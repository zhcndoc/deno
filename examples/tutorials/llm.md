---
last_modified: 2025-09-29
title: "使用 Deno 构建实时 LLM 聊天应用"
description: "学习如何将大型语言模型（LLM）与 Deno 集成，使用 OpenAI 或 Anthropic API 创建一个交互式角色扮演聊天应用，其中包含 AI 角色。"
url: /examples/llm_tutorial/
---

像 OpenAI 的 GPT 和 Anthropic 的 Claude 这样的
大型语言模型（LLM）是创建智能对话应用的强大工具。在本
教程中，我们将构建一个实时聊天应用：由 LLM 驱动的 AI 角色会在
角色扮演游戏场景中与用户进行互动。

你可以在
[GitHub 上查看已完成的应用代码](https://github.com/denoland/tutorial-with-llm)。

:::info 部署你自己的版本

想跳过教程并立刻部署已完成的应用吗？点击下面的按钮，
立即将你自己的完整 LLM 聊天应用副本部署到 Deno Deploy。
你将获得一个可运行的线上应用，并且在学习过程中可以
对其进行自定义和修改！

[![在 Deno 上部署](https://deno.com/button)](https://console.deno.com/new?clone=https://github.com/denoland/tutorial-with-llm&mode=dynamic&entrypoint=main.ts&install=deno+install)

部署完成后，在项目的 “Settings” 中添加你的 `OPENAI_API_KEY` 或 `ANTHROPIC_API_KEY`。

:::

## 初始化一个新项目

首先，为你的项目创建一个新目录并进行初始化：

```bash
mkdir deno-llm-chat
cd deno-llm-chat
deno init
```

## 项目结构

我们将创建一个模块化结构，以将 LLM
集成、游戏逻辑和服务器管理之间的职责分离开：

```sh
├── main.ts                 # 主服务器入口
├── main_test.ts            # 测试文件
├── deno.json               # Deno 配置
├── .env                    # 环境变量（API 密钥）
├── src/
│   ├── config/
│   │   ├── characters.ts   # 角色配置和预设
│   │   └── scenarios.ts    # 预定义的场景模板
│   ├── game/
│   │   ├── GameManager.ts  # 核心游戏逻辑与状态管理
│   │   └── Character.ts    # AI 角色实现
│   ├── llm/
│   │   └── LLMProvider.ts  # LLM 集成层（OpenAI/Anthropic）
│   └── server/
│       └── WebSocketHandler.ts # 实时通信
└── static/
    ├── index.html         # Web 界面
    ├── app.js            # 前端 JavaScript
    └── styles.css        # 应用样式
```

## 设置依赖项

将所需依赖添加到你的 `deno.json`：

```json title="deno.json"
{
  "tasks": {
    "dev": "deno run -A --env-file --watch main.ts",
    "start": "deno run --allow-net --allow-env --allow-read main.ts",
    "test": "deno test --allow-net --allow-env"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@1",
    "@std/http": "jsr:@std/http@1",
    "@std/uuid": "jsr:@std/uuid@1",
    "@std/json": "jsr:@std/json@1"
  },
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.asynciterable",
      "deno.ns"
    ]
  }
}
```

## 配置环境变量

为你的 API 密钥创建一个 `.env` 文件。该应用同时支持 OpenAI 和
Anthropic。用 `#` 将你不使用的配置注释掉。

```bash title=".env"
# 选择以下 LLM 供应商之一：

# OpenAI 配置
OPENAI_API_KEY=your-openai-api-key-here

# 或 Anthropic 配置  
# ANTHROPIC_API_KEY=your-anthropic-api-key-here

# 服务器配置（可选）
PORT=8000
```

你可以从以下位置获取 API 密钥：

- [OpenAI 平台](https://platform.openai.com/api-keys)
- [Anthropic 控制台](https://console.anthropic.com/)

## 构建 LLM Provider

我们应用的核心是 LLM provider，它负责与
AI 服务进行通信。创建 `src/llm/LLMProvider.ts`：

```typescript title="src/llm/LLMProvider.ts"
export interface LLMConfig {
  provider: "openai" | "anthropic" | "mock";
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export class LLMProvider {
  private config: LLMConfig;
  private rateLimitedUntil: number = 0;
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor(config?: Partial<LLMConfig>) {
    const apiKey = config?.apiKey ||
      Deno.env.get("OPENAI_API_KEY") ||
      Deno.env.get("ANTHROPIC_API_KEY");

    // 根据可用的 API 密钥自动检测供应商
    let provider = config?.provider;
    if (!provider && apiKey) {
      if (Deno.env.get("OPENAI_API_KEY")) {
        provider = "openai";
      } else if (Deno.env.get("ANTHROPIC_API_KEY")) {
        provider = "anthropic";
      }
    }

    this.config = {
      provider: provider || "mock",
      model: provider === "anthropic"
        ? "claude-3-haiku-20240307"
        : "gpt-3.5-turbo",
      maxTokens: 150,
      temperature: 0.8,
      ...config,
      apiKey,
    };

    console.log(`LLM Provider 已初始化：${this.config.provider}`);
  }

  async generateResponse(prompt: string): Promise<string> {
    // 检查限流
    if (this.rateLimitedUntil > Date.now()) {
      console.warn("已限流，使用 mock 响应");
      return this.mockResponse(prompt);
    }

    try {
      switch (this.config.provider) {
        case "openai":
          return await this.callOpenAI(prompt);
        case "anthropic":
          return await this.callAnthropic(prompt);
        case "mock":
        default:
          return this.mockResponse(prompt);
      }
    } catch (error) {
      console.error("LLM API 错误：", error);

      if (this.shouldRetry(error)) {
        this.retryCount++;
        if (this.retryCount <= this.maxRetries) {
          console.log(`正在重试...（${this.retryCount}/${this.maxRetries}）`);
          await this.delay(1000 * this.retryCount);
          return this.generateResponse(prompt);
        }
      }

      return this.mockResponse(prompt);
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API 错误：${response.status}`);
    }

    const data = await response.json();
    this.retryCount = 0; // 成功后重置
    return data.choices[0].message.content.trim();
  }

  private async callAnthropic(prompt: string): Promise<string> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.config.apiKey!,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        messages: [{ role: "user", content: prompt }],
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API 错误：${response.status}`);
    }

    const data = await response.json();
    this.retryCount = 0; // 成功后重置
    return data.content[0].text.trim();
  }

  private mockResponse(prompt: string): string {
    const responses = [
      "我明白了！让我想想……",
      "这想法很有意思。",
      "我懂你的意思。以下是我怎么想……",
      "太有趣了！我会这样来处理……",
      "说得好！这给了我一个主意……",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private shouldRetry(error: any): boolean {
    // 在限流和临时服务器错误时进行重试
    const errorMessage = error.message?.toLowerCase() || "";
    return errorMessage.includes("rate limit") ||
      errorMessage.includes("429") ||
      errorMessage.includes("500") ||
      errorMessage.includes("502") ||
      errorMessage.includes("503");
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

在这个文件中，我们设置了 LLM provider，这样我们就能很轻松地在
不同的 LLM API 之间切换，或者在测试时切换为 mock 响应。
此外，我们还添加了重试机制，用于处理 API 错误。

## 创建 AI 角色

角色是我们角色扮演应用的核心。创建
`src/game/Character.ts`：

```typescript title="src/game/Character.ts"
import { LLMProvider } from "../llm/LLMProvider.ts";

export class Character {
  public name: string;
  public class: string;
  public personality: string;
  public conversationHistory: string[] = [];
  private llmProvider: LLMProvider;

  constructor(
    name: string,
    characterClass: string,
    personality: string,
    llmProvider: LLMProvider,
  ) {
    this.name = name;
    this.class = characterClass;
    this.personality = personality;
    this.llmProvider = llmProvider;
  }

  async generateResponse(
    context: string,
    userMessage: string,
  ): Promise<string> {
    // 构建包含个性和上下文的角色提示词
    const characterPrompt = `
你是 ${this.name}，一个 ${this.class}，拥有这种性格：${this.personality}

上下文：${context}

最近对话：
${this.conversationHistory.slice(-3).join("\n")}

用户消息：${userMessage}

请以 ${this.name} 的身份进行角色内回应。将回复控制在 150 词以内，并保持你的性格特征。让对话生动有趣，并在推进角色扮演场景的同时提供帮助。
        `.trim();

    try {
      const response = await this.llmProvider.generateResponse(characterPrompt);

      // 添加到对话历史中
      this.conversationHistory.push(`用户：${userMessage}`);
      this.conversationHistory.push(`${this.name}：${response}`);

      // 保持历史可管理
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      return response;
    } catch (error) {
      console.error(`为 ${this.name} 生成响应时出错：`, error);
      return `*${this.name} 似乎陷入沉思，无法回应*`;
    }
  }

  getCharacterInfo() {
    return {
      name: this.name,
      class: this.class,
      personality: this.personality,
    };
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}
```

在这里，我们定义了 `Character` 类，它表示游戏中的每个玩家角色。
该类将根据角色的个性和当前的游戏上下文来生成回复。

## 设置角色配置

在 `src/config/characters.ts` 中创建预定义的角色模板：

```typescript title="src/config/characters.ts"
export interface CharacterConfig {
  name: string;
  class: string;
  personality: string;
  emoji?: string;
  backstory?: string;
}

export const defaultCharacters: CharacterConfig[] = [
  {
    name: "Tharin",
    emoji: "⚔️",
    class: "Fighter",
    personality:
      "勇敢且忠诚的团队领导者，始终准备保护队友。遇到危险局面时会主动负责，但也会倾听队伍的意见。",
    backstory: "一位曾经的城市卫兵，寻求冒险与正义。",
  },
  {
    name: "Lyra",
    emoji: "🔮",
    class: "Wizard",
    personality:
      "好奇且善于分析的策略家，喜欢解谜。会创造性地使用魔法来支持队伍。",
    backstory: "一位研究古代魔法的学者，追寻被遗忘的法术。",
  },
  {
    name: "Finn",
    emoji: "🗡️",
    class: "Rogue",
    personality:
      "风趣又擅长潜行的侦察兵，更倾向于用聪明的办法解决问题。行动迅速，并根据队友的需要进行调整。",
    backstory: "曾是街头窃贼，如今用这些本领做些正义的事。",
  },
];
```

这些模板就是 `Character` 类将用来实例化每个角色的依据，从而让每个角色都拥有独特的特质。LLM 将使用这些特质来生成与角色个性和背景故事一致的回复。

## 构建游戏管理器

游戏管理器负责协调角色并维护游戏状态。创建 `src/game/GameManager.ts`：

```typescript title="src/game/GameManager.ts"
import { Character } from "./Character.ts";
import { LLMProvider } from "../llm/LLMProvider.ts";

export interface GameState {
  id: string;
  gmPrompt: string;
  characters: Character[];
  messages: GameMessage[];
  currentTurn: number;
  isActive: boolean;
  createdAt: Date;
}

export interface GameMessage {
  id: string;
  speaker: string;
  message: string;
  timestamp: Date;
  type: "gm" | "character" | "system";
}

export interface StartGameRequest {
  gmPrompt: string;
  characters: Array<{
    name: string;
    class: string;
    personality: string;
  }>;
}

export class GameManager {
  private games: Map<string, GameState> = new Map();
  private llmProvider: LLMProvider;

  constructor() {
    this.llmProvider = new LLMProvider();
  }

  async startNewGame(
    gmPrompt: string,
    characterConfigs: StartGameRequest["characters"],
  ): Promise<string> {
    const gameId = crypto.randomUUID();

    // 使用他们的 LLM 个性创建角色
    const characters = characterConfigs.map((config) =>
      new Character(
        config.name,
        config.class,
        config.personality,
        this.llmProvider,
      )
    );

    const gameState: GameState = {
      id: gameId,
      gmPrompt,
      characters,
      messages: [],
      currentTurn: 0,
      isActive: true,
      createdAt: new Date(),
    };

    this.games.set(gameId, gameState);

    // 添加初始系统消息
    this.addMessage(gameId, {
      speaker: "System",
      message: `Game started! Players: ${
        characters.map((c) => c.name).join(", ")
      }`,
      type: "system",
    });

    console.log(`New game started: ${gameId}`);
    return gameId;
  }

  async handlePlayerMessage(
    gameId: string,
    message: string,
  ): Promise<GameMessage[]> {
    const game = this.games.get(gameId);
    if (!game || !game.isActive) {
      throw new Error("Game not found or inactive");
    }

    // 添加玩家消息
    this.addMessage(gameId, {
      speaker: "Player",
      message,
      type: "gm",
    });

    // 从每个角色生成回复
    const responses: GameMessage[] = [];

    for (const character of game.characters) {
      try {
        const context = this.buildContext(game);
        const response = await character.generateResponse(context, message);

        const characterMessage = this.addMessage(gameId, {
          speaker: character.name,
          message: response,
          type: "character",
        });

        responses.push(characterMessage);

        // 为了更真实：角色回复之间稍作延迟
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error getting response from ${character.name}:`, error);
      }
    }

    game.currentTurn++;
    return responses;
  }

  private buildContext(game: GameState): string {
    const recentMessages = game.messages.slice(-5);
    const context = [
      `Scenario: ${game.gmPrompt}`,
      `Current turn: ${game.currentTurn}`,
      "Recent events:",
      ...recentMessages.map((m) => `${m.speaker}: ${m.message}`),
    ].join("\n");

    return context;
  }

  private addMessage(
    gameId: string,
    messageData: Omit<GameMessage, "id" | "timestamp">,
  ): GameMessage {
    const game = this.games.get(gameId);
    if (!game) throw new Error("Game not found");

    const message: GameMessage = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...messageData,
    };

    game.messages.push(message);
    return message;
  }

  getGame(gameId: string): GameState | undefined {
    return this.games.get(gameId);
  }

  getActiveGames(): string[] {
    return Array.from(this.games.entries())
      .filter(([_, game]) => game.isActive)
      .map(([id, _]) => id);
  }

  endGame(gameId: string): boolean {
    const game = this.games.get(gameId);
    if (game) {
      game.isActive = false;
      console.log(`Game ended: ${gameId}`);
      return true;
    }
    return false;
  }
}
```

游戏管理器会处理所有与游戏相关的逻辑，包括启动新游戏、处理玩家消息以及管理游戏状态。当玩家发送一条消息时，游戏管理器会将其转发到对应的角色，以生成回复。

## 添加 WebSocket 支持

实时通信会让角色扮演体验更有趣。创建 `src/server/WebSocketHandler.ts`：

```typescript title="src/server/WebSocketHandler.ts"
import { GameManager } from "../game/GameManager.ts";

export interface WebSocketMessage {
  type: "start_game" | "send_message" | "join_game" | "get_game_state";
  gameId?: string;
  data?: any;
}

export class WebSocketHandler {
  private gameManager: GameManager;
  private connections: Map<string, WebSocket> = new Map();

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  handleConnection(request: Request): Response {
    const { socket, response } = Deno.upgradeWebSocket(request);

    const connectionId = crypto.randomUUID();
    this.connections.set(connectionId, socket);

    socket.onopen = () => {
      console.log(`WebSocket connection opened: ${connectionId}`);
      this.sendMessage(socket, {
        type: "connection",
        data: { connectionId, message: "Connected to LLM Chat server" },
      });
    };

    socket.onmessage = async (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        await this.handleMessage(socket, message);
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
        this.sendError(socket, "Invalid message format");
      }
    };

    socket.onclose = () => {
      console.log(`WebSocket connection closed: ${connectionId}`);
      this.connections.delete(connectionId);
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error for ${connectionId}:`, error);
    };

    return response;
  }

  private async handleMessage(socket: WebSocket, message: WebSocketMessage) {
    switch (message.type) {
      case "start_game":
        await this.handleStartGame(socket, message.data);
        break;
      case "send_message":
        await this.handleSendMessage(socket, message);
        break;
      case "get_game_state":
        await this.handleGetGameState(socket, message.gameId!);
        break;
      default:
        this.sendError(socket, `Unknown message type: ${message.type}`);
    }
  }

  private async handleStartGame(socket: WebSocket, data: any) {
    try {
      const { gmPrompt, characters } = data;
      const gameId = await this.gameManager.startNewGame(gmPrompt, characters);

      this.sendMessage(socket, {
        type: "game_started",
        data: {
          gameId,
          message:
            "Game started successfully! You can now send messages to interact with your characters.",
        },
      });
    } catch (error) {
      this.sendError(socket, `Failed to start game: ${error.message}`);
    }
  }

  private async handleSendMessage(
    socket: WebSocket,
    message: WebSocketMessage,
  ) {
    try {
      const { gameId, data } = message;
      if (!gameId) {
        this.sendError(socket, "Game ID required");
        return;
      }

      const responses = await this.gameManager.handlePlayerMessage(
        gameId,
        data.message,
      );

      this.sendMessage(socket, {
        type: "character_responses",
        data: { gameId, responses },
      });
    } catch (error) {
      this.sendError(socket, `Failed to process message: ${error.message}`);
    }
  }

  private async handleGetGameState(socket: WebSocket, gameId: string) {
    try {
      const game = this.gameManager.getGame(gameId);
      if (!game) {
        this.sendError(socket, "Game not found");
        return;
      }

      this.sendMessage(socket, {
        type: "game_state",
        data: {
          gameId,
          characters: game.characters.map((c) => c.getCharacterInfo()),
          messages: game.messages.slice(-10), // 最后 10 条消息
          isActive: game.isActive,
        },
      });
    } catch (error) {
      this.sendError(socket, `Failed to get game state: ${error.message}`);
    }
  }

  private sendMessage(socket: WebSocket, message: any) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }

  private sendError(socket: WebSocket, error: string) {
    this.sendMessage(socket, {
      type: "error",
      data: { error },
    });
  }
}
```

在这里，我们搭建了 WebSocket 服务器来处理连接和消息。WebSocket 允许客户端和服务器之间进行实时通信，因此非常适合像聊天应用或游戏这类交互式应用。我们在客户端和服务器之间来回发送消息，以保持游戏状态同步。

## 创建主服务器

现在让我们把所有内容在 `main.ts` 中整合起来：

```typescript title="main.ts"
import { GameManager } from "./src/game/GameManager.ts";
import { WebSocketHandler } from "./src/server/WebSocketHandler.ts";
import { defaultCharacters } from "./src/config/characters.ts";

const gameManager = new GameManager();
const wsHandler = new WebSocketHandler(gameManager);

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // 处理 WebSocket 连接
  if (req.headers.get("upgrade") === "websocket") {
    return wsHandler.handleConnection(req);
  }

  // 提供静态文件和 API 端点
  switch (url.pathname) {
    case "/":
      return new Response(await getIndexHTML(), {
        headers: { "content-type": "text/html" },
      });

    case "/api/characters":
      return new Response(JSON.stringify(defaultCharacters), {
        headers: { "content-type": "application/json" },
      });

    case "/api/game/start":
      if (req.method === "POST") {
        try {
          const body = await req.json();
          const gameId = await gameManager.startNewGame(
            body.gmPrompt,
            body.characters,
          );
          return new Response(JSON.stringify({ gameId }), {
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            {
              status: 400,
              headers: { "content-type": "application/json" },
            },
          );
        }
      }
      break;

    case "/api/game/message":
      if (req.method === "POST") {
        try {
          const body = await req.json();
          const responses = await gameManager.handlePlayerMessage(
            body.gameId,
            body.message,
          );
          return new Response(JSON.stringify({ responses }), {
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            {
              status: 400,
              headers: { "content-type": "application/json" },
            },
          );
        }
      }
      break;

    default:
      return new Response("Not Found", { status: 404 });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

async function getIndexHTML(): Promise<string> {
  try {
    return await Deno.readTextFile("./static/index.html");
  } catch {
    // 如果文件不存在，返回一个基础 HTML 模板
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>LLM 角色扮演聊天</title>
</head>
<body>
   <h1>哎呀！出了点问题。</h1>
</body>
</html>
    `;
  }
}

const port = parseInt(Deno.env.get("PORT") || "8000");
console.log(`🎭 LLM 聊天服务器正在 http://localhost:${port} 上启动`);

Deno.serve({ port }, handler);
```

在 `main.ts` 文件中，我们设置了一个 HTTP 服务器和一个 WebSocket 服务器，用于处理实时通信。我们使用 HTTP 服务器来提供静态文件并提供 API 端点，而 WebSocket 服务器则管理客户端之间的实时交互。

## 添加前端

我们的应用前端将位于 `static` 目录中。在 `static` 目录下创建一个
`index.html`、`app.js` 和一个 `style.css` 文件。

### `index.html`

我们将创建一个非常基础的布局：使用 textarea 来收集用户的场景输入，并使用一个用于发送消息的文本输入来显示响应消息。将
[this html file](https://github.com/denoland/tutorial-with-llm/blob/main/static/index.html)
中的内容复制到你的 `index.html` 中。

### `app.js`

在 `app.js` 中，我们将添加 JavaScript 来处理用户输入并展示响应。将
[this js file](https://github.com/denoland/tutorial-with-llm/blob/main/static/app.js)
中的内容复制到你的 `app.js` 中。

### `style.css`

我们将添加一些基础样式，让我们的应用看起来更好。将
[this css file](https://github.com/denoland/tutorial-with-llm/blob/main/static/style.css)
中的内容复制到你的 `style.css` 中。

## 运行你的应用

启动开发服务器：

```bash
deno task dev
```

你的 LLM 聊天应用将可以在 `http://localhost:8000` 访问。该应用将：

1. **根据可用的 API 密钥自动检测你的 LLM 提供商**
2. 如果未配置 API 密钥，则**回退到模拟响应（mock responses）**
3. 通过**重试与回退**来优雅地处理**限流（rate limiting）**
4. 通过 **WebSockets** 提供**实时交互**

## 将你的应用部署到云端

现在你已经拥有一个可工作的 LLM 聊天应用，你可以使用 Deno Deploy 将它部署到云端。

为了获得最佳体验，你可以直接从 GitHub 部署你的应用，这会设置自动化部署。创建一个 GitHub 仓库并把你的应用推送到那里。

[创建一个新的 GitHub 仓库](https://github.com/new)，然后初始化并推送你的应用到 GitHub：

```sh
git init -b main
git remote add origin https://github.com/<your_github_username>/<your_repo_name>.git
git add .
git commit -am 'initial commit'
git push -u origin main
```

当你的应用在 GitHub 上之后，你就可以
[将其部署到 Deno Deploy](https://console.deno.com/)。

别忘了在项目的“Settings（设置）”中添加你的 `OPENAI_API_KEY` 或 `ANTHROPIC_API_KEY` 环境变量。

要了解部署应用的演示，请查看
[Deno Deploy 教程](/examples/deno_deploy_tutorial/)。

## 测试

我们提供了测试来验证你的设置。将
[`main.test.ts`](https://github.com/denoland/tutorial-with-llm/blob/main/tests/main.test.ts)
文件复制到你的项目目录，并运行包含的测试来验证你的设置：

```bash
deno task test
```

🦕 现在你有了一个可运行的 LLM 聊天应用，具备实时交互、限流与错误处理。接下来你可以根据自己的游戏风格对它进行定制！考虑给 LLM 提供关于如何在不同场景下行动的指令，或如何回应特定的用户输入。你可以把这些添加到角色配置文件中。

你也可以考虑添加一个数据库，用于存储对话历史，从而支持长期的角色和故事发展。
