1. 核心组件 (Components)

extension.ts (扩展入口):

职责: 插件的激活和停用入口。

核心任务: 在 activate 函数中，注册我们的 CodexLensHoverProvider，并将其绑定到 'javascript' 和 'typescript' 语言上。

CodexLensHoverProvider.ts (悬浮提示提供者):

职责: 实现 VS Code 的 HoverProvider 接口，是整个扩展的核心。

核心任务:

实现 provideHover 方法。

从该方法的参数中获取文档（document）和位置（position）。

调用 ContextParser 来提取光标所在位置的上下文信息。

显示一个“加载中...”的即时提示。

调用 LLMService 并传入上下文，异步等待结果。

将 LLM 返回的 Markdown 字符串包装成一个 vscode.Hover 对象并返回。

处理可能发生的错误（如 API 调用失败），并显示友好的错误信息。

ContextParser.ts (上下文解析器):

职责: 一个辅助模块，负责从代码中提取有用的信息以构建 Prompt。

核心任务:

获取悬停位置的单词（API 名称）。

获取包含该单词的完整代码行。

（可选，MVP可简化）尝试分析文件的导入语句，以确定 API 所属的库。

LLMService.ts (语言模型服务):

职责: 封装所有与外部 LLM API 交互的逻辑。

核心任务:

提供一个公开方法，如 getExplanation(context)。

从 ConfigurationManager 获取用户设置的 API Key。

根据传入的 context 构建一个完整的 Prompt。

使用 axios 或 node-fetch 等库向 Claude API 发送 HTTP 请求。

返回 API 响应的文本内容。

ConfigurationManager.ts (配置管理器):

职责: 统一管理从 VS Code 设置中读取配置的逻辑。

核心任务:

提供一个方法，如 getApiKey()。

使用 vscode.workspace.getConfiguration('codexLens') API 来读取用户配置的 apiKey。

2. 数据流 (Data Flow)

(用户)       (VS Code)        (CodexLensHoverProvider)      (ContextParser)     (LLMService)        (Claude API)
  |              |                        |                         |                   |                   |
1. 悬停 -------> |                        |                         |                   |                   |
  |            2. 调用 provideHover ----> |                         |                   |                   |
  |              |                      3. 调用 getTextContext ---> |                   |                   |
  |              |                        | <--------------------- 4. 返回上下文        |                   |
  |              |                      5. 调用 getExplanation --> |                 6. 构建Prompt并调用API -> |
  |              |                        |                         |                   | <---------------- 7. 返回结果
  |              | <-------------------- 10. 返回 Hover 对象        | <---------------- 8. 返回Markdown文本     |
11. 显示窗口     |                        |                         |                   |                   |
  |              |                        |                         |                   |                   |
