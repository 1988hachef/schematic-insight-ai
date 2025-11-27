import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images?: string[];
  analysis?: string;
}

export const ChatDialog = ({ open, onOpenChange, images, analysis }: ChatDialogProps) => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePrint = () => {
    const printContent = messages
      .map(msg => {
        const role = msg.role === 'user' ? 'أنت' : 'المساعد';
        return `**${role}:**\n${msg.content}\n\n`;
      })
      .join('---\n\n');
    
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="${i18n.language === 'ar' ? 'rtl' : 'ltr'}">
          <head>
            <title>تقرير الدردشة التفاعلية</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.8; }
              h1 { color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; }
              .message { margin: 20px 0; padding: 15px; border-radius: 8px; }
              .user { background: #f0f0f0; text-align: right; }
              .assistant { background: #e8f4f8; }
              strong { color: #D4AF37; font-size: 1.1em; }
              hr { border: 1px solid #ddd; margin: 20px 0; }
            </style>
          </head>
          <body>
            <h1>📋 تقرير الدردشة التفاعلية</h1>
            <p><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
            ${messages.map(msg => `
              <div class="message ${msg.role}">
                <strong>${msg.role === 'user' ? 'أنت' : 'المساعد الذكي'}:</strong><br/>
                ${msg.content.replace(/\n/g, '<br/>')}
              </div>
            `).join('<hr/>')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const startEditMessage = (index: number) => {
    setEditingIndex(index);
    setEditText(messages[index].content);
  };

  const saveEditMessage = (index: number) => {
    const updatedMessages = [...messages];
    updatedMessages[index].content = editText;
    setMessages(updatedMessages);
    setEditingIndex(null);
    setEditText('');
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    
    // Include context about images and analysis if available
    let contextMessage = input;
    if (images && images.length > 0) {
      contextMessage = `السياق: أنا أناقش مخطط كهربائي تم تحليله. ${analysis ? 'التحليل متوفر.' : ''}\n\nالسؤال: ${input}`;
    }
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, { role: 'user', content: contextMessage }],
            language: i18n.language,
            context: analysis ? { analysis, imageCount: images?.length } : undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let assistantMessage = '';
      
      // Add empty assistant message to start streaming
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantMessage += content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content = assistantMessage;
                  return newMessages;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: t('error'),
        description: 'Failed to send message',
        variant: 'destructive',
      });
      // Remove the empty assistant message
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[700px] flex flex-col" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-gold" />
              💬 دردشة تفاعلية حول المخطط
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={messages.length === 0}
            >
              🖨️ طباعة التقرير
            </Button>
          </div>
          {images && images.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              🔗 مرتبط بـ {images.length} صورة من المخطط الكهربائي
            </p>
          )}
        </DialogHeader>

        <ScrollArea ref={scrollRef} className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gold/50" />
                <p className="text-lg">ابدأ نقاشاً حول المخطط الكهربائي</p>
                <p className="text-sm mt-2">اسأل أي سؤال عن المكونات، التوصيلات، أو التطبيقات</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-gold to-gold-light text-background'
                      : 'glass border border-gold/20'
                  }`}
                >
                  {editingIndex === index ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 rounded bg-background text-foreground"
                        rows={4}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => setEditingIndex(null)}>
                          إلغاء
                        </Button>
                        <Button size="sm" onClick={() => saveEditMessage(index)}>
                          حفظ
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-xs font-bold ${message.role === 'user' ? 'text-background/80' : 'text-gold'}`}>
                          {message.role === 'user' ? '👤 أنت' : '🤖 المساعد الذكي'}
                        </span>
                        {message.role !== 'user' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={() => startEditMessage(index)}
                          >
                            ✏️ تصحيح
                          </Button>
                        )}
                      </div>
                      <div
                        className={`prose prose-sm ${message.role === 'user' ? 'prose-invert' : 'prose-gold'} max-w-none`}
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            .replace(/## (.*)/g, '<h3 class="font-bold text-lg mt-3 mb-2">$1</h3>')
                            .replace(/### (.*)/g, '<h4 class="font-semibold text-base mt-2 mb-1">$1</h4>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                            .replace(/\n\n/g, '<br/><br/>')
                            .replace(/• /g, '<span class="text-gold">• </span>')
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                <div className="glass border border-gold/20 rounded-lg p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-gold" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={t('typeMessage') || 'Type your message...'}
            disabled={isLoading}
          />
          <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
