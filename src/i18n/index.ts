import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      appName: 'HACHEF SCHÉMA ÉLECTRIQUE AI PRO',
      developer: 'HACHEF OUSSAMA',
      
      // Language selector
      selectLanguage: 'اختر اللغة',
      arabic: 'العربية',
      french: 'Français',
      english: 'English',
      continue: 'متابعة',
      
      // Navigation
      home: 'الرئيسية',
      analyze: 'تحليل',
      catalogs: 'الكتالوجات',
      calculators: 'الحاسبات',
      saved: 'المحفوظات',
      settings: 'الإعدادات',
      about: 'حول',
      
      // Home screen
      welcome: 'مرحباً بك',
      subtitle: 'محلل متقدم للمخططات الكهربائية بالذكاء الاصطناعي',
      takePhoto: 'التقاط صورة',
      uploadImage: 'رفع صورة',
      uploadPDF: 'رفع PDF',
      recentProjects: 'المشاريع الأخيرة',
      
      // Analysis
      analyzing: 'جاري التحليل...',
      stepByStep: 'التحليل خطوة بخطوة',
      audioControls: 'التحكم بالصوت',
      play: 'تشغيل',
      pause: 'إيقاف',
      speed: 'السرعة',
      skipForward: 'تقدم 10 ثواني',
      skipBackward: 'رجوع 10 ثواني',
      export: 'تصدير PDF',
      
      // Validation
      notElectricalSchematic: 'عذراً، هذه الصورة ليست مخططاً كهربائياً',
      onlyElectricalSchematics: 'أنا متخصص فقط في المخططات الكهربائية',
      uploadValidImage: 'يرجى رفع مخطط كهربائي صحيح',
      
      // About
      aboutTitle: 'حول التطبيق',
      aboutDescription: 'تطبيق احترافي لتحليل وشرح المخططات الكهربائية باستخدام الذكاء الاصطناعي. يدعم التصوير المباشر، رفع الصور وملفات PDF، ويعطي تحليلًا دقيقًا خطوة بخطوة مع تمييز مرئي وشرح صوتي.',
      developedBy: 'تم التطوير بواسطة',
      version: 'الإصدار',
      
      // Settings
      language: 'اللغة',
      theme: 'المظهر',
      notifications: 'الإشعارات',
      offline: 'وضع عدم الاتصال',
      
      // Offline features
      offlineMode: 'أنت الآن في وضع عدم الاتصال',
      onlineRequired: 'يتطلب الاتصال بالإنترنت لتحليل الذكاء الاصطناعي',
      offlineFeaturesAvailable: 'الميزات المتاحة بدون إنترنت',
      
      // Common
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      share: 'مشاركة',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
    },
  },
  fr: {
    translation: {
      appName: 'HACHEF SCHÉMA ÉLECTRIQUE AI PRO',
      developer: 'HACHEF OUSSAMA',
      
      // Language selector
      selectLanguage: 'Sélectionner la langue',
      arabic: 'العربية',
      french: 'Français',
      english: 'English',
      continue: 'Continuer',
      
      // Navigation
      home: 'Accueil',
      analyze: 'Analyser',
      catalogs: 'Catalogues',
      calculators: 'Calculatrices',
      saved: 'Sauvegardés',
      settings: 'Paramètres',
      about: 'À propos',
      
      // Home screen
      welcome: 'Bienvenue',
      subtitle: 'Analyseur avancé de schémas électriques par IA',
      takePhoto: 'Prendre une photo',
      uploadImage: 'Télécharger une image',
      uploadPDF: 'Télécharger un PDF',
      recentProjects: 'Projets récents',
      
      // Analysis
      analyzing: 'Analyse en cours...',
      stepByStep: 'Analyse étape par étape',
      audioControls: 'Contrôles audio',
      play: 'Lecture',
      pause: 'Pause',
      speed: 'Vitesse',
      skipForward: 'Avancer 10 secondes',
      skipBackward: 'Reculer 10 secondes',
      export: 'Exporter PDF',
      
      // Validation
      notElectricalSchematic: 'Désolé, cette image n\'est pas un schéma électrique',
      onlyElectricalSchematics: 'Je suis spécialisé uniquement dans les schémas électriques',
      uploadValidImage: 'Veuillez télécharger un schéma électrique valide',
      
      // About
      aboutTitle: 'À propos de l\'application',
      aboutDescription: 'Application professionnelle d\'analyse et d\'explication de schémas électriques par intelligence artificielle. Supporte la caméra en direct, l\'import d\'images et PDF, et fournit une analyse précise étape par étape avec surlignage visuel et explication vocale.',
      developedBy: 'Développé par',
      version: 'Version',
      
      // Settings
      language: 'Langue',
      theme: 'Thème',
      notifications: 'Notifications',
      offline: 'Mode hors ligne',
      
      // Offline features
      offlineMode: 'Vous êtes en mode hors ligne',
      onlineRequired: 'Connexion Internet requise pour l\'analyse IA',
      offlineFeaturesAvailable: 'Fonctionnalités disponibles hors ligne',
      
      // Common
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      share: 'Partager',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
    },
  },
  en: {
    translation: {
      appName: 'HACHEF SCHÉMA ÉLECTRIQUE AI PRO',
      developer: 'HACHEF OUSSAMA',
      
      // Language selector
      selectLanguage: 'Select Language',
      arabic: 'العربية',
      french: 'Français',
      english: 'English',
      continue: 'Continue',
      
      // Navigation
      home: 'Home',
      analyze: 'Analyze',
      catalogs: 'Catalogs',
      calculators: 'Calculators',
      saved: 'Saved',
      settings: 'Settings',
      about: 'About',
      
      // Home screen
      welcome: 'Welcome',
      subtitle: 'Advanced AI-Powered Electrical Schematic Analyzer',
      takePhoto: 'Take Photo',
      uploadImage: 'Upload Image',
      uploadPDF: 'Upload PDF',
      recentProjects: 'Recent Projects',
      
      // Analysis
      analyzing: 'Analyzing...',
      stepByStep: 'Step by Step Analysis',
      audioControls: 'Audio Controls',
      play: 'Play',
      pause: 'Pause',
      speed: 'Speed',
      skipForward: 'Skip Forward 10s',
      skipBackward: 'Skip Backward 10s',
      export: 'Export PDF',
      
      // Validation
      notElectricalSchematic: 'Sorry, this image is not an electrical schematic',
      onlyElectricalSchematics: 'I specialize only in electrical schematics',
      uploadValidImage: 'Please upload a valid electrical schematic',
      
      // About
      aboutTitle: 'About the App',
      aboutDescription: 'Professional AI-powered electrical schematic analysis app. Supports live camera, image/PDF upload, and delivers precise step-by-step analysis with visual highlighting and voice explanation.',
      developedBy: 'Developed by',
      version: 'Version',
      
      // Settings
      language: 'Language',
      theme: 'Theme',
      notifications: 'Notifications',
      offline: 'Offline Mode',
      
      // Offline features
      offlineMode: 'You are in offline mode',
      onlineRequired: 'Internet connection required for AI analysis',
      offlineFeaturesAvailable: 'Features available offline',
      
      // Common
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      share: 'Share',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
  });

// Set language from localStorage after initialization
const savedLanguage = localStorage.getItem('language');
if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'fr' || savedLanguage === 'en')) {
  i18n.changeLanguage(savedLanguage);
}

export default i18n;
