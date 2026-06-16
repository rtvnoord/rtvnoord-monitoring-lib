"use strict";
// Main exports — gebruik subpath-imports waar mogelijk voor kleinere
// bundle-impact (bv. @rtvnoord/monitoring/middleware ipv via index).
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitoringMatcher = exports.withMonitoring = exports.GlobalError = exports.ErrorReporterClient = exports.withErrorReporter = exports.reportErrorClient = exports.reportErrorServer = void 0;
var error_reporter_1 = require("./error-reporter");
Object.defineProperty(exports, "reportErrorServer", { enumerable: true, get: function () { return error_reporter_1.reportErrorServer; } });
Object.defineProperty(exports, "reportErrorClient", { enumerable: true, get: function () { return error_reporter_1.reportErrorClient; } });
Object.defineProperty(exports, "withErrorReporter", { enumerable: true, get: function () { return error_reporter_1.withErrorReporter; } });
var ErrorReporterClient_1 = require("./ErrorReporterClient");
Object.defineProperty(exports, "ErrorReporterClient", { enumerable: true, get: function () { return ErrorReporterClient_1.ErrorReporterClient; } });
var GlobalError_1 = require("./GlobalError");
Object.defineProperty(exports, "GlobalError", { enumerable: true, get: function () { return GlobalError_1.GlobalError; } });
var middleware_1 = require("./middleware");
Object.defineProperty(exports, "withMonitoring", { enumerable: true, get: function () { return middleware_1.withMonitoring; } });
Object.defineProperty(exports, "monitoringMatcher", { enumerable: true, get: function () { return middleware_1.monitoringMatcher; } });
