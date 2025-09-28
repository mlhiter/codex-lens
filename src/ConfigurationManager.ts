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
}

export default ConfigurationManager;
