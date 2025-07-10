'use client'

import { useEffect } from 'react';

export default function ScrollLockPreventer() {
    useEffect(() => {
        // Create a MutationObserver to watch for style changes on body
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target as HTMLElement;
                    if (target === document.body) {
                        // If something tries to set overflow: hidden, revert it
                        if (document.body.style.overflow === 'hidden') {
                            document.body.style.overflow = 'auto';
                        }
                    }
                }
            });
        });

        // Start observing
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['style']
        });

        // Also prevent any initial scroll lock
        document.body.style.overflow = 'auto';

        // Cleanup
        return () => {
            observer.disconnect();
        };
    }, []);

    // This component doesn't render anything
    return null;
}