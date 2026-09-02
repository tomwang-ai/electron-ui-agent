# Getting Started / 快速入门

[English](#english) | [中文](#中文)

## English

This guide takes you from a clean checkout to a verified Electron UI run. The included demo is synthetic and contains no real product or personal information.

### Prerequisites

- Git.
- Node.js 20 or newer for runtime.
- Node.js 24 recommended for repository development because CI uses Node.js 24.
- npm compatible with the selected Node.js release.
- A desktop environment capable of running Electron.

The repository is verified locally on Windows with Node.js 24. CI builds and unit-tests on Windows and Ubuntu; the real Electron E2E job currently runs on Windows only. See [Compatibility](COMPATIBILITY.md).

### Clone and install

```bash
git clone <REPOSITORY_URL>
cd electron-ui-agent
npm ci
```

Use `npm ci` for a checkout so installation follows `package-lock.json`. The package is not yet published to the npm registry; do not assume `npm install electron-ui-agent` is available.

### Run the complete self-check

```bash
npm run check
```

It runs:

1. Repository-hygiene scanning.
2. TypeScript compilation and unit tests.
3. MCP discovery smoke testing.
4. A real Electron success case and an intentional failure-evidence case.

Successful E2E output resembles:

```json
{"passedRun":"passed","failedRun":"failed","successSteps":5}
```

The intentional failed run is expected and proves that failure evidence is generated.

### Build the entry points

```bash
npm run build
```

```text
dist/cli.js   CLI runner
dist/mcp.js   STDIO MCP server
```

`dist/` is generated and not committed.

### Run the included case

The demo reads:

- `ELECTRON_EXECUTABLE`: absolute path to an Electron executable.
- `DEMO_APP_ENTRY`: absolute path to `examples/demo-app/main.cjs`.

PowerShell:

```powershell
$env:ELECTRON_EXECUTABLE = Join-Path (Resolve-Path node_modules/electron/dist) (Get-Content node_modules/electron/path.txt)
$env:DEMO_APP_ENTRY = (Resolve-Path examples/demo-app/main.cjs)
node dist/cli.js examples/demo-case.md --output artifacts/cli
```

Bash, when an Electron executable is already available:

```bash
export ELECTRON_EXECUTABLE="<ABSOLUTE_PATH_TO_ELECTRON>"
export DEMO_APP_ENTRY="$(pwd)/examples/demo-app/main.cjs"
node dist/cli.js examples/demo-case.md --output artifacts/cli
```

The CLI prints one compact JSON line. Large evidence remains on disk.

### Inspect the result

```text
artifacts/cli/<run-id>/
├── 004-completed.png
├── console.log          only when console messages exist
├── result.json
└── trace.zip
```

Read `result.json` first. Load screenshots or the trace only when the summary is insufficient. See [Artifacts and Results](ARTIFACTS.md).

### Create a private test workspace

Never place real application cases in the public repository:

```text
private-electron-tests/
├── cases/
│   └── smoke.md
├── local-artifacts/       ignored by Git
└── README.md
```

Minimal private case:

```yaml
name: opens the application shell
app:
  executablePath: "${ENV:APP_EXECUTABLE}"
  timeoutMs: 30000
  actionTimeoutMs: 10000
steps:
  - action: assertVisible
    target: { role: heading, name: Example heading }
  - action: screenshot
    name: shell-ready
```

Run it from its private location:

```bash
node <ABSOLUTE_PATH_TO_AGENT>/dist/cli.js <PRIVATE_TEST_WORKSPACE>/cases/smoke.md --output <PRIVATE_TEST_WORKSPACE>/local-artifacts
```

### Connect an AI client

```bash
node <ABSOLUTE_PATH_TO_AGENT>/dist/mcp.js --workspace <ABSOLUTE_PATH_TO_PRIVATE_TEST_WORKSPACE>
```

The AI client can call `run_case`; MCP paths remain inside the configured workspace. See [MCP Integration](MCP.md).

### Recommended first production workflow

1. Write one deterministic smoke case by hand.
2. Stabilize it through the CLI.
3. Inspect `result.json` and `trace.zip` on failure.
4. Configure MCP only after CLI execution works.
5. Let the AI client invoke the saved case instead of controlling every click.

This keeps stable runs at zero model tokens and separates MCP problems from launch problems.

## 中文

本指南从全新检出开始，直到完成一次经过验证的 Electron UI 执行。仓库自带 Demo 完全使用虚构数据，不包含真实产品或个人信息。

### 前置条件

- Git。
- 运行要求 Node.js 20 或更高版本。
- 开发本仓库建议使用 Node.js 24，因为 CI 使用 Node.js 24。
- 与所选 Node.js 版本兼容的 npm。
- 可以运行 Electron 的桌面环境。

当前已在 Windows + Node.js 24 完成本地验证。CI 在 Windows 和 Ubuntu 上构建并运行单元测试；真实 Electron E2E 当前只在 Windows CI 执行。详见[兼容性](COMPATIBILITY.md)。

### 克隆和安装

```bash
git clone <REPOSITORY_URL>
cd electron-ui-agent
npm ci
```

检出仓库后使用 `npm ci`，确保安装严格遵循 `package-lock.json`。项目尚未发布到 npm 公共仓库，不要假定 `npm install electron-ui-agent` 已可用。

### 运行完整自检

```bash
npm run check
```

该命令依次执行：

1. 仓库卫生扫描。
2. TypeScript 编译和单元测试。
3. MCP 工具发现冒烟测试。
4. 真实 Electron 成功用例和一个故意失败的证据验证用例。

E2E 成功输出类似：

```json
{"passedRun":"passed","failedRun":"failed","successSteps":5}
```

其中失败执行是预期行为，用于证明失败证据能够生成。

### 构建入口

```bash
npm run build
```

```text
dist/cli.js   CLI执行器
dist/mcp.js   STDIO MCP服务
```

`dist/` 是生成目录，不提交到 Git。

### 执行自带用例

Demo 读取：

- `ELECTRON_EXECUTABLE`：Electron 可执行文件绝对路径。
- `DEMO_APP_ENTRY`：`examples/demo-app/main.cjs` 的绝对路径。

PowerShell：

```powershell
$env:ELECTRON_EXECUTABLE = Join-Path (Resolve-Path node_modules/electron/dist) (Get-Content node_modules/electron/path.txt)
$env:DEMO_APP_ENTRY = (Resolve-Path examples/demo-app/main.cjs)
node dist/cli.js examples/demo-case.md --output artifacts/cli
```

已有 Electron 可执行文件时的 Bash 示例：

```bash
export ELECTRON_EXECUTABLE="<ABSOLUTE_PATH_TO_ELECTRON>"
export DEMO_APP_ENTRY="$(pwd)/examples/demo-app/main.cjs"
node dist/cli.js examples/demo-case.md --output artifacts/cli
```

CLI 只打印一行精简 JSON，大体积证据保留在磁盘中。

### 查看执行结果

```text
artifacts/cli/<run-id>/
├── 004-completed.png
├── console.log          仅当存在控制台消息时生成
├── result.json
└── trace.zip
```

优先读取 `result.json`；摘要不足时才加载截图或 Trace。详见[证据与结果](ARTIFACTS.md)。

### 创建私有测试工作区

禁止把真实应用用例放入公开仓库：

```text
private-electron-tests/
├── cases/
│   └── smoke.md
├── local-artifacts/       由Git忽略
└── README.md
```

最小私有用例：

```yaml
name: opens the application shell
app:
  executablePath: "${ENV:APP_EXECUTABLE}"
  timeoutMs: 30000
  actionTimeoutMs: 10000
steps:
  - action: assertVisible
    target: { role: heading, name: Example heading }
  - action: screenshot
    name: shell-ready
```

从私有位置直接执行：

```bash
node <ABSOLUTE_PATH_TO_AGENT>/dist/cli.js <PRIVATE_TEST_WORKSPACE>/cases/smoke.md --output <PRIVATE_TEST_WORKSPACE>/local-artifacts
```

### 接入AI客户端

```bash
node <ABSOLUTE_PATH_TO_AGENT>/dist/mcp.js --workspace <ABSOLUTE_PATH_TO_PRIVATE_TEST_WORKSPACE>
```

AI 客户端可以调用 `run_case`，MCP 路径始终限制在配置工作区中。详见[MCP接入](MCP.md)。

### 推荐的首个生产工作流

1. 手工编写一个确定性冒烟用例。
2. 先通过 CLI 运行到稳定。
3. 失败时检查 `result.json` 和 `trace.zip`。
4. CLI 正常后再配置 MCP。
5. 让 AI 客户端调用保存后的用例，而不是逐步控制每次点击。

这样既能让稳定执行保持零模型 Token，也能把 MCP 问题和应用启动问题分开定位。
