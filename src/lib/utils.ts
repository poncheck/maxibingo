import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function generateSlug(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let slug = ''
    for (let i = 0; i < 8; i++) {
        slug += chars[Math.floor(Math.random() * chars.length)]
    }
    return slug
}

export function formatCurrency(amount: number, currency: string = 'PLN'): string {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: currency,
    }).format(amount)
}

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date)
}
