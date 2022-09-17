import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

i18next.use(initReactI18next).init({
    fallbackLng: 'en',
    resources: {
        en: {
            translation: {
                'browse_dao': {
                    'section_1': {
                        'title': 'Not So Popular',
                    }
                }
            },
        },
    },
});