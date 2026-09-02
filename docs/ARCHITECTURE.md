# Architecture

[English](#english) | [中文](#中文)

## English

Electron UI Agent has one job: execute deterministic UI cases against a locally trusted Electron application.

```text
human, CI, or AI client
          |
       CLI or MCP
          |
   case loader and validator
          |
 Playwright Electron runner
          |
 local evidence directory
```

## Boundaries

The CLI and MCP server share the same case loader and runner. There is no model provider inside the execution path, so a saved case consumes no language-model tokens. An AI client may author a case or invoke `run_case`, but click, fill, wait, assertion, screenshot, and evidence collection remain deterministic.

The MCP server accepts paths only inside its configured workspace. It does not expose arbitrary JavaScript evaluation. The application executable is trusted input: launching a test application has the same security implications as launching it directly.

## Evidence

Each run writes a unique local directory containing `result.json`, a Playwright trace, explicit screenshots, a failure screenshot when possible, and renderer console output when present. The MCP response returns only a compact result and artifact paths; clients load large evidence only when needed.

## Extension policy

Keep the core action set small. Add an action only when it is broadly useful across Electron applications and can be validated without application-specific knowledge. Product workflows, selectors, data, and reporting integrations belong in private downstream test projects.

## Component responsibilities

| Component | Owns | Does not own |
|---|---|---|
| `case-loader.ts` | File parsing, structural validation, recursive discovery and stable ordering | Electron launch or UI actions |
| `types.ts` | Case, target, step and result TypeScript shapes | Runtime validation by itself |
| `runner.ts` | Run ID, output directory, Electron lifecycle, first window, steps, trace and result | CLI parsing or MCP path policy |
| `cli.ts` | User arguments, file/directory discovery, sequential execution, compact stdout and exit status | MCP protocol |
| `mcp.ts` | STDIO server, Zod tool input, workspace confinement and compact tool response | Directory discovery or artifact reading |
| hygiene script | Generic text-pattern scanning and optional private deny-list | Semantic proof that content is safe |

## Execution sequence

1. CLI or MCP resolves a case path.
2. The loader selects JSON, YAML or fenced Markdown parsing.
3. `parseCase` validates required structure and creates a typed case.
4. The runner creates a UUID and output directory.
5. Environment placeholders are expanded when their values are used.
6. Playwright launches the configured Electron executable.
7. The runner waits for the first window and sets the action timeout.
8. Tracing starts and renderer console collection is attached.
9. Steps run sequentially until complete or the first failure.
10. On step failure, the runner attempts a screenshot.
11. Cleanup attempts to stop tracing and close Electron.
12. `result.json` is written and a compact result returns to CLI or MCP.

## Failure ownership

- Loader failures occur before Electron launch and can terminate CLI processing.
- Launch failures create a failed result but may have no page evidence.
- Step failures are captured in `StepResult` and stop only the current case.
- Cleanup is best-effort so one secondary evidence error does not replace the primary failure.
- The caller owns retention, reporting, retry policy and escalation.

## Token model

The core contains no LLM call. A saved case run consumes zero model API tokens. When invoked by an AI client, token use is limited to the request, compact response and any evidence the client explicitly loads. Natural-language compilation and visual recovery belong outside the deterministic core.

## State and concurrency

Each `runCase` call owns one Electron application, first page and UUID directory. CLI directory mode invokes cases sequentially. The MCP server has no explicit queue or concurrency limiter in `0.1.0`; callers should avoid uncontrolled parallel calls until resource governance is implemented.

## Design invariants

- The open-source core never imports a private test project.
- A case cannot run arbitrary JavaScript or shell commands through an action.
- MCP paths remain inside the configured workspace.
- Large evidence stays in files rather than MCP text.
- Current code controls the first Electron window only.
- Every added behavior must have a synthetic verification path.

---

## 中文

Electron UI Agent 只负责一件事：针对本地可信的 Electron 应用执行确定性 UI 用例。

```text
人工、CI 或 AI 客户端
          |
       CLI 或 MCP
          |
    用例读取与校验
          |
 Playwright Electron 执行器
          |
      本地证据目录
```

### 边界

CLI 和 MCP 服务共用同一个用例读取器和执行器。执行路径不包含模型提供商，因此保存后的用例执行时不消耗大模型 Token。AI 客户端可以编写用例或调用 `run_case`，但点击、输入、等待、断言、截图和证据采集始终由确定性执行器完成。

MCP 服务只接受配置工作区内的路径，并且不暴露任意 JavaScript 执行能力。应用可执行文件属于可信输入：启动被测应用与用户直接运行该应用具有相同的安全风险。

### 证据

每次执行都会创建唯一的本地目录，保存 `result.json`、Playwright Trace、显式截图、尽可能生成的失败截图，以及存在时的渲染进程控制台输出。MCP 只返回精简结果和证据路径，大体积证据由客户端按需读取。

### 扩展原则

核心动作集应保持精简。只有跨 Electron 应用普遍适用、且不依赖具体业务知识的动作才能加入核心。产品流程、选择器、业务数据和报告集成都应放在私有下游测试项目中。

### 组件职责

| 组件 | 负责 | 不负责 |
|---|---|---|
| `case-loader.ts` | 文件解析、结构校验、递归发现和稳定排序 | Electron启动或UI动作 |
| `types.ts` | 用例、目标、步骤和结果TypeScript形状 | 单独完成运行时校验 |
| `runner.ts` | Run ID、输出目录、Electron生命周期、首窗、步骤、Trace和结果 | CLI解析或MCP路径策略 |
| `cli.ts` | 参数、文件发现、顺序执行、精简stdout和退出状态 | MCP协议 |
| `mcp.ts` | STDIO服务、Zod输入、工作区限制和精简响应 | 目录发现或读取证据 |
| 卫生脚本 | 通用模式和可选私有禁词扫描 | 语义上证明内容安全 |

### 执行顺序

1. CLI或MCP解析用例路径。
2. 读取器选择JSON、YAML或Markdown代码块解析。
3. `parseCase`校验结构并创建类型化用例。
4. 执行器创建UUID和输出目录。
5. 使用字段时展开环境变量占位符。
6. Playwright启动Electron可执行文件。
7. 等待首个窗口并设置动作超时。
8. 启动Trace并连接渲染进程控制台收集。
9. 顺序执行步骤，完成或首次失败时停止。
10. 步骤失败时尝试截图。
11. 清理阶段尝试停止Trace并关闭Electron。
12. 写入`result.json`，向CLI或MCP返回精简结果。

### 失败归属

- 读取失败发生在启动前，可能终止CLI处理。
- 启动失败会生成失败结果，但可能没有页面证据。
- 步骤失败写入`StepResult`并只终止当前用例。
- 清理采用尽力原则，次要证据错误不覆盖主失败。
- 调用方负责保留、报告、重试和升级策略。

### Token模型

核心不调用LLM。保存后的用例执行消耗零模型API Token。由AI客户端调用时，Token只用于请求、精简响应和客户端显式加载的证据。自然语言编译和视觉恢复位于确定性核心之外。

### 状态与并发

每个`runCase`独占一个Electron应用、首个页面和UUID目录。CLI目录模式顺序调用。`0.1.0` MCP没有显式队列或并发限制；实现资源治理前，调用方应避免无控制并发。

### 设计不变量

- 开源核心永不导入私有测试项目。
- 用例动作不能运行任意JavaScript或Shell。
- MCP路径始终位于配置工作区内。
- 大体积证据保存在文件中，不放入MCP文本。
- 当前只控制首个Electron窗口。
- 每个新增行为必须有虚构验证路径。
