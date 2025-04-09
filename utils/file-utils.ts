import prettier from "prettier/standalone"
import parserBabel from "prettier/parser-babel"
import parserHtml from "prettier/parser-html"
import parserCss from "prettier/parser-postcss"
import parserMarkdown from "prettier/parser-markdown"
import parserTypescript from "prettier/parser-typescript"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"

/**
 * Supported file types for drag and drop
 */
export const SUPPORTED_FILE_TYPES = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".html",
  ".css",
  ".scss",
  ".json",
  ".md",
  ".py",
  ".rb",
  ".java",
  ".c",
  ".cpp",
  ".cs",
  ".go",
  ".rs",
  ".php",
  ".sql",
  ".txt",
  ".csv",
  ".xml",
  ".yaml",
  ".yml",
  ".sh",
  ".bat",
  ".ps1",
  ".env",
  ".gitignore",
  ".eslintrc",
  ".prettierrc",
  ".babelrc",
]

export const MAX_FILE_SIZE = 5 * 1024 * 1024

/** No‐op sanitizer (you can hook in DOMPurify or similar if you like) */
export const sanitizeInput = (code: string): string => code

export const readFileAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) =>
      e.target?.result ? resolve(e.target.result as string) : reject(new Error("Failed to read file"))
    reader.onerror = () => reject(new Error("Error reading file"))
    reader.readAsText(file)
  })

/** Extension‐based detection */
export const detectLanguage = (fileName: string): string => {
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase()
  const map: Record<string, string> = {
    ".js": "javascript",
    ".jsx": "jsx",
    ".ts": "typescript",
    ".tsx": "tsx",
    ".html": "html",
    ".css": "css",
    ".scss": "scss",
    ".json": "json",
    ".md": "markdown",
    ".py": "python",
    ".rb": "ruby",
    ".java": "java",
    ".c": "c",
    ".cpp": "cpp",
    ".cs": "csharp",
    ".go": "go",
    ".rs": "rust",
    ".php": "php",
    ".sql": "sql",
    ".sh": "bash",
    ".bat": "batch",
    ".ps1": "powershell",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".xml": "xml",
    ".env": "ini",
    ".gitignore": "plaintext",
    ".eslintrc": "json",
    ".prettierrc": "json",
    ".babelrc": "json",
  }
  return map[ext] || "plaintext"
}

/**
 * Content‐based detection (fixed regexes: use single `$` for end‐of‐line)
 */
export const detectCodeLanguage = (code: string): string => {
  try {
    // JSX / React
    if (/import\s+React|from\s+['"]react['"]|className=/.test(code)) return "jsx"
    // TS vs JS
    if (/(import\s+.*from|export\s+|const\s+\w+\s*=)/.test(code)) {
      if (/: *\w+Type\b|interface\s+\w+|<\w+>/.test(code)) return "typescript"
      return "javascript"
    }
    // HTML
    if (/<html|<body|<div|<span|<p>/.test(code)) return "html"
    // CSS
    if (/\.class\s*{|#\w+\s*{|body\s*{|margin:|padding:/.test(code)) return "css"
    // Python
    if (/^\s*def\s+\w+\s*\(|import\s+\w+|class\s+\w+\s*:/.test(code)) return "python"
    // Java
    if (/public\s+class|void\s+\w+\s*\(/.test(code)) return "java"
    // SQL
    if (/\b(SELECT|FROM|WHERE|INSERT\s+INTO)\b/.test(code.toUpperCase())) return "sql"
    // Go
    if (/func\s+\w+\s*\(|package\s+\w+|import\s+"[\w/]+"/.test(code)) return "go"
    // Rust
    if (/fn\s+\w+\s*\(|let\s+mut\s+|impl\s+|struct\s+\w+/.test(code)) return "rust"
    // C/C++
    if (/^\s*#include|int\s+main\s*\(|std::/.test(code)) return "cpp"
    // PHP
    if (/^\s*<\?php/.test(code)) return "php"
    // Shell
    if (/^#!.*\b(bash|sh)\b/.test(code)) return "bash"
    // Arrow funcs / var
    if (/function\s+\w+\s*\(|\(\s*[\w,\s]*\)\s*=>|var\s+\w+\s*=/.test(code)) return "javascript"
    // JSON
    try {
      JSON.parse(code)
      return "json"
    } catch {
      /* not JSON */
    }
    // Fallbacks
    if (/[{}]/.test(code) && /;$/.test(code.trim().split("\n").pop() || "")) return "javascript"
    if (/^\s*#/.test(code)) return "python"
    return "plaintext"
  } catch (e) {
    console.warn("Language detection failed, using plaintext:", e)
    return "plaintext"
  }
}

/**
 * Basic indentation‐only formatter
 */
const formatIndentation = (code: string): string => {
  const lines = code.split("\n")
  const out: string[] = []
  let indent = 0
  const inc = [/:$/, /\{$/, /\[$/, /\($/]
  const dec = [/^\s*\}/, /^\s*\]/, /^\s*\)/]
  for (let line of lines) {
    line = line.trim()
    if (dec.some((r) => r.test(line))) indent = Math.max(0, indent - 1)
    out.push("  ".repeat(indent) + line)
    if (inc.some((r) => r.test(line))) indent++
  }
  return out.join("\n")
}

/**
 * Prettier‐powered formatter (with correct parsers for JSX/TSX)
 */
export const formatCode = async (
  code: string,
  language: string
): Promise<string> => {
  const lang = language || "plaintext"
  const text = sanitizeInput(code)

  try {
    const parserMap: Record<string, string> = {
      javascript: "babel",
      jsx: "babel",
      typescript: "typescript",
      tsx: "typescript",
      html: "html",
      css: "css",
      scss: "scss",
      json: "json",
      markdown: "markdown",
    }
    const parser = parserMap[lang]
    if (parser) {
      return await prettier.format(text, {
        parser,
        plugins: [
          parserBabel,
          parserHtml,
          parserCss,
          parserMarkdown,
          parserTypescript,
        ],
        printWidth: 80,
        tabWidth: 2,
        singleQuote: true,
        trailingComma: "es5",
        bracketSpacing: true,
        semi: true,
      })
    }
    return formatIndentation(text)
  } catch (err) {
    console.warn(`Prettier failed on ${lang}, falling back:`, err)
    return formatIndentation(text)
  }
}

/** Heuristic: is this text even code? */
export const isLikelyCode = (text: string): boolean => {
  const pats = [
    /function\s+\w+\s*\(/i,
    /class\s+\w+/i,
    /import\s+.*from/i,
    /export\s+/i,
    /<\w+>.*<\/\w+>/i,
    /const\s+\w+\s*=/i,
    /let\s+\w+\s*=/i,
    /var\s+\w+\s*=/i,
    /if\s*\(.*\)\s*\{/,
    /for\s*\(.*\)\s*\{/,
    /while\s*\(.*\)\s*\{/,
    /switch\s*\(.*\)\s*\{/,
    /\w+\s*=>/,
    /def\s+\w+\s*\(/i,
    /public\s+class/i,
    /SELECT\s+.*\s+FROM/i,
    /CREATE\s+TABLE/i,
    /^\s*@\w+/m,
    /^\s*#include/m,
    /^\s*package\s+\w+/m,
    /^\s*using\s+\w+/m,
  ]
  const hasP = pats.some((r) => r.test(text))
  const hasB = /[{};]/.test(text)
  const hasI = /^( {2,}|\t+)/m.test(text)
  const multi = text.includes("\n")
  return (hasP && (hasB || hasI || multi)) || (hasI && hasB)
}

/** Process a dropped file */
export const processDroppedFile = async (
  file: File
): Promise<{ content: string; language: string; fileName: string }> => {
  if (file.size > MAX_FILE_SIZE)
    throw new Error(`File too large (max ${MAX_FILE_SIZE / 1e6}MB)`)
  const content = await readFileAsText(file)
  const language = detectLanguage(file.name)
  return { content, language, fileName: file.name }
}

/** Build a Markdown‐style code block (for export/download) */
export const createCodeBlockFromFile = async (
  file: File
): Promise<string> => {
  const { content, language, fileName } = await processDroppedFile(file)
  const formatted = await formatCode(content, language).catch(() => content)
  return `File: ${fileName}\n\n\`\`\`${language}\n${formatted}\n\`\`\``
}

/** Format a pasted snippet & detect its language */
export const formatPastedCode = async (
  code: string
): Promise<{ formattedCode: string; language: string }> => {
  const language = detectCodeLanguage(code)
  const formattedCode = await formatCode(code, language)
  return { formattedCode, language }
}

export const isSupportedFile = (fileName: string): boolean =>
  SUPPORTED_FILE_TYPES.includes(
    fileName.slice(fileName.lastIndexOf(".")).toLowerCase()
  )

export const getLanguageFriendlyName = (lang: string): string => {
  const names: Record<string, string> = {
    javascript: "JavaScript",
    jsx: "React JSX",
    typescript: "TypeScript",
    tsx: "React TSX",
    html: "HTML",
    css: "CSS",
    scss: "SCSS",
    json: "JSON",
    markdown: "Markdown",
    python: "Python",
    ruby: "Ruby",
    java: "Java",
    c: "C",
    cpp: "C++",
    csharp: "C#",
    go: "Go",
    rust: "Rust",
    php: "PHP",
    sql: "SQL",
    bash: "Bash",
    plaintext: "Plain Text",
  }
  return names[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)
}

