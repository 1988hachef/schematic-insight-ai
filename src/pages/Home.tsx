import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Camera, Upload, FileText, Zap, Database, Calculator, Settings, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const features = [
    { icon: Database, label: t('catalogs'), path: '/catalogs' },
    { icon: Calculator, label: t('calculators'), path: '/calculators' },
    { icon: Settings, label: t('settings'), path: '/settings' },
    { icon: Info, label: t('about'), path: '/about' },
  ];

  return (
    <div className="min-h-screen carbon-texture">
      <DeveloperSignature />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 pt-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gold mb-4 animate-pulse-glow">
            {t('appName')}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Main Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
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
                className={`glass cursor-pointer group hover:glow-gold transition-all duration-300 p-6`}
                onClick={action.onClick}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-10 h-10 text-background" />
                  </div>
                  <h3 className="text-lg font-semibold">{action.label}</h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {features.map((feature, index) => (
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
                onClick={() => navigate(feature.path)}
              >
                <div className="flex flex-col items-center text-center">
                  <feature.icon className="w-10 h-10 text-blue-electric mb-3" />
                  <p className="text-sm font-medium">{feature.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gold">{t('recentProjects')}</h2>
              <Zap className="w-6 h-6 text-blue-electric animate-pulse" />
            </div>
            <p className="text-muted-foreground text-center py-8">
              {t('loading')}
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
