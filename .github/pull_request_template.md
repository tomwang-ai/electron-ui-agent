## Summary

## 变更摘要

Describe the change without including information from any real product, organization, person, environment, or test run.

请说明变更，但不得包含任何真实产品、组织、人员、环境或测试执行信息。

## Verification

## 验证

- [ ] `npm run check` passes locally.
- [ ] Tests and examples use synthetic data only.
- [ ] No real project names, business terms, personal information, private addresses, credentials, screenshots, logs, or identifying metadata are included.
- [ ] Generated run artifacts are not committed.
- [ ] Every commit includes its own `CHANGELOG.md` update covering changes, verification and compatibility. / 每次提交均同步更新变更内容、验证情况与兼容性影响。
- [ ] The exact diff, commit messages, changelog and package contain public generic content only; no real business project information or partially redacted real artifacts. / 已核对差异、提交说明、更新记录和发布包，只含公开通用内容，禁止任何真实业务项目信息或部分脱敏的真实产物。

Pull requests that fail the repository-hygiene gate must not be merged.

未通过仓库卫生门禁的 Pull Request 禁止合并。
