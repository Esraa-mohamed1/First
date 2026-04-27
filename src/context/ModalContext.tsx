'use client';

import React, { createContext, useContext, useState } from 'react';

type ModalType = 'registration' | 'login' | 'create-course' | null;

interface ModalContextType {
    isOpen: boolean;
    view: ModalType;
    data: any;
    openModal: (view: ModalType, data?: any) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<ModalType>(null);
    const [data, setData] = useState<any>(null);

    const openModal = (view: ModalType, data: any = null) => {
        setView(view);
        setData(data);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setView(null);
        setData(null);
    };

    return (
        <ModalContext.Provider value={{ isOpen, view, data, openModal, closeModal }}>
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
