enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Format log entry
   */
  private formatLog(
    level: LogLevel,
    message: string,
    data?: any,
    error?: any
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error,
    };
  }

  /**
   * Print log to console
   */
  private print(logEntry: LogEntry): void {
    const colors = {
      DEBUG: '\x1b[36m', // Cyan
      INFO: '\x1b[32m', // Green
      WARN: '\x1b[33m', // Yellow
      ERROR: '\x1b[31m', // Red
    };
    const reset = '\x1b[0m';

    const color = colors[logEntry.level];
    const prefix = `${color}[${logEntry.level}]${reset} ${logEntry.timestamp}`;

    if (logEntry.error) {
      console.error(`${prefix} - ${logEntry.message}`, logEntry.error);
    } else if (logEntry.data) {
      console.log(`${prefix} - ${logEntry.message}`, logEntry.data);
    } else {
      console.log(`${prefix} - ${logEntry.message}`);
    }
  }

  /**
   * Log debug message
   */
  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      const logEntry = this.formatLog(LogLevel.DEBUG, message, data);
      this.print(logEntry);
    }
  }

  /**
   * Log info message
   */
  info(message: string, data?: any): void {
    const logEntry = this.formatLog(LogLevel.INFO, message, data);
    this.print(logEntry);
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: any): void {
    const logEntry = this.formatLog(LogLevel.WARN, message, data);
    this.print(logEntry);
  }

  /**
   * Log error message
   */
  error(message: string, error?: any, data?: any): void {
    const logEntry = this.formatLog(LogLevel.ERROR, message, data, error);
    this.print(logEntry);
  }

  /**
   * Log API request
   */
  logRequest(method: string, path: string, statusCode: number, duration: number): void {
    this.info(`${method} ${path} - ${statusCode} (${duration}ms)`);
  }

  /**
   * Log API error
   */
  logErrorRequest(
    method: string,
    path: string,
    statusCode: number,
    error: string
  ): void {
    this.error(`${method} ${path} - ${statusCode}`, new Error(error));
  }
}

export default new Logger();