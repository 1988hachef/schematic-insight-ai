import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeveloperSignature } from '@/components/DeveloperSignature';
import { ArrowLeft, Camera, Upload, FileText, AlertCircle, Loader2, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { captureImage, pickImage, pickMultipleImages, pickPDF } from '@/utils/imageCapture';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ChatDialog } from '@/components/ChatDialog';
import { AudioNarration } from '@/components/AudioNarration';

const Analyze = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOnline] = useState(navigator.onLine);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const analyzeImages = async (imageDataUrls: string[]) => {
    setIsAnalyzing(true);
    setCurrentImages(imageDataUrls);
    setCurrentImageIndex(0);
    setAnalysis(null);
    setSummary(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-schematic', {
        body: { 
          imageBase64: imageDataUrls[0],
          allImages: imageDataUrls,
          language: i18n.language 
        }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        toast({
          title: t('error'),
          description: data.error,
          variant: 'destructive',
        });
        setCurrentImages([]);
        return;
      }

      setAnalysis(data.analysis);
      toast({
        title: t('success'),
        description: t('analyzing'),
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : 'Failed to analyze',
        variant: 'destructive',
      });
      setCurrentImages([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSummary = async () => {
    if (!analysis || currentImages.length === 0) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-schematic', {
        body: { 
          imageBase64: currentImages[0],
          allImages: currentImages,
          language: i18n.language,
          mode: 'summary'
        }
      });

      if (error) throw error;
      if (data.error) {
        toast({
          title: t('error'),
          description: data.error,
          variant: 'destructive',
        });
        return;
      }

      setSummary(data.analysis);
      toast({
        title: t('success'),
        description: 'تم إنشاء الملخص بنجاح',
      });
    } catch (error) {
      console.error('Summary error:', error);
      toast({
        title: t('error'),
        description: 'فشل في إنشاء الملخص',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCamera = async () => {
    if (!isOnline) {
      toast({
        title: t('error'),
        description: t('onlineRequired'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const image = await captureImage();
      await analyzeImages([image]);
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: t('error'),
        description: 'Failed to capture image',
        variant: 'destructive',
      });
    }
  };

  const handleUpload = async () => {
    if (!isOnline) {
      toast({
        title: t('error'),
        description: t('onlineRequired'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const images = await pickMultipleImages();
      if (images.length > 0) {
        toast({
          title: t('success'),
          description: `تم تحميل ${images.length} صورة، جاري التحليل...`,
        });
        await analyzeImages(images);
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof Error && error.message !== 'User cancelled photos app') {
        toast({
          title: t('error'),
          description: 'Failed to upload image',
          variant: 'destructive',
        });
      }
    }
  };


  const handlePDF = async () => {
    if (!isOnline) {
      toast({
        title: t('error'),
        description: t('onlineRequired'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const pdf = await pickPDF();
      toast({
        title: t('success'),
        description: 'ملف PDF محمل، جاري معالجته...',
      });
      // TODO: Implement PDF processing with image extraction
      console.log('PDF selected:', pdf.name);
    } catch (error) {
      console.error('PDF error:', error);
      if (error instanceof Error && error.message !== 'No file selected') {
        toast({
          title: t('error'),
          description: 'فشل في تحميل ملف PDF',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="min-h-screen carbon-texture">
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
        {!analysis && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <Card 
              className={`glass p-8 hover:glow-gold transition-all duration-300 cursor-pointer group ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={handleCamera}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {isAnalyzing ? (
                    <Loader2 className="w-12 h-12 text-background animate-spin" />
                  ) : (
                    <Camera className="w-12 h-12 text-background" />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{t('takePhoto')}</h3>
                <p className="text-sm text-muted-foreground">Live camera capture</p>
              </div>
            </Card>

            <Card 
              className={`glass p-8 hover:glow-blue transition-all duration-300 cursor-pointer group ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={handleUpload}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-electric to-blue-glow flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {isAnalyzing ? (
                    <Loader2 className="w-12 h-12 text-background animate-spin" />
                  ) : (
                    <Upload className="w-12 h-12 text-background" />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{t('uploadImage')}</h3>
                <p className="text-sm text-muted-foreground">Single or multiple images</p>
              </div>
            </Card>

            <Card 
              className={`glass p-8 hover:glow-gold transition-all duration-300 cursor-pointer group ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={handlePDF}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {isAnalyzing ? (
                    <Loader2 className="w-12 h-12 text-background animate-spin" />
                  ) : (
                    <FileText className="w-12 h-12 text-background" />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{t('uploadPDF')}</h3>
                <p className="text-sm text-muted-foreground">Multi-page PDF support</p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Analysis Result */}
        {currentImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="glass p-6">
              {/* Image Gallery */}
              <div className="relative">
                <img 
                  src={currentImages[currentImageIndex]} 
                  alt={`Schematic ${currentImageIndex + 1}`}
                  className="w-full max-h-96 object-contain rounded-lg mb-4"
                />
                
                {currentImages.length > 1 && (
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                      disabled={currentImageIndex === 0}
                    >
                      السابق
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {currentImageIndex + 1} / {currentImages.length}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentImageIndex(Math.min(currentImages.length - 1, currentImageIndex + 1))}
                      disabled={currentImageIndex === currentImages.length - 1}
                    >
                      التالي
                    </Button>
                  </div>
                )}
              </div>
              {isAnalyzing && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-12 h-12 text-gold animate-spin" />
                  <span className="ml-4 text-lg">{t('analyzing')}</span>
                </div>
              )}
              {analysis && (
                <div className="mt-4 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gold">{t('stepByStep')}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateSummary}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        ملخص المخطط
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsChatOpen(true)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {t('chat')}
                      </Button>
                      <Button
                        variant="premium"
                        size="sm"
                        onClick={() => {
                          navigate('/analysis-detail', {
                            state: { analysis, summary, images: currentImages }
                          });
                        }}
                      >
                        {t('detailedView')}
                      </Button>
                    </div>
                  </div>

                  {/* Summary Section */}
                  {summary && (
                    <Card className="glass p-6 border-gold">
                      <h4 className="text-xl font-bold text-gold mb-4">📋 ملخص المخطط</h4>
                      <div 
                        className="prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: summary
                            .replace(/## (.*)/g, '<h2 class="text-gold font-bold text-xl mt-4 mb-3">$1</h2>')
                            .replace(/### (.*)/g, '<h3 class="text-gold-light font-semibold text-lg mt-3 mb-2">$1</h3>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold">$1</strong>')
                            .replace(/• /g, '<span class="text-gold">• </span>')
                        }}
                      />
                    </Card>
                  )}
                  
                  <AudioNarration text={analysis} />

                  {/* Detailed Analysis */}
                  <Card className="glass p-6">
                    <h4 className="text-xl font-bold text-blue-electric mb-4">🔍 التحليل التفصيلي</h4>
                    <div className="prose prose-invert max-w-none">
                      <div 
                        className="whitespace-pre-wrap leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: analysis
                            .replace(/## (.*)/g, '<h2 class="text-gold font-bold text-2xl mt-6 mb-4 border-b border-gold pb-2">$1</h2>')
                            .replace(/### (.*)/g, '<h3 class="text-blue-electric font-semibold text-xl mt-4 mb-3">$1</h3>')
                            .replace(/#### (.*)/g, '<h4 class="text-gold-light font-semibold text-lg mt-3 mb-2">$1</h4>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold font-bold">$1</strong>')
                            .replace(/• /g, '<span class="text-gold">• </span>')
                        }}
                      />
                    </div>
                  </Card>
                </div>
              )}
            </Card>
          </motion.div>
        )}

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

      <ChatDialog open={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
};

export default Analyze;
