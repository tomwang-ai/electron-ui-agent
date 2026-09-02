# Roadmap

[English](#english) | [中文](#中文)

## English

The project develops in small, independently useful stages.

## Current foundation

- YAML, JSON, and fenced Markdown case loading
- Input validation and environment-variable expansion
- Deterministic Electron execution through Playwright
- CLI and compact MCP integration
- Local screenshots, traces, console logs, and JSON results
- Repository privacy and business-isolation merge gate

## Next

- Stable case schema versioning
- Window selection and multi-window actions
- Case tags and controlled parallel execution
- JUnit output for CI systems
- Explicit artifact inspection tools for MCP clients

## Later, when evidence supports the need

- Optional visual-location adapter
- Bounded locator recovery
- Optional natural-language-to-case compiler outside the deterministic runner

Model providers, business workflows, hosted telemetry, and a management dashboard are intentionally outside the core project.

---

## 中文

项目采用小步、每个阶段可独立使用的演进方式。

### 当前基础能力

- 读取 YAML、JSON 和带代码块的 Markdown 用例
- 输入校验和环境变量展开
- 通过 Playwright 确定性执行 Electron UI
- CLI 和精简 MCP 集成
- 本地截图、Trace、控制台日志和 JSON 结果
- 仓库隐私与业务隔离合并门禁

### 下一阶段

- 稳定的用例 Schema 版本控制
- 窗口选择与多窗口动作
- 用例标签和受控并行执行
- 面向 CI 的 JUnit 输出
- MCP 客户端按需读取证据的工具

### 有明确需求证据后再做

- 可选视觉定位适配器
- 有限次数的定位恢复
- 位于确定性执行器之外的可选自然语言用例编译器

模型提供商、业务流程、托管遥测和管理后台明确不属于核心项目范围。
