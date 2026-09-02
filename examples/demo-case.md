# Generic demo case

This example contains synthetic data only.

```yaml
name: generic form submission
app:
  executablePath: "${ENV:ELECTRON_EXECUTABLE}"
  args:
    - "${ENV:DEMO_APP_ENTRY}"
steps:
  - action: fill
    target:
      role: textbox
      name: Display name
    value: Example User
  - action: click
    target:
      role: button
      name: Continue
  - action: assertVisible
    target:
      text: Completed
  - action: screenshot
    name: completed
```
