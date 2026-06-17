// Main exports — gebruik subpath-imports waar mogelijk voor kleinere
// bundle-impact (bv. @rtvnoord/monitoring/middleware ipv via index).

export {
  reportErrorServer,
  reportErrorClient,
  withErrorReporter,
} from './error-reporter'

export type {
  ReportLevel,
  ReportEnv,
  ErrorReport,
} from './error-reporter'

export { ErrorReporterClient } from './ErrorReporterClient'
export { GlobalError }          from './GlobalError'
export { FeedbackButton }       from './FeedbackButton'
export type { FeedbackButtonProps } from './FeedbackButton'

export {
  withMonitoring,
  monitoringMatcher,
} from './middleware'

export type { MonitoringOptions } from './middleware'
