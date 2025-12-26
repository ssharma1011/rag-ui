/**
 * Detects if text contains error logs, stack traces, or exceptions
 */
export function detectLogs(text: string): boolean {
  if (!text || text.trim().length === 0) return false;

  const patterns = [
    // Java/Kotlin stack traces
    /at\s+[\w.$]+\([\w.]+:\d+\)/,
    /^\s+at\s+/m,

    // Exception keywords
    /Exception|Error|Throwable/i,
    /Caused by:/i,
    /Exception in thread/i,

    // Log levels with timestamps
    /\d{4}-\d{2}-\d{2}[\sT]\d{2}:\d{2}:\d{2}.*?(ERROR|WARN|FATAL|Exception)/i,
    /\[\d{4}-\d{2}-\d{2}.*?\]\s*(ERROR|WARN|FATAL)/i,

    // Common log patterns
    /^(ERROR|WARN|FATAL|SEVERE)[:|\s]/m,
    /^\d{4}-\d{2}-\d{2}.*?(ERROR|WARN|FATAL)/m,

    // Python stack traces
    /Traceback \(most recent call last\)/i,
    /File ".*?", line \d+/,

    // JavaScript/Node stack traces
    /Error:\s+.*?\n\s+at\s+/,
    /^\s+at\s+.*?\(.*?:\d+:\d+\)/m,

    // C#/.NET stack traces
    /at\s+[\w.]+\.[\w.]+\(.*?\)\s+in\s+.*?:line\s+\d+/,

    // Generic error patterns
    /\[ERROR\]|\[WARN\]|\[FATAL\]/,
    /failed|failure|crashed|crash/i,
  ];

  return patterns.some(pattern => pattern.test(text));
}

/**
 * Counts the number of log lines in text
 */
export function countLogLines(text: string): number {
  if (!detectLogs(text)) return 0;

  const lines = text.split('\n');
  let logLineCount = 0;

  for (const line of lines) {
    if (
      /^\s+at\s+/.test(line) || // Stack trace line
      /^(ERROR|WARN|FATAL|INFO|DEBUG)[:|\s]/.test(line) || // Log level
      /Exception|Error|Throwable/.test(line) || // Exception
      /Caused by:|at\s+[\w.$]+\(/.test(line) // Cause or stack
    ) {
      logLineCount++;
    }
  }

  return logLineCount || lines.length; // Return total lines if can't count specific log lines
}

/**
 * Extracts the requirement (user's message) from text containing logs
 * Returns the first non-log line or lines before logs start
 */
export function extractRequirement(text: string): string {
  const lines = text.split('\n');
  const requirementLines: string[] = [];

  for (const line of lines) {
    // Check if this line looks like a log
    if (
      /^\s+at\s+/.test(line) ||
      /^(ERROR|WARN|FATAL|INFO|DEBUG)[:|\s]/.test(line) ||
      /Exception|Error|Throwable/.test(line) ||
      /Caused by:|at\s+[\w.$]+\(/.test(line) ||
      /\d{4}-\d{2}-\d{2}.*?(ERROR|WARN|FATAL)/.test(line)
    ) {
      // Stop collecting when we hit logs
      break;
    }

    if (line.trim().length > 0) {
      requirementLines.push(line);
    }
  }

  if (requirementLines.length > 0) {
    return requirementLines.join('\n').trim();
  }

  // Fallback: return first sentence or first line
  const firstLine = lines.find(l => l.trim().length > 0);
  return firstLine || text.substring(0, 100);
}

/**
 * Extracts just the log content from text
 */
export function extractLogs(text: string): string {
  const requirement = extractRequirement(text);

  // If requirement is the same as text, no logs to extract
  if (requirement === text.trim()) {
    return detectLogs(text) ? text : '';
  }

  // Return everything after the requirement
  const logsPart = text.substring(requirement.length).trim();
  return logsPart;
}

/**
 * Validates file type for log uploads
 */
export function isValidLogFile(file: File): boolean {
  const validExtensions = ['.log', '.txt', '.out', '.err'];
  const fileName = file.name.toLowerCase();

  return validExtensions.some(ext => fileName.endsWith(ext));
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
