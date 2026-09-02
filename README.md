# Electron UI Agent

[English](#english) | [中文](#中文)

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
npm install
npm run build
```

Node.js 20 or newer is required.

## Run a case

```bash
electron-ui-agent examples/demo-case.md --output artifacts
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
electron-ui-agent-mcp --workspace ./private-test-project
```

The MCP server exposes `run_case`. Paths are restricted to the configured workspace, and the response contains only a compact status summary and artifact paths.

## Keep business data separate

This repository must contain synthetic, non-identifying content only. Store application configuration, selectors, credentials, cases, screenshots, traces, and reports in a separate private repository or local workspace:

```text
open-source runner  <-  private test project  <-  private runtime secrets
```

The dependency direction must never be reversed. See [CONTRIBUTING.md](CONTRIBUTING.md) for the merge gate.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Test case format](docs/CASE_FORMAT.md)
- [Privacy and business isolation](docs/PRIVACY.md)
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
npm install
npm run build
```

要求 Node.js 20 或更高版本。

### 执行用例

```bash
electron-ui-agent examples/demo-case.md --output artifacts
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
electron-ui-agent-mcp --workspace ./private-test-project
```

MCP 服务提供 `run_case` 工具。所有路径都被限制在配置的工作区内，返回内容只包含精简状态和证据文件路径。

### 业务隔离

本仓库只能包含虚构且不可识别的信息。真实应用配置、选择器、凭据、用例、截图、Trace 和报告必须放在独立私有仓库或本地工作区：

```text
开源执行器 <- 私有测试项目 <- 私有运行时密钥
```

依赖方向不能反转。合并门禁见 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 文档

- [架构说明](docs/ARCHITECTURE.md)
- [测试用例格式](docs/CASE_FORMAT.md)
- [隐私与业务隔离](docs/PRIVACY.md)
- [路线图](docs/ROADMAP.md)

### 验证

```bash
npm run check
```

该命令会构建项目、验证 MCP 工具发现、运行单元测试和真实 Electron 端到端测试，并扫描常见敏感或可识别信息。

### 许可证

Apache License 2.0。
