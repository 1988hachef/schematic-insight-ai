import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceAssistantProps {
  analysisText: string;
  onAnalysisUpdate?: (updatedText: string) => void;
}

export const VoiceAssistant = ({ analysisText, onAnalysisUpdate }: VoiceAssistantProps) => {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<Uint8Array[]>([]);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const createWavFromPCM = (pcmData: Uint8Array): Uint8Array => {
    const int16Data = new Int16Array(pcmData.length / 2);
    for (let i = 0; i < pcmData.length; i += 2) {
      int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
    }

    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + int16Data.byteLength, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(36, 'data');
    view.setUint32(40, int16Data.byteLength, true);

    const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
    wavArray.set(new Uint8Array(wavHeader), 0);
    wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);

    return wavArray;
  };

  const playNextAudio = async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) return;

    isPlayingRef.current = true;
    const audioData = audioQueueRef.current.shift()!;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }

      const wavData = createWavFromPCM(audioData);
      const arrayBuffer = wavData.buffer.slice(0) as ArrayBuffer;
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      
      if (!isMuted) {
        source.connect(audioContextRef.current.destination);
      }

      source.onended = () => {
        isPlayingRef.current = false;
        playNextAudio();
      };

      source.start(0);
      setIsSpeaking(true);
    } catch (error) {
      console.error('Error playing audio:', error);
      isPlayingRef.current = false;
      playNextAudio();
    }
  };

  const startVoiceAssistant = async () => {
    setIsConnecting(true);

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize audio context
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      // Get language config
      const langMap: Record<string, string> = {
        'ar': 'ar',
        'fr': 'fr',
        'en': 'en',
      };
      const language = langMap[i18n.language] || 'ar';

      // Connect to edge function WebSocket - use direct project ID
      const wsUrl = `wss://mtwpfxyabldxhrxdynqp.supabase.co/functions/v1/voice-assistant`;
      
      console.log('Connecting to:', wsUrl);
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsActive(true);
        setIsConnecting(false);

        // Send initial config
        wsRef.current?.send(JSON.stringify({
          type: 'config',
          language,
          context: analysisText
        }));

        toast({
          title: 'تم التفعيل',
          description: 'المساعد الصوتي جاهز للاستخدام',
        });
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('Received:', data.type);

        if (data.type === 'response.audio.delta') {
          const binaryString = atob(data.delta);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          audioQueueRef.current.push(bytes);
          playNextAudio();
        } else if (data.type === 'response.audio_transcript.delta') {
          setTranscript(prev => prev + data.delta);
        } else if (data.type === 'response.audio.done') {
          setIsSpeaking(false);
        } else if (data.type === 'analysis.updated' && onAnalysisUpdate) {
          onAnalysisUpdate(data.updatedAnalysis);
          toast({
            title: 'تم التحديث',
            description: 'تم تصحيح التحليل بنجاح',
          });
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: 'خطأ',
          description: 'فشل الاتصال بالمساعد الصوتي',
          variant: 'destructive',
        });
        stopVoiceAssistant();
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket closed');
        stopVoiceAssistant();
      };

      // Process and send audio
      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const int16Array = new Int16Array(inputData.length);
        
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        const uint8Array = new Uint8Array(int16Array.buffer);
        let binary = '';
        const chunkSize = 0x8000;

        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
          binary += String.fromCharCode.apply(null, Array.from(chunk));
        }

        wsRef.current?.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: btoa(binary)
        }));
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

    } catch (error) {
      console.error('Error starting voice assistant:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تفعيل المساعد الصوتي',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  const stopVoiceAssistant = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsActive(false);
    setIsSpeaking(false);
    setTranscript('');
  };

  return (
    <Card className="glass p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              scale: isSpeaking ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: isSpeaking ? Infinity : 0,
            }}
          >
            {isActive ? (
              <Mic className={`w-6 h-6 ${isSpeaking ? 'text-gold' : 'text-green-500'}`} />
            ) : (
              <MicOff className="w-6 h-6 text-muted-foreground" />
            )}
          </motion.div>
          <div>
            <h3 className="text-lg font-bold">المساعد الصوتي التفاعلي</h3>
            <p className="text-sm text-muted-foreground">
              {isActive ? (isSpeaking ? 'يتحدث...' : 'استمع...') : 'غير نشط'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            disabled={!isActive}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>

          <Button
            variant={isActive ? "destructive" : "premium"}
            onClick={isActive ? stopVoiceAssistant : startVoiceAssistant}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري الاتصال...
              </>
            ) : isActive ? (
              'إيقاف'
            ) : (
              'تفعيل'
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-background/50 rounded-lg"
          >
            <p className="text-sm text-muted-foreground mb-1">النص المنطوق:</p>
            <p className="text-base">{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 text-xs text-muted-foreground space-y-1">
        <p>• يمكنك أن تطلب من المساعد قراءة التحليل</p>
        <p>• اطلب التوقف أو إعادة نقطة معينة</p>
        <p>• اسأل عن أي جزء لم تفهمه</p>
        <p>• يمكن للمساعد تصحيح الأخطاء في التحليل</p>
      </div>
    </Card>
  );
};
