# Release Guide / 发布指南

[English](#english) | [中文](#中文)

## English

The project is not yet published to the npm registry. This guide defines the release gate without claiming that publishing automation already exists.

### Versioning

Use semantic versioning:

- Patch: compatible fixes and documentation corrections.
- Minor: backward-compatible actions, tools or fields.
- Major: incompatible CLI, case schema, MCP contract or result changes.

Before `1.0.0`, explicitly document compatibility changes even when semantic versioning permits minor-version breakage.

### Pre-release checklist

1. Confirm working tree and intended commit history.
2. Review dependency changes and licenses.
3. Update version in `package.json` and lockfile together.
4. Update bilingual documentation and roadmap status.
5. Run `npm ci` from a clean environment.
6. Run `npm run check`.
7. Run `npm audit` and assess every finding.
8. Run repository hygiene with the private deny-list configured.
9. Inspect package contents with `npm pack --dry-run --json`.
10. Confirm tests, source-only fixtures and no artifacts are packaged.
11. Confirm CI is green on the exact release commit.
12. Create release notes describing behavior, compatibility, security and migration.

### Package contents

`package.json` currently includes only compiled runtime files, README and LICENSE. Test files are explicitly excluded from `dist` packaging. Always verify the dry-run list rather than relying on this statement.

### Release credentials

- Use a dedicated publisher identity with least privilege.
- Require multifactor authentication when supported.
- Never store tokens in the repository, cases, npm configuration committed to Git, logs or CI output.
- Prefer short-lived trusted publishing when a future registry workflow supports it.

### GitHub release

Release notes should include:

- Version and date.
- Supported environment evidence.
- Added, changed, fixed and removed behavior.
- Case schema or MCP contract changes.
- Security implications.
- Upgrade and rollback instructions.
- Known limitations.

Do not attach real test artifacts.

### Rollback

Do not delete a published version as a routine rollback. Publish a corrected version or deprecate the affected version according to registry policy. Preserve an auditable explanation without exposing sensitive data.

## 中文

项目尚未发布到npm公共仓库。本指南定义发布门禁，但不宣称已经存在发布自动化。

### 版本规则

使用语义化版本：

- Patch：兼容修复和文档修正。
- Minor：向后兼容的新动作、工具或字段。
- Major：不兼容CLI、用例Schema、MCP契约或结果变化。

在`1.0.0`之前，即使语义化版本允许Minor破坏，也必须明确记录兼容变化。

### 发布前清单

1. 确认工作树和预期提交历史。
2. 审核依赖变化及许可证。
3. 同时更新`package.json`和锁文件版本。
4. 更新双语文档和路线图状态。
5. 在干净环境运行`npm ci`。
6. 运行`npm run check`。
7. 运行`npm audit`并评估全部发现。
8. 配置私有禁词后运行仓库卫生门禁。
9. 使用`npm pack --dry-run --json`检查包内容。
10. 确认只打包运行所需文件和虚构材料，不含证据。
11. 确认精确发布提交的CI为绿色。
12. 编写包含行为、兼容、安全和迁移的发行说明。

### 包内容

当前`package.json`只包含编译运行文件、README和LICENSE，并明确排除`dist`中的测试文件。每次发布必须以dry-run列表为准。

### 发布凭据

- 使用最小权限专用发布身份。
- 支持时要求多因素认证。
- 禁止把Token写入仓库、用例、已提交npm配置、日志或CI输出。
- 未来Registry支持时优先短期可信发布。

### GitHub发行说明

应包含版本和日期、支持环境证据、新增/变化/修复/移除、Schema或MCP变化、安全影响、升级和回滚、已知限制。禁止附加真实测试证据。

### 回滚

不要把删除已发布版本作为常规回滚。根据Registry策略发布修正版或弃用问题版本，保留可审计且不含敏感数据的说明。
