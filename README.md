# Electron UI Agent

A vendor-neutral, token-efficient Electron UI test runner for humans, CI systems, and AI clients.

The runner reads deterministic YAML, JSON, or Markdown test cases and executes them with Playwright. Repeated runs require no language-model calls. AI clients can invoke the same runner through the Model Context Protocol (MCP) and receive compact result summaries.

## Principles

- Deterministic execution first; AI assistance is optional.
- No arbitrary JavaScript in test cases.
- Business tests and data stay in separate private repositories.
- Screenshots, traces, logs, and run results are local artifacts and are ignored by Git.
- No telemetry or network upload is built in.

## Install

```bash
npm install
npm run build
```

Node.js 20 or newer is required.

## Run a case

```bash
electron-ui-agent examples/demo-case.md --output artifacts
```

Application paths and secrets can be supplied through environment variables:

```yaml
app:
  executablePath: "${ENV:ELECTRON_EXECUTABLE}"
  args: ["${ENV:APP_ENTRY}"]
```

Supported actions are `click`, `fill`, `press`, `wait`, `assertVisible`, `assertText`, `assertValue`, and `screenshot`.

## MCP server

```bash
electron-ui-agent-mcp --workspace ./private-test-project
```

The MCP server exposes `run_case`. Paths are restricted to the configured workspace, and the response contains only a compact status summary and artifact paths.

## Keep business data separate

This repository must contain synthetic, non-identifying content only. Store application configuration, selectors, credentials, cases, screenshots, traces, and reports in a separate private repository or local workspace:

```text
open-source runner  <-  private test project  <-  private runtime secrets
```

The dependency direction must never be reversed. See [CONTRIBUTING.md](CONTRIBUTING.md) for the merge gate.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Test case format](docs/CASE_FORMAT.md)
- [Privacy and business isolation](docs/PRIVACY.md)
- [Roadmap](docs/ROADMAP.md)

## Verify

```bash
npm run check
```

This builds the project, checks MCP discovery, runs unit and Electron end-to-end tests, and scans the repository for common identifying or sensitive data patterns.

## License

Apache License 2.0.
