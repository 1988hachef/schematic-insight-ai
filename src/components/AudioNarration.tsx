import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Play, Pause, Square, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AudioNarrationProps {
  text: string;
}

export const AudioNarration = ({ text }: AudioNarrationProps) => {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textChunksRef = useRef<string[]>([]);
  const currentChunkRef = useRef(0);

  // Split text into manageable chunks for better performance
  const splitTextIntoChunks = useCallback((inputText: string): string[] => {
    const maxChunkLength = 200;
    const sentences = inputText.split(/[.!?،؛]\s*/);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxChunkLength) {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [inputText];
  }, []);

  // Get the best available voice for the language
  const getBestVoice = useCallback((lang: string): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    const langCode = lang === 'ar' ? 'ar' : lang === 'fr' ? 'fr' : 'en';
    
    // Priority: Native voice > Google voice > Any matching voice
    const nativeVoice = voices.find(v => 
      v.lang.startsWith(langCode) && !v.name.includes('Google')
    );
    const googleVoice = voices.find(v => 
      v.lang.startsWith(langCode) && v.name.includes('Google')
    );
    const anyVoice = voices.find(v => v.lang.startsWith(langCode));
    
    return nativeVoice || googleVoice || anyVoice || null;
  }, []);

  // Speak a single chunk
  const speakChunk = useCallback((chunkIndex: number) => {
    if (chunkIndex >= textChunksRef.current.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      currentChunkRef.current = 0;
      return;
    }

    const chunk = textChunksRef.current[chunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunk);
    
    const langMap: Record<string, string> = {
      'ar': 'ar-SA',
      'fr': 'fr-FR',
      'en': 'en-US',
    };
    
    utterance.lang = langMap[i18n.language] || 'ar-SA';
    utterance.rate = rate;
    utterance.volume = isMuted ? 0 : 1;
    utterance.pitch = 1;

    const voice = getBestVoice(i18n.language);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      setIsLoading(false);
      const progressPercent = ((chunkIndex + 1) / textChunksRef.current.length) * 100;
      setProgress(progressPercent);
    };

    utterance.onend = () => {
      currentChunkRef.current = chunkIndex + 1;
      // Continue to next chunk
      if (currentChunkRef.current < textChunksRef.current.length && isPlaying) {
        speakChunk(currentChunkRef.current);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(100);
        currentChunkRef.current = 0;
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsLoading(false);
      
      // Try next chunk on error
      if (event.error !== 'canceled') {
        currentChunkRef.current = chunkIndex + 1;
        if (currentChunkRef.current < textChunksRef.current.length) {
          setTimeout(() => speakChunk(currentChunkRef.current), 100);
        } else {
          setIsPlaying(false);
          setIsPaused(false);
        }
      }
    };

    utteranceRef.current = utterance;
    
    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [i18n.language, rate, isMuted, getBestVoice, isPlaying]);

  // Initialize text chunks when text changes
  useEffect(() => {
    textChunksRef.current = splitTextIntoChunks(text);
    currentChunkRef.current = 0;
    setProgress(0);
  }, [text, splitTextIntoChunks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: 'غير مدعوم',
        description: 'القراءة الصوتية غير مدعومة في هذا المتصفح',
        variant: 'destructive',
      });
      return;
    }

    if (isPlaying) {
      if (isPaused) {
        // Resume
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        // Pause
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      // Start fresh
      setIsLoading(true);
      setIsPlaying(true);
      setIsPaused(false);
      window.speechSynthesis.cancel();
      
      // Wait for voices to load
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Voices not loaded yet, wait for them
        const handleVoicesChanged = () => {
          window.speechSynthesis.onvoiceschanged = null;
          currentChunkRef.current = 0;
          speakChunk(0);
        };
        window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
        // Fallback timeout
        setTimeout(() => {
          if (window.speechSynthesis.getVoices().length > 0) {
            window.speechSynthesis.onvoiceschanged = null;
            currentChunkRef.current = 0;
            speakChunk(0);
          }
        }, 500);
      } else {
        currentChunkRef.current = 0;
        speakChunk(0);
      }
    }
  }, [isPlaying, isPaused, speakChunk, toast]);

  // Handle stop
  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setIsLoading(false);
    currentChunkRef.current = 0;
    setProgress(0);
  }, []);

  // Update rate dynamically
  useEffect(() => {
    if (utteranceRef.current && isPlaying && !isPaused) {
      // Need to restart with new rate
      const currentChunk = currentChunkRef.current;
      window.speechSynthesis.cancel();
      setTimeout(() => speakChunk(currentChunk), 50);
    }
  }, [rate]);

  if (!('speechSynthesis' in window)) {
    return null;
  }

  return (
    <Card className="glass p-4 mt-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleStop}
            disabled={!isPlaying}
            className="shrink-0"
          >
            <Square className="w-4 h-4" />
          </Button>

          <Button
            variant="premium"
            size="icon"
            onClick={handlePlayPause}
            disabled={isLoading}
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPlaying && !isPaused ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="shrink-0"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
              <span>السرعة: {rate.toFixed(1)}x</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Slider
              value={[rate]}
              onValueChange={([value]) => setRate(value)}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-1.5">
          <div 
            className="bg-gold h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  );
};