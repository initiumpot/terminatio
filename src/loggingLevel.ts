export type LoggingLevel = typeof logLevels[number]
export const logLevels = ['none', 'error', 'warn', 'info', 'debug'] as const

export const canLog = (level: LoggingLevel) => logLevels.indexOf(getLogLevel()) >= logLevels.indexOf(level)

// Very opinionated logging
if (!globalThis.logLevel) {
  if (typeof process !== 'undefined') {
    globalThis.logLevel = process.env['LOG_LEVEL'] as LoggingLevel || 'info'
  } else {
    globalThis.logLevel = 'error'
  }
}

export function getLogLevel(): LoggingLevel {
  return globalThis.logLevel as LoggingLevel
}

export function setLogLevel(level: LoggingLevel) {
  globalThis.logLevel = level
}