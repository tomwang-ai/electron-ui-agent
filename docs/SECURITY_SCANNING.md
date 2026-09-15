# Local Security Scanning / 本地安全扫描

[English](#english) | [中文](#中文)

## English

### Scope

The optional security entry point orchestrates **operator-supplied local adapters**. It does not bundle scanners, copy a private workflow into the public package, install tools, scan through a cloud service, or add shell actions to UI cases. Existing Python and PowerShell workflows can integrate using the fixed contract below. Configuring a script authorizes local code execution: review the script and its dependencies first.

| Mode | Target | Adapter contract | Required state |
|---|---|---|---|
| `repository` | Source directory | Python `SCRIPT --repo TARGET --output OUTPUT` → `summary.json` | Stable source snapshot |
| `package` | Installer/archive file | Python `SCRIPT --package TARGET --output OUTPUT` → `summary.json` | Windows; adapter must inspect, never install or launch the package |
| `installed-static` | Installation directory | PowerShell `-NoProfile -NonInteractive -File SCRIPT -Target TARGET -Output OUTPUT` → `baseline-summary.json` | Windows; adapter must verify all application processes are closed and refuse otherwise |
| `installed-dynamic` | Exact executable file | PowerShell `-NoProfile -NonInteractive -File SCRIPT -Exe TARGET -Output OUTPUT -DurationSeconds N` → `runtime-summary.json` | Windows; operator confirms a running, logged-in test session; adapter verifies the process exists |

No `AllowRunning`, remediation or arbitrary argument override is exposed. Source adapters should use redacted Gitleaks reports, local Semgrep scanning with telemetry disabled, and Trivy vulnerability scanning. Package adapters should hash, inspect signatures, run Defender without remediation, extract safely, inspect ASAR content and scan extracted content. Missing tools, rules, extraction or report parsing must produce incomplete coverage.

Static baseline helpers that only inventory files/signatures are supported as evidence collection, **not full static scans**. Runtime helpers that only collect process/network metadata are also evidence collection, **not penetration tests**. An adapter must not claim full coverage for such a helper. The bridge does not add missing ASAR analysis, malware coverage, runtime assertions or vulnerability review on its behalf.

### Local configuration

Create `security.local.json` in the private workspace (ignored in this repository). Replace placeholders with explicit executable/script paths; relative paths resolve from this config file. Runtimes are not looked up through `PATH`. Adapter dependencies may use the operator's existing `PATH`.

```json
{
  "python": "<PYTHON_EXECUTABLE>",
  "powershell": "<POWERSHELL_EXECUTABLE>",
  "timeoutMs": 900000,
  "adapters": {
    "repository": "<SOURCE_SCAN_SCRIPT>",
    "package": "<PACKAGE_SCAN_SCRIPT>",
    "installed-static": "<STATIC_SCAN_SCRIPT>",
    "installed-dynamic": "<RUNTIME_COLLECTION_SCRIPT>"
  }
}
```

Only configure modes you use. A missing adapter/runtime produces `INCONCLUSIVE`. Config is loaded once at startup; MCP callers cannot supply a config, script, executable, environment or command. Runtimes receive a limited OS/path/temp environment, not arbitrary parent credentials. Configure tool-specific non-secret paths/rules inside the trusted adapter or its private configuration. Do not depend on inherited API keys.

The workspace must contain the targets and output. Keep source/installation files and reports in separate sibling directories. Outputs inside the target or in an ancestor of the target are rejected. Symlinks/junctions resolving outside the workspace are rejected. Do not widen the workspace to a whole drive for convenience; choose a dedicated private test workspace. Tools/scripts themselves may live outside it because they are trusted startup configuration.

### CLI

From the source checkout, after `npm ci` and `npm run build`:

```bash
node dist/security-cli.js repository source --config <PRIVATE_CONFIG> --workspace <PRIVATE_WORKSPACE>
node dist/security-cli.js package packages/demo.exe --config <PRIVATE_CONFIG> --workspace <PRIVATE_WORKSPACE>
node dist/security-cli.js installed-static client --config <PRIVATE_CONFIG> --workspace <PRIVATE_WORKSPACE>
node dist/security-cli.js installed-dynamic client/demo.exe --config <PRIVATE_CONFIG> --workspace <PRIVATE_WORKSPACE> --login-confirmed --duration 60
```

The installed binary is `electron-ui-agent-security`. `--output` defaults to `.eui-agent-runs/security`; target and output resolve within `--workspace` (default: current directory). Dynamic duration is 5–3600 seconds, default 60. Timeout is 1000–14400000 ms, default 900000, and must exceed dynamic duration by at least 30 seconds. A timeout terminates the adapter process tree and records incomplete coverage. No application is launched, logged into or closed by the bridge.

For combined testing: close the client → run static → review static coverage/findings → open and log into the approved test environment → confirm login → run dynamic. Never run static and dynamic concurrently for the same installation. Each MCP process permits one security call at a time; separate processes and UI calls require caller coordination. `run_case` still owns and closes its own app and records normal UI evidence; it is not a persistent login session for this bridge.

### MCP

```bash
node dist/mcp.js --workspace <PRIVATE_WORKSPACE> --security-config <PRIVATE_CONFIG>
```

This adds `run_security_scan` alongside `run_case`. Without the startup option only `run_case` is registered. Example input:

```json
{"mode":"installed-dynamic","target":"client/demo.exe","loginConfirmed":true,"durationSeconds":60}
```

`loginConfirmed` is an explicit operator attestation, not automatic proof of a logged-in UI. An AI client must obtain that confirmation before setting it. Optional `outputDir` has the same default as CLI. Use an MCP client timeout longer than the configured scan timeout. There is no background queue or cancellation API.

### Reports and exit codes

Adapters receive a fresh, nonexistent output directory and must create it without overwriting evidence. JSON may include a UTF-8 BOM. Summary size is limited to 4 MiB and 100 checks. Supply `conclusion` and `scanners` or `checks` maps; each check has `status` (`passed`, `findings`, `error`), optional nonnegative `findings` and optional integer `returncode`. Unknown extra fields stay in local evidence, not the compact response.

```json
{"conclusion":"PASS","scanners":{"gitleaks":{"status":"passed","findings":0,"returncode":0},"semgrep":{"status":"passed","findings":0,"returncode":0},"trivy":{"status":"passed","findings":0,"returncode":0}}}
```

Source reports require all three scanner entries. Package reports require `signature`, `defender`, `extraction`, `asar` and `content` checks. An adapter must validate underlying tool coverage, not merely forward a successful exit. These presence checks do not independently prove scan completeness or authenticity.

| Conclusion | CLI exit | Meaning |
|---|---:|---|
| `PASS` | 0 | Configured adapter scope completed with consistent checks and no gate findings; not a guarantee the application is secure. |
| `BLOCKED` | 1 | Gate findings require review; not automatically confirmed defects. |
| `INCONCLUSIVE` | 2 | Missing/invalid report, tool failure, unsupported OS, timeout, inconsistent status or incomplete coverage. Known findings remain visible. |

`BASELINE_READY` and `EVIDENCE_COLLECTED` always normalize to `INCONCLUSIVE`. Baseline unsigned/invalid signature counts remain visible. Incomplete coverage takes precedence over findings. Invalid requests fail before scanning with exit 2 and may have no run directory. Non-PASS MCP results set `isError`.

Each UUID directory contains `result.json`, a generic `report.md`, and adapter-created `evidence/` when available. The response includes only normalized check names/counts/statuses, a fixed reason code and artifact paths. Adapter stdout/stderr are discarded, not sent to the model. Raw adapter files can still contain sensitive data: adapters must redact before writing; keep files private and inspect before sharing. Paths may identify the local workspace. The bridge does not automatically sanitize arbitrary third-party reports, screenshots or memory dumps.

### Safety and validation

Adapters run with the current account's permissions and are not sandboxed. They must operate locally, avoid uploading inputs/reports, disable telemetry and cloud sample submission, never delete/quarantine/remediate, and never persist sensitive UI content. The bridge itself does not enforce network isolation or validate adapter source semantics. Offline rules/database caches are the operator's responsibility. Use only trusted packages and extractors in an isolated test environment.

The public tests use synthetic subprocess adapters to verify dispatch, result normalization, timeout cleanup and boundaries. They do not certify a third-party scanner or private workflow. Run positive/negative synthetic fixtures with your actual tools before relying on their results. Private report templates, product login selectors and business configuration remain downstream.

## 中文

### 范围

可选安全入口负责调度**操作者本地提供的可信适配脚本**。不内置或下载扫描器，不复制私有流程，不提供云扫描，也不在 UI 用例中增加 Shell 动作。配置脚本意味着授权本地代码执行，使用前必须审核脚本及依赖。

| 模式 | 目标 | 固定调用协议 | 前置状态 |
|---|---|---|---|
| `repository` | 源码目录 | Python `SCRIPT --repo TARGET --output OUTPUT` → `summary.json` | 稳定源码快照 |
| `package` | 安装包或压缩包 | Python `SCRIPT --package TARGET --output OUTPUT` → `summary.json` | Windows；只能检查，不安装或启动目标 |
| `installed-static` | 安装目录 | PowerShell `-NoProfile -NonInteractive -File SCRIPT -Target TARGET -Output OUTPUT` → `baseline-summary.json` | Windows；适配器必须核验客户端进程已关闭，否则拒绝 |
| `installed-dynamic` | 精确可执行文件 | PowerShell `-NoProfile -NonInteractive -File SCRIPT -Exe TARGET -Output OUTPUT -DurationSeconds N` → `runtime-summary.json` | Windows；操作者确认已登录测试环境，适配器核验进程存在 |

不提供 `AllowRunning`、自动修复或任意参数覆盖。源码适配器应使用脱敏 Gitleaks 报告、禁用遥测的本地 Semgrep 和 Trivy；安装包适配器应执行哈希、签名、禁用修复的 Defender、安全解包、ASAR 与内容扫描。缺工具、规则、解包或解析失败必须报告覆盖不足。

只采集文件和签名的静态脚本仍然只是基线；只采集进程和网络元数据的动态脚本也不等于渗透测试。桥接层不会自动补上 ASAR、恶意软件覆盖、运行态断言或漏洞复核，适配器不得把这些缺口声明为已覆盖。

### 本地配置

在私有工作区创建 `security.local.json`（本仓库已忽略）。用明确的运行时和脚本路径替换占位符；相对路径基于配置文件目录解析。运行时不通过 `PATH` 查找，适配器依赖可使用操作者已有 `PATH`。

```json
{
  "python": "<PYTHON_EXECUTABLE>",
  "powershell": "<POWERSHELL_EXECUTABLE>",
  "timeoutMs": 900000,
  "adapters": {
    "repository": "<SOURCE_SCAN_SCRIPT>",
    "package": "<PACKAGE_SCAN_SCRIPT>",
    "installed-static": "<STATIC_SCAN_SCRIPT>",
    "installed-dynamic": "<RUNTIME_COLLECTION_SCRIPT>"
  }
}
```

只配置需要的模式；缺脚本或运行时返回 `INCONCLUSIVE`。配置只在启动时加载，MCP 调用方不能传配置、脚本、运行时、环境或命令。运行时仅继承有限的系统、路径和临时目录环境，不继承任意凭据；扫描器的非敏感路径和规则在可信适配器或其私有配置中设置。

目标和输出都必须位于工作区内，并采用互不包含的同级目录。拒绝输出位于目标内部或目标祖先目录，拒绝符号链接或 junction 逃出工作区。使用专用私有测试工作区，不要为方便把整块磁盘设为工作区。启动配置指定的可信工具和脚本可以在工作区之外。

### CLI

执行 `npm ci` 和 `npm run build` 后：

```bash
node dist/security-cli.js repository source --config <PRIVATE_CONFIG> --workspace <PRIVATE_WORKSPACE>
node dist/security-cli.js package packages/demo.exe --config <PRIVATE_CONFIG> --workspace <PRIVATE_WORKSPACE>
node dist/security-cli.js installed-static client --config <PRIVATE_CONFIG> --workspace <PRIVATE_WORKSPACE>
node dist/security-cli.js installed-dynamic client/demo.exe --config <PRIVATE_CONFIG> --workspace <PRIVATE_WORKSPACE> --login-confirmed --duration 60
```

安装后命令为 `electron-ui-agent-security`。`--output` 默认 `.eui-agent-runs/security`，目标和输出基于 `--workspace` 解析；工作区默认当前目录。动态时长 5–3600 秒，默认 60 秒；适配器超时 1000–14400000 毫秒，默认 900000，必须比动态时长至少多 30 秒。超时终止适配器进程树并报告覆盖不足。桥接层不会启动、登录或关闭客户端。

组合执行顺序：关闭客户端 → 静态扫描 → 检查覆盖和发现 → 打开客户端并登录批准的测试环境 → 确认登录 → 动态采集。相同安装目录不得静态和动态并发；每个 MCP 进程只允许一个安全调用，跨进程和 UI 调用仍需调用方协调。`run_case` 仍会关闭自己启动的应用并保存通常的 UI 证据，不能作为本入口的持续登录会话。

### MCP

```bash
node dist/mcp.js --workspace <PRIVATE_WORKSPACE> --security-config <PRIVATE_CONFIG>
```

启用后在 `run_case` 之外增加 `run_security_scan`；不传启动参数则仍只注册 `run_case`。调用示例：

```json
{"mode":"installed-dynamic","target":"client/demo.exe","loginConfirmed":true,"durationSeconds":60}
```

`loginConfirmed` 是操作者明确确认，不代表自动识别登录界面。AI 客户端必须先取得确认才能设为真。可选 `outputDir` 与 CLI 默认一致；MCP 客户端超时应长于扫描超时，没有后台队列或取消 API。

### 报告与退出码

适配器接收新的、尚不存在的输出目录，必须自行创建且不得覆盖历史证据。JSON 可含 UTF-8 BOM；摘要最大 4 MiB、100 个检查项。提供 `conclusion` 与 `scanners` 或 `checks` 字典，每项包括 `status`（`passed`、`findings`、`error`）、可选非负 `findings` 和整数 `returncode`；额外字段仅留在本地证据。

```json
{"conclusion":"PASS","scanners":{"gitleaks":{"status":"passed","findings":0,"returncode":0},"semgrep":{"status":"passed","findings":0,"returncode":0},"trivy":{"status":"passed","findings":0,"returncode":0}}}
```

源码报告必须包含三种扫描器；安装包报告必须包含 `signature`、`defender`、`extraction`、`asar`、`content`。适配器必须验证底层覆盖，不能仅转发成功退出码。这些字段存在性检查不能独立证明扫描完整性或真实性。

- `PASS` / 退出 0：配置范围内检查一致且无门禁命中，不代表应用绝对安全。
- `BLOCKED` / 退出 1：存在待复核门禁命中，不自动等同于确认缺陷。
- `INCONCLUSIVE` / 退出 2：缺失或无效报告、工具错误、不支持的平台、超时、状态矛盾或覆盖不足；已知发现仍保留。

`BASELINE_READY`、`EVIDENCE_COLLECTED` 始终转换为 `INCONCLUSIVE`，静态基线中的无效或缺失签名数量保留。覆盖不足优先于命中；非法请求在扫描前以退出 2 拒绝，可能不生成执行目录。非 PASS 的 MCP 结果设置 `isError`。

每个 UUID 目录生成 `result.json`、通用 `report.md`，适配器运行时可生成 `evidence/`。响应只含归一化检查名称、数量、状态、固定原因码和证据路径。适配器标准输出和错误输出直接丢弃，不传入模型。原始适配器文件仍可能敏感：适配器写入前必须脱敏，文件保存在本地，共享前复核；桥接层不能自动脱敏任意第三方报告、截图和内存转储。路径本身也可能标识本地工作区。

### 安全与验证

适配器继承当前账号权限，不是沙箱。必须本地运行、禁止上传输入或报告、禁用遥测与云样本提交、禁止删除隔离修复、不保存敏感 UI 内容。桥接层不强制网络隔离，也不验证脚本源码语义；离线规则和漏洞库由操作者准备，只在隔离测试环境使用可信包和解包器。

公开测试通过虚构子进程适配器验证调度、结果归一化、超时回收和边界，不认证外部扫描器及私有流程。实际使用前需对真实工具执行虚构阳性与阴性样例。私有报告模板、产品登录选择器和业务配置仍留在下游。
