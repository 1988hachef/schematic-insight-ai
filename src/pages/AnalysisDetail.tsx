import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, FileDown, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AudioNarration } from '@/components/AudioNarration';
import { ChatDialog } from '@/components/ChatDialog';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AnalysisDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const { analysis, image } = location.state || {};

  if (!analysis || !image) {
    navigate('/analyze');
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast({
      title: t('loading'),
      description: 'جاري تصدير التقرير الاحترافي...',
    });
    // TODO: Implement professional PDF export with formatting
  };

  return (
    <div className="min-h-screen carbon-texture print:bg-white">
      {/* Navigation Bar - Hidden in Print */}
      <div className="print:hidden sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/analyze')}
              className="hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('back')}
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChatOpen(true)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {t('chat')}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-2" />
                {t('print')}
              </Button>
              
              <Button
                variant="premium"
                size="sm"
                onClick={handleExport}
              >
                <FileDown className="w-4 h-4 mr-2" />
                {t('exportReport')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 print:mb-4"
        >
          <h1 className="text-4xl font-bold text-gold mb-2 print:text-black">
            {t('detailedView')}
          </h1>
          <p className="text-muted-foreground print:text-gray-600">
            {t('stepByStep')}
          </p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass p-6 print:shadow-none print:border">
            <img 
              src={image} 
              alt="Electrical schematic" 
              className="w-full max-h-[600px] object-contain rounded-lg"
            />
          </Card>
        </motion.div>

        {/* Audio Controls - Hidden in Print */}
        <div className="print:hidden mb-6">
          <AudioNarration text={analysis} />
        </div>

        {/* Analysis Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass p-8 print:shadow-none print:border print:p-6">
            <div className="prose prose-invert max-w-none print:prose-neutral">
              <div 
                className="whitespace-pre-wrap text-base leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: analysis
                    .replace(/## (.*)/g, '<h2 class="text-gold font-bold text-2xl mt-6 mb-4 print:text-black print:text-xl">$1</h2>')
                    .replace(/### (.*)/g, '<h3 class="text-gold-light font-semibold text-xl mt-4 mb-3 print:text-black print:text-lg">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold font-bold print:text-black">$1</strong>')
                    .replace(/\n\n/g, '</p><p class="mb-4">')
                    .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>')
                }}
              />
            </div>
          </Card>
        </motion.div>

        {/* Footer Info - For Print */}
        <div className="hidden print:block mt-8 text-center text-sm text-gray-600">
          <p className="mb-2">{t('appName')}</p>
          <p>{t('developedBy')}: HACHEF OUSSAMA</p>
          <p className="mt-2">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <ChatDialog open={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
};

export default AnalysisDetail;
