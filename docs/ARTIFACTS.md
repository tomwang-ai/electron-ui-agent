# Artifacts and Results / 证据与结果

[English](#english) | [中文](#中文)

## English

### Directory layout

Each case receives a random UUID `runId` and its own directory under the selected output root:

```text
<output-root>/<run-id>/
├── <step>-<name>.png     explicit screenshots
├── <step>-failure.png    best-effort failure screenshot
├── console.log           only when renderer messages exist
├── trace.zip             only when tracing started successfully
└── result.json           structured run result
```

The CLI default output root is `artifacts`. The MCP default is `.eui-agent-runs` inside its configured workspace.

### `result.json`

```json
{
  "runId": "<run-id>",
  "caseName": "generic form submission",
  "status": "passed",
  "startedAt": "<ISO-8601 timestamp>",
  "durationMs": 1240,
  "steps": [
    {
      "index": 0,
      "action": "fill",
      "status": "passed",
      "durationMs": 41
    }
  ],
  "artifacts": [
    "<output-root>/<run-id>/trace.zip",
    "<output-root>/<run-id>/result.json"
  ]
}
```

Top-level fields:

| Field | Meaning |
|---|---|
| `runId` | Random UUID for this case execution. |
| `caseName` | Case `name`. |
| `status` | `passed` when no error was recorded; otherwise `failed`. |
| `startedAt` | UTC ISO-8601 start timestamp. |
| `durationMs` | Total wall-clock duration after output-directory creation. |
| `steps` | Results for attempted steps only. |
| `artifacts` | Absolute or resolved artifact paths known to the runner. |
| `error` | Present on failure; exact wording is not a stable API in `0.1.0`. |

Step fields:

| Field | Meaning |
|---|---|
| `index` | Zero-based index from the source `steps` list. |
| `action` | Action name. |
| `status` | `passed` or `failed`. |
| `durationMs` | Step wall-clock duration. |
| `error` | Present for the failed step. |

### Screenshots

Explicit screenshot filenames use a one-based, three-digit step number, such as `004-completed.png`. Failure screenshots use the failed step number, such as `003-failure.png` for zero-based index `2`.

Failure screenshots are best-effort. They may be missing when Electron fails to launch, the first window never appears, the page closes, or screenshot capture itself fails.

### Trace

Tracing starts after the first Electron window appears. The runner requests screenshots and snapshots. It stops tracing during cleanup and writes `trace.zip` when successful.

View a trace with a compatible Playwright installation:

```bash
npx playwright show-trace <PATH_TO_TRACE_ZIP>
```

Treat traces as sensitive: they can contain UI text, screenshots and DOM state from the tested application.

### Console log

The runner listens to the first page's renderer console after the first window is obtained. Entries are rendered as:

```text
[log] message
[warning] message
[error] message
```

`console.log` is omitted when no messages were collected. Early messages emitted before listener attachment can be absent.

### Retention and cleanup

The runner does not automatically delete artifacts. The caller owns retention. In private environments, define retention based on sensitivity and diagnostic value.

Never commit real artifacts to this public repository. Both `artifacts/` and `.eui-agent-runs/` are ignored here, but downstream repositories must configure their own ignore and CI retention policies.

### Low-token inspection order

1. Compact CLI or MCP summary.
2. `result.json`.
3. Failure screenshot.
4. `console.log`.
5. `trace.zip`.

This order avoids loading large evidence unless necessary.

## 中文

### 目录结构

每个用例获得随机 UUID `runId`，在输出根目录下拥有独立目录：

```text
<output-root>/<run-id>/
├── <step>-<name>.png     显式截图
├── <step>-failure.png    尽力生成的失败截图
├── console.log           仅存在渲染进程消息时生成
├── trace.zip             仅成功启动Trace时生成
└── result.json           结构化结果
```

CLI 默认输出根目录为 `artifacts`；MCP 默认为其配置工作区内的 `.eui-agent-runs`。

### `result.json`

字段含义：

| 字段 | 含义 |
|---|---|
| `runId` | 本次用例执行的随机 UUID。 |
| `caseName` | 用例 `name`。 |
| `status` | 未记录错误时为 `passed`，否则为 `failed`。 |
| `startedAt` | UTC ISO-8601 开始时间。 |
| `durationMs` | 创建输出目录后的总墙钟时间。 |
| `steps` | 只包含实际尝试过的步骤。 |
| `artifacts` | 执行器已知的绝对或解析后证据路径。 |
| `error` | 失败时存在；`0.1.0` 不保证错误文字稳定。 |

步骤字段：

| 字段 | 含义 |
|---|---|
| `index` | 源 `steps` 列表中的零基索引。 |
| `action` | 动作名称。 |
| `status` | `passed` 或 `failed`。 |
| `durationMs` | 步骤墙钟耗时。 |
| `error` | 失败步骤包含。 |

### 截图

显式截图使用从1开始的三位步骤号，例如 `004-completed.png`。失败截图使用失败步骤号；零基索引 `2` 对应 `003-failure.png`。

失败截图是尽力生成的。Electron 启动失败、首个窗口未出现、页面关闭或截图本身失败时可能不存在。

### Trace

首个 Electron 窗口出现后开始 Trace，并请求截图和快照；清理阶段停止并尽量写入 `trace.zip`。

查看 Trace：

```bash
npx playwright show-trace <PATH_TO_TRACE_ZIP>
```

Trace 可能包含被测应用的 UI 文字、截图和 DOM 状态，必须按敏感数据处理。

### 控制台日志

获得首个页面后，执行器监听其渲染进程控制台。没有消息时不生成 `console.log`；监听器连接前的早期消息可能缺失。

### 保留与清理

执行器不会自动删除证据，保留策略由调用方负责。私有环境应按敏感程度和诊断价值设置保留期。

禁止把真实证据提交到本公开仓库。本仓库忽略 `artifacts/` 和 `.eui-agent-runs/`，下游仓库仍必须设置自己的忽略和 CI 保留策略。

### 低Token查看顺序

1. CLI或MCP精简摘要。
2. `result.json`。
3. 失败截图。
4. `console.log`。
5. `trace.zip`。

只有确有必要才加载大体积证据。
