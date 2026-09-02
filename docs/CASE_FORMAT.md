# Test Case Format

[English](#english) | [中文](#中文)

## English

Cases may be YAML, JSON, or Markdown containing one fenced YAML or JSON block. A case has a name, an application launch definition, and at least one step.

```yaml
name: generic example
app:
  executablePath: "${ENV:ELECTRON_EXECUTABLE}"
  args: ["${ENV:APP_ENTRY}"]
  timeoutMs: 30000
  actionTimeoutMs: 10000
steps:
  - action: fill
    target: { role: textbox, name: Display name }
    value: Example User
  - action: click
    target: { role: button, name: Continue }
  - action: assertVisible
    target: { text: Completed }
```

## Targets

Use one of:

- `role`, optionally with `name`
- `testId`
- exact `text`
- `css` as a last resort

Semantic roles and stable test IDs are less brittle than CSS selectors.

## Actions

| Action | Required fields | Behavior |
|---|---|---|
| `click` | `target` | Click an element. |
| `fill` | `target`, `value` | Replace an input value. |
| `press` | `key`; optional `target` | Press a key globally or on an element. |
| `wait` | `milliseconds` or `target` | Wait for time or visibility. |
| `assertVisible` | `target` | Require a visible element. |
| `assertText` | `target`, `value` | Require visible matching text. |
| `assertValue` | `target`, `value` | Require an exact input value. |
| `screenshot` | optional `name` | Save a screenshot. |

Strings support `${ENV:VARIABLE_NAME}`. Missing variables fail before the affected action can continue. Cases cannot execute arbitrary JavaScript.

`timeoutMs` limits application launch. `actionTimeoutMs` separately limits UI actions and assertions.

Passing a directory to the CLI discovers supported case files recursively and executes them in stable path order.

### Top-level schema

| Field | Type | Required | Validation and meaning |
|---|---|---:|---|
| `name` | string | Yes | Non-empty case name copied to `RunResult.caseName`. |
| `app` | object | Yes | Application launch configuration. |
| `steps` | array | Yes | Non-empty ordered list. Execution stops at the first failed step. |

Unknown fields are currently ignored rather than rejected. Do not rely on unknown fields being preserved in future schema versions.

### Application schema

| Field | Type | Required | Default | Meaning |
|---|---|---:|---|---|
| `executablePath` | string | Yes | — | Electron executable path. Environment placeholders are expanded. |
| `args` | string array | No | `[]` | Arguments passed to Electron. For development apps this commonly includes the main-process entry file. |
| `env` | string map | No | `{}` | Values merged over the runner's inherited environment. |
| `timeoutMs` | positive number | No | `30000` | `_electron.launch` timeout. It does not control step timeouts. |
| `actionTimeoutMs` | positive number | No | `30000` | Default Playwright timeout after the first window appears. |

The runner waits for `application.firstWindow()` and all steps operate on that page. There is no current schema for selecting another window.

### Target schema and precedence

`target` accepts `role`, `name`, `testId`, `text` and `css`. At least one of `role`, `testId`, `text` or `css` is required. `name` is only meaningful with `role`.

If several locator fields are provided, resolution uses this exact priority:

1. `role`, optionally with `name`.
2. `testId`.
3. exact `text`.
4. `css`.

Lower-priority fields are not fallbacks when a higher-priority field is present. Prefer one locator strategy per target so intent is unambiguous.

```yaml
target: { role: button, name: Continue }
target: { testId: continue-button }
target: { text: Completed }
target: { css: "button[data-action='continue']" }
```

### Action semantics

#### `click`

Resolves `target` and performs a Playwright click. Normal Playwright actionability rules apply.

```yaml
- action: click
  target: { role: button, name: Continue }
```

#### `fill`

Replaces the current editable value. `value` supports environment expansion.

```yaml
- action: fill
  target: { role: textbox, name: Display name }
  value: "${ENV:DISPLAY_NAME}"
```

#### `press`

Presses a Playwright key. With `target`, the key is sent to that locator; without it, the page keyboard is used.

```yaml
- action: press
  target: { role: textbox, name: Search }
  key: Enter
```

#### `wait`

With `target`, waits until the target is visible. Without `target`, waits `milliseconds`. At least one is required. When both are present, target visibility wins and `milliseconds` is ignored.

```yaml
- action: wait
  target: { text: Ready }

- action: wait
  milliseconds: 250
```

Fixed waits should be a last resort; visible-state waits are more stable.

#### `assertVisible`

Waits for a visible target. It does not assert enabled state, count or uniqueness separately.

#### `assertText`

Resolves the target, filters it with Playwright `hasText`, and waits for the filtered locator to be visible. The `value` supports environment expansion. This is not a strict whole-text equality assertion.

#### `assertValue`

Reads `inputValue()` and requires exact string equality. The expected `value` supports environment expansion.

#### `screenshot`

Captures the current page. `name` is normalized to letters, digits, underscore and hyphen, trimmed to 80 characters. The filename begins with a one-based, three-digit step number.

```yaml
- action: screenshot
  name: form-complete
```

Example output: `004-form-complete.png`.

### Format-specific behavior

- JSON is parsed with `JSON.parse`.
- YAML and YML use the `yaml` package.
- Markdown must contain a fenced block labelled `yaml`, `yml` or `json`.
- The first matching fenced block is used; surrounding prose is ignored.
- A Markdown fence without a supported language label is rejected.

### Failure behavior

- Steps run in listed order.
- Step indexes in `result.json` are zero-based.
- Screenshot filenames use one-based step numbers.
- The first failed step stops that case.
- When a page exists, the runner attempts `<step>-failure.png`.
- Launch failures can occur before a page exists, so a failure screenshot or trace is not guaranteed.
- `result.json` is always attempted after the run directory has been created.

### Unsupported operations

Version `0.1.0` does not support arbitrary JavaScript, conditional branches, loops, variables created by steps, file upload, drag and drop, native dialogs, window selection, retries, hooks or visual matching.

---

## 中文

用例可以使用 YAML、JSON，或包含一个 YAML/JSON 代码块的 Markdown。每个用例必须包含名称、应用启动配置和至少一个步骤。

```yaml
name: generic example
app:
  executablePath: "${ENV:ELECTRON_EXECUTABLE}"
  args: ["${ENV:APP_ENTRY}"]
  timeoutMs: 30000
  actionTimeoutMs: 10000
steps:
  - action: fill
    target: { role: textbox, name: Display name }
    value: Example User
  - action: click
    target: { role: button, name: Continue }
  - action: assertVisible
    target: { text: Completed }
```

### 目标定位

使用以下一种方式：

- `role`，可配合 `name`
- `testId`
- 精确 `text`
- 最后才使用 `css`

语义角色和稳定的 Test ID 通常比 CSS 选择器更可靠。

### 动作

| 动作 | 必填字段 | 行为 |
|---|---|---|
| `click` | `target` | 点击元素。 |
| `fill` | `target`、`value` | 替换输入值。 |
| `press` | `key`；可选 `target` | 全局或针对元素按键。 |
| `wait` | `milliseconds` 或 `target` | 等待指定时间或等待元素可见。 |
| `assertVisible` | `target` | 要求元素可见。 |
| `assertText` | `target`、`value` | 要求匹配文本可见。 |
| `assertValue` | `target`、`value` | 要求输入值完全一致。 |
| `screenshot` | 可选 `name` | 保存截图。 |

字符串支持 `${ENV:VARIABLE_NAME}`。缺少环境变量时，相关动作执行前会失败。用例不能执行任意 JavaScript。

`timeoutMs` 限制应用启动时间，`actionTimeoutMs` 单独限制 UI 动作和断言时间。

向 CLI 传入目录时，执行器会递归发现支持的用例文件，并按稳定的路径顺序执行。

### 顶层Schema

| 字段 | 类型 | 必填 | 校验和含义 |
|---|---|---:|---|
| `name` | 字符串 | 是 | 非空用例名，会写入 `RunResult.caseName`。 |
| `app` | 对象 | 是 | 应用启动配置。 |
| `steps` | 数组 | 是 | 非空有序步骤；第一个失败步骤会终止该用例。 |

当前未知字段会被忽略而不是拒绝。不要依赖未知字段在未来 Schema 版本中继续保留。

### 应用Schema

| 字段 | 类型 | 必填 | 默认值 | 含义 |
|---|---|---:|---|---|
| `executablePath` | 字符串 | 是 | — | Electron 可执行文件路径，支持环境变量展开。 |
| `args` | 字符串数组 | 否 | `[]` | 传给 Electron 的参数；开发应用通常包含主进程入口。 |
| `env` | 字符串映射 | 否 | `{}` | 覆盖合并到执行器继承的环境变量中。 |
| `timeoutMs` | 正数 | 否 | `30000` | `_electron.launch` 超时，不控制步骤。 |
| `actionTimeoutMs` | 正数 | 否 | `30000` | 首个窗口出现后的 Playwright 默认超时。 |

执行器等待 `application.firstWindow()`，全部步骤都操作该页面。当前 Schema 不能选择其他窗口。

### 目标Schema与优先级

`target` 接受 `role`、`name`、`testId`、`text` 和 `css`。必须至少提供 `role`、`testId`、`text`、`css` 之一；`name` 只与 `role` 配合时有意义。

同时提供多个字段时，严格按以下顺序解析：

1. `role`，可配合 `name`。
2. `testId`。
3. 精确 `text`。
4. `css`。

高优先级字段存在时，低优先级字段不会作为失败回退。建议每个目标只使用一种定位策略。

```yaml
target: { role: button, name: Continue }
target: { testId: continue-button }
target: { text: Completed }
target: { css: "button[data-action='continue']" }
```

### 动作语义

#### `click`

解析 `target` 后执行 Playwright 点击，遵循 Playwright 常规可操作性规则。

#### `fill`

替换可编辑元素当前值，`value` 支持环境变量展开。

#### `press`

有 `target` 时向该元素发送按键；没有时使用页面键盘。

#### `wait`

有 `target` 时等待目标可见；没有目标时等待 `milliseconds`。至少提供一个。同时提供时优先等待目标，忽略 `milliseconds`。固定等待应作为最后选择。

#### `assertVisible`

等待目标可见，不额外断言启用状态、数量或唯一性。

#### `assertText`

解析目标后用 Playwright `hasText` 过滤，并等待过滤结果可见。它不是严格的完整文本相等断言。

#### `assertValue`

读取 `inputValue()` 并要求字符串完全相等。

#### `screenshot`

截取当前页面。名称会规范为字母、数字、下划线和连字符，最多80个字符；文件名前缀是从1开始的三位步骤号。例如：`004-form-complete.png`。

### 各格式行为

- JSON 使用 `JSON.parse`。
- YAML/YML 使用 `yaml` 包。
- Markdown 必须包含标记为 `yaml`、`yml` 或 `json` 的代码块。
- 使用第一个匹配代码块，忽略周围说明文字。
- 没有支持语言标记的 Markdown 代码块会被拒绝。

### 失败行为

- 按列表顺序执行。
- `result.json` 中步骤索引从0开始。
- 截图文件步骤号从1开始。
- 第一个失败步骤终止当前用例。
- 页面存在时尝试生成 `<步骤>-failure.png`。
- 启动失败可能发生在页面创建前，因此不保证失败截图或 Trace。
- 创建运行目录后，总会尝试写入 `result.json`。

### 不支持的操作

`0.1.0` 不支持任意 JavaScript、条件分支、循环、步骤变量、文件上传、拖放、原生对话框、窗口选择、重试、Hook或视觉匹配。
