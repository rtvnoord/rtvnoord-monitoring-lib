import { NextResponse, type NextRequest } from 'next/server';
export declare function POST(req: NextRequest): Promise<NextResponse<{
    ok: boolean;
}>>;
