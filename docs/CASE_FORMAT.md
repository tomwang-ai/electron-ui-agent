# Test Case Format

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
