# Changelog / 更新记录

Every commit adds an entry with changes, verification and compatibility impact. Preserve previous entries and keep all content generic.

每次提交新增一条记录，包含变更内容、验证情况和兼容性影响。保留历史记录，所有内容必须通用且不可识别。

## Unreleased — Deterministic UI regression recipes / 确定性 UI 回归配方

### English

- Added exact count assertions and deadline-bound polling for exact input values.
- Added three synthetic Electron workflows for query reset, category filtering, and editor/list consistency; each verifies its own injected fault.
- Added script-first UI testing guidance and a generic, bilingual knowledge index for bounded model assistance.
- Verification: `npm run check` passed, including hygiene, unit, MCP, Electron E2E, and synthetic deterministic workflow checks.
- Compatibility: existing case actions keep their behavior; `assertCount` is additive, and `assertValue` now waits up to the configured action timeout.

### 中文

- 新增精确数量断言，并为输入值精确断言增加受截止时间约束的轮询。
- 新增三个虚构 Electron 流程：查询重置、类别筛选和编辑器/列表一致性；每个流程都会验证对应的故障注入。
- 新增脚本优先的 UI 测试指引，以及支持受限模型协助的通用双语经验索引。
- 验证：`npm run check` 已通过，包含卫生扫描、单元测试、MCP、Electron 端到端和虚构确定性流程检查。
- 兼容性：既有用例动作保持原有行为；`assertCount` 为新增动作，`assertValue` 现在会在配置的动作超时内等待。

## Unreleased — Adapter output handles / 适配器输出句柄

### English

- Use drained pipes for adapter stdout/stderr so Windows console runtimes receive usable output handles. Output remains discarded and never enters reports or MCP responses.
- Verification: synthetic subprocess and Windows PowerShell adapter tests, full `npm run check`, and Windows/Linux CI.
- Compatibility: no configuration, CLI, report or timeout changes; no additional output retention.

### 中文

- 适配器标准输出和错误输出改为持续排空的管道，为 Windows 控制台运行时提供可用句柄；内容仍丢弃，不进入报告或 MCP 响应。
- 验证：虚构子进程及 Windows PowerShell 适配器测试、完整 `npm run check` 和 Windows/Linux CI。
- 兼容性：配置、CLI、报告及超时规则不变，不增加输出留存。

## Unreleased — Optional local security adapters / 可选本地安全扫描适配器

### English

- Added a separate security CLI and opt-in MCP tool for source, package, installed-static and installed-dynamic adapter workflows. Trusted adapters and scanner dependencies are supplied locally by the operator, not bundled or downloaded.
- Added workspace confinement, fixed adapter arguments, explicit login confirmation, process-tree timeouts, isolated evidence directories and compact JSON/Markdown assessments. Missing coverage and evidence-only reports remain `INCONCLUSIVE`; findings are retained for review.
- Added bilingual setup and adapter-contract documentation. Every commit must now include its own changelog update; the contribution guide and PR checklist include this requirement.
- Made public-only GitHub submissions an explicit commit/push requirement covering diffs, messages, changelog, PRs and packages; real business project information and partially redacted real artifacts are prohibited.
- Verification: synthetic unit, subprocess, CLI, MCP and Electron E2E checks through `npm run check`; dependency audit through `npm audit`. External scanner accuracy and private workflows require separate local validation.
- Compatibility: existing UI CLI and default MCP tools remain unchanged. Security tools require explicit startup configuration; Windows adapter modes require Windows. No new package dependencies.

### 中文

- 新增独立安全扫描 CLI 和按需启用的 MCP 工具，支持源码、安装包、安装目录静态与登录后动态四种适配工作流。可信适配脚本及扫描器依赖由操作者在本地提供，项目不打包或下载。
- 增加工作区边界、固定参数、登录确认、进程树超时终止、独立证据目录以及精简 JSON/Markdown 评估。覆盖不足或仅采集证据时保留 `INCONCLUSIVE`，已发现的问题保留待复核。
- 增加双语配置和适配协议说明；要求每次提交同步新增更新记录，并同步贡献说明与 PR 检查清单。
- 明确 GitHub 提交和推送只能包含公开通用内容，覆盖差异、提交说明、更新记录、PR 和发布包；禁止任何真实业务项目信息及部分脱敏的真实产物。
- 验证：通过 `npm run check` 执行虚构数据的单元、子进程、CLI、MCP 与 Electron E2E 检查；通过 `npm audit` 检查依赖。外部扫描器准确性与私有工作流需单独在本地验证。
- 兼容性：现有 UI CLI 和默认 MCP 工具不变；安全工具需要显式启动配置，Windows 适配模式仅支持 Windows；未新增包依赖。
