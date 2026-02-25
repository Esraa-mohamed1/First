'use client';

import React, { createContext, useContext, useState } from 'react';

type ModalType = 'registration' | 'login' | null;

interface ModalContextType {
    isOpen: boolean;
    view: ModalType;
    openModal: (view: ModalType) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<ModalType>(null);

    const openModal = (view: ModalType) => {
        setView(view);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setView(null);
    };

    return (
        <ModalContext.Provider value={{ isOpen, view, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}
