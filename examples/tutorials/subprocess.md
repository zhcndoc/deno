---
title: "创建子进程"
description: "在 Deno 中使用子进程的指南。学习如何启动进程、处理输入/输出流、管理进程生命周期，以及安全实现进程间通信模式。"
url: /examples/subprocess_tutorial/
oldUrl:
  - /runtime/manual/examples/subprocess/
  - /runtime/tutorials/subprocess/
---

## 概念

- Deno 可以通过 [Deno.Command](https://docs.deno.com/api/deno/~/Deno.Command) 启动子进程。
- 启动子进程需要 `--allow-run` 权限。
- 启动的子进程不在安全沙箱中运行。
- 通过 [stdin](https://docs.deno.com/api/deno/~/Deno.stdin)、[stdout](https://docs.deno.com/api/deno/~/Deno.stdout) 和 [stderr](https://docs.deno.com/api/deno/~/Deno.stderr) 流与子进程进行通信。

## 简单示例

该示例相当于从命令行运行 `echo "Hello from Deno!"`。

```ts title="subprocess_simple.ts"
// 定义用于创建子进程的命令
const command = new Deno.Command("echo", {
  args: [
    "Hello from Deno!",
  ],
});

// 创建子进程并收集输出
const { code, stdout, stderr } = await command.output();

console.assert(code === 0);
console.log(new TextDecoder().decode(stdout));
console.log(new TextDecoder().decode(stderr));
```

运行它：

```shell
$ deno run --allow-run=echo ./subprocess_simple.ts
Hello from Deno!
```

## 安全性

创建子进程需要 `--allow-run` 权限。请注意，子进程不在 Deno 沙箱中运行，因此具有与您自己从命令行运行命令时相同的权限。

## 与子进程通信

默认情况下，当您使用 `Deno.Command()` 时，子进程继承父进程的 `stdin`、`stdout` 和 `stderr`。如果您想与启动的子进程进行通信，您必须使用 `"piped"` 选项。

## 管道输出到文件

该示例相当于在 bash 中运行 `yes &> ./process_output`。

```ts title="subprocess_piping_to_files.ts"
import {
  mergeReadableStreams,
} from "jsr:@std/streams@1.0.0-rc.4/merge-readable-streams";

// 创建要附加到进程的文件
const file = await Deno.open("./process_output.txt", {
  read: true,
  write: true,
  create: true,
});

// 启动进程
const command = new Deno.Command("yes", {
  stdout: "piped",
  stderr: "piped",
});

const process = command.spawn();

// 示例：将 stdout 和 stderr 合并并发送到文件
const joined = mergeReadableStreams(
  process.stdout,
  process.stderr,
);

// 返回一个 Promise，直到进程被终止/关闭时解析
joined.pipeTo(file.writable).then(() => console.log("管道合并完成"));

// 手动停止进程，“yes” 将永远不会自行结束
setTimeout(() => {
  process.kill();
}, 100);
```

运行它：

```shell
$ deno run --allow-run=yes --allow-read=. --allow-write=. ./subprocess_piping_to_file.ts
```

## 使用便捷方法读取子进程输出

在使用启动的子进程时，您可以对 `stdout` 和 `stderr` 流使用便捷方法，轻松收集和解析输出。这些方法类似于 `Response` 对象上可用的方法：

```ts title="subprocess_convenience_methods.ts"
const command = new Deno.Command("deno", {
  args: [
    "eval",
    "console.log(JSON.stringify({message: 'Hello from subprocess'}))",
  ],
  stdout: "piped",
  stderr: "piped",
});

const process = command.spawn();

// 使用便捷方法收集输出
const stdoutText = await process.stdout.text();
const stderrText = await process.stderr.text();

console.log("stdout:", stdoutText);
console.log("stderr:", stderrText);

// 等待进程完成
const status = await process.status;
console.log("退出码:", status.code);
```

可用的便捷方法包括：

- `.text()` - 返回 UTF-8 编码的字符串输出
- `.bytes()` - 返回 `Uint8Array` 类型的输出
- `.arrayBuffer()` - 返回 `ArrayBuffer` 类型的输出
- `.json()` - 解析输出为 JSON 并返回该对象

```ts title="subprocess_json_parsing.ts"
const command = new Deno.Command("deno", {
  args: ["eval", "console.log(JSON.stringify({name: 'Deno', version: '2.0'}))"],
  stdout: "piped",
});

const process = command.spawn();

// 直接解析 JSON 输出
const jsonOutput = await process.stdout.json();
console.log("解析后的 JSON:", jsonOutput); // { name: "Deno", version: "2.0" }

await process.status;
```