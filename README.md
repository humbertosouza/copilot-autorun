# Copilot AutoRun

A VS Code extension that automatically accepts and executes GitHub Copilot suggestions in the integrated terminal.

## ⚠️ Security Warning

**This extension automatically executes commands suggested by GitHub Copilot. Use only in trusted environments and with trusted code. Review all suggestions before enabling auto-run mode.**

## Features

- 🚀 Automatically accept GitHub Copilot inline suggestions
- ⚡ Execute accepted suggestions directly in the integrated terminal
- 🎯 Configurable language filtering (shell scripts, PowerShell, etc.)
- 🔄 Toggle auto-run mode on/off easily
- 📊 Status bar indicator showing current state
- ⚙️ Configurable delays and behaviors

## Installation

### From Source

1. Clone or download this repository
2. Open the project folder in VS Code
3. Install dependencies:
   ```bash
   npm install
   ```
4. Compile the TypeScript:
   ```bash
   npm run compile
   ```
5. Press `F5` to open a new Extension Development Host window

### Package and Install

1. Install VSCE (Visual Studio Code Extension manager):
   ```bash
   npm install -g vsce
   ```
2. Package the extension:
   ```bash
   npm run package
   ```
3. Install the generated `.vsix` file:
   ```bash
   code --install-extension copilot-autorun-0.1.0.vsix
   ```

## Usage

### Quick Start

1. **Toggle AutoRun**: Press `Ctrl+Alt+R` (or `Cmd+Alt+R` on Mac)
2. **Status Bar**: Click the AutoRun indicator in the status bar
3. **Command Palette**: 
   - `Copilot AutoRun: Toggle AutoRun`
   - `Copilot AutoRun: Enable AutoRun`
   - `Copilot AutoRun: Disable AutoRun`

### How It Works

1. When enabled, the extension monitors text changes in the editor
2. It triggers GitHub Copilot inline suggestions
3. Automatically accepts the suggestions after a configurable delay
4. Executes the current line in a dedicated terminal named "Copilot AutoRun"

### Safety Features

- **Language Filtering**: Only works with specified file types (shell scripts by default)
- **Comment Detection**: Skips lines that start with `#`, `//`, or `/*`
- **Empty Line Skipping**: Ignores empty lines or whitespace-only lines
- **Status Indicator**: Always shows current state in the status bar
- **Warning on First Use**: Shows security warning on first activation

## Configuration

Access settings via `File > Preferences > Settings` and search for "Copilot AutoRun":

### Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `copilotAutoRun.allowedLanguages` | array | `["shellscript", "powershell", "batch"]` | Language IDs where auto-run is allowed |
| `copilotAutoRun.debounceDelay` | number | `400` | Delay (ms) before triggering auto-run after text changes |
| `copilotAutoRun.suggestionDelay` | number | `200` | Delay (ms) to wait for suggestions before accepting |
| `copilotAutoRun.enableOnStartup` | boolean | `false` | Enable auto-run when VS Code starts |
| `copilotAutoRun.showNotifications` | boolean | `true` | Show notifications when toggling auto-run |

### Example Configuration

```json
{
  "copilotAutoRun.allowedLanguages": ["shellscript", "powershell", "python"],
  "copilotAutoRun.debounceDelay": 300,
  "copilotAutoRun.suggestionDelay": 150,
  "copilotAutoRun.enableOnStartup": false,
  "copilotAutoRun.showNotifications": true
}
```

## Language Support

By default, auto-run works with:
- Shell scripts (`shellscript`)
- PowerShell (`powershell`) 
- Batch files (`batch`)

To enable for other languages, add their language IDs to `allowedLanguages`. Common language IDs:
- `python` - Python files
- `javascript` - JavaScript files
- `typescript` - TypeScript files
- `json` - JSON files

Set `allowedLanguages` to an empty array `[]` to allow all languages (not recommended).

## Commands

| Command | Keybinding | Description |
|---------|------------|-------------|
| `copilotAutoRun.toggle` | `Ctrl+Alt+R` | Toggle auto-run mode |
| `copilotAutoRun.enable` | - | Enable auto-run mode |
| `copilotAutoRun.disable` | - | Disable auto-run mode |

## Development

### Building

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode for development
npm run watch

# Lint code
npm run lint

# Package extension
npm run package
```

### Project Structure

```
copilot-autorun/
├── src/
│   └── extension.ts       # Main extension code
├── package.json          # Extension manifest
├── tsconfig.json         # TypeScript configuration
├── .eslintrc.js          # ESLint configuration
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Troubleshooting

### Extension Not Working

1. **Check GitHub Copilot**: Ensure GitHub Copilot extension is installed and active
2. **Verify Language**: Check if current file language is in `allowedLanguages`
3. **Status Bar**: Confirm AutoRun is enabled (green indicator)
4. **Terminal**: Look for "Copilot AutoRun" terminal for executed commands

### Performance Issues

1. **Increase Delays**: Try higher values for `debounceDelay` and `suggestionDelay`
2. **Reduce Languages**: Limit `allowedLanguages` to only necessary file types
3. **Disable Notifications**: Set `showNotifications` to `false`

### Security Concerns

1. **Review Code**: Always review suggestions before enabling auto-run
2. **Trusted Repos**: Only use in repositories you trust
3. **Language Restrictions**: Keep `allowedLanguages` as restrictive as possible
4. **Quick Disable**: Use `Ctrl+Alt+R` to quickly disable when needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This extension automatically executes code suggestions. The authors are not responsible for any damage caused by executed commands. Use at your own risk and only in trusted environments.
