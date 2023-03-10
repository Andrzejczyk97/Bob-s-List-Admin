import React from "react";
import { Language } from "../types";

interface LanguageState {
    currentLanguage: Language;
    toggleLanguage: () => void;
}

interface LanguageProviderProps {
    children: React.ReactNode;
}

export const LanguageContext = React.createContext<LanguageState>({
    currentLanguage: "en",
    toggleLanguage: () => {},
});

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = React.useState<Language>("en");

    const toggleLanguage = React.useCallback(() => {
        setCurrentLanguage((language) => (language === "en" ? "es" : "en"));
    }, []);

    const contextValue = {
        currentLanguage,
        toggleLanguage,
    };
    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};
