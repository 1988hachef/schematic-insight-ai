import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Camera, Upload, FileText, Settings, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const leftActions = [
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
  ];

  const rightActions = [
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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

        {/* Actions Grid - Split into Left and Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {/* Left Column */}
          <div className="space-y-6">
            {leftActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card
                  className={`glass cursor-pointer group hover:glow-gold transition-all duration-300 p-8 h-full`}
                  onClick={action.onClick}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl flex-shrink-0`}>
                      <action.icon className="w-10 h-10 text-background" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{action.label}</h3>
                  </div>
                </Card>
              </motion.div>
            ))}
            
            {/* Settings in left column */}
            {settingsActions.map((action, index) => (
              <motion.div
                key={`settings-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card
                  className="glass cursor-pointer hover:glow-blue transition-all duration-300 p-6"
                  onClick={() => navigate(action.path)}
                >
                  <div className="flex items-center gap-4">
                    <action.icon className="w-8 h-8 text-blue-electric flex-shrink-0" />
                    <p className="text-base font-medium">{action.label}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {rightActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card
                  className={`glass cursor-pointer group hover:glow-gold transition-all duration-300 p-8 h-full`}
                  onClick={action.onClick}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl flex-shrink-0`}>
                      <action.icon className="w-10 h-10 text-background" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{action.label}</h3>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Developer Signature - Bottom Center */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-20 mb-8"
        >
          <div className="text-gold text-lg font-bold tracking-widest opacity-80 hover:opacity-100 transition-opacity">
            DEVELOPED BY HACHEF OUSSAMA
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
