# Documentation / 文档中心

This documentation is bilingual. Each page contains English first and Chinese second. Commands and schemas are shared to prevent translation drift.

本文档中心全部采用中英双语。每个页面先英文、后中文；命令和 Schema 共用一份，避免翻译版本产生偏差。

## Start here / 从这里开始

| Document | 文档 | Purpose / 用途 |
|---|---|---|
| [Getting Started](GETTING_STARTED.md) | 快速入门 | Installation, synthetic demo and private workspace / 安装、虚构示例和私有工作区 |
| [CLI Reference](CLI.md) | CLI参考 | Arguments, output and exit behavior / 参数、输出和退出行为 |
| [MCP Integration](MCP.md) | MCP接入 | Generic and AI-client MCP setup / 通用及AI客户端MCP配置 |
| [Test Case Format](CASE_FORMAT.md) | 用例格式 | Schema, targets, actions and validation / Schema、定位、动作和校验 |
| [Artifacts and Results](ARTIFACTS.md) | 证据与结果 | JSON, screenshots, traces and logs / JSON、截图、Trace和日志 |
| [Troubleshooting](TROUBLESHOOTING.md) | 故障排查 | Installation, launch, locator, MCP and CI problems / 安装、启动、定位、MCP和CI问题 |

## Design and governance / 设计与治理

| Document | 文档 | Purpose / 用途 |
|---|---|---|
| [Architecture](ARCHITECTURE.md) | 架构说明 | Components, execution flow and boundaries / 组件、执行流和边界 |
| [Compatibility](COMPATIBILITY.md) | 兼容性 | Supported and verified environments / 支持与已验证环境 |
| [Privacy](PRIVACY.md) | 隐私隔离 | Mandatory business and personal-data isolation / 强制业务与个人信息隔离 |
| [Security Model](SECURITY_MODEL.md) | 安全模型 | Assets, threats, controls and residual risk / 资产、威胁、控制和剩余风险 |
| [Development](DEVELOPMENT.md) | 开发指南 | Repository workflow and test gates / 仓库工作流和测试门禁 |
| [Release](RELEASE.md) | 发布指南 | Versioning, package inspection and checklist / 版本、包检查和清单 |
| [Roadmap](ROADMAP.md) | 路线图 | Current foundation, next work and non-goals / 当前基础、后续工作和非目标 |

## Capability status / 能力状态

| Capability / 能力 | Status / 状态 |
|---|---|
| YAML, JSON and fenced Markdown cases / YAML、JSON和Markdown代码块用例 | Available / 已支持 |
| Deterministic actions and assertions / 确定性动作与断言 | Available / 已支持 |
| CLI file and recursive-directory execution / CLI文件与递归目录执行 | Available / 已支持 |
| Local screenshots, trace, console and JSON result / 本地截图、Trace、控制台和JSON结果 | Available / 已支持 |
| STDIO MCP `run_case` | Available / 已支持 |
| First Electron window / 首个Electron窗口 | Available / 已支持 |
| Multi-window selection / 多窗口选择 | Planned / 规划中 |
| Visual locator recovery / 视觉定位恢复 | Planned, outside the current core / 已规划，不在当前核心中 |
| Natural-language case compilation / 自然语言用例编译 | Planned as an optional external layer / 规划为可选外部层 |
| npm registry publication / npm公共仓库发布 | Not published yet / 尚未发布 |

When documentation and code disagree, current source and automated tests are authoritative. Report mismatches with synthetic examples only.

文档与代码不一致时，以当前源码和自动化测试为准。只能使用虚构示例报告文档偏差。
