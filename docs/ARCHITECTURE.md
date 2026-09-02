# Architecture

Electron UI Agent has one job: execute deterministic UI cases against a locally trusted Electron application.

```text
human, CI, or AI client
          |
       CLI or MCP
          |
   case loader and validator
          |
 Playwright Electron runner
          |
 local evidence directory
```

## Boundaries

The CLI and MCP server share the same case loader and runner. There is no model provider inside the execution path, so a saved case consumes no language-model tokens. An AI client may author a case or invoke `run_case`, but click, fill, wait, assertion, screenshot, and evidence collection remain deterministic.

The MCP server accepts paths only inside its configured workspace. It does not expose arbitrary JavaScript evaluation. The application executable is trusted input: launching a test application has the same security implications as launching it directly.

## Evidence

Each run writes a unique local directory containing `result.json`, a Playwright trace, explicit screenshots, a failure screenshot when possible, and renderer console output when present. The MCP response returns only a compact result and artifact paths; clients load large evidence only when needed.

## Extension policy

Keep the core action set small. Add an action only when it is broadly useful across Electron applications and can be validated without application-specific knowledge. Product workflows, selectors, data, and reporting integrations belong in private downstream test projects.
