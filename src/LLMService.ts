import axios from 'axios';
import ConfigurationManager from './ConfigurationManager';

/**
 * API 上下文接口
 * 包含从用户代码中提取的上下文信息
 */
export interface ApiContext {
    /** 编程语言 */
    language: string;
    /** API 名称 */
    apiName: string;
    /** 代码行内容 */
    codeLine: string;
    /** 周围代码行 */
    surroundingCode: string[];
    /** 相关导入语句 */
    imports: string[];
    /** 函数上下文 */
    functionContext: string | null;
}

/**
 * LLM 服务类
 * 负责与外部 LLM API 进行通信，提供代码解释功能
 */
class LLMService {
    /**
     * 构建用于 LLM 的 Prompt
     * @param context API 上下文信息
     * @returns 精心设计的 Prompt 字符串
     */
    private static buildPrompt(context: ApiContext): string {
        let prompt = `你是一位资深的 ${context.language} 开发专家。请分析以下代码中的 API 调用：

**API 名称：** ${context.apiName}
**编程语言：** ${context.language}

**当前代码行：** \`${context.codeLine}\`

**周围代码上下文：**
\`\`\`${context.language}
${context.surroundingCode.join('\n')}
\`\`\``;

        // 添加导入语句信息（如果有）
        if (context.imports.length > 0) {
            prompt += `

**相关导入语句：**
\`\`\`${context.language}
${context.imports.join('\n')}
\`\`\``;
        }

        // 添加函数上下文信息（如果有）
        if (context.functionContext) {
            prompt += `

**函数上下文：**
\`\`\`${context.language}
${context.functionContext}
\`\`\``;
        }

        prompt += `

请基于以上完整的代码上下文，提供以下信息：

1. **API 核心功能**：简洁地解释这个 API 的主要用途和功能
2. **参数说明**：如果有参数，请解释每个参数的作用和类型
3. **返回值**：说明 API 的返回值类型和含义
4. **使用示例**：基于当前上下文，提供一个相关的实用代码示例
5. **注意事项**：如果有需要注意的地方（如异常处理、性能考虑等）

请以 Markdown 格式返回，保持简洁明了，重点突出实用性。`;

        return prompt;
    }

    /**
     * 获取代码解释
     * @param context API 上下文信息
     * @returns Promise，成功时返回解释文本，失败时返回 null
     */
    public static async getExplanation(context: ApiContext): Promise<string | null> {
        try {
            // 获取配置
            const apiKey = ConfigurationManager.getApiKey();
            const baseUrl = ConfigurationManager.getBaseUrl();
            const model = ConfigurationManager.getModel();
            const maxTokens = ConfigurationManager.getMaxTokens();
            const temperature = ConfigurationManager.getTemperature();

            // 检查配置是否完整
            if (!apiKey || !baseUrl) {
                console.error('Codex Lens: API Key 或 Base URL 未配置。请在设置中配置 codexLens.apiKey 和 codexLens.baseUrl');
                return null;
            }

            // 构建 Prompt
            const prompt = this.buildPrompt(context);

            // 构建请求
            const response = await axios.post(
                `${baseUrl}/chat/completions`,
                {
                    model: model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    stream: false,
                    max_tokens: maxTokens,
                    temperature: temperature
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    }
                }
            );

            // 解析响应
            if (response.data && response.data.choices && response.data.choices.length > 0) {
                return response.data.choices[0].message.content;
            } else {
                console.error('Codex Lens: API 响应格式异常', response.data);
                return null;
            }

        } catch (error) {
            console.error('Codex Lens: 调用 LLM API 时发生错误:', error);
            if (axios.isAxiosError(error)) {
                console.error('HTTP 状态码:', error.response?.status);
                console.error('错误响应:', error.response?.data);
            }
            return null;
        }
    }
}

export default LLMService;
