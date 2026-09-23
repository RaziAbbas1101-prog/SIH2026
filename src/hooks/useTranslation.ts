import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../constants/translations';

export const useTranslation = () => {
    const { language } = useLanguage();
    
    const t = (key: string) => {
        return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en'][key] || key;
    };
    
    return { t };
};
