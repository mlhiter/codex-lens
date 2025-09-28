// 'vscode' 模块包含 VS Code 扩展性 API
// 导入模块并在下面的代码中使用别名 vscode 引用它
import * as vscode from 'vscode';
import CodexLensHoverProvider from './CodexLensHoverProvider';
import ConfigurationManager from './ConfigurationManager';

export function activate(context: vscode.ExtensionContext) {
	console.log('Codex Lens extension is activating...');

	// Check configuration on startup
	const apiKey = ConfigurationManager.getApiKey();
	const baseUrl = ConfigurationManager.getBaseUrl();

	if (!apiKey || !baseUrl) {
		vscode.window.showWarningMessage(
			'Codex Lens: Please configure API Key and Base URL in settings (codexLens.apiKey and codexLens.baseUrl)'
		);
	}


	const disposable = vscode.languages.registerHoverProvider(
		[
			{ language: 'javascript' },
			{ language: 'typescript' },
			{ language: 'python' },
			{ language: 'java' },
			{ language: 'go' },
			{ language: 'rust' },
			{ language: 'cpp' },
			{ language: 'c' }
		],
		new CodexLensHoverProvider()
	);

	context.subscriptions.push(disposable);

	console.log('Codex Lens extension activated successfully');
}

// 当扩展被停用时调用此方法
export function deactivate() {}
