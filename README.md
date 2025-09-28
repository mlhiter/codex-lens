# Codex Lens

🚀 **Intelligent Code Explanations at Your Fingertips**

Codex Lens is a powerful VS Code extension that provides AI-powered code explanations and insights directly in your editor. Simply hover over any API, function, or code element to get instant, contextual explanations powered by advanced language models.

## ✨ Features

- **🔍 Intelligent Hover Explanations**: Get detailed explanations of APIs, functions, and code elements by simply hovering over them
- **🌍 Multi-Language Support**: Works with 20+ programming languages including JavaScript, TypeScript, Python, Java, Go, Rust, C++, and more
- **🧠 Context-Aware Analysis**: Analyzes surrounding code, imports, and function context for accurate explanations
- **⚡ Real-time Processing**: Fast, responsive AI-powered analysis with request caching to avoid duplicates
- **🛠️ Flexible LLM Integration**: Compatible with various language models (Claude, GPT-4, etc.) via OpenAI-compatible APIs
- **📝 Rich Markdown Output**: Beautiful, formatted explanations with syntax highlighting and structured information

### What You Get in Each Explanation:
- **API Core Functionality**: Clear explanation of the main purpose and features
- **Parameter Details**: Type and purpose of each parameter
- **Return Values**: Description of what the API returns
- **Usage Examples**: Practical code examples based on your context
- **Best Practices**: Important considerations, error handling, and performance tips

## 📋 Requirements

- VS Code version 1.91.0 or higher
- An API key for a compatible language model service (Claude, OpenAI, etc.)
- Internet connection for API calls

## ⚙️ Extension Settings

Configure Codex Lens through VS Code settings (`Cmd/Ctrl + ,`):

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `codexLens.apiKey` | string | `""` | Your API key for the LLM service |
| `codexLens.baseUrl` | string | `""` | Base URL for the LLM service (e.g., `https://api.anthropic.com`) |
| `codexLens.model` | string | `claude-3-5-haiku-20241022` | Model to use for explanations |
| `codexLens.maxTokens` | number | `1000` | Maximum tokens for the response |
| `codexLens.temperature` | number | `0.7` | Response creativity (0-2, where 0 is deterministic) |

## 🚀 Quick Start

1. **Install the Extension**: Install Codex Lens from the VS Code marketplace
2. **Configure API Settings**:
   - Open VS Code settings (`Cmd/Ctrl + ,`)
   - Search for "Codex Lens"
   - Set your `apiKey` and `baseUrl`
3. **Start Using**: Simply hover over any code element in supported languages to get instant explanations!

### Example Configuration:

```json
{
    "codexLens.apiKey": "your-api-key-here",
    "codexLens.baseUrl": "https://api.anthropic.com",
    "codexLens.model": "claude-3-5-haiku-20241022",
    "codexLens.maxTokens": 1000,
    "codexLens.temperature": 0.7
}
```

## 🔧 Supported Languages

Codex Lens works with a wide range of programming languages:

- **Web Development**: JavaScript, TypeScript, HTML, CSS, SCSS, Less, Vue, React, JSX, TSX
- **Backend Languages**: Python, Java, C#, Go, Rust, PHP, Ruby, Kotlin, Swift, Scala
- **Systems Languages**: C, C++
- **Data & Scripting**: R, Julia, Lua, Perl, SQL
- **Shell Scripting**: Shell, PowerShell
- **Mobile Development**: Dart (Flutter), Swift, Kotlin

## 🎯 How It Works

1. **Context Detection**: When you hover over code, Codex Lens analyzes the surrounding context
2. **Smart Parsing**: Extracts relevant information including imports, function context, and code structure
3. **AI Processing**: Sends the context to your configured language model for analysis
4. **Rich Display**: Shows formatted explanations with syntax highlighting and structured information

## 🐛 Known Issues

- First-time API calls may take a few seconds depending on your LLM service response time
- Some complex code patterns may require additional context for optimal explanations
- Network connectivity issues may prevent explanations from loading

## 📈 Release Notes

### 0.0.1

- Initial release of Codex Lens
- Multi-language hover explanations
- Configurable LLM integration
- Context-aware code analysis
- Request caching and error handling

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with the VS Code Extension API
- Powered by advanced language models
- Inspired by the need for better code understanding tools

---

**Happy Coding with Codex Lens! 🚀**
