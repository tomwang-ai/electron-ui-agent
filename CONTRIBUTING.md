# Contributing

[English](#english) | [中文](#中文)

## English

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

---

## 中文

欢迎提交贡献，但所有内容必须保持通用，并且可以使用虚构数据复现。

### 必须通过的检查

```bash
npm ci
npm run check
```

所有贡献都必须排除真实项目名称、业务概念、组织信息、个人信息、凭据、私有地址、私有测试用例、截图、日志和运行产物。提交前必须把真实问题转换成最小虚构复现。

只有自动仓库卫生检查通过，并且审核者确认变更与业务隔离且不可识别后，Pull Request 才能合并。维护者可以通过 CI Secret `REPOSITORY_HYGIENE_DENYLIST` 配置额外私有禁词，禁止提交这些禁词本身。

保持变更聚焦。只有标准库和现有依赖无法安全实现某项明确能力时，才允许增加新依赖。
