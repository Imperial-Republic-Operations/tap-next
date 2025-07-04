'use client'

type Props = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
    const isNumber = (value: unknown): value is number => typeof value === 'number';

    const getPages = (): (number | string)[] => {
        if (totalPages <= 5) return Array.from({length: totalPages}, (_, i) => i);

        const pages: (number | string)[] = [0, 1];

        if (currentPage > 2) pages.push('...');

        if (currentPage > 1 && currentPage < totalPages - 2) {
            pages.push(currentPage);
        }

        if (currentPage < totalPages - 3) pages.push('...');

        pages.push(totalPages - 2, totalPages - 1);

        return pages;
    }

    return (
        <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
            <div className="-mt-px flex w-0 flex-1">
                <button
                    onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
                    className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    <svg className="mr-3 size-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                            fillRule="evenodd"
                            d="M18 10a.75.75 0 0 1-.75.75H4.66l2.1 1.95a.75.75 0 1 1-1.02 1.1l-3.5-3.25a.75.75 0 0 1 0-1.1l3.5-3.25a.75.75 0 1 1 1.02 1.1l-2.1 1.95h12.59A.75.75 0 0 1 18 10Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Previous
                </button>
            </div>

            <div className="hidden md:-mt-px md:flex">
                {getPages().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => isNumber(page) && onPageChange(page)}
                        className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                            page === currentPage
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                        }`}
                    >
                        {isNumber(page) ? page + 1 : page}
                    </button>
                ))}
            </div>

            <div className="-mt-px flex w-0 flex-1 justify-end">
                <button
                    onClick={() => currentPage + 1 < totalPages && onPageChange(currentPage + 1)}
                    className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    Next
                    <svg className="ml-3 size-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                            fillRule="evenodd"
                            d="M2 10a.75.75 0 0 1 .75-.75h12.59l-2.1-1.95a.75.75 0 1 1 1.02-1.1l3.5 3.25a.75.75 0 0 1 0 1.1l-3.5 3.25a.75.75 0 1 1-1.02-1.1l2.1-1.95H2.75A.75.75 0 0 1 2 10Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </nav>
    );
}