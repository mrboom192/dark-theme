import fs from "fs";
import path from "path";

const readJson = (relativePath) => {
  const filePath = path.resolve(process.cwd(), relativePath);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const palette = readJson("src/palette.json");
const semantic = readJson("src/semantic.json");
const themeMeta = readJson("src/theme.json");
const colorMap = readJson("src/vscode-colors.json");
const tokenColors = readJson("src/tokens.json");

const resolveRef = (ref, stack) => {
  if (ref.startsWith("@palette.")) {
    const key = ref.slice("@palette.".length);
    const value = palette[key];
    if (!value) {
      throw new Error(`Missing palette entry: ${key}`);
    }
    return value;
  }

  if (ref.startsWith("@semantic.")) {
    const key = ref.slice("@semantic.".length);
    if (stack.includes(key)) {
      throw new Error(`Circular semantic reference: ${[...stack, key].join(" -> ")}`);
    }
    const value = semantic[key];
    if (!value) {
      throw new Error(`Missing semantic entry: ${key}`);
    }
    return resolveValue(value, [...stack, key]);
  }

  return ref;
};

const resolveValue = (value, stack = []) => {
  if (typeof value === "string") {
    if (value.startsWith("@palette.") || value.startsWith("@semantic.")) {
      return resolveRef(value, stack);
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveValue(item, stack));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, resolveValue(val, stack)])
    );
  }

  return value;
};

const resolvedColors = resolveValue(colorMap);
const resolvedTokenColors = resolveValue(tokenColors);

const theme = {
  ...themeMeta,
  colors: resolvedColors,
  tokenColors: resolvedTokenColors
};

const outputPath = path.resolve(process.cwd(), "themes/dark-theme.json");
fs.writeFileSync(outputPath, JSON.stringify(theme, null, 2) + "\n");

console.log("Theme built:", outputPath);
