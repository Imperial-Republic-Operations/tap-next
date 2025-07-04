'use client';

import { createContext, useContext } from 'react';

const NotFoundContext = createContext(false);

export function NotFoundProvider({ children }: { children: React.ReactNode }) {
    return (
        <NotFoundContext.Provider value={true}>
            {children}
        </NotFoundContext.Provider>
    );
}

export function useIsNotFound() {
    return useContext(NotFoundContext);
}