import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const languages = [
  { code: 'ar', name: 'العربية', nativeName: 'العربية' },
  { code: 'fr', name: 'Français', nativeName: 'Français' },
  { code: 'en', name: 'English', nativeName: 'English' },
];

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState('ar');

  const handleContinue = () => {
    i18n.changeLanguage(selectedLang);
    localStorage.setItem('language', selectedLang);
    localStorage.setItem('hasSelectedLanguage', 'true');
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 carbon-texture">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 glow-gold">
          {/* Logo/Title */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-bold text-gold mb-2">
              HACHEF SCHÉMA<br/>ÉLECTRIQUE AI PRO
            </h1>
            <p className="text-muted-foreground text-sm mt-4">
              {t('selectLanguage')}
            </p>
          </motion.div>

          {/* Language Options */}
          <div className="space-y-3 mb-8">
            {languages.map((lang, index) => (
              <motion.div
                key={lang.code}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => setSelectedLang(lang.code)}
                  className={`w-full p-4 rounded-xl transition-all duration-300 ${
                    selectedLang === lang.code
                      ? 'bg-primary text-primary-foreground glow-gold'
                      : 'glass hover:bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{lang.nativeName}</span>
                    {selectedLang === lang.code && (
                      <Check className="w-6 h-6" />
                    )}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Continue Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={handleContinue}
              className="w-full py-6 text-lg bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold transition-all duration-300 glow-gold"
            >
              {t('continue')}
            </Button>
          </motion.div>
        </div>

        {/* Developer Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 text-gold text-sm"
          style={{ direction: 'ltr' }}
        >
          HACHEF OUSSAMA
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LanguageSelector;
