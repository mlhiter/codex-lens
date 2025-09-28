import {
    HoverProvider,
    TextDocument,
    Position,
    Hover,
    MarkdownString,
    CancellationToken
} from 'vscode';
import ContextParser from './ContextParser';
import LLMService from './LLMService';

/**
 * Codex Lens 悬停提供器
 * 实现 VS Code 的 HoverProvider 接口，在悬停时提供 AI 生成的代码解释
 */
class CodexLensHoverProvider implements HoverProvider {
    /**
     * 为给定的文档位置提供悬停信息
     * @param document 文本文档
     * @param position 文档中的位置
     * @param token 取消令牌
     * @returns 包含 AI 生成解释的悬停对象，如果无法提供解释则返回 null
     */
    public async provideHover(
        document: TextDocument,
        position: Position,
        token: CancellationToken
    ): Promise<Hover | null | undefined> {
        // 从文档和位置提取上下文
        const context = ContextParser.getApiContext(document, position);

        // 如果没有找到上下文，返回 null
        if (!context) {
            return null;
        }

        // 检查是否请求了取消操作
        if (token.isCancellationRequested) {
            return null;
        }

        // 从 LLM 服务获取解释
        const explanation = await LLMService.getExplanation(context);

        // 异步调用后检查是否请求了取消操作
        if (token.isCancellationRequested) {
            return null;
        }

        // 如果服务返回 null 或空字符串，返回 null
        if (!explanation) {
            return null;
        }

        // 创建受信任的 MarkdownString 以支持富文本渲染
        const markdownString = new MarkdownString(explanation);
        markdownString.isTrusted = true;

        // 返回包含解释的悬停对象
        return new Hover(markdownString);
    }
}

export default CodexLensHoverProvider;
