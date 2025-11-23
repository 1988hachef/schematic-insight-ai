import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeveloperSignature } from '@/components/DeveloperSignature';
import { ArrowLeft, Camera, Upload, FileText, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Analyze = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOnline] = useState(navigator.onLine);

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
          <h1 className="text-4xl font-bold text-gold mb-4">{t('analyze')}</h1>
          <p className="text-muted-foreground text-lg">{t('uploadValidImage')}</p>
        </motion.div>

        {/* Online Status Warning */}
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="glass p-4 border-destructive">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-destructive mr-3" />
                <div>
                  <p className="font-semibold">{t('offlineMode')}</p>
                  <p className="text-sm text-muted-foreground">{t('onlineRequired')}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Upload Options */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="glass p-8 hover:glow-gold transition-all duration-300 cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-12 h-12 text-background" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('takePhoto')}</h3>
              <p className="text-sm text-muted-foreground">Live camera capture</p>
            </div>
          </Card>

          <Card className="glass p-8 hover:glow-blue transition-all duration-300 cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-electric to-blue-glow flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-12 h-12 text-background" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('uploadImage')}</h3>
              <p className="text-sm text-muted-foreground">Single or multiple images</p>
            </div>
          </Card>

          <Card className="glass p-8 hover:glow-gold transition-all duration-300 cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-12 h-12 text-background" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('uploadPDF')}</h3>
              <p className="text-sm text-muted-foreground">Multi-page PDF support</p>
            </div>
          </Card>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass p-6">
            <h2 className="text-xl font-bold text-gold mb-4">Instructions</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-gold mr-2">•</span>
                <span>Only electrical schematics will be analyzed (single-line, control, wiring, P&ID electrical parts)</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-2">•</span>
                <span>Images must be clear and well-lit for accurate analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-2">•</span>
                <span>Multi-page PDFs will be automatically stitched together</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-2">•</span>
                <span>AI analysis requires internet connection</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Analyze;
