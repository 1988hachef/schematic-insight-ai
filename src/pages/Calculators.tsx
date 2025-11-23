import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeveloperSignature } from '@/components/DeveloperSignature';
import { ArrowLeft, Calculator as CalcIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Calculators = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const calculatorItems = [
    { title: 'Cable Size Calculator', available: true },
    { title: 'Voltage Drop Calculator', available: true },
    { title: 'Short Circuit Calculator', available: true },
    { title: 'Motor Starter Sizing', available: true },
    { title: 'Power Factor Correction', available: true },
    { title: 'Load Calculation', available: true },
  ];

  return (
    <div className="min-h-screen carbon-texture">
      <DeveloperSignature />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gold mb-4">{t('calculators')}</h1>
          <p className="text-muted-foreground text-lg">{t('offlineFeaturesAvailable')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {calculatorItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="glass p-6 hover:glow-gold transition-all duration-300 cursor-pointer group">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CalcIcon className="w-8 h-8 text-background" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.available ? 'Available offline' : 'Coming soon'}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Calculators;
