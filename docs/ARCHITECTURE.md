# Architecture

[English](#english) | [中文](#中文)

## English

Electron UI Agent has one job: execute deterministic UI cases against a locally trusted Electron application.

```text
human, CI, or AI client
          |
       CLI or MCP
          |
   case loader and validator
          |
 Playwright Electron runner
          |
 local evidence directory
```

## Boundaries

The CLI and MCP server share the same case loader and runner. There is no model provider inside the execution path, so a saved case consumes no language-model tokens. An AI client may author a case or invoke `run_case`, but click, fill, wait, assertion, screenshot, and evidence collection remain deterministic.

The MCP server accepts paths only inside its configured workspace. It does not expose arbitrary JavaScript evaluation. The application executable is trusted input: launching a test application has the same security implications as launching it directly.

## Evidence

Each run writes a unique local directory containing `result.json`, a Playwright trace, explicit screenshots, a failure screenshot when possible, and renderer console output when present. The MCP response returns only a compact result and artifact paths; clients load large evidence only when needed.

## Extension policy

Keep the core action set small. Add an action only when it is broadly useful across Electron applications and can be validated without application-specific knowledge. Product workflows, selectors, data, and reporting integrations belong in private downstream test projects.

---

## 中文

Electron UI Agent 只负责一件事：针对本地可信的 Electron 应用执行确定性 UI 用例。

```text
人工、CI 或 AI 客户端
          |
       CLI 或 MCP
          |
    用例读取与校验
          |
 Playwright Electron 执行器
          |
      本地证据目录
```

### 边界

CLI 和 MCP 服务共用同一个用例读取器和执行器。执行路径不包含模型提供商，因此保存后的用例执行时不消耗大模型 Token。AI 客户端可以编写用例或调用 `run_case`，但点击、输入、等待、断言、截图和证据采集始终由确定性执行器完成。

MCP 服务只接受配置工作区内的路径，并且不暴露任意 JavaScript 执行能力。应用可执行文件属于可信输入：启动被测应用与用户直接运行该应用具有相同的安全风险。

### 证据

每次执行都会创建唯一的本地目录，保存 `result.json`、Playwright Trace、显式截图、尽可能生成的失败截图，以及存在时的渲染进程控制台输出。MCP 只返回精简结果和证据路径，大体积证据由客户端按需读取。

### 扩展原则

核心动作集应保持精简。只有跨 Electron 应用普遍适用、且不依赖具体业务知识的动作才能加入核心。产品流程、选择器、业务数据和报告集成都应放在私有下游测试项目中。
