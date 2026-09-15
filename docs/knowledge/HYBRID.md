# Script-first UI Testing

[English](#english) | [中文](#中文) · [Index / 索引](README.md)

## English

<a id="uik-017-en"></a>
### UIK-017 — Run scripts first

**Trigger:** Repeated UI regression should run without a model, while unfamiliar or visually ambiguous operations may need model assistance.

**Decision:** Use reviewed case files when the target, input sequence and pass/fail predicate are known. The CLI and MCP runner execute those files without model integration. A calling agent may use a model for an unfamiliar view, an unsupported canvas interaction or evidence requiring visual judgment, within the existing authorization and capture policy. The runner does not automatically call a model, configure a provider or heal a locator.

| Condition | Action | Result boundary |
|---|---|---|
| Known locator, authorized data and observable predicate | Run the case in listed order; wait for readiness and assert exact state. | Record the deterministic result and artifacts. |
| Action accepted, assertion fails | Preserve the failure before diagnosis. | Model interpretation cannot turn a failed assertion into a pass. |
| Locator drift, missing readiness or unsupported control | Keep the failed run; let the calling agent inspect the obstacle under the same UI ownership. | A tool failure is not proof of a product defect. |
| Required authorization, identity or privacy boundary is missing | Stop dependent operations and report the gap. | Model fallback cannot supply authorization or bypass authentication. |

Keep a single UI operator as required by [UIK-001](EXECUTION.md#uik-001-en). After a model-assisted discovery, convert stable steps into a reviewed case, then rerun it from a known baseline. Preserve the original failing evidence and label the new run. Changing a selector or expectation requires evidence that the target or specification is correct; it must not merely make the case pass.

### Runnable methods

These examples use only a local fictional application. They do not connect to a business environment or verify a real product. Their visible controls, data and expected behavior are intentionally defined by the fixture.

| Method and case | Preconditions and ordered assertions | Limit |
|---|---|---|
| [Query reset](../../examples/deterministic-cases/query-reset.yaml) | Input starts empty → fill a synthetic query → read it back → click Reset → wait for exact empty value. | One observed empty value does not establish backend search behavior. |
| [Filter exclusion](../../examples/deterministic-cases/category-filter.yaml) | Initial list has four rows → select Beta → wait for Alpha count zero → require total and Beta counts two. | Counts apply to matching DOM nodes; the fictional pinned-item rule is not a rule for other products. |
| [Editor list consistency](../../examples/deterministic-cases/editor-items.yaml) | Start empty → open editor → commit one synthetic item → require inner count one → cancel and reopen → require inner and outer counts one. | This fixture commits an in-memory item; it does not exercise file upload or server persistence. |

All cases use stable test IDs or scoped CSS, a five-second launch timeout and a one-second action timeout. The reset and filter fixture handlers complete asynchronously; the assertions wait on values and counts rather than guessing a sleep duration. Every case starts a new fixture process and the runner closes only that process at completion. Artifacts remain in the selected local output directory.

From the repository root, run the acceptance suite:

```sh
npm run test:deterministic
```

The suite runs each case normally and then with its corresponding fixture fault, serially. It requires three passes and three failures at the intended assertion. Exit zero means the suite itself passed, including detection of the injected faults. It does not mean all six case results are passes. No model SDK, provider or remote service is used.

To run only the normal cases with the existing CLI on PowerShell:

```powershell
npm run build
$env:ELECTRON_EXECUTABLE = node -p "require('electron')"
$env:DETERMINISTIC_APP_ENTRY = (Resolve-Path examples/deterministic-app/main.cjs).Path
$env:DETERMINISTIC_FAULT = ''
node dist/cli.js examples/deterministic-cases --output artifacts/deterministic-manual
```

`DETERMINISTIC_FAULT` accepts empty, `reset`, `filter` or `items`; nonempty values deliberately break only that fixture behavior. This setting is not a real-application control.

### Moving a method to a private application

Keep actual selectors, environment profiles, record aliases and business expectations in the private test workspace. Before reusing a recipe, verify the current window and route, a unique target, a readiness signal, the action's accepted state, a bounded assertion and the exact restoration path. Link the expected behavior to its specification. Read back each action before proceeding; do not treat a click's completion as business success.

For races, require evidence that the earlier request is in flight before selecting the later target, then control or observe completion order and assert the final binding; quick clicks alone are not a race test. The current case format has no request barrier. For canvas operations, a model may help discover geometry, but reproducible coordinates still need a verified image binding, scale and ROI plus an observable result. These methods need an authorized suitable adapter; they are not implemented by the three example cases.

**Acceptance:** Run the normal and injected-fault checks, inspect the first failed step, review the changed case and preserve its evidence identity. A stable workflow can then be rerun without a model. A model-assisted verdict remains separately identified when no deterministic predicate is available.

**Limit:** The current runner launches its own application and uses the first window. It cannot attach to the user's existing session, select another window, upload files or disable automatic screenshot/trace capture. Follow [capture boundaries](EVIDENCE.md#uik-012-en) before using any private data. Determinism describes the procedure and assertion, not immunity to environmental faults.

**Basis:** The methods are supported by the synthetic cases, [fixture](../../examples/deterministic-app/index.html) and [acceptance suite](../../scripts/deterministic-e2e.mjs). Their executed result belongs to the current validation report; this page is not a claim that a business application passed.

## 中文

<a id="uik-017-zh"></a>
### UIK-017 — 优先执行脚本

**触发：** 重复 UI 回归需要不调用模型执行，同时允许模型协助陌生或视觉含义不明确的操作。

**决策：** 目标、输入顺序和通过条件已知时，使用已评审用例文件。CLI 和 MCP 执行这些文件时不接入模型。陌生页面、尚不支持的画布交互或需要视觉判断的证据，可由调用方 agent 在已有授权及采集策略内调用模型协助。执行器不会自动调用模型、配置服务商或修复定位器。

| 条件 | 动作 | 结论边界 |
|---|---|---|
| 定位器已知、数据获准、判定条件可观察 | 按顺序执行用例，等待就绪，精确断言状态。 | 记录确定性结果及证据。 |
| 动作已受理，断言失败 | 先保留失败证据，再诊断。 | 模型解释不能将失败断言直接改判通过。 |
| 定位器失效、页面未就绪或控件不受支持 | 保留失败记录，由调用方 agent 在同一 UI 控制权下检查阻碍。 | 工具失败不证明产品有缺陷。 |
| 缺少必要授权、身份或隐私边界 | 停止依赖这些条件的操作，报告缺口。 | 模型辅助不能提供授权或绕过认证。 |

遵循 [UIK-001](EXECUTION.md#uik-001-zh)，同一客户端只保留一个 UI 操作者。模型探索后，将稳定步骤转换为经过评审的用例，从已知基线重新执行。保留原失败证据，并标明新一轮执行。修改定位器或预期值须有目标或规范正确性的依据，不能只为让测试通过。

### 可运行的方法

以下示例只使用本地虚构应用，不连接业务环境，也不验证真实产品。界面、数据及预期行为由夹具明确定义。

| 方法与用例 | 前提及顺序断言 | 限制 |
|---|---|---|
| [查询重置](../../examples/deterministic-cases/query-reset.yaml) | 输入初始为空 → 填入虚构查询词 → 读回确认 → 点击重置 → 等待值精确为空。 | 一次读回空值不证明后端查询行为。 |
| [筛选排除](../../examples/deterministic-cases/category-filter.yaml) | 初始列表四项 → 选中 Beta → 等待 Alpha 数量为零 → 总数和 Beta 数量均为二。 | 统计匹配的 DOM 节点；虚构的置顶规则不能当作其他产品规范。 |
| [编辑器列表一致性](../../examples/deterministic-cases/editor-items.yaml) | 初始为空 → 打开编辑器 → 提交一个虚构条目 → 内层数量为一 → 取消并重开 → 内外数量均为一。 | 只在内存中提交条目，不覆盖真实文件上传或服务端持久化。 |

用例使用稳定 Test ID 或范围明确的 CSS，启动超时五秒、动作超时一秒。查询重置和筛选夹具采用异步处理，断言等待实际值或数量，不猜测固定睡眠时长。每例启动独立夹具进程，结束时执行器只关闭自己启动的进程，证据保留在指定本地输出目录。

在仓库根目录执行验收：

```sh
npm run test:deterministic
```

验收脚本对每个用例先正常运行，再注入对应故障，全程串行。要求正常三项通过，故障三项在指定断言处失败。退出码零表示验收脚本通过，包括成功识别注入故障，不表示六次用例都通过。运行不使用模型 SDK、服务商或远程服务。

在 PowerShell 中，只运行正常用例：

```powershell
npm run build
$env:ELECTRON_EXECUTABLE = node -p "require('electron')"
$env:DETERMINISTIC_APP_ENTRY = (Resolve-Path examples/deterministic-app/main.cjs).Path
$env:DETERMINISTIC_FAULT = ''
node dist/cli.js examples/deterministic-cases --output artifacts/deterministic-manual
```

`DETERMINISTIC_FAULT` 仅接受空值、`reset`、`filter` 或 `items`；非空值故意破坏对应夹具行为，不是控制真实应用的参数。

### 迁移到私有应用

真实定位器、环境配置、对象别名和业务预期保留在私有测试工作区。复用方法前核验当前窗口和路由、唯一目标、就绪信号、动作受理状态、有界断言及精确恢复路径，并把预期行为关联到规范。每次动作后先读回，再进入下一步，不能将点击完成当作业务成功。

竞态测试须先证明早先请求仍在途，再选择后一个目标，控制或观察完成顺序并断言最终绑定；快速点击本身不构成竞态验证。当前用例格式没有请求屏障。画布操作可让模型协助定位，但可重复使用的坐标仍须有已核验的图像绑定、缩放、ROI 及可观察结果。这些方法需要适用且已获授权的适配器，不属于三个示例已经实现的能力。

**验收：** 执行正常和注入故障检查，核对首个失败步骤，评审用例变更并保留证据身份。稳定流程随后可不调用模型重跑；没有确定性判定条件时，模型辅助结论仍须单独标记。

**限制：** 当前执行器启动自己的应用并使用首个窗口，不能附着用户现有会话、选择其他窗口、上传文件或关闭自动截图及 Trace。使用私有数据前遵循[采集边界](EVIDENCE.md#uik-012-zh)。确定性描述步骤和断言，不代表环境不会出故障。

**依据：** 虚构用例、[夹具](../../examples/deterministic-app/index.html)及[验收脚本](../../scripts/deterministic-e2e.mjs)。实际执行结果记录在本轮验证报告，本页不宣称业务应用已通过。
