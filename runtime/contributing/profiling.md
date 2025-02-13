---
title: "性能分析"
oldUrl: /runtime/manual/references/contributing/profiling/
---

## 性能分析：

可以用来生成/可视化性能结果的工具：

- flamegraph-rs (https://github.com/flamegraph-rs/flamegraph)
- flamescope (https://github.com/Netflix/flamescope)

使用 perf 对 `micro_bench_ops` 进行分析并使用 flamescope 可视化的示例：

```sh
# 构建 `examples/micro_bench_ops`
cargo build --release --example micro_bench_ops

# 使用 perf 运行 `examples/micro_bench_ops`
sudo perf record -F 49 -a -g -- ./target/release/examples/micro_bench_ops
sudo perf script --header > micro_bench_ops_perf

# 现在使用 flamescope 打开文件
```

结合 flamegraph 运行 `deno_tcp.ts` 的示例（`script.sh`）：

```sh
sudo flamegraph -o flamegraph.svg target/debug/deno run --allow-net cli/bench/deno_tcp.ts &
sleep 1
./third_party/prebuilt/linux64/wrk http://localhost:4500/
sleep 1
kill `pgrep perf`
```

## V8 分析：

在 `micro_bench_ops` 上使用 V8 分析的示例：

```sh
# 构建 `examples/micro_bench_ops`
cargo build --release --example micro_bench_ops

# 运行 `examples/micro_bench_ops`
./target/release/examples/micro_bench_ops --prof
```

在 `deno_tcp.ts` 上使用 V8 分析的示例：

```sh
# 构建 `deno`
cargo build --release

# 运行 `deno_tcp.ts`
./target/release/deno --v8-flags=--prof --allow-net cli/bench/deno_tcp.ts &
sleep 1
./third_party/prebuilt/linux64/wrk http://localhost:4500/
sleep 1
kill `pgrep deno`
```

V8 将在当前目录中写一个像这样的文件：
`isolate-0x7fad98242400-v8.log`。要检查该文件：

```sh
node --prof-process isolate-0x7fad98242400-v8.log > prof.log
```

`prof.log` 将包含有关不同调用的滴答分配的信息。

要通过 Web 界面查看日志，请生成日志的 JSON 文件：

在浏览器中打开 `rusty_v8/v8/tools/profview/index.html`，并选择 `prof.json` 以图形方式查看分布。

性能分析期间有用的 V8 标志：

- --prof
- --log-internal-timer-events
- --log-timer-events
- --track-gc
- --log-source-code
- --track-gc-object-stats

要了解更多关于性能分析的信息，请查看以下链接：

- [https://v8.dev/docs/profile](https://v8.dev/docs/profile)

## 使用 LLDB 调试

要调试 deno 二进制文件，我们可以使用 `rust-lldb`。它应与 `rustc` 一起提供，并且是 LLDB 的一个包装。

```shell
$ rust-lldb -- ./target/debug/deno run --allow-net tests/http_bench.ts
# 在 macOS 上，您可能会收到类似的警告
# `ImportError: cannot import name _remove_dead_weakref`
# 在这种情况下，通过设置 PATH 使用系统 python，例如
# PATH=/System/Library/Frameworks/Python.framework/Versions/2.7/bin:$PATH
(lldb) command script import "/Users/kevinqian/.rustup/toolchains/1.36.0-x86_64-apple-darwin/lib/rustlib/etc/lldb_rust_formatters.py"
(lldb) type summary add --no-value --python-function lldb_rust_formatters.print_val -x ".*" --category Rust
(lldb) type category enable Rust
(lldb) target create "../deno/target/debug/deno"
当前可执行文件设置为 '../deno/target/debug/deno' (x86_64)。
(lldb) settings set -- target.run-args  "tests/http_bench.ts" "--allow-net"
(lldb) b op_start
(lldb) r
```

## V8 标志

V8 有许多内部命令行标志：

```shell
$ deno run --v8-flags=--help _
SSE3=1 SSSE3=1 SSE4_1=1 SSE4_2=1 SAHF=1 AVX=1 FMA3=1 BMI1=1 BMI2=1 LZCNT=1 POPCNT=1 ATOM=0
概要：
  shell [选项] [--shell] [<文件>...]
  d8 [选项] [-e <字符串>] [--shell] [[--module] <文件>...]

  -e        执行一个字符串在 V8 中
  --shell   运行一个交互式 JavaScript shell
  --module  执行一个文件作为 JavaScript 模块

注意：--module 选项对 *.mjs 文件隐式启用。

接受以下语法的选项（'-' 和 '--' 都可以）：
  --flag        (仅限 bool 标志)
  --no-flag     (仅限 bool 标志)
  --flag=value  (仅限非 bool 标志，等号周围不得有空格)
  --flag value  (仅限非 bool 标志)
  --            (捕获 JavaScript 中所有剩余参数)

选项：
  --use-strict (强制严格模式)
        类型：bool  默认：false
  --es-staging (启用测试版和谐功能（仅供内部使用）)
        类型：bool  默认：false
  --harmony (启用所有已完成的和谐功能)
        类型：bool  默认：false
  --harmony-shipping (启用所有已发布的和谐功能)
        类型：bool  默认：true
  --harmony-regexp-sequence (启用“RegExp Unicode 序列属性”（进行中）)
        类型：bool  默认：false
  --harmony-weak-refs-with-cleanup-some (启用“带有 FinalizationRegistry.prototype.cleanupSome 的和谐弱引用”（进行中）)
        类型：bool  默认：false
  --harmony-regexp-match-indices (启用“和谐 regexp 匹配索引”（进行中）)
        类型：bool  默认：false
  --harmony-top-level-await (启用“和谐顶级 await”)
        类型：bool  默认：false
  --harmony-namespace-exports (启用“和谐命名空间导出（export * as foo from 'bar'）”)
        类型：bool  默认：true
  --harmony-sharedarraybuffer (启用“和谐共享数组缓冲区”)
        类型：bool  默认：true
  --harmony-import-meta (启用“和谐 import.meta 属性”)
        类型：bool  默认：true
  --harmony-dynamic-import (启用“和谐动态导入”)
        类型：bool  默认：true
  --harmony-promise-all-settled (启用“和谐 Promise.allSettled”)
        类型：bool  默认：true
  --harmony-promise-any (启用“和谐 Promise.any”)
        类型：bool  默认：true
  --harmony-private-methods (启用“和谐类文字中的私有方法”)
        类型：bool  默认：true
  --harmony-weak-refs (启用“和谐弱引用”)
        类型：bool  默认：true
  --harmony-string-replaceall (启用“和谐 String.prototype.replaceAll”)
        类型：bool  默认：true
  --harmony-logical-assignment (启用“和谐逻辑赋值”)
        类型：bool  默认：true
  --lite-mode (启用以性能换取内存节省)
        类型：bool  默认：false
  --future (隐含我们希望在不远的将来发布的所有分阶段功能)
        类型：bool  默认：false
  --assert-types (生成运行时类型断言以测试类型器)
        类型：bool  默认：false
  --allocation-site-pretenuring (使用分配点的预租)
        类型：bool  默认：true
  --page-promotion (根据利用率提升页面)
        类型：bool  默认：true
  --always-promote-young-mc (在标记-紧凑期间始终提升年轻对象)
        类型：bool  默认：true
  --page-promotion-threshold (启用快速撤离的页面上存活字节的最小百分比)
        类型：int  默认：70
  --trace-pretenuring (跟踪 HAllocate 指令的预租决策)
        类型：bool  默认：false
  --trace-pretenuring-statistics (跟踪分配点预租统计信息)
        类型：bool  默认：false
  --track-fields (跟踪仅具有 smi 值的字段)
        类型：bool  默认：true
  --track-double-fields (跟踪具有双精度值的字段)
        类型：bool  默认：true
  --track-heap-object-fields (跟踪具有堆值的字段)
        类型：bool  默认：true
  --track-computed-fields (跟踪计算的样板字段)
        类型：bool  默认：true
  --track-field-types (跟踪字段类型)
        类型：bool  默认：true
  --trace-block-coverage (跟踪收集的块覆盖信息)
        类型：bool  默认：false
  --trace-protector-invalidation (跟踪保护器单元失效)
        类型：bool  默认：false
  --feedback-normalization (将反馈规范化馈送到构造函数)
        类型：bool  默认：false
  --enable-one-shot-optimization (启用仅执行一次的代码大小优化)
        类型：bool  默认：false
  --unbox-double-arrays (自动拆箱双精度数组)
        类型：bool  默认：true
  --interrupt-budget (应在分析器计数器上使用的中断预算)
        类型：int  默认：147456
  --jitless (禁用可执行内存的运行时分配。)
        类型：bool  默认：false
  --use-ic (使用内联缓存)
        类型：bool  默认：true
  --budget-for-feedback-vector-allocation (在我们决定分配反馈向量之前，每个功能执行的字节码数量)
        类型：int  默认：1024
  --lazy-feedback-allocation (懒分配反馈向量)
        类型：bool  默认：true
  --ignition-elide-noneffectful-bytecodes (排除没有任何外部效果的字节码)
        类型：bool  默认：true
  --ignition-reo (使用 ignition 寄存器等效优化器)
        类型：bool  默认：true
  --ignition-filter-expression-positions (在字节码管道之前过滤表达位置)
        类型：bool  默认：true
  --ignition-share-named-property-feedback (在从同一对象加载同一命名属性时共享反馈槽)
        类型：bool  默认：true
  --print-bytecode (打印由 ignition 解释器生成的字节码)
        类型：bool  默认：false
  --enable-lazy-source-positions (在初始编译期间跳过生成源位置，但在实际需要时重新生成)
        类型：bool  默认：true
  --stress-lazy-source-positions (在懒惰编译后立即收集懒惰源位置)
        类型：bool  默认：false
  --print-bytecode-filter (选择要打印字节码的函数筛选)
        类型：string  默认：*
  --trace-ignition-codegen (跟踪 ignition 解释器字节码处理程序的代码生成)
        类型：bool  默认：false
  --trace-ignition-dispatches (跟踪 ignition 解释器对字节码处理程序的调度)
        类型：bool  默认：false
  --trace-ignition-dispatches-output-file (将在文件中写入字节码处理程序调度表（默认情况下，不会写入文件）)
        类型：string  默认：nullptr
  --fast-math (更快（但可能不太准确）的数学函数)
        类型：bool  默认：true
  --trace-track-allocation-sites (跟踪对分配点的跟踪)
        类型：bool  默认：false
  --trace-migration (跟踪对象迁移)
        类型：bool  默认：false
  --trace-generalization (跟踪地图概括)
        类型：bool  默认：false
  --turboprop (启用实验性涡轮增压中级编译器。)
        类型：bool  默认：false
  --concurrent-recompilation (异步在单独线程上优化热门功能)
        类型：bool  默认：true
  --trace-concurrent-recompilation (跟踪并发重新编译)
        类型：bool  默认：false
  --concurrent-recompilation-queue-length (并发编译队列的长度)
        类型：int  默认：8
  --concurrent-recompilation-delay (人工编译延迟以 ms 为单位)
        类型：int  默认：0
  --block-concurrent-recompilation (阻塞排队作业直到释放)
        类型：bool  默认：false
  --concurrent-inlining (在单独线程上运行优化编译器的内联阶段)
        类型：bool  默认：false
  --max-serializer-nesting (最大嵌套子序列化程序的级别)
        类型：int  默认：25
  --trace-heap-broker-verbose (详细跟踪堆代理（所有报告）)
        类型：bool  默认：false
  --trace-heap-broker-memory (跟踪堆代理内存（引用分析和区域编号）)
        类型：bool  默认：false
  --trace-heap-broker (跟踪堆代理（仅报告缺少的数据）)
        类型：bool  默认：false
  --stress-runs (压力测试运行次数)
        类型：int  默认：0
  --deopt-every-n-times (每通过 n 次 deopt 点时进行去优化)
        类型：int  默认：0
  --print-deopt-stress (打印可能的去优化点数)
        类型：bool  默认：false
  --opt (使用自适应优化)
        类型：bool  默认：true
  --turbo-sp-frame-access (尽可能使用堆栈指针相对访问帧)
        类型：bool  默认：false
  --turbo-control-flow-aware-allocation (在分配寄存器时考虑控制流)
        类型：bool  默认：true
  --turbo-filter (TurboFan 编译器的优化筛选)
        类型：string  默认：*
  --trace-turbo (跟踪生成的 TurboFan IR)
        类型：bool  默认：false
  --trace-turbo-path (将生成的 TurboFan IR 转储到的目录)
        类型：string  默认：nullptr
  --trace-turbo-filter (跟踪 turbofan 编译的筛选)
        类型：string  默认：*
  --trace-turbo-graph (跟踪生成的 TurboFan 图)
        类型：bool  默认：false
  --trace-turbo-scheduled (跟踪带有调度的 TurboFan IR)
        类型：bool  默认：false
  --trace-turbo-cfg-file (将 turbo cfg 图（用于 C1 可视化工具）跟踪到给定文件名)
        类型：string  默认：nullptr
  --trace-turbo-types (跟踪 TurboFan 的类型)
        类型：bool  默认：true
  --trace-turbo-scheduler (跟踪 TurboFan 的调度程序)
        类型：bool  默认：false
  --trace-turbo-reduction (跟踪 TurboFan 的各种减速器)
        类型：bool  默认：false
  --trace-turbo-trimming (跟踪 TurboFan 的图修剪器)
        类型：bool  默认：false
  --trace-turbo-jt (跟踪 TurboFan 的跳线)
        类型：bool  默认：false
  --trace-turbo-ceq (跟踪 TurboFan 的控制等价)
        类型：bool  默认：false
  --trace-turbo-loop (跟踪 TurboFan 的循环优化)
        类型：bool  默认：false
  --trace-turbo-alloc (跟踪 TurboFan 的寄存器分配)
        类型：bool  默认：false
  --trace-all-uses (跟踪所有使用位置)
        类型：bool  默认：false
  --trace-representation (跟踪表示类型)
        类型：bool  默认：false
  --turbo-verify (在每个阶段验证 TurboFan 图)
        类型：bool  默认：false
  --turbo-verify-machine-graph (在指令选择之前验证 TurboFan 机器图)
        类型：string  默认：nullptr
  --trace-verify-csa (跟踪代码存根验证)
        类型：bool  默认：false
  --csa-trap-on-node (在给定存根中创建具有给定 ID 的 Node.js 时触发断点。格式为: StubName,NodeId)
        类型：string  默认：nullptr
  --turbo-stats (打印 TurboFan 统计信息)
        类型：bool  默认：false
  --turbo-stats-nvp (以机器可读格式打印 TurboFan 统计信息)
        类型：bool  默认：false
  --turbo-stats-wasm (打印 TurboFan 编译的 wasm 统计信息)
        类型：bool  默认：false
  --turbo-splitting (在 TurboFan 中调度时拆分节点)
        类型：bool  默认：true
  --function-context-specialization (启用 TurboFan 中的函数上下文专业化)
        类型：bool  默认：false
  --turbo-inlining (在 TurboFan 中启用内联)
        类型：bool  默认：true
  --max-inlined-bytecode-size (单次内联的字节码最大大小)
        类型：int  默认：500
  --max-inlined-bytecode-size-cumulative (考虑内联的字节码的最大累积大小)
        类型：int  默认：1000
  --max-inlined-bytecode-size-absolute (考虑内联的字节码的最大累积大小)
        类型：int  默认：5000
  --reserve-inline-budget-scale-factor (考虑内联的字节码的最大累积大小)
        类型：float  默认：1.2
  --max-inlined-bytecode-size-small (考虑小函数内联的字节码的最大大小)
        类型：int  默认：30
  --max-optimized-bytecode-size (考虑优化的最大字节码大小；过高的值可能会使编译器击中（发布）断言)
        类型：int  默认：61440
  --min-inlining-frequency (内联的最低频率)
        类型：float  默认：0.15
  --polymorphic-inlining (多态内联)
        类型：bool  默认：true
  --stress-inline (为内联设置高阈值以尽可能多地内联)
        类型：bool  默认：false
  --trace-turbo-inlining (跟踪 TurboFan 内联)
        类型：bool  默认：false
  --turbo-inline-array-builtins (在 TurboFan 代码中内联数组内置)
        类型：bool  默认：true
  --use-osr (使用栈上替换)
        类型：bool  默认：true
  --trace-osr (跟踪栈上替换)
        类型：bool  默认：false
  --analyze-environment-liveness (分析环境槽的存活性并清除死值)
        类型：bool  默认：true
  --trace-environment-liveness (跟踪局部变量槽的存活性)
        类型：bool  默认：false
  --turbo-load-elimination (启用 TurboFan 中的负载消除)
        类型：bool  默认：true
  --trace-turbo-load-elimination (跟踪 TurboFan 负载消除)
        类型：bool  默认：false
  --turbo-profiling (启用 TurboFan 中的基本块分析)
        类型：bool  默认：false
  --turbo-profiling-verbose (启用 TurboFan 中的基本块分析，并在输出中包括每个函数的调度和反汇编)
        类型：bool  默认：false
  --turbo-verify-allocation (验证 TurboFan 中的寄存器分配)
        类型：bool  默认：false
  --turbo-move-optimization (优化 TurboFan 中的间隙移动)
        类型：bool  默认：true
  --turbo-jt (启用 TurboFan 中的跳转线程)
        类型：bool  默认：true
  --turbo-loop-peeling (TurboFan 循环去皮)
        类型：bool  默认：true
  --turbo-loop-variable (TurboFan 循环变量优化)
        类型：bool  默认：true
  --turbo-loop-rotation (TurboFan 循环旋转)
        类型：bool  默认：true
  --turbo-cf-optimization (优化 TurboFan 中的控制流)
        类型：bool  默认：true
  --turbo-escape (启用逃逸分析)
        类型：bool  默认：true
  --turbo-allocation-folding (TurboFan 中的分配折叠)
        类型：bool  默认：true
  --turbo-instruction-scheduling (启用 TurboFan 中的指令调度)
        类型：bool  默认：false
  --turbo-stress-instruction-scheduling (随机调度指令以施加依赖跟踪)
        类型：bool  默认：false
  --turbo-store-elimination (启用 TurboFan 中的存储-存储消除)
        类型：bool  默认：true
  --trace-store-elimination (跟踪存储消除)
        类型：bool  默认：false
  --turbo-rewrite-far-jumps (将远跳转重写为近跳转（ia32，x64）)
        类型：bool  默认：true
  --stress-gc-during-compilation (模拟 GC/编译器线程竞争与 https://crbug.com/v8/8520 相关)
        类型：bool  默认：false
  --turbo-fast-api-calls (启用 TurboFan 的快速 API 调用)
        类型：bool  默认：false
  --reuse-opt-code-count (不丢弃指定数量的去优化的已优化代码。)
        类型：int  默认：0
  --turbo-nci (启用实验性本地上下文独立代码。)
        类型：bool  默认：false
  --turbo-nci-as-highest-tier (测试时将默认 TF 替换为 NCI 代码作为最高层。)
        类型：bool  默认：false
  --print-nci-code (打印本地上下文独立代码。)
        类型：bool  默认：false
  --trace-turbo-nci (跟踪本地上下文独立代码。)
        类型：bool  默认：false
  --turbo-collect-feedback-in-generic-lowering (启用通用降低中的实验性反馈收集。)
        类型：bool  默认：false
  --optimize-for-size (启用优化以更喜欢内存大小而不是执行速度)
        类型：bool  默认：false
  --untrusted-code-mitigations (启用执行不受信任代码的缓解措施)
        类型：bool  默认：false
  --expose-wasm (将 wasm 接口暴露给 JavaScript)
        类型：bool  默认：true
  --assume-asmjs-origin (强制 wasm 解码器假定输入为内部 asm-wasm 格式)
        类型：bool  默认：false
  --wasm-num-compilation-tasks ( wasm 的最大并行编译任务数)
        类型：int  默认：128
  --wasm-write-protect-code-memory (对 wasm 本机堆上的代码内存进行写保护)
        类型：bool  默认：false
  --wasm-async-compilation (启用 WebAssembly.compile 的实际异步编译)
        类型：bool  默认：true
  --wasm-test-streaming (在测试中使用流式编译而不是异步编译)
        类型：bool  默认：false
  --wasm-max-mem-pages ( wasm 实例的初始最大 64KiB 内存页面数)
        类型：uint  默认：32767
  --wasm-max-mem-pages-growth (一个 wasm 内存可以增长到的最大 64KiB 页面数)
        类型：uint  默认：65536
  --wasm-max-table-size ( wasm 实例的最大表大小)
        类型：uint  默认：10000000
  --wasm-max-code-space ( wasm 的最大提交代码空间（以 MB 为单位）)
        类型：uint  默认：1024
  --wasm-tier-up (启用向优化编译器的升级（需要 --liftoff 才能生效）)
        类型：bool  默认：true
  --trace-wasm-ast-start (用于 wasm AST 跟踪的开始函数（包括）)
        类型：int  默认：0
  --trace-wasm-ast-end (用于 wasm AST 跟踪的结束函数（不包括）)
        类型：int  默认：0
  --liftoff (启用 Liftoff，这是 WebAssembly 的基线编译器)
        类型：bool  默认：true
  --trace-wasm-memory (打印在 wasm 代码中执行的所有内存更新)
        类型：bool  默认：false
  --wasm-tier-mask-for-testing (编译时将功能与 TurboFan 而非 Liftoff 的位掩码)
        类型：int  默认：0
  --wasm-expose-debug-eval (在 CDP 上暴露 wasm 求值器支持)
        类型：bool  默认：false
  --validate-asm (在编译之前验证 asm.js 模块)
        类型：bool  默认：true
  --suppress-asm-messages (不要发出与 asm.js 相关的消息（用于黄金文件测试）)
        类型：bool  默认：false
  --trace-asm-time (将 asm.js 定时信息记录到控制台)
        类型：bool  默认：false
  --trace-asm-scanner (记录 asm.js 扫描器遇到的标记)
        类型：bool  默认：false
  --trace-asm-parser (对 asm.js 解析失败进行详细日志记录)
        类型：bool  默认：false
  --stress-validate-asm (尽量对所有内容进行 asm.js 验证)
        类型：bool  默认：false
  --dump-wasm-module-path (将 wasm 模块转储到的目录)
        类型：string  默认：nullptr
  --experimental-wasm-eh (为 wasm 启用原型异常处理操作码)
        类型：bool  默认：false
  --experimental-wasm-simd (为 wasm 启用原型 SIMD 操作码)
        类型：bool  默认：false
  --experimental-wasm-return-call (为 wasm 启用原型返回调用操作码)
        类型：bool  默认：false
  --experimental-wasm-compilation-hints (为 wasm 启用原型编译提示部分)
        类型：bool  默认：false
  --experimental-wasm-gc (为 wasm 启用原型垃圾收集)
        类型：bool  默认：false
  --experimental-wasm-typed-funcref (为 wasm 启用原型类型函数引用)
        类型：bool  默认：false
  --experimental-wasm-reftypes (为 wasm 启用原型引用类型操作码)
        类型：bool  默认：false
  --experimental-wasm-threads (为 wasm 启用原型线程操作码)
        类型：bool  默认：false
  --experimental-wasm-type-reflection (为 wasm 启用原型 wasm 类型反射)
        类型：bool  默认：false
  --experimental-wasm-bigint (为 wasm 启用原型 JS BigInt 支持)
        类型：bool  默认：true
  --experimental-wasm-bulk-memory (为 wasm 启用原型批量内存操作码)
        类型：bool  默认：true
  --experimental-wasm-mv (为 wasm 启用原型多值支持)
        类型：bool  默认：true
  --wasm-staging (启用分阶段的 wasm 功能)
        类型：bool  默认：false
  --wasm-opt (启用 wasm 优化)
        类型：bool  默认：false
  --wasm-bounds-checks (启用边界检查（仅在性能测试中禁用）)
        类型：bool  默认：true
  --wasm-stack-checks (启用堆栈检查（仅在性能测试中禁用）)
        类型：bool  默认：true
  --wasm-math-intrinsics (将一些 Math 导入转化为 wasm)
        类型：bool  默认：true
  --wasm-trap-handler (使用信号处理程序捕获 wasm 中的越界内存访问（当前仅限 Linux x86_64）)
        类型：bool  默认：true
  --wasm-fuzzer-gen-test (在运行 wasm 模糊测试时生成测试用例)
        类型：bool  默认：false
  --print-wasm-code (打印 WebAssembly 代码)
        类型：bool  默认：false
  --print-wasm-stub-code (打印 WebAssembly 存根代码)
        类型：bool  默认：false
  --asm-wasm-lazy-compilation (为 asm-wasm 模块启用懒惰编译)
        类型：bool  默认：false
  --wasm-lazy-compilation (为所有 wasm 模块启用懒惰编译)
        类型：bool  默认：false
  --wasm-lazy-validation (为懒惰编译的 wasm 函数启用懒惰验证)
        类型：bool  默认：false
  --wasm-atomics-on-non-shared-memory (允许在非共享 WebAssembly 内存上进行原子操作)
        类型：bool  默认：true
  --wasm-grow-shared-memory (允许增长共享的 WebAssembly 内存对象)
        类型：bool  默认：true
  --wasm-simd-post-mvp (允许未包含在当前提案中的原型 SIMD 操作进行原型设计)
        类型：bool  默认：false
  --wasm-code-gc (启用对 wasm 代码的垃圾收集)
        类型：bool  默认：true
  --trace-wasm-code-gc (跟踪 wasm 代码的垃圾收集)
        类型：bool  默认：false
  --stress-wasm-code-gc (压力测试 wasm 代码的垃圾收集)
        类型：bool  默认：false
  --wasm-max-initial-code-space-reservation (初始 wasm 代码空间保留的最大大小（以 MB 为单位）)
        类型：int  默认：0
  --frame-count (分析器检查的堆栈帧数量)
        类型：int  默认：1
  --stress-sampling-allocation-profiler (启用采样分配分析器，X 为采样间隔)
        类型：int  默认：0
  --lazy-new-space-shrinking (启用懒惰的新空间收缩策略)
        类型：bool  默认：false
  --min-semi-space-size (半空间的最小大小（以 MB 为单位），新空间由两个半空间组成)
        类型：size_t  默认：0
  --max-semi-space-size (半空间的最大大小（以 MB 为单位），新空间由两个半空间组成)
        类型：size_t  默认：0
  --semi-space-growth-factor (增长新空间的因子)
        类型：int  默认：2
  --max-old-space-size (老生代的最大大小（以 MB 为单位）)
        类型：size_t  默认：0
  --max-heap-size (堆的最大大小（以 MB 为单位）最大半空间大小和老生代大小优先。不能同时指定所有三个标志。)
        类型：size_t  默认：0
  --initial-heap-size (堆的初始大小（以 MB 为单位）)
        类型：size_t  默认：0
  --huge-max-old-generation-size (对于物理内存大于 16 GB 的 x64 系统，将老生代的最大大小增加到 4 GB)
        类型：bool  默认：true
  --initial-old-space-size (初始老空间大小（以 MB 为单位）)
        类型：size_t  默认：0
  --global-gc-scheduling (基于全局内存启用垃圾收集调度)
        类型：bool  默认：true
  --gc-global (始终执行全局 GC)
        类型：bool  默认：false
  --random-gc-interval (在随机(0, X) 分配之后收集垃圾。覆盖 gc_interval。)
        类型：int  默认：0
  --gc-interval (在 <n> 次分配之后收集垃圾)
        类型：int  默认：-1
  --retain-maps-for-n-gc (在 <n> 次老生代垃圾收集期间保持地图存活)
        类型：int  默认：2
  --trace-gc (在每次垃圾收集后打印一行跟踪信息)
        类型：bool  默认：false
  --trace-gc-nvp (在每次垃圾收集后以名称=值格式打印一行详细跟踪信息)
        类型：bool  默认：false
  --trace-gc-ignore-scavenger (在小型垃圾收集后不打印跟踪行)
        类型：bool  默认：false
  --trace-idle-notification (在每个闲置通知后打印一行跟踪信息)
        类型：bool  默认：false
  --trace-idle-notification-verbose (打印空闲通知使用的堆状态)
        类型：bool  默认：false
  --trace-gc-verbose (在每次垃圾收集后打印更多细节)
        类型：bool  默认：false
  --trace-gc-freelists (在每次主要垃圾收集之前和之后打印每个空闲列表的详细信息)
        类型：bool  默认：false
  --trace-gc-freelists-verbose (在每次主要垃圾收集之前和之后打印每一页的空闲列表的详细信息)
        类型：bool  默认：false
  --trace-evacuation-candidates (显示关于通过压实进行页面撤离的统计信息)
        类型：bool  默认：false
  --trace-allocations-origins (显示关于分配来源的统计信息。通过 --no-inline-new 组合以跟踪从生成代码中分配的内容)
        类型：bool  默认：false
  --trace-allocation-stack-interval (在 <n> 次空闲列表分配后打印堆栈跟踪)
        类型：int  默认：-1
  --trace-duplicate-threshold-kb (如果其大小超过给定阈值，则打印堆中的重复对象)
        类型：int  默认：0
  --trace-fragmentation (报告老生代的碎片化)
        类型：bool  默认：false
  --trace-fragmentation-verbose (报告老生代的碎片化（详细）)
        类型：bool  默认：false
  --minor-mc-trace-fragmentation (在标记后跟踪碎片化)
        类型：bool  默认：false
  --trace-evacuation (报告撤离统计信息)
        类型：bool  默认：false
  --trace-mutator-utilization (打印突变器利用率、分配速度、gc 速度)
        类型：bool  默认：false
  --incremental-marking (使用增量标记)
        类型：bool  默认：true
  --incremental-marking-wrappers (对标记包装器使用增量标记)
        类型：bool  默认：true
  --incremental-marking-task (对增量标记使用任务)
        类型：bool  默认：true
  --incremental-marking-soft-trigger (通过任务开始增量标记的阈值，以可用空间的百分比表示：限制 - 大小)
        类型：int  默认：0
  --incremental-marking-hard-trigger (通过空间的百分比立即开始增量标记的阈值：限制 - 大小)
        类型：int  默认：0
  --trace-unmapper (跟踪取消映射)
        类型：bool  默认：false
  --parallel-scavenge (并行清理)
        类型：bool  默认：true
  --scavenge-task (调度清理任务)
        类型：bool  默认：true
  --scavenge-task-trigger (以当前堆限制的百分比触发清理任务)
        类型：int  默认：80
  --scavenge-separate-stack-scanning (在清理中使用单独的阶段进行堆栈扫描)
        类型：bool  默认：false
  --trace-parallel-scavenge (跟踪并行清理)
        类型：bool  默认：false
  --write-protect-code-memory (对代码内存进行写保护)
        类型：bool  默认：true
  --concurrent-marking (使用并发标记)
        类型：bool  默认：true
  --concurrent-array-buffer-sweeping (并发清理数组缓冲区)
        类型：bool  默认：true
  --concurrent-allocation (在老生代中并发分配)
        类型：bool  默认：false
  --local-heaps (允许从后台任务访问堆)
        类型：bool  默认：false
  --stress-concurrent-allocation (启动后台线程以分配内存)
        类型：bool  默认：false
  --parallel-marking (在原子暂停期间使用并行标记)
        类型：bool  默认：true
  --ephemeron-fixpoint-iterations (切换到线性即时算法所需的固定点迭代次数)
        类型：int  默认：10
  --trace-concurrent-marking (跟踪并发标记)
        类型：bool  默认：false
  --concurrent-store-buffer (使用并发存储缓冲处理)
        类型：bool  默认：true
  --concurrent-sweeping (使用并发清理)
        类型：bool  默认：true
  --parallel-compaction (使用并行压实)
        类型：bool  默认：true
  --parallel-pointer-update (在压实期间使用并行指针更新)
        类型：bool  默认：true
  --detect-ineffective-gcs-near-heap-limit (触发内存不足失败以避免垃圾收集风暴接近堆限制)
        类型：bool  默认：true
  --trace-incremental-marking (跟踪增量标记的进展)
        类型：bool  默认：false
  --trace-stress-marking (跟踪压力标记进展)
        类型：bool  默认：false
  --trace-stress-scavenge (跟踪压力清理进展)
        类型：bool  默认：false
  --track-gc-object-stats (跟踪对象数量和内存使用情况)
        类型：bool  默认：false
  --trace-gc-object-stats (跟踪对象数量和内存使用情况)
        类型：bool  默认：false
  --trace-zone-stats (跟踪区域内存使用情况)
        类型：bool  默认：false
  --zone-stats-tolerance (仅当分配的区域内存按此量更改时报告滴答)
        类型：size_t  默认：1048576
  --track-retaining-path (启用跟踪保留路径的支持)
        类型：bool  默认：false
  --concurrent-array-buffer-freeing (在后台线程上释放数组缓冲区分配)
        类型：bool  默认：true
  --gc-stats (由跟踪内部用于启用 gc 统计信息)
        类型：int  默认：0
  --track-detached-contexts (跟踪预期被垃圾收集的本地上下文)
        类型：bool  默认：true
  --trace-detached-contexts (跟踪预期被垃圾收集的本地上下文)
        类型：bool  默认：false
  --move-object-start (启用移动对象开头)
        类型：bool  默认：true
  --memory-reducer (使用内存压缩)
        类型：bool  默认：true
  --memory-reducer-for-small-heaps (对小堆使用内存压缩)
        类型：bool  默认：true
  --heap-growing-percent (指定堆增长因子为 (1 + heap_growing_percent/100))
        类型：int  默认：0
  --v8-os-page-size (覆盖操作系统页面大小（以 KBytes 为单位）)
        类型：int  默认：0
  --always-compact (在每个完整的 GC 上执行压实)
        类型：bool  默认：false
  --never-compact (在完整的 GC 上永远不执行压实 - 仅用于测试)
        类型：bool  默认：false
  --compact-code-space (在完整收集上压缩代码空间)
        类型：bool  默认：true
  --flush-bytecode (在最近没有被执行时刷新的字节码)
        类型：bool  默认：true
  --stress-flush-bytecode (压力测试字节码刷新)
        类型：bool  默认：false
  --use-marking-progress-bar (在增量标记激活时使用进度条按增量扫描大对象。)
        类型：bool  默认：true
  --stress-per-context-marking-worklist (对标记使用每个上下文工作列表)
        类型：bool  默认：false
  --force-marking-deque-overflows (通过将标记双端队列的大小减少到 64 字进行强制溢出)
        类型：bool  默认：false
  --stress-compaction (对 GC 压缩进行压力测试以找出错误（暗示 --force_marking_deque_overflows）)
        类型：bool  默认：false
  --stress-compaction-random (通过选择随机百分比的页作为撤离候选者来强制 GC 压缩。覆盖 stress_compaction。)
        类型：bool  默认：false
  --stress-incremental-marking (在小堆内强制增量标记并更频繁地运行)
        类型：bool  默认：false
  --fuzzer-gc-analysis (打印分配数量并启用 gc 模糊测试的分析模式，例如 --stress-marking， --stress-scavenge)
        类型：bool  默认：false
  --stress-marking (在 0 到 X（包括）之间的随机点强制标记常规标记开始限制的百分比)
        类型：int  默认：0
  --stress-scavenge (在新空间容量的 0 到 X（包括）之间随机点强制清理)
        类型：int  默认：0
  --gc-experiment-background-schedule (新的后台 GC 调度启发式)
        类型：bool  默认：false
  --gc-experiment-less-compaction (在非内存减少模式中更少的压缩)
        类型：bool  默认：false
  --disable-abortjs (禁用 AbortJS 运行时函数)
        类型：bool  默认：false
  --randomize-all-allocations (通过忽略分配页时传递的任何提示来随机化虚拟内存保留)
        类型：bool  默认：false
  --manual-evacuation-candidates-selection (仅测试模式标志。它允许单元测试选择撤离候选者页面（需要 --stress_compaction）。)
        类型：bool  默认：false
  --fast-promotion-new-space (在生存率高时快速提升新生代空间)
        类型：bool  默认：false
  --clear-free-memory (将空闲内存初始化为 0)
        类型：bool  默认：false
  --young-generation-large-objects (在年轻代中默认分配大对象)
        类型：bool  默认：true
  --debug-code (为调试生成额外代码（断言）)
        类型：bool  默认：false
  --code-comments (在代码反汇编中发出注释；要获得更可读的源位置，您应该添加 --no-concurrent_recompilation)
        类型：bool  默认：false
  --enable-sse3 (如果可用，则启用使用 SSE3 指令)
        类型：bool  默认：true
  --enable-ssse3 (如果可用，则启用使用 SSSE3 指令)
        类型：bool  默认：true
  --enable-sse4-1 (如果可用，则启用使用 SSE4.1 指令)
        类型：bool  默认：true
  --enable-sse4-2 (如果可用，则启用使用 SSE4.2 指令)
        类型：bool  默认：true
  --enable-sahf (如果可用，则启用使用 SAHF 指令（仅限 X64）)
        类型：bool  默认：true
  --enable-avx (如果可用，则启用使用 AVX 指令)
        类型：bool  默认：true
  --enable-fma3 (如果可用，则启用使用 FMA3 指令)
        类型：bool  默认：true
  --enable-bmi1 (如果可用，则启用使用 BMI1 指令)
        类型：bool  默认：true
  --enable-bmi2 (如果可用，则启用使用 BMI2 指令)
        类型：bool  默认：true
  --enable-lzcnt (如果可用，则启用使用 LZCNT 指令)
        类型：bool  默认：true
  --enable-popcnt (如果可用，则启用使用 POPCNT 指令)
        类型：bool  默认：true
  --arm-arch (如果可用，为所选的 ARM 架构生成指令：armv6，armv7，armv7+sudiv 或 armv8)
        类型：string  默认：armv8
  --force-long-branches (强制所有产生的分支都在长模式下（仅限 MIPS/PPC）)
        类型：bool  默认：false
  --mcpu (为特定 cpu 启用优化)
        类型：string  默认：auto
  --partial-constant-pool (启用使用部分常量池（仅限 X64）)
        类型：bool  默认：true
  --sim-arm64-optional-features (在测试中启用模拟器上的可选功能：none 或 all)
        类型：string  默认：none
  --enable-source-at-csa-bind (在 CSA 绑定位置的二进制文件中包含源信息。)
        类型：bool  默认：false
  --enable-armv7 (已弃用（请使用 --arm_arch 代替）)
        类型：maybe_bool  默认：unset
  --enable-vfp3 (已弃用（请使用 --arm_arch 代替）)
        类型：maybe_bool  默认：unset
  --enable-32dregs (已弃用（请使用 --arm_arch 代替）)
        类型：maybe_bool  默认：unset
  --enable-neon (已弃用（请使用 --arm_arch 代替）)
        类型：maybe_bool  默认：unset
  --enable-sudiv (已弃用（请使用 --arm_arch 代替）)
        类型：maybe_bool  默认：unset
  --enable-armv8 (已弃用（请使用 --arm_arch 代替）)
        类型：maybe_bool  默认：unset
  --enable-regexp-unaligned-accesses (为 regexp 引擎启用未对齐访问)
        类型：bool  默认：true
  --script-streaming (启用后台解析)
        类型：bool  默认：true
  --stress-background-compile (压力测试后台解析)
        类型：bool  默认：false
  --finalize-streaming-on-background (在后台线程上执行脚本流的最终化)
        类型：bool  默认：false
  --disable-old-api-accessors (禁用旧式 API 访问器，其设置通过原型链触发)
        类型：bool  默认：false
  --expose-gc (暴露 gc 扩展)
        类型：bool  默认：false
  --expose-gc-as (以指定名称暴露 gc 扩展)
        类型：string  默认：nullptr
  --expose-externalize-string (暴露外部化字符串扩展)
        类型：bool  默认：false
  --expose-trigger-failure (暴露触发失败扩展)
        类型：bool  默认：false
  --stack-trace-limit (要捕获的堆栈帧数量)
        类型：int  默认：10
  --builtins-in-stack-traces (显示堆栈跟踪中的内置函数)
        类型：bool  默认：false
  --experimental-stack-trace-frames (启用实验性帧（API/内置）和堆栈跟踪布局)
        类型：bool  默认：false
  --disallow-code-generation-from-strings (不允许 eval 及其相关函数)
        类型：bool  默认：false
  --expose-async-hooks (暴露 async_hooks 对象)
        类型：bool  默认：false
  --expose-cputracemark-as (以指定名称暴露 cputracemark 扩展)
        类型：string  默认：nullptr
  --allow-unsafe-function-constructor (允许在没有安全检查的情况下调用函数构造器)
        类型：bool  默认：false
  --force-slow-path (总是采用内置函数的慢速路径)
        类型：bool  默认：false
  --test-small-max-function-context-stub-size (通过使最大大小更小来启用测试函数上下文大小溢出路径)
        类型：bool  默认：false
  --inline-new (使用快速内联分配)
        类型：bool  默认：true
  --trace (跟踪 javascript 函数调用)
        类型：bool  默认：false
  --trace-wasm (跟踪 wasm 函数调用)
        类型：bool  默认：false
  --lazy (使用懒惰编译)
        类型：bool  默认：true
  --max-lazy (忽略急切编译提示)
        类型：bool  默认：false
  --trace-opt (跟踪懒惰优化)
        类型：bool  默认：false
  --trace-opt-verbose (额外详细的编译追踪)
        类型：bool  默认：false
  --trace-opt-stats (跟踪懒惰优化统计信息)
        类型：bool  默认：false
  --trace-deopt (跟踪优化函数去优化)
        类型：bool  默认：false
  --trace-file-names (在 trace-opt/trace-deopt 输出中包括文件名)
        类型：bool  默认：false
  --always-opt (始终尝试优化函数)
        类型：bool  默认：false
  --always-osr (始终尝试 OSR 功能)
        类型：bool  默认：false
  --prepare-always-opt (为启用始终优化做准备)
        类型：bool  默认：false
  --trace-serializer (打印代码序列化器跟踪)
        类型：bool  默认：false
  --compilation-cache (启用编译缓存)
        类型：bool  默认：true
  --cache-prototype-transitions (缓存原型转换)
        类型：bool  默认：true
  --parallel-compile-tasks (启用并行编译任务)
        类型：bool  默认：false
  --compiler-dispatcher (启用编译器调度程序)
        类型：bool  默认：false
  --trace-compiler-dispatcher (跟踪编译器调度程序活动)
        类型：bool  默认：false
  --cpu-profiler-sampling-interval (CPU 分析器采样间隔，以微秒为单位)
        类型：int  默认：1000
  --trace-side-effect-free-debug-evaluate (针对无副作用的调试评估打印调试消息以进行测试)
        类型：bool  默认：false
  --hard-abort (通过崩溃中止)
        类型：bool  默认：true
  --expose-inspector-scripts (暴露 injected-script-source.js 以进行调试)
        类型：bool  默认：false
  --stack-size (v8 允许使用的堆栈区域的默认大小（以 kBytes 为单位）)
        类型：int  默认：984
  --max-stack-trace-source-length (堆栈跟踪中打印的函数源代码的最大长度。)
        类型：int  默认：300
  --clear-exceptions-on-js-entry (在进入 JavaScript 时清除待处理的异常)
        类型：bool  默认：false
  --histogram-interval (聚合内存直方图的时间间隔，以 ms 为单位)
        类型：int  默认：600000
  --heap-profiler-trace-objects (转储堆对象的分配/移动/大小更新)
        类型：bool  默认：false
  --heap-profiler-use-embedder-graph (使用新的 EmbedderGraph API 获取嵌入节点)
        类型：bool  默认：true
  --heap-snapshot-string-limit (在堆快照中将字符串截断为此长度)
        类型：int  默认：1024
  --sampling-heap-profiler-suppress-randomness (使用常量采样间隔以消除测试的不稳定性)
        类型：bool  默认：false
  --use-idle-notification (使用空闲通知以减少内存开销。)
        类型：bool  默认：true
  --trace-ic (跟踪内联缓存状态转换以用于工具/ic-processor)
        类型：bool  默认：false
  --modify-field-representation-inplace (启用就地字段表示更新)
        类型：bool  默认：true
  --max-polymorphic-map-count (在多态状态下跟踪的最大地图数量)
        类型：int  默认：4
  --native-code-counters (生成额外代码以操作统计计数器)
        类型：bool  默认：false
  --thin-strings (启用 ThinString 支持)
        类型：bool  默认：true
  --trace-prototype-users (跟踪对原型用户跟踪的更新)
        类型：bool  默认：false
  --trace-for-in-enumerate (跟踪 for-in 枚举的慢路径)
        类型：bool  默认：false
  --trace-maps (跟踪地图创建)
        类型：bool  默认：false
  --trace-maps-details (还记录地图详细信息)
        类型：bool  默认：true
  --allow-natives-syntax (允许本地语法)
        类型：bool  默认：false
  --allow-natives-for-differential-fuzzing (仅允许明确允许的本地人)
        类型：bool  默认：false
  --parse-only (仅解析源)
        类型：bool  默认：false
  --trace-sim (跟踪模拟器执行)
        类型：bool  默认：false
  --debug-sim (启用调试模拟器)
        类型：bool  默认：false
  --check-icache (检查ARM和MIPS模拟器中的icache刷新)
        类型：bool  默认：false
  --stop-sim-at (模拟器在 x 指令数后停止)
        类型：int  默认：0
  --sim-stack-alignment (模拟器中的堆栈对齐字节（4 或 8，默认 8）)
        类型：int  默认：8
  --sim-stack-size (ARM64，MIPS64 和 PPC64 模拟器的堆栈大小，以 kBytes 为单位（默认是 2 MB）)
        类型：int  默认：2048
  --log-colour (记录时，尝试使用彩色输出。)
        类型：bool  默认：true
  --trace-sim-messages (跟踪模拟器调试消息。由 --trace-sim 隐含。)
        类型：bool  默认：false
  --async-stack-traces (在 Error.stack 中包含异步堆栈跟踪)
        类型：bool  默认：true
  --stack-trace-on-illegal (在抛出非法异常时打印堆栈跟踪)
        类型：bool  默认：false
  --abort-on-uncaught-exception (在抛出未捕获的异常时中止程序（转储核心）)
        类型：bool  默认：false
  --correctness-fuzzer-suppressions (压制某些未指定的行为以缓解正确性模糊测试：当堆栈溢出或字符串超过最大长度时中止程序（而不是抛出 RangeError）。使用固定的抑制字符串进行错误消息。)
        类型：bool  默认：false
  --randomize-hashes (随机化哈希以避免可预测的哈希碰撞（对于快照，此选项不能覆盖内置种子）)
        类型：bool  默认：true
  --rehash-snapshot (从快照重新哈希字符串以覆盖内置种子)
        类型：bool  默认：true
  --hash-seed (用于哈希属性键的固定种子（0 意味着随机）（对于快照，此选项不能覆盖内置种子）)
        类型：uint64  默认：0
  --random-seed (初始化随机生成器的默认种子（0，默认值，表示使用系统随机）。)
        类型：int  默认：0
  --fuzzer-random-seed (初始化模糊测试随机生成器的默认种子（0，默认值，表示使用 v8 的随机数生成器种子。）
        类型：int  默认：0
  --trace-rail (跟踪 RAIL 模式)
        类型：bool  默认：false
  --print-all-exceptions (打印每个抛出异常的异常对象和堆栈跟踪)
        类型：bool  默认：false
  --detailed-error-stack-trace (在错误堆栈帧数组中为每个函数调用包含参数)
        类型：bool  默认：false
  --adjust-os-scheduling-parameters (调整与隔离相关的特定于操作系统的调度参数)
        类型：bool  默认：true
  --runtime-call-stats (报告运行时调用计数和时间)
        类型：bool  默认：false
  --rcs (报告运行时调用计数和时间)
        类型：bool  默认：false
  --rcs-cpu-time (在 cpu 时间中报告运行时（默认是墙钟时间）)
        类型：bool  默认：false
  --profile-deserialization (打印反序列化快照所需的时间。)
        类型：bool  默认：false
  --serialization-statistics (收集序列化对象的统计信息。)
        类型：bool  默认：false
  --serialization-chunk-size (自定义序列化块大小)
        类型：uint  默认：4096
  --regexp-optimization (生成优化的正则表达式代码)
        类型：bool  默认：true
  --regexp-mode-modifiers (启用正则表达式中的内联标志。)
        类型：bool  默认：false
  --regexp-interpret-all (解释所有正则表达式代码)
        类型：bool  默认：false
  --regexp-tier-up (启用正则表达式解释器并在设置的执行次数后升级到编译器)
        类型：bool  默认：true
  --regexp-tier-up-ticks (设置正则表达式解释器在升级到编译器之前的执行次数)
        类型：int  默认：1
  --regexp-peephole-optimization (启用正则表达式字节码的窥视孔优化)
        类型：bool  默认：true
  --trace-regexp-peephole-optimization (跟踪正则表达式字节码的窥视孔优化)
        类型：bool  默认：false
  --trace-regexp-bytecodes (跟踪正则表达式字节码执行)
        类型：bool  默认：false
  --trace-regexp-assembler (跟踪正则表达式宏汇编调用。)
        类型：bool  默认：false
  --trace-regexp-parser (跟踪正则表达式解析)
        类型：bool  默认：false
  --trace-regexp-tier-up (跟踪正则表达式升级执行)
        类型：bool  默认：false
  --testing-bool-flag (testing_bool_flag)
        类型：bool  默认：true
  --testing-maybe-bool-flag (testing_maybe_bool_flag)
        类型：maybe_bool  默认：unset
  --testing-int-flag (testing_int_flag)
        类型：int  默认：13
  --testing-float-flag (float-flag)
        类型：float  默认：2.5
  --testing-string-flag (string-flag)
        类型：string  默认：Hello, world!
  --testing-prng-seed (用于线程测试随机性的种子)
        类型：int  默认：42
  --testing-d8-test-runner (测试运行器在标记其为优化之前启用此标志以检查函数是否已准备好)
        类型：bool  默认：false
  --fuzzing (模糊测试使用此标志表明它们正在 ... 模糊测试。这会导致使用无效时，内联函数失败（例如，返回未定义）)
        类型：bool  默认：false
  --embedded-src (生成的嵌入式数据文件的路径。（mksnapshot 仅适用）)
        类型：string  默认：nullptr
  --embedded-variant (在嵌入式数据文件中为符号消歧而生成的标签。（mksnapshot 仅适用）)
        类型：string  默认：nullptr
  --startup-src (以 C++ 源的形式编写 V8 启动。（mksnapshot 仅适用）)
        类型：string  默认：nullptr
  --startup-blob (编写 V8 启动 blob 文件。（mksnapshot 仅适用）)
        类型：string  默认：nullptr
  --target-arch (mksnapshot 的目标架构。 （mksnapshot 仅适用）)
        类型：string  默认：nullptr
  --target-os (mksnapshot 的目标系统。（mksnapshot 仅适用）)
        类型：string  默认：nullptr
  --target-is-simulator (指示 mksnapshot 目标旨在运行在模拟器上，并且可以生成特定于模拟器的指令。（mksnapshot 仅适用）)
        类型：bool  默认：false
  --minor-mc-parallel-marking (为年轻一代使用并行标记)
        类型：bool  默认：true
  --trace-minor-mc-parallel-marking (跟踪年轻一代的并行标记)
        类型：bool  默认：false
  --minor-mc (执行年轻一代标记紧凑 GC)
        类型：bool  默认：false
  --help (打印使用消息，包括控制台上的标志)
        类型：bool  默认：true
  --dump-counters (在退出时转储计数器)
        类型：bool  默认：false
  --dump-counters-nvp (以名称值对的方式转储计数器以退出)
        类型：bool  默认：false
  --use-external-strings (使用外部字符串源代码)
        类型：bool  默认：false
  --map-counters (将计数器映射到文件)
        类型：string  默认：
  --mock-arraybuffer-allocator (使用模拟的 ArrayBuffer 分配器进行测试。)
        类型：bool  默认：false
  --mock-arraybuffer-allocator-limit (用于测试的模拟 ArrayBuffer 分配器的内存限制。)
        类型：size_t  默认：0
  --gdbjit (启用 GDBJIT 接口)
        类型：bool  默认：false
  --gdbjit-full (对所有代码对象启用 GDBJIT 接口)
        类型：bool  默认：false
  --gdbjit-dump (将带有调试信息的 elf 对象转储到磁盘)
        类型：bool  默认：false
  --gdbjit-dump-filter (仅转储包含此子字符串的对象)
        类型：string  默认：
  --log (最小日志记录（无 API、代码、GC、可疑或句柄示例）)
        类型：bool  默认：false
  --log-all (将所有事件记录到日志文件。)
        类型：bool  默认：false
  --log-api (将 API 事件记录到日志文件。)
        类型：bool  默认：false
  --log-code (在不分析的情况下记录代码事件。)
        类型：bool  默认：false
  --log-handles (记录全局句柄事件。)
        类型：bool  默认：false
  --log-suspect (记录可疑操作。)
        类型：bool  默认：false
  --log-source-code (记录源代码。)
        类型：bool  默认：false
  --log-function-events (单独记录函数事件（解析、编译、执行）。)
        类型：bool  默认：false
  --prof (记录统计分析信息（暗示 --log-code）。)
        类型：bool  默认：false
  --detailed-line-info (始终为 CPU 分析生成详细行信息。)
        类型：bool  默认：false
  --prof-sampling-interval (对于 --prof 的样本间隔（以微秒为单位）。)
        类型：int  默认：1000
  --prof-cpp (类似于 --prof，但忽略生成的代码。)
        类型：bool  默认：false
  --prof-browser-mode (与 --prof 一起使用，启用与浏览器兼容的分析模式。)
        类型：bool  默认：true
  --logfile (指定日志文件的名称。)
        类型：string  默认：v8.log
  --logfile-per-isolate (每个隔离的单独日志文件。)
        类型：bool  默认：true
  --ll-prof (启用低级 Linux 分析器。)
        类型：bool  默认：false
  --gc-fake-mmap (指定用于 ll_prof 的假 gc mmap 文件的名称)
        类型：string  默认：/tmp/__v8_gc__
  --log-internal-timer-events (时间内部事件。)
        类型：bool  默认：false
  --redirect-code-traces (输出去优化信息和反汇编到文件 code-<pid>-<isolate id>.asm)
        类型：bool  默认：false
  --redirect-code-traces-to (输出去优化信息和反汇编到给定文件)
        类型：string  默认：nullptr
  --print-opt-source (打印优化和内联函数的源代码)
        类型：bool  默认：false
  --vtune-prof-annotate-wasm (当 v8_enable_vtunejit 启用时，加载 wasm 源映射并提供注释支持（实验性）。)
        类型：bool  默认：false
  --win64-unwinding-info (启用 Windows/x64 的展开信息)
        类型：bool  默认：true
  --interpreted-frames-native-stack (在本机堆栈上显示解释的帧（对外部分析器有用）。)
        类型：bool  默认：false
  --predictable (启用可预测模式)
        类型：bool  默认：false
  --predictable-gc-schedule (可预测的垃圾收集调度。修复堆增长、空闲和内存减少行为。)
        类型：bool  默认：false
  --single-threaded (禁用后台任务)
        类型：bool  默认：false
  --single-threaded-gc (禁用后台 gc 任务)
        类型：bool  默认：false
```

特别有用的标志：

```console
--async-stack-traces
```