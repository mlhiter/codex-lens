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

        const context = ContextParser.getApiContext(document, position);

        if (!context) {
            console.log('Codex Lens: No context found');
            return null;
        }

        if (token.isCancellationRequested) {
            return null;
        }

        try {
            const explanation = await LLMService.getExplanation(context);

            if (token.isCancellationRequested) {
                return null;
            }

            if (!explanation) {
                console.log('Codex Lens: No explanation received from LLM service');
                return null;
            }

            const markdownString = new MarkdownString(explanation);
            markdownString.isTrusted = true;

            return new Hover(markdownString);
        } catch (error) {
            console.error('Codex Lens: Error in provideHover:', error);
            return null;
        }
    }
}

export default CodexLensHoverProvider;
