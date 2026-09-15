# UI Execution Methods

[English](#english) | [中文](#中文) · [Index / 索引](README.md)

## English

These are reviewed methods for the calling AI. Use them with the selected controller's verified capabilities. They do not extend the [case format](../CASE_FORMAT.md); unsupported measurements need a suitable authorized adapter or an explicitly limited conclusion.

<a id="uik-001-en"></a>
### UIK-001 — One UI operator

**Trigger:** Several agents or a human share a running client.

**Practice and acceptance:** Assign one operator for that client. Other agents review code or permitted evidence without sending UI input. Transfer ownership explicitly before another operator acts; after human intervention, re-establish the current window, page, selection, and unsaved state. Record the operator and evidence source in the private report.

On resuming a task, re-check the assigned repository and role before using tools. Read-only reviewers must not fetch or switch branches, run builds, or rewrite evidence; `git fetch` updates repository metadata even when the working tree stays unchanged.

**Limit:** This is ownership per shared client, not a fixed team size. Independent read-only work can proceed where the user permits it; UI ownership does not create authority to control an existing session.

<a id="uik-002-en"></a>
### UIK-002 — Rebind the current target

**Trigger:** Navigation, module/filter changes, a reopened window, an empty search, or external interaction invalidates the previous view.

**Practice and acceptance:** Re-read the active module, filters, visible entry, and selected target. Establish a unique current binding before an action. Keep identifying values inside the approved private boundary; report aliases and the result of the binding check.

**Limit:** Stale accessibility nodes, a wrong filter, or lost focus can produce zero results. Zero matches alone does not establish absent data. Previous coordinates or selectors are hints until checked against the current state.

<a id="uik-003-en"></a>
### UIK-003 — Prove action acceptance

**Trigger:** Keyboard adjustment, save shortcuts, confirmation, quick cancellation, or closing a dialog.

**Practice and acceptance:** Verify focus and the actual value/state change. Observe acceptance separately from completion: for example, the expected confirmation appeared, the submitted value was received, and the resulting state was read back. Record evidence for the particular attempt being assessed.

After a cached-node or focus error, refresh the window binding and accessibility state before one bounded recovery attempt. If permitted, activate the verified target window explicitly. Read back the intended input or dialog transition; never reuse a stale index or count a setter exception as a product result.

Some native adapters derive coordinate geometry from snapshot image metadata. If geometry is unavailable, obtain a fresh snapshot with the adapter's required text and image metadata within the approved capture boundary; do not return or persist private pixels. Prove pointer acceptance and keyboard acceptance separately. A working click does not establish that subsequent typing reached the intended control.

**Limit:** A successful input call or no error message proves neither acceptance nor persistence. A later ordinary cancellation or cleanup cannot prove that the first rapid attempt was accepted.

<a id="uik-004-en"></a>
### UIK-004 — Establish a save control

**Trigger:** Testing lost edits, saving during navigation, exit/save races, or upload-and-cancel behavior.

**Practice and acceptance:** On authorized test data, perform an ordinary save with an observable acceptance signal, then leave and re-enter the same target to read back the saved value. Only after this control works, vary the timing or navigation condition while preserving other relevant conditions.

If a dialog can upload an item before its form is saved, observe the outer list and editor before upload, after upload, after Cancel, and after reopening the same bound target. Distinguish unsaved form fields from an independently completed upload. Verify the intended Cancel behavior before expecting rollback; a disagreement between lists does not by itself establish server persistence or failed deletion.

**Limit:** A failed control leaves the race claim unqualified; a restart used for recovery does not repair that missing control. Re-entry may also read a cache: when durable persistence is the claim, add evidence from an independent supported read path or a qualified restart.

<a id="uik-005-en"></a>
### UIK-005 — Qualify a race attempt

**Trigger:** Suspected out-of-order requests, late writes, debounce behavior, or cancellation while work is in flight.

**Practice and acceptance:** State the required overlap before the test. Collect evidence for input acceptance, the relevant operation being in flight, completion order, and final target state. Use bounded observations and distinguish a qualified attempt from an attempt that never entered the required window.

**Limit:** Fast typing, a throttling preset, source-code delays, or elapsed time alone does not prove overlap. Network timing/cancellation probes are not built-in runner actions. Without a permitted suitable probe, report the unverified timing condition instead of asserting a race defect or fix.

<a id="uik-006-en"></a>
### UIK-006 — Restore the exact test change

**Trigger:** Adding, editing, or removing a reversible test object.

**Practice and acceptance:** Capture the original state within the permitted boundary and establish a supported way to target and restore the exact change before editing. Use existing task authorization; seek clarification only for an unresolved destructive scope. After restoration, leave and re-enter the same target and check its identity, the changed object, and affected list state. Record restoration separately from the defect result.

**Limit:** Do not blindly use Undo, reset, clear-all, or removal of an unseen object. One restored object does not prove restoration of metadata, search history, selection, or preferences. Scope each additional restoration claim to its own evidence.

<a id="uik-007-en"></a>
### UIK-007 — Separate lifecycle evidence

**Trigger:** Startup, exit, relaunch, version qualification, first-use initialization, or duration claims.

**Practice and acceptance:** Verify process identity, executable/build identity, window readiness, page readiness, and target readiness separately. State the timing origin and observation source for each duration. Match a binary to a source commit only when supporting build provenance exists.

For first-use claims, distinguish the first recorded visit in an existing process, a component remount, and a verified cold start; record whether storage or prior visits remain relevant or unknown. Keep the target binding stable while comparing navigation contexts. A difference before and after visiting another view is a context comparison, not proof of cold-start behavior. Establish any stronger baseline only through supported actions within the authorized scope.

**Limit:** A changed PID, tool exit code, or version label does not establish normal application exit, saved state, source equivalence, or startup duration. The current runner launches its own application, uses the first Electron window, and attempts to close that application at the end; it does not select an existing or secondary window. See [architecture](../ARCHITECTURE.md).

<a id="uik-008-en"></a>
### UIK-008 — Read back preferences

**Trigger:** A test changes a setting, export destination, or other remembered value.

**Practice and acceptance:** Retain the original value privately, restore it using an authorized supported path, and separately verify the stored value and the value displayed after a normal component remount or qualified restart. Treat caching as a conditional implementation fact that needs evidence.

**Limit:** Do not guess an unknown original value or use direct storage edits without applicable authorization. Exact text equality, normalized path equivalence, and physical directory existence are different checks. Restoring a path preference does not require creating a missing directory.

<a id="uik-015-en"></a>
### UIK-015 — Bound recovery attempts

**Trigger:** A locator, automation adapter, or timing attempt fails, or an interrupted run resumes.

**Practice and acceptance:** Classify the obstacle, refresh the relevant state, and choose a supported alternative inside the same authorized scope. Set a stopping condition based on the risk and diagnostic value. Preserve which attempts qualified and which observations were missing.

After an interruption, inventory completed evidence and unfinished cleanup before repeating any test. Recheck process identity, including creation time, endpoint ownership, and the user's current session before a cleanup mutation; a recorded PID alone is insufficient. Do not replay an old UI baseline over later user changes or reopen a closed client just to clean up. Close only diagnostic resources whose run ownership is still established. Distinguish historical restoration records from fresh observations, and report any residue whose ownership or safe restoration cannot be established.

An authorized diagnostic controller may be a fallback when the current adapter cannot deliver input. Treat enabling a diagnostic endpoint or attaching a debugger as temporary instrumentation, not a read-only observation. Record the endpoint and debugger baseline first. Verify the target process, loopback binding, selected renderer, and a real input/readback roundtrip before testing. Record which endpoint, connection, and debugger attachment the run owns. Restore test state and network conditions, detach only the owned attachment, and close only endpoints created by the run. Verify that owned listeners are gone, reused endpoints retain their baseline, and the original client remains alive. Limit the controller to predefined diagnostic operations allowed by tool policy and existing task authorization; this does not permit arbitrary application JavaScript, internal business-handler invocation, or bypassing public UI to change business state. This is a caller procedure, not an additional runner or MCP capability.

**Limit:** Repetition is useful only when it adds evidence. Do not expand to additional real records, change product code, bypass authentication, or introduce arbitrary JavaScript execution to overcome an obstacle. If no authorized method can establish the claim, report the precise remaining gap.

---

## 中文

以下是供调用方 AI 使用的已审阅方法，应结合所选控制器经核实的能力执行。它们不扩展[用例格式](../CASE_FORMAT.md)；不支持的测量需要合适且已获授权的适配器，否则应明确缩小结论范围。

<a id="uik-001-zh"></a>
### UIK-001 — 唯一 UI 操作者

**触发：** 多个 agent 或人工共用正在运行的客户端。

**做法与验收：** 同一客户端只指定一个操作者，其他 agent 只读代码或允许查看的证据，不发送 UI 输入。换人前明确移交控制权；人工介入后重新确认窗口、页面、选中目标及未保存状态。操作者和证据来源记录在私有报告中。

恢复任务上下文后，使用工具前重新核对受派仓库和角色。只读复核者不能拉取或切换分支、运行构建或改写证据；即使工作区未变，`git fetch` 也会更新仓库元数据。

**限制：** 这是同一客户端的操作归属，不是固定团队人数。用户允许时，独立只读工作可以进行；成为操作者不等于取得现有会话的控制权限。

<a id="uik-002-zh"></a>
### UIK-002 — 重新绑定当前目标

**触发：** 导航、模块或筛选切换、窗口重开、搜索为空，或外部操作使旧状态失效。

**做法与验收：** 重新读取当前模块、筛选、可见入口及选中目标，动作前建立唯一的当前绑定。身份值留在允许的私有边界内，对外仅报告别名及绑定核验结果。

**限制：** 过期的可访问性节点、错误筛选或失焦都可能产生零结果。仅凭零匹配不能认定数据不存在。旧坐标或选择器在当前状态核验前只是线索。

<a id="uik-003-zh"></a>
### UIK-003 — 证明动作受理

**触发：** 键盘调参、保存快捷键、确认、快速取消或关闭弹窗。

**做法与验收：** 先核验焦点以及实际值或状态变化，分开观察受理和完成，例如预期确认窗出现、提交值被接收、结果状态被读回。证据必须属于正在判断的那次尝试。

遇到节点缓存或焦点错误后，先刷新窗口绑定及可访问性状态，再进行一次有界恢复尝试。授权允许时显式激活已核实的目标窗口。读回目标输入值或弹窗状态变化；不得复用过期索引，也不得将赋值工具异常当作产品结果。

部分原生适配器依赖快照中的图像元数据建立坐标几何。几何信息不可用时，在获准采集边界内获取包含适配器所需文字和图像元数据的新快照，不返回或保存私有像素。分别证明指针操作和键盘输入受理；点击有效不能证明后续文字输入到达目标控件。

**限制：** 输入调用成功或未报错，均不能证明受理或持久化。稍后的普通取消或清理不能补证第一次快速操作已受理。

<a id="uik-004-zh"></a>
### UIK-004 — 建立普通保存对照

**触发：** 验证编辑丢失、导航时保存、退出保存竞态，或上传后取消的行为。

**做法与验收：** 在获准测试数据上先正常保存并观察受理信号，离开后重入同一目标读回保存值。只有对照成立，才在保持其他相关条件一致的前提下改变时序或导航条件。

如果弹窗能在保存表单前上传对象，应分别观察上传前、上传后、取消后及重开同一绑定目标时的外层列表和编辑器。区分未保存表单字段与独立完成的上传。预期回滚前先核实取消操作的产品约定；两处列表不一致本身不能证明服务端持久化或删除失败。

**限制：** 对照失败时，竞态前提尚未成立；为恢复而重启不能补齐这个对照。重入也可能读取缓存：如果声称验证持久化，还需受支持的独立读取路径或合格重启证据。

<a id="uik-005-zh"></a>
### UIK-005 — 确认竞态尝试成立

**触发：** 怀疑请求乱序、迟到回写、防抖异常或执行中取消。

**做法与验收：** 测试前定义必须出现的重叠条件。分别采集输入受理、相关操作在途、完成顺序及目标最终状态的证据。限定观察范围，区分条件成立的尝试和从未进入目标时间窗口的尝试。

**限制：** 快速输入、节流预设、源码延迟或单纯经过一段时间都不能证明重叠。网络时序或取消探针不是执行器内置动作。缺少获准的适用探针时，应报告未验证的时序条件，不能判定竞态缺陷或修复成立。

<a id="uik-006-zh"></a>
### UIK-006 — 精确恢复本轮改动

**触发：** 新增、编辑或移除可恢复测试对象。

**做法与验收：** 在允许边界内保存原状态，编辑前先确认有受支持的方法精确定位并恢复本次改动。沿用当次已有授权，仅在破坏性操作范围仍不清楚时澄清。恢复后离开再重入同一目标，分别核验身份、改动对象和受影响的列表状态。恢复结果独立于缺陷结果记录。

**限制：** 不盲用撤销、复原、全部清空，也不删除不可见对象。某个对象恢复不能证明元数据、搜索历史、选择或偏好全部恢复；额外恢复结论分别取证。

<a id="uik-007-zh"></a>
### UIK-007 — 分开验证生命周期

**触发：** 启动、退出、重开、版本确认、首次使用初始化或耗时结论。

**做法与验收：** 分别核验进程身份、可执行文件及构建身份、窗口就绪、页面就绪和目标就绪。每段耗时说明时间起点及观察来源。有构建来源证据时才将安装包对应到源码提交。

验证首次使用时，区分现有进程中的首次记录访问、组件重新挂载及已核验的冷启动，并说明存储或先前访问的影响是否已知。比较导航上下文时保持目标绑定一致。访问另一视图前后的差异属于上下文对照，不能证明冷启动行为。需要更强基线时，仅通过授权范围内受支持的动作建立。

**限制：** PID 变化、工具退出码或版本标签不能证明应用正常退出、状态已保存、源码一致或启动耗时。当前执行器启动自己的应用，使用首个 Electron 窗口，结束时尝试关闭该应用；不能选择已有实例或第二个窗口，详见[架构](../ARCHITECTURE.md)。

<a id="uik-008-zh"></a>
### UIK-008 — 读回偏好设置

**触发：** 测试改变设置、导出目录或其他记忆值。

**做法与验收：** 私下保留原值，沿获准且受支持的路径恢复，并分别核验存储值以及正常重新挂载组件或合格重启后显示的值。缓存是需要证据的条件性实现事实。

**限制：** 原值未知时不猜测；直接修改存储须有适用授权。精确文字相等、路径规范化后等值、物理目录存在是三项不同检查。恢复路径偏好不要求创建缺失目录。

<a id="uik-015-zh"></a>
### UIK-015 — 限定恢复尝试

**触发：** 定位器、自动化适配器或时序尝试失败，或中断的任务恢复执行。

**做法与验收：** 区分阻碍类型，刷新相关状态，在原授权范围内选择受支持的替代方式。根据风险和诊断价值设定停止条件，保留哪些尝试成立、哪些观察缺失。

中断恢复后，先盘点已完成证据及未完成收尾，再决定是否需要重测。执行收尾变更前，重新核验进程身份（包括创建时间）、端点归属及用户当前会话；仅有旧 PID 不足以证明归属。不得用旧界面基线覆盖用户后续改动，也不为收尾重新打开已关闭的客户端。只关闭仍能证明由本轮拥有的诊断资源。区分历史恢复记录和本次新观察，无法确认归属或安全恢复的残留应如实报告。

当前适配器不能送达输入时，可在已有授权内选用诊断控制器。开启诊断端点或连接调试器属于临时诊断操作，不能描述为只读观察。先记录端点及调试器基线，测试前核验目标进程、回环监听、选中渲染器，以及真实输入和读回；记录本轮拥有的端点、连接及调试器连接。恢复测试状态和网络条件后，只断开本轮建立的调试器连接，只关闭本轮创建的端点。再核验自建监听消失、复用端点保持基线且原客户端仍运行。控制器仅限工具策略及已有任务授权允许、预先明确范围的诊断操作，不授予任意应用 JavaScript 执行、内部业务处理器调用，或绕过公开 UI 改变业务状态的权限。这是调用方流程，不代表执行器或 MCP 新增能力。

**限制：** 重试应带来新证据。不能为绕过阻碍扩大到更多真实记录、修改产品代码、绕过认证或加入任意 JavaScript 执行能力。没有获准方法能证明结论时，应准确报告剩余缺口。
