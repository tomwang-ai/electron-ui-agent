# Contributing

[English](#english) | [中文](#中文)

## English

Contributions are welcome when they remain generic and reproducible with synthetic data.

### Public-only GitHub submissions

All submissions must be public and generic. **No real business project information is permitted**, including names, workflows, selectors, identifiers, configuration, internal paths/addresses, people, data, credentials or scan evidence. This applies to files, changelog entries, commit messages, PR content, attachments and packages. Partial redaction does not make a real project artifact acceptable; create synthetic examples from scratch. Check the exact staged diff and package contents before each commit/push, run the hygiene gate, and obtain human privacy review before merge.

## Required checks

Run:

```bash
npm ci
npm run check
```

Every contribution must exclude real project names, business concepts, organization details, personal information, credentials, private addresses, private test cases, screenshots, logs, and generated execution artifacts. Convert a real failure into the smallest synthetic reproduction before submitting it.

Pull requests must not be merged unless automated repository-hygiene checks pass and a reviewer confirms the change remains business-neutral and non-identifying. Maintainers may configure additional private deny-list terms through the `REPOSITORY_HYGIENE_DENYLIST` CI secret; those terms must never be committed.

Keep changes focused. New dependencies require a concrete capability that cannot be covered safely by the standard library or current dependencies.

Every commit, including documentation-only changes, must add a matching entry to [CHANGELOG.md](CHANGELOG.md) in that same commit. Describe what changed, how it was verified (or why verification is not applicable), and compatibility impact. Preserve earlier entries. Entries must remain generic and must not include private execution evidence.

---

## 中文

欢迎提交贡献，但所有内容必须保持通用，并且可以使用虚构数据复现。

### GitHub 提交必须公开通用

所有提交只能包含公开、通用内容，**禁止任何真实业务项目信息**：名称、流程、选择器、标识、配置、内部路径和地址、人员、数据、凭据及扫描证据均不得提交。范围覆盖文件、更新记录、提交说明、PR 内容、附件和发布包。部分脱敏不代表真实项目产物可以公开，示例必须从零虚构。每次提交和推送前检查准确的暂存差异与打包内容，运行卫生门禁，合并前必须完成人工隐私复核。

### 必须通过的检查

```bash
npm ci
npm run check
```

所有贡献都必须排除真实项目名称、业务概念、组织信息、个人信息、凭据、私有地址、私有测试用例、截图、日志和运行产物。提交前必须把真实问题转换成最小虚构复现。

只有自动仓库卫生检查通过，并且审核者确认变更与业务隔离且不可识别后，Pull Request 才能合并。维护者可以通过 CI Secret `REPOSITORY_HYGIENE_DENYLIST` 配置额外私有禁词，禁止提交这些禁词本身。

保持变更聚焦。只有标准库和现有依赖无法安全实现某项明确能力时，才允许增加新依赖。

每次提交（包括仅文档变更）必须在同一提交中向 [CHANGELOG.md](CHANGELOG.md) 新增对应记录，说明本次变更、验证情况（或不适用原因）与兼容性影响。保留已有记录，确保更新可追溯；记录必须通用，不得包含私有执行证据。
