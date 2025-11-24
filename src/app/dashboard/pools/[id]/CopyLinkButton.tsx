'use client'

import { useState } from 'react'

export default function CopyLinkButton({ url }: { url: string }) {
    const [copied, setCopied] = useState(false)

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <button
            onClick={copyToClipboard}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-smooth font-semibold"
        >
            {copied ? '✓ Skopiowano!' : '📋 Kopiuj'}
        </button>
    )
}
