import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        zh: { translation: zh },
    },
    lng: 'zh', // 默认语言
    fallbackLng: 'zh',
    interpolation: {
        escapeValue: false, // 不需要为 React 转义
    },
});

export default i18n;
