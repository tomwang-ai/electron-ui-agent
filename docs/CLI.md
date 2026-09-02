# CLI Reference / CLI 参考

[English](#english) | [中文](#中文)

## English

### Synopsis

```text
electron-ui-agent <case-file-or-directory> [--output <directory>]
electron-ui-agent <case-file-or-directory> [-o <directory>]
electron-ui-agent --help
```

From a checkout:

```bash
node dist/cli.js <case-file-or-directory> --output artifacts
```

### Arguments

| Argument | Required | Description |
|---|---:|---|
| `<case-file-or-directory>` | Yes | One YAML, YML, JSON or Markdown case file, or a directory recursively containing supported files. |
| `--output <directory>` | No | Artifact root. Relative paths resolve from the current directory. Default: `artifacts`. |
| `-o <directory>` | No | Short form of `--output`. |
| `--help`, `-h` | No | Print usage and exit successfully. |

Unknown options and multiple positional inputs are rejected.

### Discovery and ordering

Directory discovery is recursive. Supported extensions are `.json`, `.yaml`, `.yml` and `.md`. Files are sorted by full path before execution. No supported files causes failure before application launch.

Cases execute sequentially. Parallel execution, tag filtering and retries are not implemented in `0.1.0`.

### Standard output

One compact JSON object is printed per completed case:

```json
{
  "runId": "<run-id>",
  "caseName": "generic form submission",
  "status": "passed",
  "artifacts": [
    "<output-root>/<run-id>/004-completed.png",
    "<output-root>/<run-id>/trace.zip",
    "<output-root>/<run-id>/result.json"
  ]
}
```

Failure can add `error`:

```json
{
  "runId": "<run-id>",
  "caseName": "generic failure",
  "status": "failed",
  "error": "locator.waitFor: Timeout exceeded",
  "artifacts": ["<output-root>/<run-id>/001-failure.png", "<output-root>/<run-id>/trace.zip", "<output-root>/<run-id>/result.json"]
}
```

Parse this JSON or `result.json`; do not parse human error wording.

### Exit behavior

| Situation | Result |
|---|---|
| `--help` | Exit `0`. |
| All executed cases pass | Exit `0`. |
| At least one normal run fails | Exit `1`. |
| Invalid arguments, no cases, parse failure or uncaught setup error | Non-zero Node.js exit; exact code is not yet versioned. |

For a directory, a normal failed run does not stop later cases. A parse or setup exception can terminate the process early.

### Environment expansion

Syntax:

```text
${ENV:VARIABLE_NAME}
```

Supported fields:

- `app.executablePath`
- every `app.args` item
- every `app.env` value
- `fill.value`
- `assertText.value`
- `assertValue.value`

Prefer uppercase portable names. Missing variables fail when the affected value is expanded. Never commit secrets directly in cases.

### Examples

```bash
node dist/cli.js cases/smoke.yaml
node dist/cli.js cases --output local-artifacts
node dist/cli.js cases/smoke.yaml --output <ABSOLUTE_PRIVATE_ARTIFACT_DIRECTORY>
```

PowerShell:

```powershell
$env:APP_EXECUTABLE = '<ABSOLUTE_PATH_TO_APP>'
node dist/cli.js cases/smoke.yaml -o local-artifacts
```

Bash:

```bash
export APP_EXECUTABLE='<ABSOLUTE_PATH_TO_APP>'
node dist/cli.js cases/smoke.yaml -o local-artifacts
```

### CI guidance

Keep real cases in a private repository and inject secrets through the CI secret store. Preserve the CLI exit code:

```bash
node <AGENT_DIR>/dist/cli.js cases --output test-artifacts
```

Upload output only as a private CI artifact. Never publish real traces or screenshots here.

## 中文

### 命令格式

```text
electron-ui-agent <用例文件或目录> [--output <目录>]
electron-ui-agent <用例文件或目录> [-o <目录>]
electron-ui-agent --help
```

从源码检出运行：

```bash
node dist/cli.js <用例文件或目录> --output artifacts
```

### 参数

| 参数 | 必填 | 说明 |
|---|---:|---|
| `<用例文件或目录>` | 是 | 一个 YAML、YML、JSON、Markdown 用例文件，或递归包含支持文件的目录。 |
| `--output <目录>` | 否 | 证据根目录。相对路径基于当前目录解析。默认：`artifacts`。 |
| `-o <目录>` | 否 | `--output` 短写。 |
| `--help`、`-h` | 否 | 打印帮助并成功退出。 |

未知选项和多个位置参数会被拒绝。

### 发现与顺序

目录发现是递归的，支持 `.json`、`.yaml`、`.yml` 和 `.md`。执行前按完整路径排序。没有支持的文件时，会在启动应用前失败。

用例顺序执行。`0.1.0` 尚未实现并行、标签筛选和重试。

### 标准输出

每个完成用例输出一行精简 JSON：

```json
{
  "runId": "<run-id>",
  "caseName": "generic form submission",
  "status": "passed",
  "artifacts": [
    "<output-root>/<run-id>/004-completed.png",
    "<output-root>/<run-id>/trace.zip",
    "<output-root>/<run-id>/result.json"
  ]
}
```

失败时可能增加 `error`：

```json
{
  "runId": "<run-id>",
  "caseName": "generic failure",
  "status": "failed",
  "error": "locator.waitFor: Timeout exceeded",
  "artifacts": ["<output-root>/<run-id>/001-failure.png", "<output-root>/<run-id>/trace.zip", "<output-root>/<run-id>/result.json"]
}
```

应解析该 JSON 或 `result.json`，不要解析自然语言错误文字。

### 退出行为

| 情况 | 结果 |
|---|---|
| `--help` | 退出码 `0`。 |
| 所有已执行用例通过 | 退出码 `0`。 |
| 至少一个普通执行失败 | 退出码 `1`。 |
| 参数无效、没有用例、解析失败或未捕获准备错误 | Node.js 非零退出；具体值尚未纳入版本契约。 |

目录执行时，普通用例失败不会阻止后续用例；解析或准备异常可能提前终止进程。

### 环境变量展开

格式：

```text
${ENV:VARIABLE_NAME}
```

支持字段：

- `app.executablePath`
- 每个 `app.args` 项
- 每个 `app.env` 值
- `fill.value`
- `assertText.value`
- `assertValue.value`

建议使用全大写跨平台名称。缺少变量时会在展开相关值时失败。禁止在用例中直接提交密钥。

### 示例

```bash
node dist/cli.js cases/smoke.yaml
node dist/cli.js cases --output local-artifacts
node dist/cli.js cases/smoke.yaml --output <ABSOLUTE_PRIVATE_ARTIFACT_DIRECTORY>
```

PowerShell：

```powershell
$env:APP_EXECUTABLE = '<ABSOLUTE_PATH_TO_APP>'
node dist/cli.js cases/smoke.yaml -o local-artifacts
```

Bash：

```bash
export APP_EXECUTABLE='<ABSOLUTE_PATH_TO_APP>'
node dist/cli.js cases/smoke.yaml -o local-artifacts
```

### CI建议

真实用例放在私有仓库，通过 CI 密钥存储注入密钥，并保留 CLI 退出码：

```bash
node <AGENT_DIR>/dist/cli.js cases --output test-artifacts
```

输出只能作为私有 CI Artifact 上传，禁止向本仓库公开真实 Trace 或截图。
