// 'vscode' 模块包含 VS Code 扩展性 API
// 导入模块并在下面的代码中使用别名 vscode 引用它
import * as vscode from 'vscode';
import CodexLensHoverProvider from './CodexLensHoverProvider';

// 当扩展被激活时调用此方法
// 扩展在第一次执行命令时被激活
export function activate(context: vscode.ExtensionContext) {
	// 为 JavaScript 和 TypeScript 文件注册悬停提供器
	const disposable = vscode.languages.registerHoverProvider(
		[
			{ language: 'javascript' },
			{ language: 'typescript' }
		],
		new CodexLensHoverProvider()
	);

	// 将 disposable 添加到订阅中以确保正确清理
	context.subscriptions.push(disposable);
}

// 当扩展被停用时调用此方法
export function deactivate() {}
