# Development Guide / 开发指南

[English](#english) | [中文](#中文)

## English

### Repository layout

```text
src/
├── case-loader.ts        parsing, discovery and validation
├── cli.ts                command-line entry
├── mcp.ts                STDIO MCP entry and workspace boundary
├── runner.ts             Electron lifecycle, steps and artifacts
└── types.ts              public case and result types
scripts/
├── check-repository-hygiene.mjs
├── e2e.mjs
└── mcp-smoke.mjs
examples/demo-app/         synthetic Electron app
docs/                      bilingual documentation
```

### Setup

```bash
npm ci
npm run build
```

Use Node.js 24 to match CI. Do not switch package managers or create another lockfile.

### Commands

| Command | Purpose |
|---|---|
| `npm run build` | Compile TypeScript to `dist/`. |
| `npm test` | Build and run Node.js unit tests. |
| `npm run test:mcp` | Build, start the MCP server through the official SDK client and verify `run_case` discovery. |
| `npm run test:e2e` | Build and run real Electron success and failure-evidence cases. |
| `npm run check:hygiene` | Scan repository text for identifying and sensitive patterns. |
| `npm run check` | Run the full local quality gate. |

### Change workflow

1. Confirm the feature is generic across Electron applications.
2. Identify the smallest source boundary.
3. Update or add a meaningful automated check.
4. Update English and Chinese documentation together.
5. Run `npm run check`.
6. Inspect `git status --short` and `git diff --check`.
7. Confirm no artifacts, private paths or identifying data are staged.

### Testing strategy

#### Unit tests

Use the built-in `node:test` and `node:assert` modules. Unit-test validation, parsing and pure behavior without launching Electron.

#### MCP smoke test

Use the official MCP SDK client over STDIO. Tests must prove tool discovery without relying on a particular AI product.

#### Electron E2E

Use the synthetic app only. Cover at least one passing path and one intentional failing assertion that generates evidence. Never use a real product as the public fixture.

### Adding an action

An action is appropriate only when it is broadly reusable and deterministic.

Required changes usually include:

1. Add the type to `Step` in `src/types.ts`.
2. Validate it in `parseStep`.
3. Execute it in `executeStep`.
4. Add a unit or E2E check.
5. Update [Case Format](CASE_FORMAT.md) in both languages.
6. Re-evaluate the security model.

Do not add arbitrary code evaluation, shell execution or application-specific shortcuts.

### Adding an MCP tool

Keep the tool surface small. Define strict Zod input, enforce workspace confinement for every path, return compact text, and document token behavior. Update `scripts/mcp-smoke.mjs` to verify discovery.

### Documentation rules

- English first, Chinese second in the same page.
- Commands and schemas should appear once per language section and remain equivalent.
- Mark planned capabilities explicitly.
- Never document a command that was not tested or inspected against source.
- Use placeholders, never local absolute paths, private addresses or personal names.
- Update `docs/README.md` when adding a page.

### Hygiene gate

The built-in scanner checks common local user paths, private IPv4 addresses, credential-shaped tokens and non-example email addresses. Maintainers may add newline-separated private terms through `REPOSITORY_HYGIENE_DENYLIST` without committing them.

Scanner success does not replace review. Semantic business information may not match a pattern.

### Dependency policy

Prefer Node.js standard library and current dependencies. A new dependency requires a concrete generic capability, active maintenance, acceptable license and test evidence. Keep `package-lock.json` changes focused.

### Generated files

Do not commit `dist/`, `artifacts/`, `.eui-agent-runs/`, logs or environment files. After tests, `git status --short` should show only intentional source and documentation changes.

## 中文

### 仓库结构

```text
src/
├── case-loader.ts        解析、发现和校验
├── cli.ts                命令行入口
├── mcp.ts                STDIO MCP入口和工作区边界
├── runner.ts             Electron生命周期、步骤和证据
└── types.ts              公开用例及结果类型
scripts/                  卫生、E2E和MCP冒烟脚本
examples/demo-app/        虚构Electron应用
docs/                      中英双语文档
```

### 环境准备

```bash
npm ci
npm run build
```

使用Node.js 24匹配CI。禁止切换包管理器或创建其他锁文件。

### 命令

| 命令 | 用途 |
|---|---|
| `npm run build` | 编译TypeScript到`dist/`。 |
| `npm test` | 构建并运行Node.js单元测试。 |
| `npm run test:mcp` | 通过官方SDK客户端启动MCP并验证`run_case`发现。 |
| `npm run test:e2e` | 运行真实Electron成功和失败证据用例。 |
| `npm run check:hygiene` | 扫描可识别和敏感模式。 |
| `npm run check` | 运行完整本地门禁。 |

### 变更流程

1. 确认能力对不同Electron应用通用。
2. 找到最小源码边界。
3. 更新或增加有意义的自动化检查。
4. 同时更新中英文文档。
5. 运行`npm run check`。
6. 检查`git status --short`和`git diff --check`。
7. 确认未暂存证据、私有路径或可识别数据。

### 测试策略

- 单元测试使用内置`node:test`和`node:assert`，覆盖校验、解析和纯逻辑。
- MCP冒烟使用官方SDK客户端和STDIO，不依赖具体AI产品。
- Electron E2E只使用虚构应用，至少覆盖一个成功流程和一个生成证据的故意失败断言。

### 增加动作

1. 在`src/types.ts`的`Step`增加类型。
2. 在`parseStep`校验。
3. 在`executeStep`执行。
4. 添加单元或E2E检查。
5. 双语更新[用例格式](CASE_FORMAT.md)。
6. 重新评估安全模型。

禁止增加任意代码执行、Shell执行或应用专用捷径。

### 增加MCP工具

保持工具面精简；使用严格Zod输入；每个路径都执行工作区限制；返回精简文本；说明Token行为；并更新`mcp-smoke.mjs`验证发现。

### 文档规则

- 同一页面先英文后中文。
- 命令和Schema在每个语言区各写一次并保持等价。
- 规划能力必须显式标记。
- 未经源码核对或测试的命令不能写入文档。
- 只使用占位符，禁止本地绝对路径、私有地址和个人姓名。
- 新增页面同步更新`docs/README.md`。

### 卫生门禁

内置扫描覆盖本机用户路径、私网IPv4、疑似凭据Token和非示例邮箱。维护者可通过`REPOSITORY_HYGIENE_DENYLIST`传入换行分隔私有禁词而不提交它们。

扫描通过不能替代人工审核，语义业务信息可能不匹配固定模式。

### 依赖和生成文件

优先Node.js标准库和现有依赖。新依赖必须有明确通用能力、活跃维护、可接受许可证和测试证据，锁文件改动保持聚焦。

禁止提交`dist/`、`artifacts/`、`.eui-agent-runs/`、日志或环境文件。测试后`git status --short`只能包含预期源码和文档变更。
