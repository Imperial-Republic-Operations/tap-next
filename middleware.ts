import { NextRequest, NextResponse } from 'next/server'

// Add BigInt serialization support globally
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export function middleware(request: NextRequest) {
    // For now, just pass through all requests
    // Authentication will be handled by the auth API routes and client-side session management
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}