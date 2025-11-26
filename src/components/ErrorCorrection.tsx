import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorCorrectionProps {
  analysisText: string;
  onCorrectionApplied: (correctedText: string) => void;
}

export const ErrorCorrection = ({ analysisText, onCorrectionApplied }: ErrorCorrectionProps) => {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [corrections, setCorrections] = useState<string[]>([]);
  const [showManualEdit, setShowManualEdit] = useState(false);
  const [manualText, setManualText] = useState(analysisText);

  const checkForErrors = async () => {
    setIsChecking(true);
    setCorrections([]);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-schematic', {
        body: {
          imageBase64: '', // Not needed for correction
          language: i18n.language,
          mode: 'correct',
          textToCorrect: analysisText
        }
      });

      if (error) throw error;

      if (data.corrections && data.corrections.length > 0) {
        setCorrections(data.corrections);
        toast({
          title: 'تم الفحص',
          description: `تم العثور على ${data.corrections.length} تصحيح محتمل`,
        });
      } else {
        toast({
          title: 'رائع!',
          description: 'لم يتم العثور على أخطاء',
        });
      }

      if (data.correctedText) {
        onCorrectionApplied(data.correctedText);
      }
    } catch (error) {
      console.error('Error checking for errors:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في فحص الأخطاء',
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const applyManualEdit = () => {
    if (manualText.trim() !== analysisText.trim()) {
      onCorrectionApplied(manualText);
      toast({
        title: 'تم التحديث',
        description: 'تم تطبيق التعديلات يدوياً',
      });
      setShowManualEdit(false);
    }
  };

  return (
    <Card className="glass p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-blue-electric" />
          <div>
            <h3 className="text-lg font-bold">تصحيح الأخطاء</h3>
            <p className="text-sm text-muted-foreground">فحص وتصحيح الأخطاء الإملائية والمعلومات</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowManualEdit(!showManualEdit);
              setManualText(analysisText);
            }}
          >
            {showManualEdit ? 'إلغاء' : 'تعديل يدوي'}
          </Button>
          <Button
            variant="premium"
            size="sm"
            onClick={checkForErrors}
            disabled={isChecking}
          >
            {isChecking ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري الفحص...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                فحص الأخطاء
              </>
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showManualEdit && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <Textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="قم بتعديل النص هنا..."
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowManualEdit(false)}
              >
                إلغاء
              </Button>
              <Button
                variant="premium"
                size="sm"
                onClick={applyManualEdit}
              >
                تطبيق التعديلات
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {corrections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 space-y-2"
        >
          <h4 className="text-sm font-semibold text-gold mb-2">التصحيحات المقترحة:</h4>
          {corrections.map((correction, index) => (
            <div
              key={index}
              className="p-3 bg-background/50 rounded-lg border border-gold/20"
            >
              <p className="text-sm">{correction}</p>
            </div>
          ))}
        </motion.div>
      )}

      <div className="mt-4 text-xs text-muted-foreground space-y-1">
        <p>• الفحص التلقائي يتحقق من الأخطاء الإملائية والمعلومات الخاطئة</p>
        <p>• يمكنك التعديل يدوياً لأي جزء من التحليل</p>
        <p>• التصحيحات تستخدم الذكاء الاصطناعي للتحقق من المعلومات</p>
      </div>
    </Card>
  );
};
