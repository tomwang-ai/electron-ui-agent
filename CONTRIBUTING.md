# Contributing

Contributions are welcome when they remain generic and reproducible with synthetic data.

## Required checks

Run:

```bash
npm ci
npm run check
```

Every contribution must exclude real project names, business concepts, organization details, personal information, credentials, private addresses, private test cases, screenshots, logs, and generated execution artifacts. Convert a real failure into the smallest synthetic reproduction before submitting it.

Pull requests must not be merged unless automated repository-hygiene checks pass and a reviewer confirms the change remains business-neutral and non-identifying. Maintainers may configure additional private deny-list terms through the `REPOSITORY_HYGIENE_DENYLIST` CI secret; those terms must never be committed.

Keep changes focused. New dependencies require a concrete capability that cannot be covered safely by the standard library or current dependencies.
