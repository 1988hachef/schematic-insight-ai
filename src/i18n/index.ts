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
      
      // Chat
      aiChat: 'حوار مع الذكاء الاصطناعي',
      chat: 'دردشة',
      startConversation: 'ابدأ محادثة حول المخططات الكهربائية',
      typeMessage: 'اكتب رسالتك...',
      
      // Validation
      notElectricalSchematic: 'عذراً، هذه الصورة ليست مخططاً كهربائياً',
      onlyElectricalSchematics: 'أنا متخصص فقط في المخططات الكهربائية',
      uploadValidImage: 'يرجى رفع مخطط كهربائي صحيح',
      
      // About
      aboutTitle: 'حول التطبيق',
      aboutDescription: 'تطبيق احترافي متخصص في تحليل وشرح المخططات الكهربائية بدقة عالية باستخدام الذكاء الاصطناعي المتقدم. يوفر التطبيق تحليلاً تفصيلياً شاملاً للمخططات الكهربائية بجميع أنواعها مع دعم التصوير المباشر، رفع الصور المتعددة وملفات PDF، ويقدم تحليلاً دقيقاً خطوة بخطوة مع شرح صوتي واضح بثلاث لغات.',
      featureAI: 'تحليل بالذكاء الاصطناعي',
      featureAIDesc: 'ذكاء اصطناعي متقدم لفهم دقيق وشامل للمخططات الكهربائية',
      featureRealtime: 'معالجة فورية',
      featureRealtimeDesc: 'تحليل فوري مفصل مع شرح صوتي واضح بثلاث لغات',
      featureFocus: 'تخصص كهربائي',
      featureFocusDesc: 'متخصص حصرياً في تحليل المخططات الكهربائية فقط',
      featureMulti: 'دعم متعدد الصيغ',
      featureMultiDesc: 'التقاط بالكاميرا، رفع صور متعددة ومعالجة ملفات PDF',
      developedBy: 'تم التطوير بواسطة',
      version: 'الإصدار',
      appPurpose: 'الغرض من التطبيق',
      appPurposeDesc: 'هذا التطبيق مصمم خصيصاً لمساعدة المهندسين الكهربائيين والفنيين والطلاب في فهم وتحليل المخططات الكهربائية بشكل احترافي ودقيق. يوفر التطبيق تحليلاً تفصيلياً يشمل تحديد المكونات، شرح مسارات التيار، أنظمة الحماية، والمواصفات الفنية مع إمكانية تصدير التقارير بشكل احترافي.',
      
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
      confirm: 'تأكيد',
      back: 'رجوع',
      print: 'طباعة',
      exportReport: 'تصدير تقرير',
      confirmAnalysis: 'تأكيد التحليل',
      detailedView: 'العرض التفصيلي',
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
      
      // Chat
      aiChat: 'Conversation avec l\'IA',
      chat: 'Discussion',
      startConversation: 'Commencez une conversation sur les schémas électriques',
      typeMessage: 'Tapez votre message...',
      
      // Validation
      notElectricalSchematic: 'Désolé, cette image n\'est pas un schéma électrique',
      onlyElectricalSchematics: 'Je suis spécialisé uniquement dans les schémas électriques',
      uploadValidImage: 'Veuillez télécharger un schéma électrique valide',
      
      // About
      aboutTitle: 'À propos de l\'application',
      aboutDescription: 'Application professionnelle spécialisée dans l\'analyse détaillée et l\'explication des schémas électriques avec haute précision en utilisant l\'intelligence artificielle avancée. L\'application fournit une analyse complète et détaillée de tous types de schémas électriques avec support de capture en direct, téléchargement d\'images multiples et fichiers PDF, et offre une analyse précise étape par étape avec explication audio claire en trois langues.',
      featureAI: 'Analyse par IA',
      featureAIDesc: 'Intelligence artificielle avancée pour compréhension précise des schémas électriques',
      featureRealtime: 'Traitement instantané',
      featureRealtimeDesc: 'Analyse instantanée détaillée avec explication audio en trois langues',
      featureFocus: 'Spécialisation électrique',
      featureFocusDesc: 'Spécialisé exclusivement dans l\'analyse des schémas électriques uniquement',
      featureMulti: 'Support multi-formats',
      featureMultiDesc: 'Capture caméra, téléchargement d\'images multiples et traitement PDF',
      developedBy: 'Développé par',
      version: 'Version',
      appPurpose: 'Objectif de l\'application',
      appPurposeDesc: 'Cette application est spécialement conçue pour aider les ingénieurs électriciens, techniciens et étudiants à comprendre et analyser les schémas électriques de manière professionnelle et précise. Elle fournit une analyse détaillée incluant l\'identification des composants, l\'explication des flux de courant, les systèmes de protection et les spécifications techniques avec possibilité d\'exporter des rapports professionnels.',
      
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
      confirm: 'Confirmer',
      back: 'Retour',
      print: 'Imprimer',
      exportReport: 'Exporter rapport',
      confirmAnalysis: 'Confirmer l\'analyse',
      detailedView: 'Vue détaillée',
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
      
      // Chat
      aiChat: 'AI Chat',
      chat: 'Chat',
      startConversation: 'Start a conversation about electrical schematics',
      typeMessage: 'Type your message...',
      
      // Validation
      notElectricalSchematic: 'Sorry, this image is not an electrical schematic',
      onlyElectricalSchematics: 'I specialize only in electrical schematics',
      uploadValidImage: 'Please upload a valid electrical schematic',
      
      // About
      aboutTitle: 'About the App',
      aboutDescription: 'Professional application specialized in detailed analysis and explanation of electrical schematics with high precision using advanced artificial intelligence. The application provides comprehensive detailed analysis of all types of electrical schematics with support for live capture, multiple image uploads and PDF files, and offers accurate step-by-step analysis with clear audio explanation in three languages.',
      featureAI: 'AI-Powered Analysis',
      featureAIDesc: 'Advanced artificial intelligence for precise electrical schematic understanding',
      featureRealtime: 'Instant Processing',
      featureRealtimeDesc: 'Instant detailed analysis with clear audio explanation in three languages',
      featureFocus: 'Electrical Specialization',
      featureFocusDesc: 'Exclusively specialized in electrical schematic analysis only',
      featureMulti: 'Multi-Format Support',
      featureMultiDesc: 'Camera capture, multiple image uploads and PDF processing',
      developedBy: 'Developed by',
      version: 'Version',
      appPurpose: 'Application Purpose',
      appPurposeDesc: 'This application is specially designed to help electrical engineers, technicians and students understand and analyze electrical schematics professionally and accurately. It provides detailed analysis including component identification, current flow explanation, protection systems and technical specifications with the ability to export professional reports.',
      
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
      confirm: 'Confirm',
      back: 'Back',
      print: 'Print',
      exportReport: 'Export Report',
      confirmAnalysis: 'Confirm Analysis',
      detailedView: 'Detailed View',
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
