# UI Testing Knowledge

[English](#english) | [中文](#中文)

## English

This is the single source for reusable UI testing methods used by an AI caller. Read the entries relevant to the current claim before planning or executing a test. The CLI and MCP runner do not load these pages or update knowledge automatically; a caller must include this index in its own task guidance.

Entries describe decision rules, not additional runner capabilities or verified product behavior. Keep real run evidence and business-specific knowledge in the caller's private workspace under [Privacy](../PRIVACY.md). Only abstract methods and purpose-built synthetic reproductions belong here.

For recurring tests, start with [UIK-017](HYBRID.md#uik-017-en) to choose a reviewed script or bounded assistance from the calling agent's model.

### Find the relevant entry

| Trigger or search terms | Entry |
|---|---|
| Shared client, multiple agents, human takeover | [UIK-001: One UI operator](EXECUTION.md#uik-001-en) |
| Module, filter, stale target, empty search | [UIK-002: Rebind the current target](EXECUTION.md#uik-002-en) |
| Keyboard, focus, confirmation, cancellation | [UIK-003: Prove action acceptance](EXECUTION.md#uik-003-en) |
| Save, exit, persistence, upload, Cancel | [UIK-004: Establish a save control](EXECUTION.md#uik-004-en) |
| Race, debounce, throttling, late response | [UIK-005: Qualify a race attempt](EXECUTION.md#uik-005-en) |
| Edit, undo, object removal, restoration | [UIK-006: Restore the exact test change](EXECUTION.md#uik-006-en) |
| Launch, exit, version, first use, cold start | [UIK-007: Separate lifecycle evidence](EXECUTION.md#uik-007-en) |
| Preferences, cache, path, remount | [UIK-008: Read back preferences](EXECUTION.md#uik-008-en) |
| DOM, accessibility, module coverage, masked identity | [UIK-009: Bound assertion meaning](EVIDENCE.md#uik-009-en) |
| ROI, pixel difference, tooltip, overlay | [UIK-010: Qualify visual comparisons](EVIDENCE.md#uik-010-en) |
| Sampling, clock origins, GIF/MP4, edited viewing cut | [UIK-011: Measure observation coverage](EVIDENCE.md#uik-011-en) |
| Screenshot, trace, logs, redaction | [UIK-012: Review the capture path](EVIDENCE.md#uik-012-en) |
| Outcome, prerequisite, expected rule, inconclusive | [UIK-013: Separate outcome axes](EVIDENCE.md#uik-013-en) |
| SHA, manifest, review snapshot, freeze | [UIK-014: Preserve evidence identity](EVIDENCE.md#uik-014-en) |
| Retry, fallback, interruption, cleanup ownership | [UIK-015: Bound recovery attempts](EXECUTION.md#uik-015-en) |
| New lesson, correction, maintenance | [UIK-016: Keep knowledge current](#uik-016-en) |
| No model, deterministic recipe, model fallback | [UIK-017: Run scripts first](HYBRID.md#uik-017-en) |

<a id="uik-016-en"></a>
### UIK-016 — Keep knowledge current

**Trigger:** Before a UI task, at closeout, or after a correction changes a testing decision.

**Practice:** At startup, search this index and read only matching entries. Before closeout, decide whether a reviewed finding adds a reusable method or corrects an existing one. Search for overlap, update the existing entry first, and add a new entry only when needed. Keep unverified causes, version-specific observations, and execution history in the private report. Knowledge maintenance follows the user's authorized scope; it does not grant authority for future data changes, deletion, publication, or other external actions.

**Review:** Each entry needs a trigger, changed decision, acceptance evidence, and a limit. Distinguish user-confirmed preferences, reviewed methods, and synthetic reproductions actually executed. For a claimed synthetic validation, reference the synthetic fixture and its check command; a prose review alone does not verify runtime support. Remove identifying context by deriving an abstract method or inventing a reproduction, never by copying a partially masked business report. Keep the private source-to-lesson mapping private.

**Acceptance:** Read back the changed entry, its English/Chinese counterparts, and the index link. Check UTF-8, reachable links, capability accuracy, and privacy; run the checks required by [Development](../DEVELOPMENT.md). Obtain an independent read-only review when the change affects consequential decisions or evidence claims. Report which entries changed. A closeout with no new reusable lesson needs no artificial addition.

**Limit:** These instructions guide the calling AI. They are not a background learning service, a scheduler, or a new test-case schema. This initial collection records reviewed methods; it does not claim that each scenario has an automated synthetic test.

### Entry shape

Use a stable `UIK` identifier and anchors for both languages. Keep the detailed method in one entry; other guidance should link to it.

```text
ID and title
Trigger: when the method changes a decision
Practice: action and required evidence
Acceptance: what supports the conclusion
Limit: what the evidence does not establish
Basis: reviewed method, confirmed preference, or executed synthetic reproduction
```

---

## 中文

这里是供调用方 AI 使用的通用 UI 测试方法唯一来源。设计或执行测试前，只读与当前待验证结论相关的条目。CLI 和 MCP 执行器不会自动读取这些页面或更新知识；调用方需要在自己的任务指引中接入本索引。

条目是决策方法，不代表执行器新增能力或产品行为已被验证。真实执行证据和业务专用知识按[隐私要求](../PRIVACY.md)留在调用方私有工作区；这里仅保存抽象方法和专门编造的复现。

重复回归先按 [UIK-017](HYBRID.md#uik-017-zh) 选择已评审脚本，或由调用方 agent 使用模型进行有边界的协助。

### 按场景检索

| 触发场景或关键词 | 条目 |
|---|---|
| 共享客户端、多 agent、人工接管 | [UIK-001：唯一 UI 操作者](EXECUTION.md#uik-001-zh) |
| 模块、筛选、旧目标、搜索为空 | [UIK-002：重新绑定当前目标](EXECUTION.md#uik-002-zh) |
| 键盘、焦点、确认、取消 | [UIK-003：证明动作受理](EXECUTION.md#uik-003-zh) |
| 保存、退出、持久化、上传、取消 | [UIK-004：建立普通保存对照](EXECUTION.md#uik-004-zh) |
| 竞态、防抖、节流、迟到响应 | [UIK-005：确认竞态尝试成立](EXECUTION.md#uik-005-zh) |
| 编辑、撤销、删除对象、恢复 | [UIK-006：精确恢复本轮改动](EXECUTION.md#uik-006-zh) |
| 启动、退出、版本、首次使用、冷启动 | [UIK-007：分开验证生命周期](EXECUTION.md#uik-007-zh) |
| 偏好、缓存、路径、重新挂载 | [UIK-008：读回偏好设置](EXECUTION.md#uik-008-zh) |
| DOM、可访问性、模块覆盖、身份遮挡 | [UIK-009：限定断言含义](EVIDENCE.md#uik-009-zh) |
| ROI、像素差、提示框、覆盖层 | [UIK-010：限定视觉比较范围](EVIDENCE.md#uik-010-zh) |
| 采样、时钟原点、GIF/MP4、缩短观看版 | [UIK-011：实测观察覆盖](EVIDENCE.md#uik-011-zh) |
| 截图、Trace、日志、脱敏 | [UIK-012：检查采集链路](EVIDENCE.md#uik-012-zh) |
| 结论、前置条件、预期规则、证据不足 | [UIK-013：分开记录结论维度](EVIDENCE.md#uik-013-zh) |
| SHA、清单、审阅快照、冻结 | [UIK-014：保持证据身份一致](EVIDENCE.md#uik-014-zh) |
| 重试、替代方案、中断、收尾归属 | [UIK-015：限定恢复尝试](EXECUTION.md#uik-015-zh) |
| 新经验、纠正、持续维护 | [UIK-016：持续更新知识](#uik-016-zh) |
| 无模型、确定性步骤、模型辅助 | [UIK-017：优先执行脚本](HYBRID.md#uik-017-zh) |

<a id="uik-016-zh"></a>
### UIK-016 — 持续更新知识

**触发：** UI 任务开始前、收尾时，或某次纠正改变了测试决策后。

**做法：** 开始时搜索索引，只读命中条目。收尾前判断已复核的发现是否增加了可复用方法，或纠正了已有知识。先查重，优先更新原条目，确有必要才新增。未经证实的原因、版本限定现象和执行历史留在私有报告。知识维护遵循用户已授权范围，不授予未来的数据修改、删除、发布或其他外部操作权限。

**复核：** 每条包含触发条件、改变的决策、验收证据和适用限制。区分用户确认的偏好、已审阅的方法、实际执行过的虚构复现。声称完成虚构验证时，须引用虚构夹具及检查命令；仅审阅文字不能证明运行时支持。通过抽象方法或编造复现去掉可识别上下文，不能复制仅做部分遮挡的业务报告。真实来源与经验的对应关系留在私有工作区。

**验收：** 回读改动条目、中英对应内容及索引链接，检查 UTF-8、链接可达、能力描述准确性和隐私，并运行[开发指南](../DEVELOPMENT.md)要求的检查。影响重要决策或证据结论的改动安排独立只读复核。交付时说明更新了哪些条目。没有新经验时不为增加数量而新增。

**限制：** 这些指引由调用方 AI 执行，不是后台自学习服务、定时任务或新的用例格式。当前首批条目属于已审阅的方法，不代表每个场景都有自动化虚构测试。

### 条目结构

使用稳定的 `UIK` 编号及中英锚点。详细方法只维护在一个条目中，其他指引仅引用。

```text
编号与标题
触发：何时会改变决策
做法：动作及所需证据
验收：什么证据支持结论
限制：这些证据不能证明什么
依据：已审阅方法、已确认偏好或已执行的虚构复现
```
