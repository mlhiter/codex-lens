import { TextDocument, Position } from 'vscode';
import { ApiContext } from './LLMService';

/**
 * 上下文解析器类
 * 负责从 VS Code 编辑器中提取代码上下文信息
 */
class ContextParser {
    /**
     * 从指定文档和位置获取 API 上下文信息
     * @param document VS Code 文档对象
     * @param position 光标位置
     * @returns API 上下文对象，如果无法解析则返回 null
     */
    public static getApiContext(document: TextDocument, position: Position): ApiContext | null {
        // 获取光标下单词的范围
        const wordRange = document.getWordRangeAtPosition(position);

        // 如果光标下没有单词，返回 null
        if (!wordRange) {
            return null;
        }

        // 提取光标下的单词作为 API 名称
        const apiName = document.getText(wordRange);

        // 获取当前行的完整文本
        const codeLine = document.lineAt(position.line).text;

        // 获取文档的编程语言
        const language = document.languageId;

        // 返回组合的上下文对象
        return {
            language,
            apiName,
            codeLine
        };
    }
}

export default ContextParser;
