'use server'

import { signIn } from '@/auth'

export async function signInWithEmail(formData: FormData, callbackUrl: string) {
    const email = formData.get('email') as string
    await signIn('resend', {
        email,
        redirectTo: callbackUrl,
    })
}

export async function signInWithGoogle(callbackUrl: string) {
    await signIn('google', { redirectTo: callbackUrl })
}

export async function signInWithFacebook(callbackUrl: string) {
    await signIn('facebook', { redirectTo: callbackUrl })
}
