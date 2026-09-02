# Compatibility / 兼容性

[English](#english) | [中文](#中文)

## English

### Declared and verified support

| Area | Declared | Verified in current automation |
|---|---|---|
| Node.js runtime | `>=20` from `package.json` | Node.js 24 in GitHub Actions and local development |
| Package manager | npm with `package-lock.json` | `npm ci` and `npm run check` |
| Windows | Intended | Build, unit, MCP smoke and real Electron E2E |
| Ubuntu | Intended for non-UI core | Build, unit and MCP smoke; no Electron E2E in current CI |
| macOS | Architecturally intended | Not currently covered by project CI |
| Electron under test | Executable launch through Playwright | Synthetic app using the repository Electron dev dependency |
| MCP | STDIO server | Official SDK client discovery smoke test |

“Intended” is not the same as verified. Do not report macOS or Linux Electron E2E support as proven until CI evidence exists.

### Version relationships

- Runtime engine declaration: Node.js 20 or newer.
- Repository development uses TypeScript 7 and Node.js type definitions 24.
- Synthetic E2E uses Electron 44 as a development dependency.
- Runtime automation uses Playwright 1.62.
- MCP implementation uses `@modelcontextprotocol/sdk` 1.30.

Dependency versions are governed by `package-lock.json`. Review release notes and run the full matrix before upgrades.

### Application requirements

The application must be launchable as an Electron executable accepted by Playwright `_electron.launch`. Development apps commonly pass the main entry in `app.args`; packaged apps may need no entry argument.

The current runner requires a first BrowserWindow. Applications that never create a normal first window, immediately close it, or use unsupported native-only surfaces may not work.

### Current UI scope

- First Electron window only.
- Renderer DOM accessible through Playwright locators.
- No native operating-system dialog automation.
- No WebView-specific routing contract.
- No multi-window selection.
- No headless mode switch.

### Path portability

Cases should use environment placeholders for executable and entry paths. Avoid committing platform-specific absolute paths. JSON configurations on Windows require escaped backslashes; YAML accepts quoted paths, but environment variables remain safer.

## 中文

### 声明与已验证支持

| 范围 | 声明 | 当前自动化验证 |
|---|---|---|
| Node.js运行时 | `package.json`声明`>=20` | GitHub Actions和本地开发使用Node.js 24 |
| 包管理器 | npm和`package-lock.json` | `npm ci`及`npm run check` |
| Windows | 目标支持 | 构建、单元、MCP冒烟和真实Electron E2E |
| Ubuntu | 非UI核心目标支持 | 构建、单元和MCP冒烟；当前CI不跑Electron E2E |
| macOS | 架构目标 | 当前项目CI未覆盖 |
| 被测Electron | 通过Playwright启动可执行文件 | 使用仓库Electron开发依赖的虚构应用 |
| MCP | STDIO服务 | 官方SDK客户端发现冒烟测试 |

“目标支持”不等于“已经验证”。没有 CI 证据前，不能宣称 macOS 或 Linux Electron E2E 已得到证明。

### 版本关系

- 运行时声明：Node.js 20或更高。
- 仓库开发使用TypeScript 7及Node.js 24类型定义。
- 虚构E2E使用Electron 44开发依赖。
- 自动化运行时使用Playwright 1.62。
- MCP使用`@modelcontextprotocol/sdk` 1.30。

依赖精确版本由`package-lock.json`管理。升级前必须查看发行说明并运行完整矩阵。

### 应用要求

应用必须能作为Playwright `_electron.launch`接受的Electron可执行程序启动。开发应用通常通过`app.args`传主入口；已打包应用可能不需要入口参数。

当前执行器要求存在首个BrowserWindow。始终不创建普通窗口、立即关闭窗口或只使用不支持的原生界面时可能无法工作。

### 当前UI范围

- 只操作首个Electron窗口。
- 渲染DOM可由Playwright定位。
- 不支持操作系统原生对话框。
- 没有WebView专用路由契约。
- 不支持多窗口选择。
- 没有无头模式开关。

### 路径可移植性

用例应通过环境变量占位符提供可执行文件和入口路径，避免提交平台绝对路径。Windows JSON需要转义反斜杠；YAML可使用引号路径，但环境变量更安全。
