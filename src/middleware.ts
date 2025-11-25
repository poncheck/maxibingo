import { auth } from "@/auth"
import { NextResponse } from "next/server"

export const runtime = 'nodejs'

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
    const isBetPage = req.nextUrl.pathname.includes('/bet')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

    // Redirect logged-in users away from auth pages
    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Protect dashboard and bet pages
    if ((isDashboard || isBetPage) && !isLoggedIn) {
        const callbackUrl = encodeURIComponent(req.nextUrl.pathname)
        return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.url))
    }

    // Protect admin pages - require login AND admin status
    if (isAdminPage) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/auth/signin', req.url))
        }
        // Check if user is admin
        if (!req.auth?.user?.isAdmin) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
