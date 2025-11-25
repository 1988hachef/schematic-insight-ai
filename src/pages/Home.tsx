import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Camera, Upload, FileText, Settings, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DeveloperSignature } from '@/components/DeveloperSignature';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const mainActions = [
    {
      icon: Camera,
      label: t('takePhoto'),
      color: 'from-gold to-gold-light',
      onClick: () => navigate('/analyze'),
    },
    {
      icon: Upload,
      label: t('uploadImage'),
      color: 'from-blue-electric to-blue-glow',
      onClick: () => navigate('/analyze'),
    },
    {
      icon: FileText,
      label: t('uploadPDF'),
      color: 'from-primary to-secondary',
      onClick: () => navigate('/analyze'),
    },
  ];

  const settingsActions = [
    { icon: Settings, label: t('settings'), path: '/settings' },
    { icon: Info, label: t('about'), path: '/about' },
  ];

  return (
    <div className="min-h-screen carbon-texture">
      <DeveloperSignature position="right" />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 pt-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gold mb-6 animate-pulse-glow">
            {t('appName')}
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Main Actions - Larger Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {mainActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className={`glass cursor-pointer group hover:glow-gold transition-all duration-300 p-10 h-full`}
                onClick={action.onClick}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-2xl`}>
                    <action.icon className="w-14 h-14 text-background" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{action.label}</h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Settings Actions - Smaller Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-4 max-w-md mx-auto"
        >
          {settingsActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className="glass cursor-pointer hover:glow-blue transition-all duration-300 p-6"
                onClick={() => navigate(action.path)}
              >
                <div className="flex flex-col items-center text-center">
                  <action.icon className="w-8 h-8 text-blue-electric mb-2" />
                  <p className="text-sm font-medium">{action.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
