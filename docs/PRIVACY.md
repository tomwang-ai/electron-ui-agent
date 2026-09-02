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

## Scope of prohibited information

The prohibition covers repository files and history, tests, fixtures, examples, generated samples, documentation, Issue and Pull Request bodies, comments, commit messages, author metadata controlled by maintainers, release notes and downloadable assets.

Examples of prohibited content include real product/project names, organization names, personal names, usernames, private email addresses, credentials, internal hostnames, private IP addresses, local user paths, customer data, screenshots, traces and copied business workflows.

Public platform-generated account metadata is outside repository file control, but maintainers must not duplicate private identity information into repository content.

## Safe synthetic reproduction

Replace a real report with:

- A generic application title.
- Example-domain email addresses.
- Documentation-reserved or placeholder addresses rather than private infrastructure.
- Invented UI labels and records.
- A minimal synthetic Electron fixture.
- Sanitized error categories instead of raw logs.

Synthetic means the data was invented for the reproduction, not merely partially masked.

## Contribution review

Before merge, review both the final diff and commit history. Confirm that ignored artifacts are not force-added, screenshots contain no identifying UI, examples do not encode a recognizable workflow, and documentation does not reveal internal deployment details.

If a violation is found before merge, replace it with synthetic content. If sensitive content reaches public history, stop distribution, assess exposure, rotate affected credentials, and follow an appropriate history-remediation process. Do not assume a follow-up deletion removes already-fetched copies.

## Private deny-list

`REPOSITORY_HYGIENE_DENYLIST` accepts newline-separated terms. Configure it as a private CI secret. The script reports only “configured private term” and file path, not the matching term. Do not echo or commit the secret.

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

### 禁止信息范围

范围包括仓库文件和历史、测试、夹具、示例、生成样本、文档、Issue和PR正文、评论、维护者可控的提交信息和作者元数据、发行说明及下载附件。

禁止内容包括真实产品/项目名、组织名、个人姓名、用户名、私有邮箱、凭据、内部主机名、私网IP、本机用户路径、客户数据、截图、Trace和复制的业务流程。

平台自动生成的公开账号元数据不受仓库文件控制，但维护者不得把私有身份信息再次写入仓库内容。

### 安全虚构复现

把真实报告替换为通用应用标题、示例域名邮箱、文档保留地址或占位符、虚构UI标签和记录、最小虚构Electron夹具，以及脱敏错误类别。虚构意味着专门为复现创造，而不是只做部分遮挡。

### 贡献审核

合并前同时审核最终Diff和提交历史，确认未强制添加忽略证据、截图没有可识别UI、示例不编码可识别流程、文档不泄露内部部署细节。

合并前发现污染应替换为虚构内容。敏感内容进入公开历史后，应停止传播、评估暴露、轮换受影响凭据并执行适当历史修复。后续删除不能撤回已被其他人获取的副本。

### 私有禁词

`REPOSITORY_HYGIENE_DENYLIST`接受换行分隔词条，应配置为私有CI Secret。脚本只报告“configured private term”和文件路径，不显示命中词。禁止回显或提交该Secret。
