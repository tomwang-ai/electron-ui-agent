# Privacy and Business Isolation

The public repository contains only generic execution code and synthetic examples. Real application configuration, product terminology, selectors, credentials, cases, screenshots, traces, logs, and reports must remain in a separate private workspace.

```text
public runner <- private test project <- private runtime secrets
```

The public runner must never import from, copy, package, or publish the private project. Runtime evidence is written to ignored local directories and no telemetry is sent.

## Merge gate

Every pull request must pass `npm run check:hygiene` and human review. The scanner rejects common local user paths, private network addresses, credential-shaped tokens, and non-example email addresses. Maintainers can provide additional organization-specific terms through the private `REPOSITORY_HYGIENE_DENYLIST` CI secret without committing those terms.

Automated scanning is not proof that content is safe. Contributors must convert real failures into synthetic reproductions and reviewers must reject identifying or business-specific material even when a scanner does not recognize it.

Do not attach raw screenshots, traces, logs, or cases to public Issues. Security-sensitive reports should use the repository's private security advisory channel.
