export type ReportLevel = 'error' | 'warning' | 'info';
export type ReportEnv = 'production' | 'preview' | 'dev';
export interface ErrorReport {
    message: string;
    stack?: string | null;
    level?: ReportLevel;
    url?: string;
    ua?: string;
    release?: string | null;
    context?: Record<string, unknown>;
}
export declare function reportErrorServer(error: unknown, partial?: Partial<ErrorReport>): Promise<void>;
export declare function withErrorReporter<TArgs extends any[], TReturn>(handler: (...args: TArgs) => Promise<TReturn>): (...args: TArgs) => Promise<TReturn>;
export declare function reportErrorClient(error: unknown, partial?: Partial<ErrorReport>): Promise<void>;
