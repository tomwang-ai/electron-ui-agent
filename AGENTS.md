# Agent Guidance

## English

## Repository boundary

This repository is a generic open-source Electron UI test runner. Never add information from a real product, project, organization, person, environment, or test execution. Use synthetic names and data in every test, fixture, example, document, Issue, and Pull Request.

Business test projects may depend on this package. This package must never import, copy, package, or publish content from a business test project.

## Development

- Use Node.js 20 or newer.
- Install with `npm ci`.
- Run `npm run check` before proposing a change.
- Keep execution deterministic and model-independent.
- Do not add arbitrary JavaScript evaluation to the case format or MCP surface.
- Keep MCP responses compact; large screenshots, traces, and logs remain artifact files.
- Do not commit `artifacts/`, `.eui-agent-runs/`, environment files, or generated build output.

## Merge gate

A change may merge only when repository-hygiene scanning, unit tests, MCP discovery, Electron end-to-end tests, and human privacy review pass. A failing or unknown gate blocks merge.

---

## 中文

### 仓库边界

本仓库是通用开源 Electron UI 测试执行器。源码、测试、夹具、示例、文档、Issue 和 Pull Request 中都不得添加任何真实产品、项目、组织、人员、环境或测试执行信息，只能使用虚构名称和数据。

业务测试项目可以依赖本软件包，但本软件包不得导入、复制、打包或发布业务测试项目中的内容。

### 开发要求

- 使用 Node.js 20 或更高版本。
- 使用 `npm ci` 安装依赖。
- 提交变更前运行 `npm run check`。
- 保持确定性执行且不依赖具体模型。
- 禁止在用例格式或 MCP 接口中增加任意 JavaScript 执行能力。
- MCP 返回内容应保持精简；大体积截图、Trace 和日志只作为证据文件保存。
- 禁止提交 `artifacts/`、`.eui-agent-runs/`、环境文件或生成的构建产物。

### 合并门禁

只有仓库卫生扫描、单元测试、MCP 工具发现、Electron 端到端测试和人工隐私复核全部通过，变更才能合并。门禁失败或状态未知时禁止合并。
