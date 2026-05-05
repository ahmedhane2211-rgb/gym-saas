import React, { createContext, useMemo } from "react";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
    const { i18n, t } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
    };

    const value = useMemo(() => ({
        toggleLanguage,
        t,
        i18n,
    }), [i18n.language, t]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export { LanguageContext, LanguageProvider };