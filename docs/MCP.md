# MCP Integration / MCP 接入

[English](#english) | [中文](#中文)

## English

### Purpose and transport

The MCP server lets AI clients invoke saved deterministic cases. It is not an autonomous visual agent and does not ask a model to control every click.

- Transport: STDIO.
- Entry: `dist/mcp.js`.
- Current tool count: one.

```bash
npm ci
npm run build
node <ABSOLUTE_PATH_TO_AGENT>/dist/mcp.js --workspace <ABSOLUTE_PATH_TO_PRIVATE_TEST_WORKSPACE>
```

### Workspace boundary

`--workspace` is the MCP path boundary. If omitted, the server reads `ELECTRON_UI_AGENT_WORKSPACE`; otherwise it uses the process working directory.

Recommended priority:

1. Explicit absolute `--workspace`.
2. `ELECTRON_UI_AGENT_WORKSPACE` in managed environments.
3. Current directory only for local experiments.

`casePath` and `outputDir` must resolve inside the workspace. `..` escapes and external absolute paths are rejected.

This restriction does not make an untrusted case safe. A case selects an executable, so running a case is trusted local code execution.

### Tool contract: `run_case`

Input:

```json
{
  "casePath": "cases/smoke.yaml",
  "outputDir": ".eui-agent-runs"
}
```

| Field | Required | Description |
|---|---:|---|
| `casePath` | Yes | YAML, YML, JSON or Markdown path relative to the workspace. Directories are not accepted. |
| `outputDir` | No | Artifact root relative to the workspace. Default: `.eui-agent-runs`. |

Success response text:

```json
{
  "runId": "<run-id>",
  "status": "passed",
  "artifacts": ["<workspace>/.eui-agent-runs/<run-id>/trace.zip", "<workspace>/.eui-agent-runs/<run-id>/result.json"]
}
```

Failure response text:

```json
{
  "runId": "<run-id>",
  "status": "failed",
  "failedStep": 2,
  "error": "locator.waitFor: Timeout exceeded",
  "artifacts": ["<workspace>/.eui-agent-runs/<run-id>/003-failure.png", "<workspace>/.eui-agent-runs/<run-id>/trace.zip", "<workspace>/.eui-agent-runs/<run-id>/result.json"]
}
```

`failedStep` is zero-based. Failed runs set the MCP error flag, but clients should still parse the text and evidence paths.

### Token-efficient client behavior

1. Call `run_case` once.
2. Read only `status`, `failedStep`, `error` and artifact paths.
3. Stop when passed.
4. On failure, inspect `result.json` first.
5. Load a screenshot only when visual context is necessary.
6. Load the trace only for deep diagnosis.

Do not paste complete traces, screenshots or all logs into model context. Saved cases execute without model tokens; only the compact MCP exchange occupies client context.

### Generic STDIO configuration

Many clients use this shape:

```json
{
  "mcpServers": {
    "electron-ui-agent": {
      "command": "node",
      "args": [
        "<ABSOLUTE_PATH_TO_AGENT>/dist/mcp.js",
        "--workspace",
        "<ABSOLUTE_PATH_TO_PRIVATE_TEST_WORKSPACE>"
      ]
    }
  }
}
```

Use absolute paths. Escape Windows backslashes in JSON, or use forward slashes when supported. Consult current client documentation for file location and restart behavior.

### Codex

Official OpenAI documentation states that local Codex clients support STDIO MCP and share `~/.codex/config.toml`; trusted projects may use `.codex/config.toml`.

CLI registration:

```bash
codex mcp add electron-ui-agent -- node <ABSOLUTE_PATH_TO_AGENT>/dist/mcp.js --workspace <ABSOLUTE_PATH_TO_PRIVATE_TEST_WORKSPACE>
codex mcp list
```

Equivalent TOML:

```toml
[mcp_servers.electron_ui_agent]
command = "node"
args = [
  "<ABSOLUTE_PATH_TO_AGENT>/dist/mcp.js",
  "--workspace",
  "<ABSOLUTE_PATH_TO_PRIVATE_TEST_WORKSPACE>"
]
startup_timeout_sec = 10
tool_timeout_sec = 120
required = false
default_tools_approval_mode = "prompt"
```

Restart the client or extension, then verify the server through its MCP view or `/mcp` surface.

Official reference: [OpenAI Codex MCP documentation](https://developers.openai.com/codex/mcp/).

### Other clients

Clients using `mcpServers` JSON can adapt the generic configuration. Product UI and configuration locations change; use the client's current official guide rather than an old tutorial.

Protocol reference: [Model Context Protocol](https://modelcontextprotocol.io/).

### Prompt examples

```text
Run cases/smoke.yaml with electron-ui-agent. Return only status, failed step, error, and artifact paths. Do not load screenshots or traces unless the run fails and the summary is insufficient.
```

```text
Run cases/smoke.yaml. On failure inspect result.json first, then only the failure screenshot if needed. Retry at most once and do not modify the application.
```

### Troubleshooting checklist

1. Confirm `dist/mcp.js` exists after `npm run build`.
2. Run `npm run test:mcp`.
3. Use absolute paths.
4. Manually start the configured command; it should stay running and write no non-protocol text to stdout.
5. Confirm the workspace exists.
6. Confirm `casePath` is relative to that workspace.
7. Raise the client tool timeout when a valid run needs more than its default.
8. Keep MCP logs private when they contain local paths.

### Current limitations

- Only `run_case`.
- One file per call.
- No artifact-reading tool; local paths are returned.
- No asynchronous queue or cancellation.
- No MCP resources or prompts.
- No HTTP transport or authentication layer.
- No built-in model or visual recovery.

## 中文

### 用途与传输

MCP 服务让 AI 客户端调用已保存的确定性用例。它不是自主视觉 Agent，也不会让模型控制每一次点击。

- 传输：STDIO。
- 入口：`dist/mcp.js`。
- 当前工具数：一个。

```bash
npm ci
npm run build
node <ABSOLUTE_PATH_TO_AGENT>/dist/mcp.js --workspace <ABSOLUTE_PATH_TO_PRIVATE_TEST_WORKSPACE>
```

### 工作区边界

`--workspace` 是 MCP 路径边界。未提供时读取 `ELECTRON_UI_AGENT_WORKSPACE`，否则使用进程当前目录。

推荐优先级：

1. 显式绝对路径 `--workspace`。
2. 托管环境使用 `ELECTRON_UI_AGENT_WORKSPACE`。
3. 只有本地试验才使用当前目录。

`casePath` 和 `outputDir` 必须解析到工作区内。使用 `..` 或外部绝对路径逃逸会被拒绝。

路径限制不代表不可信用例安全。用例可以选择可执行文件，因此执行用例属于可信本地代码执行。

### 工具契约：`run_case`

输入：

```json
{
  "casePath": "cases/smoke.yaml",
  "outputDir": ".eui-agent-runs"
}
```

| 字段 | 必填 | 说明 |
|---|---:|---|
| `casePath` | 是 | 相对工作区的 YAML、YML、JSON 或 Markdown 用例。不能传目录。 |
| `outputDir` | 否 | 相对工作区的证据根目录。默认：`.eui-agent-runs`。 |

成功响应文本：

```json
{
  "runId": "<run-id>",
  "status": "passed",
  "artifacts": ["<workspace>/.eui-agent-runs/<run-id>/trace.zip", "<workspace>/.eui-agent-runs/<run-id>/result.json"]
}
```

失败响应文本：

```json
{
  "runId": "<run-id>",
  "status": "failed",
  "failedStep": 2,
  "error": "locator.waitFor: Timeout exceeded",
  "artifacts": ["<workspace>/.eui-agent-runs/<run-id>/003-failure.png", "<workspace>/.eui-agent-runs/<run-id>/trace.zip", "<workspace>/.eui-agent-runs/<run-id>/result.json"]
}
```

`failedStep` 从零开始。失败执行会设置 MCP 错误标记，但客户端仍应解析文本和证据路径。

### 低Token客户端行为

1. 只调用一次 `run_case`。
2. 只读取 `status`、`failedStep`、`error` 和证据路径。
3. 通过后停止。
4. 失败先看 `result.json`。
5. 需要视觉上下文时才加载截图。
6. 深度诊断时才加载 Trace。

禁止默认把完整 Trace、截图或全部日志放入模型上下文。保存后的用例执行不消耗模型 Token，只有精简 MCP 交互占用客户端上下文。

### 通用STDIO配置

许多客户端使用类似结构：

```json
{
  "mcpServers": {
    "electron-ui-agent": {
      "command": "node",
      "args": [
        "<ABSOLUTE_PATH_TO_AGENT>/dist/mcp.js",
        "--workspace",
        "<ABSOLUTE_PATH_TO_PRIVATE_TEST_WORKSPACE>"
      ]
    }
  }
}
```

必须使用绝对路径。Windows JSON 中反斜杠需要转义；客户端支持时可使用正斜杠。配置位置和重启方式应查看客户端当前官方文档。

### Codex

OpenAI 官方文档说明，本地 Codex 客户端支持 STDIO MCP 并共享 `~/.codex/config.toml`；可信项目可使用 `.codex/config.toml`。

CLI 注册：

```bash
codex mcp add electron-ui-agent -- node <ABSOLUTE_PATH_TO_AGENT>/dist/mcp.js --workspace <ABSOLUTE_PATH_TO_PRIVATE_TEST_WORKSPACE>
codex mcp list
```

等价 TOML：

```toml
[mcp_servers.electron_ui_agent]
command = "node"
args = [
  "<ABSOLUTE_PATH_TO_AGENT>/dist/mcp.js",
  "--workspace",
  "<ABSOLUTE_PATH_TO_PRIVATE_TEST_WORKSPACE>"
]
startup_timeout_sec = 10
tool_timeout_sec = 120
required = false
default_tools_approval_mode = "prompt"
```

重启客户端或扩展，然后通过 MCP 页面或 `/mcp` 验证服务。

官方参考：[OpenAI Codex MCP文档](https://developers.openai.com/codex/mcp/)。

### 其他客户端

使用 `mcpServers` JSON 的客户端可以调整通用配置。产品界面和配置位置会变化，应查看当前官方指南，不要复制旧教程。

协议参考：[Model Context Protocol](https://modelcontextprotocol.io/)。

### 提示词示例

```text
使用 electron-ui-agent 执行 cases/smoke.yaml。只返回状态、失败步骤、错误和证据路径。除非执行失败且摘要不足，否则不要加载截图或 Trace。
```

```text
执行 cases/smoke.yaml。失败时先检查 result.json，必要时只加载失败截图。最多重试一次，不要修改应用。
```

### 排查清单

1. `npm run build` 后确认 `dist/mcp.js` 存在。
2. 运行 `npm run test:mcp`。
3. 使用绝对路径。
4. 手工启动配置命令，进程应保持运行且不向 stdout 写协议外文本。
5. 确认工作区存在。
6. 确认 `casePath` 相对该工作区。
7. 合法执行超过客户端默认时间时，提高工具超时。
8. MCP 日志含本地路径时必须保密。

### 当前限制

- 只有 `run_case`。
- 每次调用一个文件。
- 没有证据读取工具，只返回本地路径。
- 没有异步队列或取消。
- 没有 MCP Resource 或 Prompt。
- 没有 HTTP 传输或认证层。
- 没有内置模型或视觉恢复。
