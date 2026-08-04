---
last_modified: 2026-07-08
title: "WebGPU 渲染"
description: "在 raw 后端上使用 WebGPU 绘制到原生窗口：请求适配器，将窗口包装为 UnsafeWindowSurface，配置画布上下文，并运行渲染循环。"
---

:::info Deno 2.9 中可用

`deno desktop` 从 Deno v2.9.0 开始可用。如果你使用的是更早的
版本，请[更新 Deno](/runtime/reference/cli/upgrade/) 后再使用。

:::

[raw 后端](/runtime/desktop/backends/#raw)会提供一个未连接 Web 引擎的原生窗口。
你无需加载 HTML，而是使用 [WebGPU](/api/web/~/GPUDevice) 自行绘制到窗口上。这对于游戏、
可视化、模拟器，以及任何需要自行渲染像素而不是文档的应用来说，都是合适的后端。

连接窗口与 WebGPU 的桥梁是
[`Deno.BrowserWindow.getNativeWindow()`](/api/deno/~/Deno.BrowserWindow.prototype.getNativeWindow)，
它会返回一个
[`Deno.UnsafeWindowSurface`](/api/deno/~/Deno.UnsafeWindowSurface)。该表面
提供了 WebGPU 画布上下文，因此你可以在真实的操作系统窗口上使用与浏览器中相同的
`context.configure()` /
`getCurrentTexture()` / `present()` 流程。

## 设置

WebGPU 位于一个不稳定标志之后，并且在
`deno.json` 中选择原始后端：

```json title="deno.json"
{
  "desktop": {
    "backend": "raw"
  },
  "unstable": ["webgpu"]
}
```

与 `cef` 和 `webview` 不同，`raw` 不能通过命令行中的 `--backend` 传递——它只能通过
`desktop.backend` 字段进行选择。请参阅
[后端](/runtime/desktop/backends/#raw)。

## 一个最小示例

最小的实用程序：打开一个窗口，并将其清除为纯色。此示例会在添加任何绘制操作之前，验证整个流程——适配器、表面、上下文、呈现——都已正确连接。

```ts title="main.ts"
// WebGPU 上下文必须在原生表面可以被包装之前存在，因此
// 请先获取适配器和设备。
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) throw new Error("no WebGPU adapter available");
const device = await adapter.requestDevice();

const win = new Deno.BrowserWindow({
  title: "WebGPU",
  width: 640,
  height: 480,
});

// 将原生窗口包装为表面，并在其上配置 WebGPU 上下文。
const surface = win.getNativeWindow();
const format = navigator.gpu.getPreferredCanvasFormat();
const context = surface.getContext("webgpu");
context.configure({ device, format, alphaMode: "opaque" });

// 在第一帧之前，使表面尺寸与窗口匹配。
const [width, height] = win.getSize();
surface.width = width;
surface.height = height;

// 将帧清除为青绿色并呈现。
const encoder = device.createCommandEncoder();
encoder.beginRenderPass({
  colorAttachments: [{
    view: context.getCurrentTexture().createView(),
    clearValue: { r: 0, g: 0.5, b: 0.5, a: 1 },
    loadOp: "clear",
    storeOp: "store",
  }],
}).end();
device.queue.submit([encoder.finish()]);
surface.present();
```

构建并运行：

```sh
deno desktop main.ts
./main      # macOS / Linux
.\main.exe  # Windows
```

`surface.present()` 才会真正将编码后的帧推送到显示器；如果没有它，窗口将保持空白。像上面这样调用一次后，静态帧会一直显示在屏幕上，直到窗口关闭。

## 绘制几何图形

将表面清除为某种颜色可以操作表面，但不会绘制任何内容。使用 WGSL 着色器的渲染管线是 GPU 图形编程中的“hello world”。此示例绘制一个三角形，其顶点颜色会在三角形表面上进行插值——不需要顶点缓冲区，位置数据直接写在着色器中。

```ts title="triangle.ts"
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) throw new Error("no WebGPU adapter available");
const device = await adapter.requestDevice();

const win = new Deno.BrowserWindow({
  title: "Triangle",
  width: 640,
  height: 480,
});

const surface = win.getNativeWindow();
const format = navigator.gpu.getPreferredCanvasFormat();
const context = surface.getContext("webgpu");
context.configure({ device, format, alphaMode: "opaque" });

const [width, height] = win.getSize();
surface.width = width;
surface.height = height;

// 顶点阶段输出三个角；片元阶段接收它们之间插值后的
// 颜色。
const shader = device.createShaderModule({
  code: `
    struct VertexOut {
      @builtin(position) pos: vec4f,
      @location(0) color: vec3f,
    };

    @vertex
    fn vs(@builtin(vertex_index) i: u32) -> VertexOut {
      var positions = array<vec2f, 3>(
        vec2f( 0.0,  0.6),
        vec2f(-0.6, -0.6),
        vec2f( 0.6, -0.6),
      );
      var colors = array<vec3f, 3>(
        vec3f(1.0, 0.0, 0.0),
        vec3f(0.0, 1.0, 0.0),
        vec3f(0.0, 0.0, 1.0),
      );
      var out: VertexOut;
      out.pos = vec4f(positions[i], 0.0, 1.0);
      out.color = colors[i];
      return out;
    }

    @fragment
    fn fs(in: VertexOut) -> @location(0) vec4f {
      return vec4f(in.color, 1.0);
    }
  `,
});

const pipeline = device.createRenderPipeline({
  layout: "auto",
  vertex: { module: shader, entryPoint: "vs" },
  fragment: { module: shader, entryPoint: "fs", targets: [{ format }] },
  primitive: { topology: "triangle-list" },
});

const encoder = device.createCommandEncoder();
const pass = encoder.beginRenderPass({
  colorAttachments: [{
    view: context.getCurrentTexture().createView(),
    clearValue: { r: 0.05, g: 0.05, b: 0.08, a: 1 },
    loadOp: "clear",
    storeOp: "store",
  }],
});
pass.setPipeline(pipeline);
pass.draw(3);
pass.end();
device.queue.submit([encoder.finish()]);
surface.present();
```

## 使用渲染循环进行动画

对于任何会移动的内容，都需要重复绘制。底层后端没有 DOM，因此没有
`requestAnimationFrame`——需要自行安排帧。此示例复用三角形管线，并通过
uniform 缓冲区将经过的时间传入着色器，使其旋转。

```ts title="spin.ts"
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) throw new Error("no WebGPU adapter available");
const device = await adapter.requestDevice();

const win = new Deno.BrowserWindow({ title: "Spin", width: 640, height: 480 });

const surface = win.getNativeWindow();
const format = navigator.gpu.getPreferredCanvasFormat();
const context = surface.getContext("webgpu");
context.configure({ device, format, alphaMode: "opaque" });

// 让 surface 的大小与窗口保持一致，并在窗口大小改变时重新配置。
function resize() {
  const [width, height] = win.getSize();
  surface.width = width;
  surface.height = height;
}
resize();
win.addEventListener("resize", resize);

const shader = device.createShaderModule({
  code: `
    @group(0) @binding(0) var<uniform> angle: f32;

    struct VertexOut {
      @builtin(position) pos: vec4f,
      @location(0) color: vec3f,
    };

    @vertex
    fn vs(@builtin(vertex_index) i: u32) -> VertexOut {
      var base = array<vec2f, 3>(
        vec2f( 0.0,  0.6),
        vec2f(-0.6, -0.6),
        vec2f( 0.6, -0.6),
      );
      var colors = array<vec3f, 3>(
        vec3f(1.0, 0.0, 0.0),
        vec3f(0.0, 1.0, 0.0),
        vec3f(0.0, 0.0, 1.0),
      );
      let s = sin(angle);
      let c = cos(angle);
      let p = base[i];
      var out: VertexOut;
      out.pos = vec4f(p.x * c - p.y * s, p.x * s + p.y * c, 0.0, 1.0);
      out.color = colors[i];
      return out;
    }

    @fragment
    fn fs(in: VertexOut) -> @location(0) vec4f {
      return vec4f(in.color, 1.0);
    }
  `,
});

const uniform = device.createBuffer({
  size: 4, // 一个 f32
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const pipeline = device.createRenderPipeline({
  layout: "auto",
  vertex: { module: shader, entryPoint: "vs" },
  fragment: { module: shader, entryPoint: "fs", targets: [{ format }] },
  primitive: { topology: "triangle-list" },
});

const bindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: uniform } }],
});

const start = performance.now();

function frame() {
  if (win.isClosed()) return;

  const angle = (performance.now() - start) / 1000;
  device.queue.writeBuffer(uniform, 0, new Float32Array([angle]));

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r: 0.05, g: 0.05, b: 0.08, a: 1 },
      loadOp: "clear",
      storeOp: "store",
    }],
  });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.draw(3);
  pass.end();
  device.queue.submit([encoder.finish()]);
  surface.present();

  setTimeout(frame, 16); // 约 60 fps
}

win.addEventListener("close", () => Deno.exit(0));
frame();
```

自行调度的 `setTimeout` 会让你大约每 16 毫秒获得一帧。`win.isClosed()` 
检查会在窗口关闭后停止循环，而 `close` 监听器会退出进程；否则，待处理的
计时器会让运行时继续运行，即使屏幕上已经没有任何内容。

## 关键细节

- **在包装窗口之前请求适配器。**
  [`getNativeWindow()`](/api/deno/~/Deno.BrowserWindow.prototype.getNativeWindow)
  需要一个处于活动状态的 WebGPU 上下文，如果在调用
  [`navigator.gpu.requestAdapter()`](/api/web/~/GPU.prototype.requestAdapter) 之前调用它，就会抛出异常。

- **设置 surface 的大小，并调整它。** 在第一帧之前设置
  `surface.width` / `surface.height`，并在窗口的 [`resize`](/runtime/desktop/windows/#events) 事件触发时更新它们（并让上下文重新配置）。与窗口大小不匹配的 surface 会被拉伸或裁剪。

- **每帧调用 `present()`。** 对渲染过程进行编码和提交会绘制到交换链纹理中；
  [`present()`](/api/deno/~/Deno.UnsafeWindowSurface.prototype.present) 才会将其显示在屏幕上。跳过它，窗口将保持空白。

- **每帧获取新的纹理。** 在循环中调用
  `context.getCurrentTexture().createView()` ——交换链会为每帧提供不同的纹理。

- **关闭操作会降级为隐藏。** 一旦从窗口中获取了 surface，
  [`close()`](/runtime/desktop/windows/#lifecycle) 会隐藏窗口，而不是销毁它，因此 WebGPU 正在渲染到的原生句柄不会在窗口下方被释放。调用 [`Deno.exit()`](/api/deno/~/Deno.exit) 结束进程，就像上面的渲染循环在 `close` 事件中所做的那样。

## 相关内容

- [后端](/runtime/desktop/backends/) — 何时选择 `raw` 而不是 `cef` /
  `webview`。
- [Windows](/runtime/desktop/windows/) —
  [`Deno.BrowserWindow`](/api/deno/~/Deno.BrowserWindow) 的生命周期、尺寸和
  事件。
- [WebGPU API](/api/web/~/GPUDevice) 和
  [WGSL 规范](https://www.w3.org/TR/WGSL/)。
