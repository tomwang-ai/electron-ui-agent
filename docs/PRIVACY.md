# Privacy and Business Isolation

[English](#english) | [中文](#中文)

## English

The public repository contains only generic execution code and synthetic examples. Real application configuration, product terminology, selectors, credentials, cases, screenshots, traces, logs, and reports must remain in a separate private workspace.

```text
public runner <- private test project <- private runtime secrets
```

The public runner must never import from, copy, package, or publish the private project. Runtime evidence is written to ignored local directories and no telemetry is sent.

## Merge gate

Every pull request must pass `npm run check:hygiene` and human review. The scanner rejects common local user paths, private network addresses, credential-shaped tokens, and non-example email addresses. Maintainers can provide additional organization-specific terms through the private `REPOSITORY_HYGIENE_DENYLIST` CI secret without committing those terms.

Automated scanning is not proof that content is safe. Contributors must convert real failures into synthetic reproductions and reviewers must reject identifying or business-specific material even when a scanner does not recognize it.

Do not attach raw screenshots, traces, logs, or cases to public Issues. Security-sensitive reports should use the repository's private security advisory channel.

---

## 中文

公开仓库只能包含通用执行代码和虚构示例。真实应用配置、产品术语、选择器、凭据、用例、截图、Trace、日志和报告必须保存在独立私有工作区。

```text
公开执行器 <- 私有测试项目 <- 私有运行时密钥
```

公开执行器不得导入、复制、打包或发布私有项目内容。运行证据写入 Git 忽略的本地目录，项目不发送遥测数据。

### 合并门禁

每个 Pull Request 都必须通过 `npm run check:hygiene` 和人工复核。扫描器会拒绝常见本机用户路径、私网地址、疑似凭据 Token 和非示例邮箱。维护者可以通过私有 CI Secret `REPOSITORY_HYGIENE_DENYLIST` 增加组织内部禁词，禁止把禁词本身提交到仓库。

自动扫描不能证明内容绝对安全。贡献者必须把真实问题转换成最小虚构复现；即使扫描器没有识别，审核者也必须拒绝任何可识别或业务相关内容。

禁止在公开 Issue 中附加原始截图、Trace、日志或用例。涉及安全的报告应使用仓库的私有安全公告渠道。
