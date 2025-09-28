import { workspace } from 'vscode';

/**
 * 配置管理器类
 * 提供统一的方法来访问插件的配置项
 */
class ConfigurationManager {
    /**
     * 获取 API Key 配置
     * @returns API Key 字符串，如果未配置则返回 undefined
     */
    public static getApiKey(): string | undefined {
        return workspace.getConfiguration('codexLens').get<string>('apiKey');
    }

    /**
     * 获取 Base URL 配置
     * @returns Base URL 字符串，如果未配置则返回 undefined
     */
    public static getBaseUrl(): string | undefined {
        return workspace.getConfiguration('codexLens').get<string>('baseUrl');
    }

    /**
     * 获取模型配置
     * @returns 模型名称字符串，默认为 claude-3-5-haiku-20241022
     */
    public static getModel(): string {
        return workspace.getConfiguration('codexLens').get<string>('model', 'claude-3-5-haiku-20241022');
    }

    /**
     * 获取最大 Token 数配置
     * @returns 最大 Token 数，默认为 1000
     */
    public static getMaxTokens(): number {
        return workspace.getConfiguration('codexLens').get<number>('maxTokens', 1000);
    }

    /**
     * 获取温度配置
     * @returns 温度值，默认为 0.7
     */
    public static getTemperature(): number {
        return workspace.getConfiguration('codexLens').get<number>('temperature', 0.7);
    }
}

export default ConfigurationManager;
