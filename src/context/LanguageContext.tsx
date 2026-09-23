import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext<{ language: string; setLanguage: (lang: string) => void } | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState(localStorage.getItem('preferredLanguage') || 'en');

    useEffect(() => {
        localStorage.setItem('preferredLanguage', language);
    }, [language]);

    return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext)!;
