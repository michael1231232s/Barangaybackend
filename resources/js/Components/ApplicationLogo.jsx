import { usePage } from '@inertiajs/react';

/**
 * Barangay seal — `public/images/barangaylogo.png` (URL from shared `branding.logoUrl`).
 */
export default function ApplicationLogo({ className = '', alt = 'Barangay logo' }) {
    const fallback = '/images/barangaylogo.png';
    const logoUrl = usePage().props.branding?.logoUrl ?? fallback;

    return (
        <img
            src={logoUrl}
            alt={alt}
            className={`object-contain ${className}`.trim()}
        />
    );
}
