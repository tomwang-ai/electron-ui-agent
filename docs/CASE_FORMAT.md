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
