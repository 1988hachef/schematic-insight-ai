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
    const { imageBase64, language = 'ar' } = await req.json();
    
    if (!imageBase64) {
      throw new Error('Image is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Starting schematic analysis...');

    // Step 1: Validate that the image is an electrical schematic
    const validationResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: 'You are an expert electrical engineer. Your task is to determine if an image is an electrical schematic diagram (single-line, control, wiring, P&ID electrical part, etc.). Respond with ONLY "YES" or "NO".'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Is this image an electrical schematic diagram? Answer ONLY with YES or NO.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!validationResponse.ok) {
      const errorText = await validationResponse.text();
      console.error('Validation API error:', validationResponse.status, errorText);
      throw new Error('Failed to validate image');
    }

    const validationData = await validationResponse.json();
    const isElectrical = validationData.choices[0].message.content.trim().toUpperCase();
    
    console.log('Validation result:', isElectrical);

    if (isElectrical !== 'YES') {
      const errorMessages = {
        'ar': 'عذراً، هذه الصورة ليست مخططاً كهربائياً',
        'fr': 'Désolé, cette image n\'est pas un schéma électrique',
        'en': 'Sorry, this image is not an electrical schematic'
      };
      
      return new Response(
        JSON.stringify({ 
          error: errorMessages[language as keyof typeof errorMessages] || errorMessages['ar'],
          isValid: false 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Step 2: Analyze the electrical schematic with structured format
    const systemPrompts = {
      'ar': `أنت مهندس كهربائي محترف متخصص في تحليل المخططات الكهربائية. 

قم بتحليل المخطط الكهربائي بشكل منظم ومنسق:

نظم التحليل باستخدام هذا التنسيق:

## 📋 نوع المخطط
[حدد نوع المخطط]

## 🔌 المكونات الرئيسية
[اذكر المكونات وموقعها]

## ⚡ تدفق الطاقة والتحكم
[وضح المسار من المصدر إلى الحمل]

## 🛡️ أجهزة الحماية
[حدد أجهزة الحماية المستخدمة]

## ⚠️ نقاط مهمة وملاحظات السلامة
[اذكر أي ملاحظات مهمة]

استخدم:
- فقرات منفصلة ومنظمة
- عناوين واضحة مع الرموز التعبيرية
- نقاط مرقمة أو نقاط تعداد عند الحاجة
- لغة واضحة ومهنية`,

      'fr': `Vous êtes un ingénieur électricien professionnel spécialisé dans l'analyse de schémas électriques.

Analysez le schéma électrique de manière organisée et structurée:

Organisez l'analyse selon ce format:

## 📋 Type de Schéma
[Identifiez le type]

## 🔌 Composants Principaux
[Listez les composants et leur emplacement]

## ⚡ Flux de Puissance et Contrôle
[Décrivez le chemin de la source à la charge]

## 🛡️ Dispositifs de Protection
[Identifiez les dispositifs de protection]

## ⚠️ Points Importants et Sécurité
[Mentionnez les observations importantes]

Utilisez:
- Paragraphes séparés et organisés
- Titres clairs avec emojis
- Listes numérotées ou à puces si nécessaire
- Langage clair et professionnel`,

      'en': `You are a professional electrical engineer specialized in analyzing electrical schematics.

Analyze the electrical schematic in an organized and structured way:

Organize the analysis using this format:

## 📋 Schematic Type
[Identify the type]

## 🔌 Main Components
[List components and their locations]

## ⚡ Power and Control Flow
[Describe the path from source to load]

## 🛡️ Protection Devices
[Identify protection devices used]

## ⚠️ Important Points and Safety
[Mention important observations]

Use:
- Separate, organized paragraphs
- Clear headings with emojis
- Numbered or bullet lists when needed
- Clear, professional language`
    };

    const analysisResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('Analysis API error:', analysisResponse.status, errorText);
      
      // Handle rate limiting
      if (analysisResponse.status === 429) {
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

      throw new Error('Failed to analyze schematic');
    }

    const analysisData = await analysisResponse.json();
    const analysis = analysisData.choices[0].message.content;

    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify({ 
        analysis,
        isValid: true,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in analyze-schematic function:', error);
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
