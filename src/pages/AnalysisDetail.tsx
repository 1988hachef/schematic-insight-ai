import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, FileDown, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AudioNarration } from '@/components/AudioNarration';
import { ChatDialog } from '@/components/ChatDialog';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AnalysisDetail = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { analysis, summary, images = [] } = location.state || {};

  if (!analysis) {
    navigate('/analyze');
    return null;
  }

  const imageList = Array.isArray(images) ? images : [images].filter(Boolean);
  const currentLanguage = i18n.language;

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
    <div className={`min-h-screen carbon-texture print:bg-white ${currentLanguage === 'ar' ? 'print:text-right' : 'print:text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
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
          <Card className="glass p-6 print:shadow-none print:border-2 print:border-black">
            {/* Interactive carousel for screen */}
            <div className="print:hidden">
              {imageList.length > 0 && (
                <div className="relative">
                  <img 
                    src={imageList[currentImageIndex]} 
                    alt={`Electrical schematic ${currentImageIndex + 1}`}
                    className="w-full max-h-[600px] object-contain rounded-lg"
                  />
                  
                  {imageList.length > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                        disabled={currentImageIndex === 0}
                      >
                        <ChevronRight className={`w-4 h-4 ${currentLanguage !== 'ar' ? 'rotate-180' : ''}`} />
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {currentImageIndex + 1} / {imageList.length}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentImageIndex(Math.min(imageList.length - 1, currentImageIndex + 1))}
                        disabled={currentImageIndex === imageList.length - 1}
                      >
                        <ChevronLeft className={`w-4 h-4 ${currentLanguage !== 'ar' ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* All images for print */}
            <div className="hidden print:grid print:grid-cols-1 print:gap-8 print:mb-6">
              {imageList.map((img, index) => (
                <div key={index} className="page-break-inside-avoid">
                  <p className="text-center font-bold text-black mb-3 text-lg">
                    صورة {index + 1} من {imageList.length}
                  </p>
                  <img 
                    src={img} 
                    alt={`Schematic ${index + 1}`}
                    className="w-full max-h-[700px] object-contain border-2 border-black"
                  />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Audio Controls - Hidden in Print */}
        <div className="print:hidden mb-6">
          <AudioNarration text={analysis} />
        </div>

        {/* Summary Section */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card className="glass p-8 print:shadow-none print:border-2 print:border-black print:p-6 border-gold">
              <h2 className="text-2xl font-bold text-gold mb-6 print:text-blue-600 print:font-extrabold print:text-xl">
                📋 ملخص المخطط الكهربائي
              </h2>
            <div className="prose prose-invert max-w-none print:prose-neutral" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
              <div 
                className={`whitespace-pre-wrap text-base leading-relaxed ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                dangerouslySetInnerHTML={{
                  __html: summary
                    .replace(/## (.*)/g, '<h2 class="text-gold font-bold text-xl mt-4 mb-3 print:text-blue-600 print:font-bold print:text-lg">$1</h2>')
                    .replace(/### (.*)/g, '<h3 class="text-gold-light font-semibold text-lg mt-3 mb-2 print:text-blue-500 print:font-semibold print:text-base">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold font-bold print:text-blue-600 print:font-bold">$1</strong>')
                    .replace(/• /g, '<span class="text-gold print:text-black">• </span>')
                }}
              />
            </div>
            </Card>
          </motion.div>
        )}

        {/* Analysis Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass p-8 print:shadow-none print:border-2 print:border-black print:p-6">
            <h2 className="text-2xl font-bold text-blue-electric mb-6 print:text-blue-600 print:font-extrabold print:text-xl">
              🔍 التحليل التفصيلي
            </h2>
            <div className="prose prose-invert max-w-none print:prose-neutral" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
              <div 
                className={`whitespace-pre-wrap text-base leading-relaxed ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                dangerouslySetInnerHTML={{
                  __html: analysis
                    .replace(/## (.*)/g, '<h2 class="text-gold font-bold text-2xl mt-8 mb-4 border-b-2 border-gold pb-2 print:text-blue-600 print:border-blue-600 print:font-bold print:text-xl">$1</h2>')
                    .replace(/### (.*)/g, '<h3 class="text-blue-electric font-semibold text-xl mt-6 mb-3 print:text-blue-500 print:font-semibold print:text-lg">$1</h3>')
                    .replace(/#### (.*)/g, '<h4 class="text-gold-light font-semibold text-lg mt-4 mb-2 print:text-blue-400 print:font-semibold print:text-base">$1</h4>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold font-bold print:text-blue-600 print:font-bold">$1</strong>')
                    .replace(/• /g, '<span class="text-gold print:text-black">• </span>')
                    .replace(/\n\n/g, '</p><p class="mb-4 print:mb-3 print:text-black">')
                }}
              />
            </div>
          </Card>
        </motion.div>

        {/* Footer Info - For Print */}
        <div className="hidden print:block mt-12 pt-6 border-t-2 border-black text-center">
          <p className="font-bold text-lg text-black mb-2">{t('appName')}</p>
          <p className="text-black font-semibold mb-2">
            {new Date().toLocaleDateString(
              currentLanguage === 'ar' ? 'ar-SA' : currentLanguage === 'fr' ? 'fr-FR' : 'en-US',
              { year: 'numeric', month: 'long', day: 'numeric' }
            )}
          </p>
          <p className="text-black font-bold mt-4 text-base">DEVELOPED BY HACHEF OUSSAMA</p>
        </div>
      </div>

      <ChatDialog open={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
};

export default AnalysisDetail;
