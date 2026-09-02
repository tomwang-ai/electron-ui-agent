# Electron UI Agent

[English](#english) | [中文](#中文)

> **Let any AI run repeatable Electron UI tests without spending tokens on every click.**
>
> **让任何 AI 都能低 Token、可重复地执行 Electron 桌面应用 UI 测试。**

## What is it? / 这是什么？

Electron UI Agent is a small local test runner between an AI client and an Electron application. Give it a readable test case; it launches the application, performs the UI steps with Playwright, checks the expected result, and saves screenshots, traces, logs, and structured results.

Electron UI Agent 是位于 AI 客户端与 Electron 应用之间的本地测试执行器。给它一份可读测试用例，它会启动应用、通过 Playwright 执行 UI 操作、验证预期结果，并保存截图、Trace、日志和结构化结果。

It works with AI clients through MCP, with CI through exit codes and JSON, and with humans through a CLI. The tested application's business cases remain in a separate private workspace and never enter this public repository.

它通过 MCP 接入 AI 客户端，通过退出码和 JSON 接入 CI，也可以由人工直接使用 CLI。被测应用的业务用例始终留在独立私有工作区，不进入本公开仓库。

## Why does it exist? / 为什么需要它？

| Without this runner / 直接让AI操作 | With Electron UI Agent / 使用本项目 |
|---|---|
| The model spends context on every click and screenshot. / 每次点击和截图都消耗模型上下文。 | A saved case runs deterministically with zero model API calls. / 保存后的用例零模型调用执行。 |
| The same test may be interpreted differently each time. / 同一用例每次可能被不同理解。 | YAML, JSON or Markdown compiles intent into repeatable steps. / 用结构化步骤保证可重复。 |
| Failures are described only in chat. / 失败只停留在聊天描述中。 | Every run returns JSON and keeps local evidence. / 每次执行都有JSON和本地证据。 |
| Business data can leak into a generic tool. / 业务数据容易混入通用工具。 | The open-source core and private cases are separated by design and CI gates. / 开源核心与私有用例由架构和CI门禁隔离。 |

## How it works / 工作流程

```text
Human, CI, Codex, Claude, or another MCP client
人工、CI或任意MCP AI客户端
                    |
          YAML / JSON / Markdown case
          YAML / JSON / Markdown 用例
                    |
             Electron UI Agent
           parse -> launch -> act -> assert
           解析 -> 启动 -> 操作 -> 断言
                    |
           Your Electron application
              你的Electron应用
                    |
       JSON + screenshot + trace + console
       JSON + 截图 + Trace + 控制台日志
```

## 60-second example / 60秒示例

Write a case / 编写用例：

```yaml
name: submit a generic form
app:
  executablePath: "${ENV:APP_EXECUTABLE}"
steps:
  - action: fill
    target: { role: textbox, name: Display name }
    value: Example User
  - action: click
    target: { role: button, name: Continue }
  - action: assertVisible
    target: { text: Completed }
  - action: screenshot
    name: completed
```

Run it / 执行：

```bash
node dist/cli.js cases/form.yaml --output local-artifacts
```

Receive a compact result / 获得精简结果：

```json
{"runId":"<run-id>","caseName":"submit a generic form","status":"passed","artifacts":["<artifact-path>/result.json","<artifact-path>/trace.zip"]}
```

The same saved case can be called from MCP without asking the model to decide every UI action again.

同一份保存后的用例可以通过 MCP 重复调用，不需要模型再次决定每一步 UI 操作。

## Good fit / 适用场景

- An AI assistant needs to execute an existing Electron UI test. / AI助手需要执行已有Electron UI用例。
- A CI job needs a machine-readable pass/fail result plus evidence. / CI需要机器可读结果和失败证据。
- A team wants repeatable desktop smoke tests without binding to one model vendor. / 团队希望获得不绑定模型厂商的桌面冒烟测试。
- A private test project must depend on a business-neutral open-source runner. / 私有测试项目需要依赖与业务隔离的开源执行器。

## Not yet / 当前不适用

- Autonomous exploration of an unknown application. / 自主探索完全未知的应用。
- Visual self-healing or natural-language case generation inside the core. / 核心内置视觉自愈或自然语言生成用例。
- Native operating-system dialogs or multi-window selection. / 操作系统原生对话框或多窗口选择。
- Sandboxing an untrusted executable. / 沙箱隔离不可信可执行程序。

**Start here / 从这里开始:** [Getting Started / 快速入门](docs/GETTING_STARTED.md) · [Documentation / 文档中心](docs/README.md)

## English

A vendor-neutral, token-efficient Electron UI test runner for humans, CI systems, and AI clients.

The runner reads deterministic YAML, JSON, or Markdown test cases and executes them with Playwright. Repeated runs require no language-model calls. AI clients can invoke the same runner through the Model Context Protocol (MCP) and receive compact result summaries.

## Principles

- Deterministic execution first; AI assistance is optional.
- No arbitrary JavaScript in test cases.
- Business tests and data stay in separate private repositories.
- Screenshots, traces, logs, and run results are local artifacts and are ignored by Git.
- No telemetry or network upload is built in.

## Install

```bash
npm ci
npm run build
npm run check
```

Node.js 20 or newer is required.

The package is not yet published to the npm registry. These commands are for a source checkout.

## Run a case

```bash
node dist/cli.js <CASE_FILE_OR_DIRECTORY> --output <PRIVATE_ARTIFACT_DIRECTORY>
```

Application paths and secrets can be supplied through environment variables:

```yaml
app:
  executablePath: "${ENV:ELECTRON_EXECUTABLE}"
  args: ["${ENV:APP_ENTRY}"]
```

Supported actions are `click`, `fill`, `press`, `wait`, `assertVisible`, `assertText`, `assertValue`, and `screenshot`.

## MCP server

```bash
node <ABSOLUTE_PATH_TO_AGENT>/dist/mcp.js --workspace <ABSOLUTE_PATH_TO_PRIVATE_TEST_WORKSPACE>
```

The MCP server exposes `run_case`. Paths are restricted to the configured workspace, and the response contains only a compact status summary and artifact paths.

## Keep business data separate

This repository must contain synthetic, non-identifying content only. Store application configuration, selectors, credentials, cases, screenshots, traces, and reports in a separate private repository or local workspace:

```text
open-source runner  <-  private test project  <-  private runtime secrets
```

The dependency direction must never be reversed. See [CONTRIBUTING.md](CONTRIBUTING.md) for the merge gate.

## Documentation

- [Documentation index](docs/README.md)
- [Getting started](docs/GETTING_STARTED.md)
- [CLI reference](docs/CLI.md)
- [MCP integration](docs/MCP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Test case format](docs/CASE_FORMAT.md)
- [Privacy and business isolation](docs/PRIVACY.md)
- [Artifacts and results](docs/ARTIFACTS.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Compatibility](docs/COMPATIBILITY.md)
- [Security model](docs/SECURITY_MODEL.md)
- [Development](docs/DEVELOPMENT.md)
- [Release](docs/RELEASE.md)
- [Roadmap](docs/ROADMAP.md)

## Verify

```bash
npm run check
```

This builds the project, checks MCP discovery, runs unit and Electron end-to-end tests, and scans the repository for common identifying or sensitive data patterns.

## License

Apache License 2.0.

---

## 中文

Electron UI Agent 是一个厂商无关、低 Token 消耗的 Electron UI 测试执行器，可供人工、CI 系统和各种 AI 客户端使用。

执行器读取确定性的 YAML、JSON 或 Markdown 测试用例，并通过 Playwright 执行。保存后的用例重复运行时不需要调用大语言模型。AI 客户端可以通过模型上下文协议（MCP）调用同一个执行器，并只接收精简结果。

### 设计原则

- 优先确定性执行，AI 辅助是可选能力。
- 测试用例不允许执行任意 JavaScript。
- 业务测试和数据必须保存在独立私有仓库中。
- 截图、Trace、日志和运行结果仅作为本地产物，并由 Git 忽略。
- 项目不包含遥测或网络上传能力。

### 安装

```bash
npm ci
npm run build
npm run check
```

要求 Node.js 20 或更高版本。

项目尚未发布到 npm 公共仓库；以上命令用于源码检出。

### 执行用例

```bash
node dist/cli.js <CASE_FILE_OR_DIRECTORY> --output <PRIVATE_ARTIFACT_DIRECTORY>
```

应用路径和敏感参数可通过环境变量提供：

```yaml
app:
  executablePath: "${ENV:ELECTRON_EXECUTABLE}"
  args: ["${ENV:APP_ENTRY}"]
```

当前支持 `click`、`fill`、`press`、`wait`、`assertVisible`、`assertText`、`assertValue` 和 `screenshot`。

### MCP 服务

```bash
node <ABSOLUTE_PATH_TO_AGENT>/dist/mcp.js --workspace <ABSOLUTE_PATH_TO_PRIVATE_TEST_WORKSPACE>
```

MCP 服务提供 `run_case` 工具。所有路径都被限制在配置的工作区内，返回内容只包含精简状态和证据文件路径。

### 业务隔离

本仓库只能包含虚构且不可识别的信息。真实应用配置、选择器、凭据、用例、截图、Trace 和报告必须放在独立私有仓库或本地工作区：

```text
开源执行器 <- 私有测试项目 <- 私有运行时密钥
```

依赖方向不能反转。合并门禁见 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 文档

- [文档中心](docs/README.md)
- [快速入门](docs/GETTING_STARTED.md)
- [CLI参考](docs/CLI.md)
- [MCP接入](docs/MCP.md)
- [架构说明](docs/ARCHITECTURE.md)
- [测试用例格式](docs/CASE_FORMAT.md)
- [隐私与业务隔离](docs/PRIVACY.md)
- [证据与结果](docs/ARTIFACTS.md)
- [故障排查](docs/TROUBLESHOOTING.md)
- [兼容性](docs/COMPATIBILITY.md)
- [安全模型](docs/SECURITY_MODEL.md)
- [开发指南](docs/DEVELOPMENT.md)
- [发布指南](docs/RELEASE.md)
- [路线图](docs/ROADMAP.md)

### 验证

```bash
npm run check
```

该命令会构建项目、验证 MCP 工具发现、运行单元测试和真实 Electron 端到端测试，并扫描常见敏感或可识别信息。

### 许可证

Apache License 2.0。
