'use client'

import { useRouter } from 'next/navigation'

export default function BetButton({
    slug,
    isLoggedIn,
}: {
    slug: string
    isLoggedIn: boolean
}) {
    const router = useRouter()

    function handleClick() {
        if (!isLoggedIn) {
            router.push(`/auth/signin?callbackUrl=/pool/${slug}/bet`)
        } else {
            router.push(`/pool/${slug}/bet`)
        }
    }

    return (
        <button
            onClick={handleClick}
            className="px-8 py-4 rounded-xl gradient-primary text-white text-lg font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-smooth"
        >
            🎯 Postaw Zakład
        </button>
    )
}
