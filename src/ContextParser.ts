import { TextDocument, Position, Range } from 'vscode';
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

        // 获取周围代码行（前后各3行）
        const surroundingCode = this.getSurroundingCode(document, position, 3);

        // 获取相关的导入语句
        const imports = this.getRelevantImports(document, apiName);

        // 获取当前函数/方法的上下文
        const functionContext = this.getFunctionContext(document, position);

        // 返回组合的上下文对象
        return {
            language,
            apiName,
            codeLine,
            surroundingCode,
            imports,
            functionContext
        };
    }

    /**
     * 获取指定位置周围的代码行
     * @param document VS Code 文档对象
     * @param position 光标位置
     * @param contextLines 前后各取的行数
     * @returns 周围代码的字符串数组
     */
    private static getSurroundingCode(document: TextDocument, position: Position, contextLines: number): string[] {
        const startLine = Math.max(0, position.line - contextLines);
        const endLine = Math.min(document.lineCount - 1, position.line + contextLines);

        const lines: string[] = [];
        for (let i = startLine; i <= endLine; i++) {
            const lineText = document.lineAt(i).text;
            // 标记当前行
            if (i === position.line) {
                lines.push(`>>> ${lineText}`);
            } else {
                lines.push(`    ${lineText}`);
            }
        }

        return lines;
    }

    /**
     * 获取与指定 API 名称相关的导入语句
     * @param document VS Code 文档对象
     * @param apiName API 名称
     * @returns 相关的导入语句数组
     */
    private static getRelevantImports(document: TextDocument, apiName: string): string[] {
        const imports: string[] = [];
        const text = document.getText();
        const language = document.languageId;

        // 根据不同语言匹配导入语句的正则表达式
        let importRegexes: RegExp[] = [];

        if (language === 'javascript' || language === 'typescript') {
            importRegexes = [
                new RegExp(`import.*${apiName}.*from.*`, 'gi'),
                new RegExp(`import.*{[^}]*${apiName}[^}]*}.*from.*`, 'gi'),
                new RegExp(`const.*${apiName}.*=.*require\\(.*\\)`, 'gi'),
                new RegExp(`import\\s+${apiName}\\s+from.*`, 'gi')
            ];
        } else if (language === 'python') {
            importRegexes = [
                new RegExp(`from.*import.*${apiName}`, 'gi'),
                new RegExp(`import.*${apiName}`, 'gi')
            ];
        } else if (language === 'java') {
            importRegexes = [
                new RegExp(`import.*${apiName}.*`, 'gi')
            ];
        }

        // 查找匹配的导入语句
        for (const regex of importRegexes) {
            const matches = text.match(regex);
            if (matches) {
                imports.push(...matches);
            }
        }

        return [...new Set(imports)]; // 去重
    }

    /**
     * 获取当前位置所在的函数/方法上下文
     * @param document VS Code 文档对象
     * @param position 光标位置
     * @returns 函数上下文信息
     */
    private static getFunctionContext(document: TextDocument, position: Position): string | null {
        const text = document.getText();
        const language = document.languageId;

        // 获取当前位置之前的文本
        const textBeforePosition = document.getText(new Range(0, 0, position.line, position.character));

        // 根据不同语言匹配函数定义的正则表达式
        let functionRegexes: RegExp[] = [];

        if (language === 'javascript' || language === 'typescript') {
            functionRegexes = [
                /function\s+(\w+)\s*\([^)]*\)\s*{/g,
                /(\w+)\s*:\s*\([^)]*\)\s*=>/g,
                /(\w+)\s*=\s*\([^)]*\)\s*=>/g,
                /(\w+)\s*\([^)]*\)\s*{/g, // 方法定义
                /async\s+function\s+(\w+)\s*\([^)]*\)\s*{/g,
                /async\s+(\w+)\s*\([^)]*\)\s*{/g
            ];
        } else if (language === 'python') {
            functionRegexes = [
                /def\s+(\w+)\s*\([^)]*\):/g,
                /async\s+def\s+(\w+)\s*\([^)]*\):/g
            ];
        } else if (language === 'java') {
            functionRegexes = [
                /(?:public|private|protected)?\s*(?:static)?\s*\w+\s+(\w+)\s*\([^)]*\)\s*{/g
            ];
        }

        // 找到最近的函数定义
        let lastMatch: RegExpMatchArray | null = null;
        for (const regex of functionRegexes) {
            let match;
            while ((match = regex.exec(textBeforePosition)) !== null) {
                lastMatch = match;
            }
        }

        return lastMatch ? lastMatch[0] : null;
    }
}

export default ContextParser;
