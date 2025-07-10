'use client'

import { useMemo } from 'react';
import bbobHTML from '@bbob/html';
import presetHTML5 from '@bbob/preset-html5';

interface DomSanitizerProps {
    content: string;
}

export function DomSanitizer({ content }: DomSanitizerProps) {
    const sanitizedHtml = useMemo(() => {
        const linkClasses = "text-primary-500 underline italic hover:text-primary-700 dark:hover:text-primary-300";
        const html = bbobHTML(content.replaceAll("\n", "<br />"), presetHTML5());
        return html.replaceAll("<a", `<a class='${linkClasses}'`);
    }, [content]);

    return (
        <span dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    );
}