import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Renamed from 'middleware' to 'proxy' for Next.js 16
export function proxy(req: NextRequest) {
    const hostname = req.headers.get('host') || ''
    
    // Check if we are on the admin subdomain
    const isAdminSubdomain = hostname.startsWith('admin.')

    if (isAdminSubdomain) {
        // If the URL doesn't already start with /admin, rewrite it internally
        if (!req.nextUrl.pathname.startsWith('/admin')) {
            const url = req.nextUrl.clone()
            url.pathname = `/admin${req.nextUrl.pathname}`
            return NextResponse.rewrite(url)
        }
    }

    return NextResponse.next()
}

export const config = {
    // Match all paths except static files and public assets
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}