# Agent Guidance

## English

## Repository boundary

This repository is a generic open-source Electron UI test runner. Never add information from a real product, project, organization, person, environment, or test execution. Use synthetic names and data in every test, fixture, example, document, Issue, and Pull Request.

Business test projects may depend on this package. This package must never import, copy, package, or publish content from a business test project.

## Public-only commit requirement

Every GitHub submission must contain public, generic content only. No information from any real business project is allowed, even if considered harmless or partially redacted. This covers source, tests, fixtures, examples, configuration, documentation, changelog entries, commit messages, PRs, attachments and release packages. Never include real project names, business workflows, selectors, identifiers, internal paths/addresses, personnel, credentials, data or scan evidence. Create examples from scratch with synthetic content. Before every commit and push, review the exact staged diff and package contents and run the hygiene gate; automated checks do not replace human privacy review.

## Development

- Use Node.js 20 or newer.
- Install with `npm ci`.
- Run `npm run check` before proposing a change.
- Keep execution deterministic and model-independent.
- Do not add arbitrary JavaScript evaluation to the case format or MCP surface.
- Keep MCP responses compact; large screenshots, traces, and logs remain artifact files.
- Do not commit `artifacts/`, `.eui-agent-runs/`, environment files, or generated build output.
- Every commit must update `CHANGELOG.md` in the same commit with a new entry describing the change, verification and compatibility impact. Include documentation-only changes; preserve earlier entries and use synthetic, non-identifying content only.

## UI testing knowledge

Before UI testing, use the [knowledge index](docs/knowledge/README.md) to recall only relevant methods. At closeout or after a confirmed correction, follow UIK-016 to review and maintain reusable knowledge within the authorized scope. Keep detailed methods in that single source; keep real evidence in the private workspace. These are caller instructions, not automatic runner behavior.

## Merge gate

A change may merge only when repository-hygiene scanning, unit tests, MCP discovery, Electron end-to-end tests, and human privacy review pass. A failing or unknown gate blocks merge.

---

## 中文

### 仓库边界

本仓库是通用开源 Electron UI 测试执行器。源码、测试、夹具、示例、文档、Issue 和 Pull Request 中都不得添加任何真实产品、项目、组织、人员、环境或测试执行信息，只能使用虚构名称和数据。

业务测试项目可以依赖本软件包，但本软件包不得导入、复制、打包或发布业务测试项目中的内容。

### GitHub 提交内容必须公开通用

每次 GitHub 提交只能包含公开、通用内容，禁止任何真实业务项目的信息，即使自认为无害或已经部分脱敏也不得提交。范围包括源码、测试、夹具、示例、配置、文档、更新记录、提交说明、PR、附件和发布包。禁止真实项目名称、业务流程、选择器、标识、内部路径和地址、人员、凭据、数据及扫描证据；示例必须从零虚构。每次提交和推送前必须复核准确的暂存差异与打包内容，并运行卫生门禁；自动检查不能替代人工隐私复核。目的：保证公开仓库不承载任何真实业务项目的信息。

### 开发要求

- 使用 Node.js 20 或更高版本。
- 使用 `npm ci` 安装依赖。
- 提交变更前运行 `npm run check`。
- 保持确定性执行且不依赖具体模型。
- 禁止在用例格式或 MCP 接口中增加任意 JavaScript 执行能力。
- MCP 返回内容应保持精简；大体积截图、Trace 和日志只作为证据文件保存。
- 禁止提交 `artifacts/`、`.eui-agent-runs/`、环境文件或生成的构建产物。
- 每次提交必须在同一提交中更新 `CHANGELOG.md`，新增本次变更内容、验证情况与兼容性影响；仅文档变更也适用。保留已有记录，只使用虚构且不可识别的信息。目的：让每次更新都可追溯，便于使用者和审核者了解变化。

### UI 测试知识

UI 测试前通过[经验索引](docs/knowledge/README.md)只召回相关方法。收尾或收到已确认的纠正后，按 UIK-016 在授权范围内复核并维护可复用知识。详细方法保持唯一来源，真实证据留在私有工作区。这些是调用方指引，不是执行器自动行为。

### 合并门禁

只有仓库卫生扫描、单元测试、MCP 工具发现、Electron 端到端测试和人工隐私复核全部通过，变更才能合并。门禁失败或状态未知时禁止合并。
