import LoggerSingleton from '../ActionSingletons/LoggerSingleton.js';
import SentrySingleton from '../ServiceSingletons/SentrySingleton.js';

class LoggerService {
  loggerInstance = null;

  sentryInstance = null;

  constructor(logger, sentry) {
    this.loggerInstance = logger;
    this.sentryInstance = sentry;
  }

  log(message) {
    this.loggerInstance.log(message);
  }

  info(message) {
    this.loggerInstance.info(message);
  }

  warn(message) {
    this.loggerInstance.warn(message);
  }

  error(message, Error) {
    this.loggerInstance.error(message, Error.message);
    this.sentryInstance.captureException(Error);
  }

  fatal(message, Error) {
    this.loggerInstance.fatal(message, Error.message);
    this.sentryInstance.captureException(Error);
  }
}

export default new LoggerService(LoggerSingleton, SentrySingleton);
