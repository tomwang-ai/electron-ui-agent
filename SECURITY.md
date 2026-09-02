# Security Policy

[English](#english) | [中文](#中文)

## English

Do not open a public issue for a suspected vulnerability when the report could expose sensitive information. Use the repository's private security advisory feature.

Test cases execute local applications. Only run cases and application binaries from sources you trust. The MCP server restricts case and artifact paths to its configured workspace, but launching an application is inherently equivalent to running that application locally.

The project does not collect telemetry or upload test artifacts.

---

## 中文

如果漏洞报告可能暴露敏感信息，请勿创建公开 Issue，应使用仓库的私有安全公告功能。

测试用例会执行本地应用。只能运行来源可信的用例和应用程序。MCP 服务会把用例和证据路径限制在配置工作区内，但启动应用本身始终等同于在本机直接运行该应用。

本项目不采集遥测，也不上传测试产物。
