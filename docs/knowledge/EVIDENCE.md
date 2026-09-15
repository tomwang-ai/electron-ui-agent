# UI Evidence Methods

[English](#english) | [中文](#中文) · [Index / 索引](README.md)

## English

These reviewed methods apply to the caller's private report. The current [runner result](../ARTIFACTS.md) retains its existing schema; the richer judgments below are not new fields or automatic checks.

<a id="uik-009-en"></a>
### UIK-009 — Bound assertion meaning

**Trigger:** A locator, accessibility extraction, or text check is used as proof of a visible list, complete report, usable control, or affected module.

**Practice and acceptance:** State the inspected scope. Establish a current unique target and inspect visibility, enabled state, relevant content, and layout only to the extent required by the claim. Record whether bounds/offscreen information is available for accessibility observations.

Record the functional surface and the module or context actually tested separately. Shared implementation suggests candidate impact; it does not prove reproduction in every module. If privacy masking hides target identity, retain permitted binding evidence and identify it as a nonvisual source; an added caption is not identity proof. Visible export options establish option availability, not execution or correctness of an export.

Accessibility trees can retain hidden panels and collapsed controls. A navigation label or input node merely appearing in the tree does not prove that view is active. Require a current route, verified visible state, focus, or accepted interaction appropriate to the claim; refresh cached bindings after window or dialog changes.

Positive element dimensions do not exclude clipping by a collapsed ancestor or an overlay. When coordinate input depends on visibility, check viewport bounds and the intended hit point. Framework click or double-click listeners do not establish a business navigation action; verify the relevant handler or an observed route transition before retrying the same gesture.

**Limit:** A node count is not the visible row count; partial text does not prove complete loading or correct layout. In the current runner, `assertText` uses `hasText`, not whole-text equality; `assertVisible` alone is not a full usability/layout check. `assertValue` compares the input value exactly, not durable persistence. See [runner source](../../src/runner.ts).

<a id="uik-010-en"></a>
### UIK-010 — Qualify visual comparisons

**Trigger:** Image differences are used to prove a defect, unchanged state, or restoration.

**Practice and acceptance:** Fix the target identity, reference source, region of interest (ROI), scale, display mode, and relevant overlays. Record actual capture times and compare equivalent regions. Isolate changes to tooltips or overlays when attributing differences; retain unexplained differences explicitly.

**Limit:** Zero difference within one ROI does not prove whole-image or persisted-state equality. Changing several overlays together cannot attribute all differences to one overlay. The runner has no built-in ROI comparison or automatic redaction; these require a permitted external evidence method.

<a id="uik-011-en"></a>
### UIK-011 — Measure observation coverage

**Trigger:** Watching an export destination, waiting for cancellation, measuring responsiveness, or comparing timed samples.

**Practice and acceptance:** Preserve timestamp precision and identify each clock origin. Report actual first/last observations, intervals, maximum gaps, read errors, and late spot checks. Distinguish continuous observation from discrete samples, and elapsed observation time from operation duration.

Before encoding or comparing action and frame times, verify relative timestamps against absolute timestamps and their declared origins. A reused capture closure may retain an earlier origin even when the action log starts a new clock. If a constant offset is established by every available timestamp pair, preserve the original records and publish a conversion sidecar with both origins, the offset direction, and checked intervals. Do not silently rewrite source times or subtract clocks whose relationship remains unverified.

For motion evidence assembled from screenshots, retain only newly captured source frames that are authorized for retention and have passed privacy review; these may be the redacted encoding inputs. Original frames remain subject to the applicable capture and retention rules. Keep acquisition times, action events, and hashes. Identify discrete sampling, crop rearrangement, and evidence annotations in the presentation. Repeating a frame holds the last observation; it does not establish what happened between samples. An animation reconstructed from assertions is an illustration, not a recording of the application.

When motion evidence is requested, link each reproduced claim to its actual playable media and list requested claims without a qualified clip separately. For an edited viewing cut, keep a distinct version using the original sample gaps, label omitted intervals in the cut, and retain its mapping to source frames and clock references. Verify that added annotations leave the retained source pixel blocks unchanged before encoding. The delivery index should state unrecorded steps and evidence limits and link the media and required sidecars; check those links before delivery.

Validate the encoded media by decoding it: inspect state transitions, frame timestamps, container duration, palette changes, and any requested final hold. Report measured duration and timing quantization separately from requested values. A successful encoder exit does not prove correct playback. Use interior regions for lossy-codec color checks, then inspect the actual controls and small changes needed by the claim; whole-frame similarity alone can hide a missing mark.

**Limit:** Planned observation length is not achieved coverage. Zero observed files does not prove server-side cancellation. Two process snapshots do not establish exact exit/start times; local and remote clocks cannot be subtracted without a justified clock relationship.

<a id="uik-012-en"></a>
### UIK-012 — Review the capture path

**Trigger:** Producing or inspecting screenshots, traces, logs, assertion failures, or reports.

**Practice and acceptance:** Apply [Privacy](../PRIVACY.md) before capture. For private runs, check the applicable authorization and retention rules, automatic captures, tool return content, and storage destinations. Prefer an allowlist of necessary output fields, aliases, booleans, and aggregate counts. Verify that the material delivered to the reviewer is safe at the actual output boundary.

A dialog or toolbar rectangle is not by itself a safe crop: transparent and translucent surfaces retain background pixels. Do not rely on brightness thresholds, color thresholds, or a synthetic dark-image example to certify arbitrary private pixels as removed. When an image cannot be safely certified, deliver bounded non-image assertions instead.

If an authorized normal UI action can create a neutral backdrop, such as an empty result list from a synthetic query, verify that backdrop and the actual compositing layers before capture. Recheck the boundary after every relevant transition. Every frame intended for retention or delivery must meet the content and boundary requirements, including automatic overlays and intermediate transitions; unsafe frames must not enter persistence or delivery. Place only verified safe crops on a new opaque canvas and label any rearrangement; do not treat an earlier sample approval as approval of later content.

Verify image-transform semantics with synthetic data before relying on them. Some pipelines, including Sharp, apply only one resize per pipeline; a shrink-and-enlarge sequence requires materializing the first result and starting a new pipeline. Even a correctly executed pixelation algorithm is not proof of anonymization. Review the final encoded output, and use opaque replacement or omission for content that must not remain recoverable. Synthetic checks validate only the tested transformation, not a real crop's contents or privacy.

**Limit:** Omitting a `screenshot` step does not disable trace screenshots/snapshots, console capture, or best-effort failure screenshots. Assertion errors can expose expected and actual values. A tool that returns the original before cropping has already exposed it; later masking cannot retract it. The runner has no capture-disable or redaction switch. If the capture path cannot meet the required privacy boundary, use a verified suitable adapter or report the obstacle. A hash proves integrity, not privacy.

<a id="uik-013-en"></a>
### UIK-013 — Separate outcome axes

**Trigger:** Summarizing a run, attributing failure, or continuing from an earlier report.

**Practice and acceptance:** Separately state the product conclusion, whether the intended scenario executed, tool/environment failures, and restoration outcome. For a product conclusion, identify the qualified attempt and acceptance evidence, or the precise missing condition. Mark historical results, user-deferred scope, and structural observations with their sources; do not silently convert them into current verified results or pending work.

A prerequisite warning proves only that the gate was reached. If the intended editor or workflow cannot be entered, record the missing precondition rather than counting the target defect as reproduced or fixed; establishing that precondition remains subject to the existing data authorization. When behavior is observable but the expected product rule is unverified, report the observation separately from a confirmed defect verdict.

**Limit:** Runner `passed`/`failed` describes execution according to recorded errors, not an independent product verdict. A confirmed defect can result from a successfully completed investigation; insufficient evidence proves neither a defect nor a fix. Distinguish a missing scenario precondition, a tool capability gap, and information that actually requires a user answer. These are report distinctions, not additional runner status values.

<a id="uik-014-en"></a>
### UIK-014 — Preserve evidence identity

**Trigger:** Revising a report, building an evidence manifest, independent review, or freezing a delivery.

**Practice and acceptance:** Map each current file to its current digest. Label earlier hashes as historical review snapshots with their stage. Finalize content, build a manifest, review it independently where warranted, and rebuild affected references after further edits. Exclude a manifest's own digest from its contents; keep its final digest in a separate delivery record. Store later review records outside the frozen set or publish an explicitly versioned set under applicable authorization.

**Limit:** A previous digest is not the digest of a revised file. Without the old bytes, do not claim a complete byte-level diff. Integrity checks do not validate the product conclusion or the privacy of the content. Do not silently rewrite a frozen evidence set to make later notes appear contemporaneous.

---

## 中文

以下已审阅方法用于调用方的私有报告。当前[执行器结果](../ARTIFACTS.md)保持现有格式；下文更细的判断不是新增字段或自动检查。

<a id="uik-009-zh"></a>
### UIK-009 — 限定断言含义

**触发：** 使用定位器、可访问性提取或文本匹配证明可见列表、完整报告、可用控件或受影响模块。

**做法与验收：** 说明检查范围，建立当前唯一目标，仅按待验证结论所需检查可见性、启用状态、相关内容和布局。可访问性观察须注明是否提供边界或屏外状态信息。

分别记录功能归属与实际复测的模块或上下文。共享实现只能提示候选影响范围，不能证明每个模块都已复现。隐私遮挡隐藏目标身份时，应保留获准的绑定证据，并注明它属于非视觉来源；后加字幕不能充当身份证据。导出选项可见只证明选项可用，不证明导出已执行或结果正确。

可访问性树可能保留隐藏面板和折叠控件。树中出现导航文字或输入节点，不能证明该视图处于活动状态。应按断言需要核验当前路由、可见状态、焦点或已受理的交互；窗口或弹窗变化后刷新缓存绑定。

元素尺寸大于零，仍可能被折叠祖先裁剪或被覆盖层挡住。坐标输入依赖可见性时，要检查视口边界和目标命中点。框架注册的单击或双击监听，不证明存在业务导航动作；重复手势前应核对对应处理逻辑或实际路由变化。

**限制：** 节点数不是可见行数，局部文字不能证明完整加载或布局正确。当前 `assertText` 使用 `hasText`，不是完整文本相等；`assertVisible` 单独不能证明可用性或布局全部正确；`assertValue` 精确比较输入值，不证明持久化，详见[执行器源码](../../src/runner.ts)。

<a id="uik-010-zh"></a>
### UIK-010 — 限定视觉比较范围

**触发：** 用图像差异证明缺陷、状态未变或已恢复。

**做法与验收：** 固定目标身份、参考来源、感兴趣区域（ROI）、缩放、显示模式和相关覆盖层。记录实际采集时间，比较同等区域。归因时单独控制提示框或覆盖层变化，明确保留未解释差异。

**限制：** 某个 ROI 差异为零，不能证明整图或持久化状态一致。同时改变多个覆盖层，不能将全部差异归到其中一个。执行器没有内置 ROI 比较或自动脱敏，需要获准的外部取证方法。

<a id="uik-011-zh"></a>
### UIK-011 — 实测观察覆盖

**触发：** 监测导出目录、等待取消、测量响应或比较定时采样。

**做法与验收：** 保留时间戳精度，明确各个时间原点。报告实际首末观察时间、间隔、最大空档、读取错误和后续离散检查。区分连续观察与离散采样，以及已观察时长与操作耗时。

编码或比较动作与帧时间前，用绝对时间戳及声明的原点核验相对时间。复用的采集闭包可能保留旧原点，而动作日志已启用新时钟。所有可用时间戳对均支持固定偏移时，保留原始记录，另附换算文件，说明两个原点、偏移方向和已核验的间隔。不得悄悄改写源时间，也不能相减关系尚未核实的时钟。

用截图组成动态证据时，仅保留获准留存且已通过隐私核验的本轮新采集源帧，可以是脱敏后的编码输入；原始帧仍遵循适用采集及保留规则。保留采集时间、动作事件和哈希。在展示中注明离散采样、裁剪重排和取证注释。重复一帧只是保持上次观察结果，不能证明采样间隙发生了什么。根据断言重建的动画属于示意图，不是应用录屏。

用户要求动态证据时，每个已复现结论都应对应实际可播放的媒体，要求验证但尚无合格片段的项目单独列出。制作缩短观看版时，另保留使用原采样间隔的版本，在观看版内标明省略间隔，并保留到源帧及时间参照的映射。编码前核验新增注释没有改变保留的源像素块。交付索引应说明未录到的步骤及证据限制，链接媒体和必要说明文件，并在交付前检查链接。

通过解码验证最终媒体：检查状态转换、帧时间戳、容器时长、调色板变化及请求的末帧停留。实测时长和时间量化应与请求值分开记录。编码器成功退出不证明播放正确。有损编码的颜色检查应使用区域内部，再检查结论所需的实际控件和细小变化；整帧相似度可能掩盖缺失标记。

**限制：** 计划时长不等于实际覆盖。没有观察到文件不证明服务端已取消。两个进程快照不能确定精确退出或启动时间；没有可信时钟关系时，不能直接相减本地和远端时间。

<a id="uik-012-zh"></a>
### UIK-012 — 检查采集链路

**触发：** 生成或查看截图、Trace、日志、断言失败信息或报告。

**做法与验收：** 采集前落实[隐私要求](../PRIVACY.md)。私有执行需核对适用授权及保留规则、自动采集、工具返回内容和存储位置。优先输出必要字段的允许集合、别名、布尔值和聚合计数。在真正输出的位置核验交给复核者的内容安全性。

弹窗或工具栏的矩形边界本身不能证明裁剪安全：透明或半透明表面仍保留背景像素。不得依靠亮度阈值、颜色阈值或虚构暗图样例，证明任意真实隐私像素已被移除。无法确认图片安全时，改用范围明确的非图片断言。

获准的正常界面操作若能建立中性背景，例如用虚构查询得到空列表，应在采集前核验该背景及实际合成图层。相关状态切换后重新检查边界。每个拟保存或交付帧均须满足内容及边界要求，自动浮层和过渡帧也须复核；不安全帧不得进入持久化或交付。只把已验证安全的裁剪放到新建不透明画布上，并注明重排；不能把之前的小样放行视为后续内容也已通过。

依赖图片变换前，先用虚构数据核验其语义。部分处理链（包括 Sharp）每条链只应用一次缩放；先缩小再放大需要将第一步结果物化，并开启新处理链。即使像素化算法执行正确，也不证明完成匿名化。检查最终编码输出；必须不可恢复的内容应使用不透明替换或直接省略。虚构检查仅验证所测变换，不证明真实裁剪区域的内容或隐私安全。

**限制：** 不写 `screenshot` 步骤，不能关闭 Trace 截图及快照、控制台采集或尽力生成的失败截图。断言错误可能显示预期值与实际值。工具先回传原图再裁剪时，原图已经暴露，后续遮挡不能撤回。执行器没有关闭采集或自动脱敏开关。链路不满足所需隐私边界时，使用已核实的适用适配器或报告阻碍。哈希只证明完整性，不证明隐私通过。

<a id="uik-013-zh"></a>
### UIK-013 — 分开记录结论维度

**触发：** 汇总执行、判断失败原因或继续历史报告。

**做法与验收：** 分开写产品结论、目标场景是否执行、工具或环境故障，以及恢复结果。产品结论须指向条件成立的尝试和验收证据，或明确缺少的条件。历史结论、用户暂缓范围和结构性观察注明来源，不悄悄转成当前已验证结果或待办。

前置条件提示只证明触达了门禁。无法进入目标编辑器或流程时，应记录缺少的前提，不能将目标缺陷算作已复现或已修复；建立前提仍须遵循已有数据授权。能够观察到行为但预期产品规则尚未核实时，应将现象记录与确认缺陷的结论分开。

**限制：** 执行器 `passed`/`failed` 根据是否记录错误判断执行情况，不是独立产品结论。调查成功完成也可以发现真实缺陷；证据不足既不能证明缺陷，也不能证明修复。区分场景前提缺失、工具能力缺口和确实需要用户回答的信息。这些是报告中的区别，不是执行器新增状态值。

<a id="uik-014-zh"></a>
### UIK-014 — 保持证据身份一致

**触发：** 修改报告、建立证据清单、独立复核或冻结交付。

**做法与验收：** 当前文件对应当前摘要，旧摘要注明历史审阅阶段。先定稿内容，再建立清单，按需要独立复核；继续修改后重建受影响的引用。清单内部不记录自身摘要，最终摘要放在独立交付记录中。后续审阅记录置于冻结集合之外，或在适用授权下发布明确的新版本集合。

**限制：** 旧摘要不能代表改后的文件。没有旧原件时，不能声称完成全部字节差异比对。完整性检查不能验证产品结论或内容隐私；不能悄悄改写冻结证据，让后来的说明看似当时已有。
