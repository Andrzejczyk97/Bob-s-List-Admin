import React, { useContext } from "react";
import { Language } from "../types";
import { LanguageContext } from "./LanguageContext";

import "./LanguageSwitch.css";

const langToFlagMap: Record<Language, string> = {
    en: "🇬🇧",
    es: "🇪🇸",
};
// todo: toggles language on click
// no need of any fancy UX. Just toggle on click :)
export const LanguageSwitchButton: React.FC = () => {
    const { toggleLanguage } = useContext(LanguageContext);
    const { currentLanguage } = useContext(LanguageContext);

    return (
        <div
            data-test="land-switch-button"
            onClick={toggleLanguage}
            data-lang={currentLanguage}
            className="lang-switch"
        >
            {langToFlagMap[currentLanguage]}
        </div>
    );
};
