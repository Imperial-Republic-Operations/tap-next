import React, { useEffect, useRef, useState } from "react";
import bbobHTML from '@bbob/html';
import presetHTML5 from '@bbob/preset-html5';

interface BBCodeEditorProps {
    placeholder?: string;
    rows?: number;
    value?: string;
    onChange?: (val: string) => void;
    disabled?: boolean;
}

export default function BBCodeEditor({
    placeholder = 'Enter text using BBCode...',
    rows = 6,
    value = '',
    onChange = () => {},
    disabled = false,
}: BBCodeEditorProps) {
    const [inputValue, setInputValue] = useState(value);
    const [previewHtml, setPreviewHtml] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const linkClasses =
        'text-blue-500 underline italic hover:text-blue-700 dark:hover:text-primary-300';

    const updatePreview = (val: string) => {
        const html = bbobHTML(val.replace('\n', '<br />'), presetHTML5());
        setPreviewHtml(html.replaceAll('<a', `<a className='${linkClasses}'`));
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setInputValue(val);
        onChange(val);
        updatePreview(val);
    }

    const insertTag = (open: string, close: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = inputValue?.substring(start, end);

        const newValue =
            inputValue?.substring(0, start) +
            open +
            selectedText +
            close +
            inputValue.substring(end);

        setInputValue(newValue);
        onChange(newValue);
        updatePreview(newValue);

        setTimeout(() => {
            textarea.focus();
            const cursor = start + open.length + selectedText.length + close.length;
            textarea.setSelectionRange(cursor, cursor);
        });
    };

    useEffect(() => {
        updatePreview(inputValue);
    }, []);

    return (
        <div className="space-y-4">
            {/* BBCode Buttons */}
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => insertTag('[b]', '[/b]')}
                    className="px-2 py-1 text-sm rounded bg-primary-300 dark:bg-primary-700"
                >
                    Bold
                </button>
                <button
                    type="button"
                    onClick={() => insertTag('[i]', '[/i]')}
                    className="px-2 py-1 text-sm rounded bg-primary-300 dark:bg-primary-700"
                >
                    Italic
                </button>
                <button
                    type="button"
                    onClick={() => insertTag('[u]', '[/u]')}
                    className="px-2 py-1 text-sm rounded bg-primary-300 dark:bg-primary-700"
                >
                    Underline
                </button>
                <button
                    type="button"
                    onClick={() => insertTag('[url]', '[/url]')}
                    className="px-2 py-1 text-sm rounded bg-primary-300 dark:bg-primary-700"
                >
                    Link
                </button>
                <button
                    type="button"
                    onClick={() => insertTag('[quote]', '[/quote]')}
                    className="px-2 py-1 text-sm rounded bg-primary-300 dark:bg-primary-700"
                >
                    Quote
                </button>
            </div>

            {/* Textarea Input */}
            <textarea
                ref={textareaRef}
                rows={rows}
                placeholder={placeholder}
                value={inputValue}
                disabled={disabled}
                onChange={handleInput}
                onBlur={() => onChange(inputValue)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white p-2 text-sm focus:ring focus:ring-primary-500"
            />

            {/* Live Preview */}
            <div className="border border-dashed border-gray-400 rounded-md p-3 text-sm dark:text-white dark:bg-gray-800">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Preview:</h3>
                <span dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
        </div>
    );
}