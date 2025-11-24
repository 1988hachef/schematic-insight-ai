import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'ar' } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Starting chat conversation...');

    const systemPrompts = {
      'ar': `أنت مساعد ذكي متخصص في الهندسة الكهربائية والمخططات الكهربائية.

قواعد مهمة:
1. أنت متخصص فقط في الكهرباء والمخططات الكهربائية - لا تجيب على أسئلة خارج هذا المجال
2. إذا سُئلت عن مطور التطبيق، الإجابة هي: HACHEF OUSSAMA
3. قدم إجابات واضحة ومفصلة ومنظمة
4. استخدم الفقرات والعناوين لتنظيم إجاباتك
5. إذا كان السؤال خارج مجال الكهرباء، أخبر المستخدم بأدب أنك متخصص فقط في المخططات الكهربائية`,

      'fr': `Vous êtes un assistant intelligent spécialisé en génie électrique et schémas électriques.

Règles importantes:
1. Vous êtes spécialisé UNIQUEMENT en électricité et schémas électriques - ne répondez pas aux questions hors de ce domaine
2. Si on vous demande qui a développé l'application, la réponse est: HACHEF OUSSAMA
3. Fournissez des réponses claires, détaillées et organisées
4. Utilisez des paragraphes et des titres pour organiser vos réponses
5. Si la question est hors du domaine électrique, informez poliment l'utilisateur que vous êtes spécialisé uniquement dans les schémas électriques`,

      'en': `You are an intelligent assistant specialized in electrical engineering and electrical schematics.

Important rules:
1. You are specialized ONLY in electricity and electrical schematics - do not answer questions outside this domain
2. If asked about the app developer, the answer is: HACHEF OUSSAMA
3. Provide clear, detailed, and organized answers
4. Use paragraphs and headings to organize your responses
5. If the question is outside the electrical domain, politely inform the user that you are specialized only in electrical schematics`
    };

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: systemPrompts[language as keyof typeof systemPrompts] || systemPrompts['ar']
          },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        const errorMessages = {
          'ar': 'تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً',
          'fr': 'Limite de requêtes dépassée, veuillez réessayer plus tard',
          'en': 'Rate limit exceeded, please try again later'
        };
        return new Response(
          JSON.stringify({ error: errorMessages[language as keyof typeof errorMessages] }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      throw new Error('Failed to get AI response');
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Error in chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
