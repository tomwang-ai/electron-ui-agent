# Agent Guidance

## Repository boundary

This repository is a generic open-source Electron UI test runner. Never add information from a real product, project, organization, person, environment, or test execution. Use synthetic names and data in every test, fixture, example, document, Issue, and Pull Request.

Business test projects may depend on this package. This package must never import, copy, package, or publish content from a business test project.

## Development

- Use Node.js 20 or newer.
- Install with `npm ci`.
- Run `npm run check` before proposing a change.
- Keep execution deterministic and model-independent.
- Do not add arbitrary JavaScript evaluation to the case format or MCP surface.
- Keep MCP responses compact; large screenshots, traces, and logs remain artifact files.
- Do not commit `artifacts/`, `.eui-agent-runs/`, environment files, or generated build output.

## Merge gate

A change may merge only when repository-hygiene scanning, unit tests, MCP discovery, Electron end-to-end tests, and human privacy review pass. A failing or unknown gate blocks merge.
