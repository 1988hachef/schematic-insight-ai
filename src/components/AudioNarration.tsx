import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from 'lucide-react';

interface AudioNarrationProps {
  text: string;
}

export const AudioNarration = ({ text }: AudioNarrationProps) => {
  const { i18n } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const newUtterance = new SpeechSynthesisUtterance(text);
    
    // Set language based on current language
    const langMap: Record<string, string> = {
      'ar': 'ar-SA',
      'fr': 'fr-FR',
      'en': 'en-US',
    };
    newUtterance.lang = langMap[i18n.language] || 'ar-SA';
    newUtterance.rate = rate;
    newUtterance.volume = isMuted ? 0 : 1;
    newUtterance.pitch = 1;

    newUtterance.onend = () => {
      setIsPlaying(false);
    };

    newUtterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
    };

    setUtterance(newUtterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text, i18n.language]);

  useEffect(() => {
    if (utterance) {
      utterance.rate = rate;
    }
  }, [rate, utterance]);

  useEffect(() => {
    if (utterance) {
      utterance.volume = isMuted ? 0 : 1;
    }
  }, [isMuted, utterance]);

  const handlePlayPause = () => {
    if (!utterance) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Cancel any existing speech before starting new
      window.speechSynthesis.cancel();
      
      // Wait a bit for cancel to complete
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }, 100);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleSkipForward = () => {
    // Skip forward by restarting from current position + 10 seconds
    // This is a simplified version - actual implementation would need to track position
    handleStop();
  };

  const handleSkipBack = () => {
    // Skip back by restarting from beginning
    handleStop();
    if (utterance) {
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  if (!('speechSynthesis' in window)) {
    return null;
  }

  return (
    <Card className="glass p-4 mt-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleSkipBack}
        >
          <SkipBack className="w-4 h-4" />
        </Button>

        <Button
          variant="premium"
          size="icon"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleSkipForward}
        >
          <SkipForward className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>

        <div className="flex-1">
          <div className="text-sm text-muted-foreground mb-1">
            Speed: {rate.toFixed(1)}x
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
    </Card>
  );
};
