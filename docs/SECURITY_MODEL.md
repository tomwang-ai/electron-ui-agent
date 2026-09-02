# Security Model / 安全模型

[English](#english) | [中文](#中文)

## English

### Security objective

Provide deterministic local Electron UI execution while minimizing exposed filesystem scope, arbitrary-code surfaces, data disclosure and model-context expansion.

### Protected assets

- Local source code and files outside the configured private test workspace.
- Application credentials supplied through environment variables.
- UI text, screenshots, DOM snapshots, traces and console logs.
- Integrity of the host running the tested application.
- Integrity of public repository history and release packages.

### Trust boundaries

```text
AI client or human
       |
  CLI / MCP input                 untrusted until validated
       |
case loader and path boundary
       |
Electron executable               explicitly trusted by operator
       |
tested UI and local artifacts     potentially sensitive
```

### Assumptions

- The operator trusts the application executable and main-process entry.
- The private test workspace is controlled by the operator.
- The local Node.js and npm installation are trusted.
- AI clients can read the compact MCP response; artifact access depends on their filesystem permissions.
- The runner is not an application sandbox.

### Implemented controls

| Risk | Control |
|---|---|
| Case format executes arbitrary script | Closed action union; no `evaluate` action. |
| MCP reads or writes arbitrary paths | `casePath` and `outputDir` confined to configured workspace. |
| Secret hardcoding | `${ENV:NAME}` expansion and documentation requirements. |
| Large model context | Compact MCP result; artifacts remain local. |
| Public repository data leakage | Hygiene scanner, ignore rules, PR checklist and human review. |
| Partial failure without evidence | Best-effort failure screenshot, trace, console and structured result. |
| Hanging actions | Separate launch and action timeouts. |
| Uncontrolled network upload | No telemetry or upload implementation. |

### Inherent and residual risks

#### Executable launch

`app.executablePath` runs a local executable. A malicious case can select malicious software. Workspace confinement does not prevent this because the executable path is part of the case. Only execute trusted cases and applications.

#### Electron application privileges

The tested application can have Node.js, filesystem, network or native privileges. The runner cannot remove those privileges.

#### Evidence sensitivity

Traces and screenshots can contain credentials, personal data or proprietary UI. Artifact paths in MCP responses can also reveal local directory structure. Store all real evidence privately and apply retention controls.

#### Environment inheritance

The Electron process inherits the runner environment, then applies `app.env` overrides. It may receive environment variables unrelated to the test. Run sensitive workloads in a minimal dedicated environment when necessary.

#### Denial of service

Fixed timeouts limit individual waits, but a tested application can still consume CPU, memory, disk or network resources. The runner does not provide operating-system resource isolation.

#### Supply chain

Dependencies and Electron binaries are external code. Use the committed lockfile, review updates, run `npm audit`, and protect release credentials.

### MCP deployment recommendations

- Prefer local STDIO over a network-exposed wrapper.
- Configure the narrowest private workspace.
- Keep tool approval in prompt mode for interactive AI clients.
- Do not expose the MCP process to untrusted remote users.
- Do not add shell or JavaScript evaluation as a convenience tool.
- Give the MCP process only filesystem permissions it needs.

### Secret handling

- Store secrets in environment variables or a private secret manager.
- Never put secrets in YAML, JSON, Markdown, screenshots, traces, logs, Issues or Pull Requests.
- Use synthetic values in public examples.
- Rotate a secret immediately if it enters public Git history; removing the visible line is not enough.

### Vulnerability reporting

Use the repository's private security advisory channel when a report could expose sensitive material. Public reports must use a synthetic reproduction.

### Out of scope

- Sandboxing a malicious Electron application.
- Protecting a host already compromised before launch.
- Authenticating a future HTTP MCP transport.
- Automatically redacting arbitrary application content from traces.
- Guaranteeing that third-party AI clients handle artifact paths securely.

## 中文

### 安全目标

提供确定性本地Electron UI执行，同时尽量缩小文件系统范围、任意代码面、数据泄露和模型上下文膨胀。

### 保护资产

- 配置私有测试工作区之外的本地源码和文件。
- 通过环境变量提供的应用凭据。
- UI文字、截图、DOM快照、Trace和控制台日志。
- 运行被测应用的主机完整性。
- 公开仓库历史和发布包完整性。

### 信任边界

```text
AI客户端或人工
       |
  CLI / MCP输入                 校验前不可信
       |
 用例解析和路径边界
       |
 Electron可执行文件             由操作者明确可信
       |
 被测UI和本地证据               可能敏感
```

### 假设

- 操作者信任应用可执行文件和主进程入口。
- 私有测试工作区由操作者控制。
- 本地Node.js和npm可信。
- AI客户端可以读取精简MCP响应，能否读证据取决于其文件权限。
- 执行器不是应用沙箱。

### 已实现控制

| 风险 | 控制 |
|---|---|
| 用例执行任意脚本 | 封闭动作联合，不提供`evaluate`。 |
| MCP任意读写路径 | `casePath`和`outputDir`限制在配置工作区。 |
| 密钥硬编码 | `${ENV:NAME}`展开和文档规范。 |
| 模型上下文过大 | MCP精简结果，证据留在本地。 |
| 公开仓库泄露 | 卫生扫描、忽略规则、PR清单和人工审核。 |
| 失败无证据 | 尽力生成失败截图、Trace、控制台和结构化结果。 |
| 动作卡死 | 启动和动作使用独立超时。 |
| 非受控上传 | 不实现遥测或上传。 |

### 固有和剩余风险

- `app.executablePath`会运行本地程序；恶意用例可以选择恶意程序，路径边界无法消除该风险。
- 被测Electron应用可能拥有Node.js、文件、网络或原生权限，执行器不能移除这些权限。
- Trace和截图可能包含凭据、个人数据或专有UI，MCP证据路径也可能暴露本地目录结构。
- Electron进程继承执行器环境，可能获得测试无关变量；敏感任务应使用最小专用环境。
- 超时不能限制CPU、内存、磁盘或网络资源，执行器不提供操作系统资源隔离。
- 依赖和Electron二进制属于外部代码，应使用锁文件、审核升级、运行`npm audit`并保护发布凭据。

### MCP部署建议

- 优先本地STDIO，不包装为网络服务。
- 配置尽可能窄的私有工作区。
- 交互式AI客户端保持工具审批提示。
- 不向不可信远程用户暴露MCP进程。
- 不为方便增加Shell或JavaScript执行工具。
- 只授予MCP进程所需文件权限。

### 密钥处理

- 密钥保存在环境变量或私有密钥管理器。
- 禁止写入YAML、JSON、Markdown、截图、Trace、日志、Issue或PR。
- 公开示例使用虚构值。
- 密钥进入公开Git历史后必须立即轮换，仅删除可见行不够。

### 漏洞报告

报告可能暴露敏感材料时，使用仓库私有安全公告渠道。公开报告只能使用虚构复现。

### 非目标

- 沙箱隔离恶意Electron应用。
- 保护启动前已经失陷的主机。
- 为未来HTTP MCP传输提供认证。
- 自动脱敏Trace中的任意应用内容。
- 保证第三方AI客户端安全处理证据路径。
