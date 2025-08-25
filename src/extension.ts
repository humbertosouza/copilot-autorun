import * as vscode from 'vscode';

let disposables: vscode.Disposable[] = [];
let enabled = false;
let timer: NodeJS.Timeout | undefined;
let statusBarItem: vscode.StatusBarItem;

function debounce(fn: () => void, ms = 300) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fn, ms);
}

function updateStatusBar() {
    if (!statusBarItem) {
        statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusBarItem.command = 'copilotAutoRun.toggle';
    }
    
    statusBarItem.text = enabled ? '$(debug-start) AutoRun ON' : '$(debug-stop) AutoRun OFF';
    statusBarItem.tooltip = enabled ? 'Copilot AutoRun is enabled - Click to disable' : 'Copilot AutoRun is disabled - Click to enable';
    statusBarItem.show();
}

function showNotification(message: string) {
    const config = vscode.workspace.getConfiguration('copilotAutoRun');
    const showNotifications = config.get<boolean>('showNotifications', true);
    
    if (showNotifications) {
        vscode.window.showInformationMessage(message);
    }
}

async function onEditorChange() {
    if (!enabled) return;
    
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    // Check if we're in an allowed language
    const config = vscode.workspace.getConfiguration('copilotAutoRun');
    const allowedLanguages = config.get<string[]>('allowedLanguages', []);
    
    if (allowedLanguages.length > 0 && !allowedLanguages.includes(editor.document.languageId)) {
        return;
    }

    // Skip empty lines or lines with only whitespace
    const pos = editor.selection.active;
    const lineText = editor.document.lineAt(pos.line).text.trim();
    if (!lineText) return;

    // Skip lines that look like comments
    if (lineText.startsWith('#') || lineText.startsWith('//') || lineText.startsWith('/*')) {
        return;
    }

    try {
        // Trigger inline suggestion
        await vscode.commands.executeCommand('editor.action.inlineSuggest.trigger');
        
        // Wait for suggestion to populate
        const suggestionDelay = config.get<number>('suggestionDelay', 200);
        await new Promise(resolve => setTimeout(resolve, suggestionDelay));
        
        // Try to accept the suggestion
        await vscode.commands.executeCommand('editor.action.inlineSuggest.commit');

        // Get the updated line text after accepting suggestion
        const updatedLineText = editor.document.lineAt(pos.line).text.trim();
        if (!updatedLineText) return;

        // Get or create terminal
        const terminalName = 'Copilot AutoRun';
        let terminal = vscode.window.terminals.find(t => t.name === terminalName);
        if (!terminal) {
            terminal = vscode.window.createTerminal({ 
                name: terminalName,
                cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
            });
        }
        
        terminal.show(false); // Show terminal but don't focus it
        terminal.sendText(updatedLineText, true);
        
    } catch (error) {
        console.error('Copilot AutoRun error:', error);
    }
}

function enableAutoRun() {
    if (enabled) return;
    
    enabled = true;
    
    const config = vscode.workspace.getConfiguration('copilotAutoRun');
    const debounceDelay = config.get<number>('debounceDelay', 400);
    
    // Listen for text document changes
    disposables.push(
        vscode.workspace.onDidChangeTextDocument(() => 
            debounce(onEditorChange, debounceDelay)
        )
    );
    
    // Listen for selection changes
    disposables.push(
        vscode.window.onDidChangeTextEditorSelection(() => 
            debounce(onEditorChange, debounceDelay)
        )
    );
    
    updateStatusBar();
    showNotification('Copilot AutoRun: ENABLED ⚠️ Use with caution!');
}

function disableAutoRun() {
    if (!enabled) return;
    
    enabled = false;
    
    // Dispose all event listeners
    disposables.forEach(disposable => disposable.dispose());
    disposables = [];
    
    updateStatusBar();
    showNotification('Copilot AutoRun: DISABLED');
}

function toggleAutoRun() {
    if (enabled) {
        disableAutoRun();
    } else {
        enableAutoRun();
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Copilot AutoRun extension is now active');
    
    // Initialize status bar
    updateStatusBar();
    context.subscriptions.push(statusBarItem);
    
    // Register commands
    const toggleCommand = vscode.commands.registerCommand('copilotAutoRun.toggle', toggleAutoRun);
    const enableCommand = vscode.commands.registerCommand('copilotAutoRun.enable', enableAutoRun);
    const disableCommand = vscode.commands.registerCommand('copilotAutoRun.disable', disableAutoRun);
    
    context.subscriptions.push(toggleCommand, enableCommand, disableCommand);
    
    // Check if we should enable on startup
    const config = vscode.workspace.getConfiguration('copilotAutoRun');
    const enableOnStartup = config.get<boolean>('enableOnStartup', false);
    
    if (enableOnStartup) {
        enableAutoRun();
    }
    
    // Show warning on first activation
    const hasShownWarning = context.globalState.get('hasShownWarning', false);
    if (!hasShownWarning) {
        vscode.window.showWarningMessage(
            'Copilot AutoRun can automatically execute commands. Use only in trusted environments!',
            'I Understand'
        ).then(() => {
            context.globalState.update('hasShownWarning', true);
        });
    }
}

export function deactivate() {
    disableAutoRun();
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}
