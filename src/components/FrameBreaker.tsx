"use client";

import { useEffect } from "react";

export default function FrameBreaker() {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const link = (e.target as HTMLElement).closest('a[href]');
            if (link) {
                const href = (link as HTMLAnchorElement).href;
                // Check if it's an internal anchor link (hash) or same page, maybe we want to allow those? 
                // But user said "Any navigation should replace the top window".
                // Let's stick to the user's snippet logic.

                // If the link has target="_blank", let it be.
                if ((link as HTMLAnchorElement).target === "_blank") return;

                e.preventDefault();
                window.top!.location.href = href;
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    return null;
}
