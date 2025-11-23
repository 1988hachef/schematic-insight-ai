import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { DeveloperSignature } from '@/components/DeveloperSignature';
import { ArrowLeft, Zap, Shield, Brain, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced artificial intelligence for precise schematic understanding',
    },
    {
      icon: Zap,
      title: 'Real-Time Processing',
      description: 'Instant analysis with visual highlighting and audio explanation',
    },
    {
      icon: Shield,
      title: 'Electrical Focus',
      description: 'Specialized exclusively in electrical schematics validation',
    },
    {
      icon: Sparkles,
      title: 'Multi-Format Support',
      description: 'Camera capture, image upload, and PDF multi-page processing',
    },
  ];

  return (
    <div className="min-h-screen carbon-texture">
      <DeveloperSignature />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 pt-16"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            className="hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('home')}
          </Button>
        </motion.div>

        {/* App Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gold mb-4 animate-pulse-glow">
            {t('appName')}
          </h1>
          <p className="text-xl text-muted-foreground">{t('aboutTitle')}</p>
        </motion.div>

        {/* Description Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass p-8 mb-8 glow-gold">
            <p className="text-lg leading-relaxed text-center">
              {t('aboutDescription')}
            </p>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="glass p-6 hover:glow-blue transition-all duration-300 h-full">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-electric to-blue-glow flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-background" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Developer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="glass p-8 text-center glow-gold">
            <p className="text-muted-foreground mb-3">{t('developedBy')}</p>
            <h2 className="text-3xl font-bold text-gold mb-4" style={{ direction: 'ltr' }}>
              HACHEF OUSSAMA
            </h2>
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-gold to-gold-light">
              <p className="text-sm font-semibold text-background">
                Electrical Engineer
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Version */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-muted-foreground"
        >
          <p>{t('version')} 1.0.0</p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
