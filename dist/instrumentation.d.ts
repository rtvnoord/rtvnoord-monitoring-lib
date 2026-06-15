export declare function register(): Promise<void>;
export declare function onRequestError(error: unknown, request: {
    path: string;
    method: string;
    headers: Record<string, string | undefined>;
}, context: {
    routerKind: 'Pages Router' | 'App Router';
    routePath: string;
    routeType: string;
}): Promise<void>;
