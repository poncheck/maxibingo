import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import Resend from "next-auth/providers/resend"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
        Resend({
            apiKey: process.env.RESEND_API_KEY,
            from: process.env.EMAIL_FROM,
        }),
    ],
    pages: {
        signIn: '/auth/signin',
        verifyRequest: '/auth/verify-request',
        signOut: '/auth/signout',
        error: '/auth/error',
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            // If url is relative, prepend baseUrl
            if (url.startsWith("/")) {
                // If redirecting to signin page (default behavior sometimes), go to dashboard instead
                if (url === '/auth/signin') return `${baseUrl}/dashboard`
                return `${baseUrl}${url}`
            }
            // If url is on same origin, allow it
            if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id
            }
            return session
        },
    },
})
