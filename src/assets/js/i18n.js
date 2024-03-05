import { createI18n } from 'vue-i18n';
import textsEn from '../data/texts-en.json';
import textsEs from '../data/texts-es.json';

const messages = {
    en: textsEn,
    es: textsEs
};

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages
});

export default i18n;