# Troubleshooting / 故障排查

[English](#english) | [中文](#中文)

## English

### Use this diagnostic order

1. `node --version` and `npm --version`.
2. `npm ci`.
3. `npm run build`.
4. `npm test`.
5. `npm run test:mcp` for MCP problems.
6. `npm run test:e2e` for Electron launch or evidence problems.
7. Run the target case with the CLI before involving an AI client.
8. Inspect `result.json`, then screenshot, console and trace.

### Installation fails

- Confirm Node.js meets `>=20`; use Node.js 24 for repository development.
- Use `npm ci`, not a different package manager.
- Do not regenerate the lockfile as a first recovery step.
- If Electron binary download fails, verify network/proxy policy and retry installation from an approved source.
- Run `npm audit` after installation.

### `dist/cli.js` or `dist/mcp.js` is missing

```bash
npm run build
```

Check TypeScript errors. `dist/` is generated and intentionally absent from Git.

### No supported case files found

The input path must be an existing `.json`, `.yaml`, `.yml` or `.md` file, or a directory containing one recursively. Other extensions are ignored.

### Markdown case is rejected

Use a fenced block explicitly labelled `yaml`, `yml` or `json`:

````markdown
```yaml
name: generic case
app:
  executablePath: "${ENV:APP_EXECUTABLE}"
steps:
  - action: wait
    milliseconds: 100
```
````

Only the first matching block is parsed.

### Missing environment variable

Set every referenced `${ENV:NAME}` in the process that starts the CLI or MCP server. An AI client may start MCP with a different environment than an interactive terminal.

Do not replace missing variables by committing secrets.

### Electron does not launch

- Confirm `app.executablePath` is an executable file, not a directory.
- Use an absolute path through an environment variable.
- For a development app, confirm the main-process entry is present in `app.args`.
- Increase `app.timeoutMs` only when startup legitimately takes longer.
- Launch the same executable manually to separate application failure from runner failure.

### First window never appears

The runner waits for `application.firstWindow()`. Confirm the application creates a BrowserWindow. Background-only processes and some native-only windows are outside current scope.

### Locator timeout

1. Confirm the expected UI is in the first window.
2. Prefer `role` plus accessible `name`.
3. Use a stable `testId` when semantics are unavailable.
4. Confirm exact case and whitespace for `text`.
5. Use `css` last.
6. Wait for a meaningful visible state before interacting.
7. Increase `actionTimeoutMs` only after verifying that the UI is legitimately slow.

If a target provides several strategies, remember that only the highest-priority strategy is used; lower fields are not fallbacks.

### `assertText` surprises

`assertText` uses Playwright `hasText` filtering and visibility. It is not strict whole-text equality. Use `assertValue` for exact form values. Exact general text equality is not implemented yet.

### Failure screenshot is missing

Screenshots require an existing page. Launch failure, missing first window, closed page or screenshot failure can leave only `result.json`. This is expected best-effort behavior.

### Trace is missing

Tracing starts only after the first window appears. If launch or first-window acquisition fails, there is no trace. A trace-stop failure can also omit the archive.

### MCP server is not visible

- Build first.
- Run `npm run test:mcp`.
- Use absolute command and argument paths.
- Restart the AI client after configuration.
- Check that the client supports local STDIO MCP.
- Verify stdout is reserved for MCP protocol output.

### MCP rejects a path

`casePath` and `outputDir` must stay inside `--workspace`. Use paths relative to that workspace. The restriction is intentional and must not be bypassed with broader filesystem access.

### MCP run times out in the client

There are two separate timeout layers:

- Case `timeoutMs` / `actionTimeoutMs` inside the runner.
- Tool timeout configured by the MCP client.

The client tool timeout must exceed the longest legitimate complete run.

### CI passes locally but fails remotely

- Use Node.js 24 locally to match CI.
- Run the exact `npm run check` command.
- Confirm no generated artifacts were staged.
- Inspect both Windows and Ubuntu jobs.
- Remember that Electron E2E currently runs only on Windows CI.

### Hygiene gate fails

The output reports file and category, not the matching secret. Replace real data with synthetic placeholders. For a false positive, prefer rewriting the example over weakening the rule. Never print the private deny-list secret.

### When reporting a problem

Provide a minimal synthetic case, operating system, Node.js version, command, exit code and sanitized error. Do not attach real screenshots, traces, paths, emails, addresses, tokens or business terms.

## 中文

### 建议诊断顺序

1. 检查`node --version`和`npm --version`。
2. 运行`npm ci`。
3. 运行`npm run build`。
4. 运行`npm test`。
5. MCP问题运行`npm run test:mcp`。
6. Electron启动或证据问题运行`npm run test:e2e`。
7. 接入AI客户端前先用CLI执行目标用例。
8. 依次查看`result.json`、截图、控制台和Trace。

### 安装失败

- 确认Node.js满足`>=20`；开发仓库使用Node.js 24。
- 使用`npm ci`，不要换包管理器。
- 不要把重建锁文件作为首个恢复手段。
- Electron二进制下载失败时检查网络/代理策略，并从批准的来源重试。
- 安装后运行`npm audit`。

### 缺少`dist/cli.js`或`dist/mcp.js`

运行`npm run build`并处理TypeScript错误。`dist/`是生成目录，本来就不提交Git。

### 找不到支持的用例

输入必须是存在的`.json`、`.yaml`、`.yml`、`.md`文件，或递归包含这些文件的目录。其他扩展名会忽略。

### Markdown用例被拒绝

代码块必须明确标记`yaml`、`yml`或`json`。只解析第一个匹配代码块。

### 缺少环境变量

在启动CLI或MCP服务的同一进程环境中设置所有`${ENV:NAME}`。AI客户端启动MCP时可能与交互式终端环境不同。禁止通过提交密钥解决变量缺失。

### Electron无法启动

- `app.executablePath`必须是可执行文件，不是目录。
- 通过环境变量使用绝对路径。
- 开发应用确认`app.args`包含主进程入口。
- 只有启动确实较慢时才增加`app.timeoutMs`。
- 手工启动同一个可执行文件，区分应用问题和执行器问题。

### 首个窗口始终不出现

执行器等待`application.firstWindow()`。确认应用创建BrowserWindow。后台进程和部分纯原生窗口不在当前范围内。

### 定位超时

1. 确认目标位于首个窗口。
2. 优先`role`加可访问名称。
3. 语义不足时使用稳定`testId`。
4. `text`检查大小写和空白。
5. 最后使用`css`。
6. 操作前等待有业务意义的可见状态。
7. 确认UI确实慢后才增加`actionTimeoutMs`。

同时提供多种定位时，只使用最高优先级字段，其他字段不是回退。

### `assertText`结果不符合预期

`assertText`使用Playwright `hasText`过滤和可见性，不是严格完整文本相等。表单精确值使用`assertValue`。通用精确文本相等尚未实现。

### 没有失败截图或Trace

截图需要已存在页面；启动失败、首窗缺失、页面关闭或截图失败时可能只有`result.json`。Trace也只有首窗出现后才启动，这属于预期的尽力生成行为。

### MCP服务不可见

- 先构建。
- 运行`npm run test:mcp`。
- 命令和参数使用绝对路径。
- 配置后重启AI客户端。
- 确认客户端支持本地STDIO MCP。
- stdout必须只用于MCP协议输出。

### MCP拒绝路径

`casePath`和`outputDir`必须位于`--workspace`内，并使用相对该工作区的路径。禁止通过扩大文件系统权限绕过限制。

### MCP在客户端超时

有两个独立层次：用例内部的`timeoutMs`/`actionTimeoutMs`，以及MCP客户端工具超时。客户端超时必须大于最长合法完整执行时间。

### 本地通过但CI失败

- 本地使用Node.js 24匹配CI。
- 运行完全相同的`npm run check`。
- 确认没有暂存生成产物。
- 同时检查Windows和Ubuntu任务。
- 真实Electron E2E当前只在Windows CI运行。

### 卫生门禁失败

输出只报告文件和类别，不显示匹配密钥。把真实数据改成虚构占位符。误报时优先改写示例，不要削弱规则；禁止打印私有禁词Secret。

### 报告问题

提供最小虚构用例、操作系统、Node.js版本、命令、退出码和脱敏错误。禁止附加真实截图、Trace、路径、邮箱、地址、Token或业务术语。
