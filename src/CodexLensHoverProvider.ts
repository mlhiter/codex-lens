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
    // 缓存正在进行的请求，避免重复请求
    private activeRequests = new Map<string, Promise<string | null>>();

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
            // 创建请求的唯一标识符
            const requestKey = `${document.uri.toString()}-${position.line}-${position.character}-${context.apiName}`;

            // 检查是否已有相同的请求在进行中
            let explanationPromise = this.activeRequests.get(requestKey);

            if (!explanationPromise) {
                explanationPromise = LLMService.getExplanation(context);
                this.activeRequests.set(requestKey, explanationPromise);

                // 请求完成后清理缓存
                explanationPromise.finally(() => {
                    this.activeRequests.delete(requestKey);
                });
            }

            // 等待解释完成
            const explanation = await explanationPromise;

            if (token.isCancellationRequested) {
                return null;
            }

            if (!explanation) {
                console.log('Codex Lens: No explanation received from LLM service');
                const errorMarkdown = new MarkdownString();
                errorMarkdown.appendMarkdown(`## ❌ Codex Lens 错误\n\n`);
                errorMarkdown.appendMarkdown(`无法获取 \`${context.apiName}\` 的解释。\n\n`);
                errorMarkdown.appendMarkdown(`请检查：\n`);
                errorMarkdown.appendMarkdown(`- API 密钥是否正确配置\n`);
                errorMarkdown.appendMarkdown(`- 网络连接是否正常\n`);
                errorMarkdown.appendMarkdown(`- 服务端点是否可访问`);
                errorMarkdown.isTrusted = true;
                return new Hover(errorMarkdown);
            }

            const markdownString = new MarkdownString();
            markdownString.appendMarkdown(`## 🚀 Codex Lens 分析结果\n\n`);
            markdownString.appendMarkdown(explanation);
            markdownString.isTrusted = true;

            return new Hover(markdownString);
        } catch (error) {
            console.error('Codex Lens: Error in provideHover:', error);

            const errorMarkdown = new MarkdownString();
            errorMarkdown.appendMarkdown(`## ❌ Codex Lens 错误\n\n`);
            errorMarkdown.appendMarkdown(`分析 \`${context?.apiName || '未知'}\` 时发生错误。\n\n`);
            errorMarkdown.appendMarkdown(`错误信息：\`${error instanceof Error ? error.message : '未知错误'}\``);
            errorMarkdown.isTrusted = true;

            return new Hover(errorMarkdown);
        }
    }
}

export default CodexLensHoverProvider;
