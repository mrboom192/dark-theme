# Dark Theme

A VS Code dark theme with a split palette + semantic token layer for easy iteration.

## Structure

- `src/palette.json` base color values
- `src/semantic.json` semantic tokens that map to the palette
- `src/vscode-colors.json` VS Code UI color mappings (uses semantic tokens)
- `src/tokens.json` syntax highlighting rules (uses semantic tokens)
- `scripts/build-theme.mjs` build script that generates the final theme
- `themes/dark-theme.json` generated theme output

## Build

```sh
npm run build
```

Make changes in `src/` and rebuild to update `themes/dark-theme.json`.

## Packaging

```sh
npx vsce package
```

## This will generate a .vsix file that can be installed via VSCode extensions.
