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
            async sendVerificationRequest({ identifier: email, url, provider }) {
                const { host } = new URL(url)
                const res = await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${provider.apiKey}`,
                    },
                    body: JSON.stringify({
                        from: provider.from,
                        to: email,
                        subject: `Zaloguj się do ${host}`,
                        html: `
                            <body style="background: #f9f9f9;">
                                <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: #fff; max-width: 600px; margin: auto; border-radius: 10px;">
                                    <tr>
                                        <td align="center" style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #6366f1;">
                                            <img src="https://babybingo.online/logo.png" alt="BabyBingo" width="60" height="60" style="vertical-align: middle; margin-right: 8px;" />
                                            <strong>BabyBingo</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding: 20px 0;">
                                            <table border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td align="center" style="border-radius: 5px;" bgcolor="#6366f1">
                                                        <a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #fff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #6366f1; display: inline-block; font-weight: bold;">
                                                            Zaloguj się
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #333;">
                                            Jeśli nie prosiłeś o ten email, możesz go zignorować.
                                        </td>
                                    </tr>
                                </table>
                            </body>
                        `,
                    }),
                })

                if (!res.ok) {
                    throw new Error("Resend error: " + JSON.stringify(await res.json()))
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth/signin',
        verifyRequest: '/auth/verify-request',
        signOut: '/auth/signout',
        error: '/auth/error',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            // Auto-link accounts with same email
            if (account?.provider === 'google' || account?.provider === 'facebook') {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! }
                })

                if (existingUser) {
                    // Check if account already linked
                    const existingAccount = await prisma.account.findUnique({
                        where: {
                            provider_providerAccountId: {
                                provider: account.provider,
                                providerAccountId: account.providerAccountId
                            }
                        }
                    })

                    // If not linked, link it
                    if (!existingAccount) {
                        await prisma.account.create({
                            data: {
                                userId: existingUser.id,
                                type: account.type,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                refresh_token: account.refresh_token,
                                access_token: account.access_token,
                                expires_at: account.expires_at,
                                token_type: account.token_type,
                                scope: account.scope,
                                id_token: account.id_token,
                                session_state: account.session_state as string,
                            }
                        })
                    }
                }
            }
            return true
        },
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
                session.user.isAdmin = user.isAdmin || false
            }
            return session
        },
    },
})
