
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
// مفتاح Gemini المجاني الخاص بك (آمن تمامًا لأنه مجاني ولا حدود حقيقية)
const MY_GEMINI_KEY = "AIzaSyD1xsZUeIYiapYegUBhsfZ0BuzFwEKAnNc";
// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, allImages, language = 'ar', mode = 'detailed', textToCorrect } = await req.json();
    
    if (!imageBase64) {
      throw new Error('Image is required');
    }

    const images = allImages && allImages.length > 0 ? allImages : [imageBase64];
    console.log(`تحليل ${images.length} صورة/صور...`);

    // بناء محتوى الصور لإرسالها إلى Gemini
    const imageParts = images.flatMap((img: string, i: number) => [
      { type: "text", text: images.length > 1 ? `صورة ${i + 1}:` : "المخطط الكهربائي:" },
      { type: "image_url", image_url: { url: img } }
    ]);

    // الـ System Prompt حسب اللغة والوضع
    const systemPrompts: Record<string, string> = {
      'ar': mode === 'summary'
        ? `أنت خبير في تلخيص المخططات الكهربائية. قدم ملخصًا واضحًا:
## الغرض من المخطط
## الشرح المبسط
## الخلاصة`
        : `أنت مهندس كهربائي محترف. قم بتحليل المخطط بشكل شامل:
## نوع المخطط
## المكونات الرئيسية
## مسار تدفق الطاقة
## نظام الحماية
## مبدأ العمل
## المواصفات الفنية
## ملاحظات السلامة
## تقييم المخطط`,
      'en': mode === 'summary'
        ? `You are an expert in summarizing electrical schematics. Provide a clear summary:
## Schematic Purpose
## Simplified Explanation
## Summary`
        : `You are a professional electrical engineer. Analyze comprehensively:
## Schematic Type
## Main Components
## Power Flow
## Protection System
## Operating Principle
## Technical Specs
## Safety Notes
## Evaluation`,
      'fr': mode === 'summary'
        ? `Résumé clair du schéma électrique:
## Objectif
## Explication simplifiée
## Résumé`
        : `Analyse complète du schéma:
## Type de Schéma
## Composants Principaux
## Flux de Puissance
## Système de Protection
## Principe de Fonctionnement
## Spécifications
## Sécurité
## Évaluation`
    };

    let userContent: any;

    if (mode === 'correct' && textToCorrect) {
      userContent = [{ type: "text", text: `قم بمراجعة وتصحيح النص التالي:\n\n${textToCorrect}` }];
    } else {
      userContent = [
        { type: "text", text: `قم بتحليل هذا المخطط الكهربائي بشكل ${mode === 'summary' ? 'ملخص' : 'مفصل'}.` },
        ...imageParts
      ];
    }

    // طلب التحليل من Gemini مباشرة (مجاني 100%)
    const analysisResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${MY_GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompts[language] || systemPrompts['ar'] }] },
            { role: "user", parts: userContent }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192
          }
        })
      }
    );

    if (!analysisResponse.ok) {
      const err = await analysisResponse.text();
      console.error("Gemini Error:", analysisResponse.status, err);

      const msg = {
        ar: "حدث خطأ مؤقت، جرب مرة أخرى خلال ثواني.",
        en: "Temporary error, please try again in a few seconds.",
        fr: "Erreur temporaire, réessayez dans quelques secondes."
      };

      return new Response(JSON.stringify({ error: msg[language as keyof typeof msg] || msg.ar }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await analysisResponse.json();
    const analysis = data.candidates[0].content.parts[0].text;

    console.log("تحليل ناجح باستخدام Gemini المجاني");
    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Error in analyze-schematic:', error);
    return new Response(
      JSON.stringify({ error: 'فشل في تحليل المخطط، تأكد من الصورة' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});



//import "https://deno.land/x/xhr@0.1.0/mod.ts";
//import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

//const corsHeaders = {
  //'Access-Control-Allow-Origin': '*',
  //'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
//};

//serve(async (req) => {
  //if (req.method === 'OPTIONS') {
    //return new Response(null, { headers: corsHeaders });
  //}

  //try {
    //const { imageBase64, allImages, language = 'ar', mode = 'detailed', textToCorrect } = await req.json();
    
    //if (!imageBase64) {
      //throw new Error('Image is required');
    //}

   // const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
   // if (!LOVABLE_API_KEY) {
     // throw new Error('LOVABLE_API_KEY is not configured');
   // }

   // const images = allImages && allImages.length > 0 ? allImages : [imageBase64];
  //  console.log(`Starting schematic analysis for ${images.length} image(s)...`);

    // Step 1: Validate the first image
   // console.log('Starting image validation...');
    
    //const validationResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    //  method: 'POST',
    //  headers: {
        //'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        //'Content-Type': 'application/json',
     // },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert electrical engineer. Determine if this image contains ANY electrical, electronic, or technical schematic content. Answer ONLY "YES" or "NO".'
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Does this image contain electrical or technical schematic content? Answer ONLY YES or NO.' },
              { type: 'image_url', image_url: { url: images[0] } }
            ]
          }
        ],
      }),
    });

    //if (validationResponse.ok) {
     // const validationData = await validationResponse.json();
     // const responseContent = validationData.choices[0].message.content.trim().toUpperCase();
     // console.log('Validation response:', responseContent);
   // }
//
    // Step 2: Analyze images
   // console.log(`Starting ${mode} analysis...`);

   // const imageContents = images.map((img: string, index: number) => [
      //{ type: 'text', text: images.length > 1 ? `صورة ${index + 1} من ${images.length}:` : 'المخطط الكهربائي:' },
     // { type: 'image_url', image_url: { url: img } }
  //  ]).flat();

    const systemPrompts: Record<string, string> = {
      'ar': mode === 'summary' ?
        `أنت خبير في تلخيص المخططات الكهربائية. قدم ملخصاً واضحاً:
## 🎯 الغرض من المخطط
## 📝 الشرح المبسط
## ✅ الخلاصة` :
        `أنت مهندس كهربائي محترف. قم بتحليل المخطط بشكل شامل:
## 📋 نوع المخطط
## 🔌 المكونات الرئيسية
## ⚡ مسار تدفق الطاقة
## 🛡️ نظام الحماية
## 🔧 مبدأ العمل
## ⚙️ المواصفات الفنية
## ⚠️ ملاحظات السلامة
## 📊 تقييم المخطط`,
      'en': mode === 'summary' ?
        `You are an expert in summarizing electrical schematics. Provide a clear summary:
## 🎯 Schematic Purpose
## 📝 Simplified Explanation
## ✅ Summary` :
        `You are a professional electrical engineer. Analyze comprehensively:
## 📋 Schematic Type
## 🔌 Main Components
## ⚡ Power Flow
## 🛡️ Protection System
## 🔧 Operating Principle
## ⚙️ Technical Specs
## ⚠️ Safety Notes
## 📊 Evaluation`,
      'fr': mode === 'summary' ?
        `Vous êtes un expert en résumé de schémas électriques:
## 🎯 Objectif
## 📝 Explication
## ✅ Résumé` :
        `Vous êtes un ingénieur électricien professionnel:
## 📋 Type de Schéma
## 🔌 Composants Principaux
## ⚡ Flux de Puissance
## 🛡️ Système de Protection
## 🔧 Principe de Fonctionnement
## ⚙️ Spécifications
## ⚠️ Sécurité
## 📊 Évaluation`
    };

    let messagesContent;
    if (mode === 'correct' && textToCorrect) {
      messagesContent = { role: 'user', content: `قم بمراجعة وتصحيح النص التالي:\n\n${textToCorrect}` };
    } else {
      messagesContent = {
        role: 'user',
        content: [
          { type: 'text', text: `قم بتحليل هذا المخطط الكهربائي بشكل ${mode === 'summary' ? 'ملخص' : 'مفصل'}.` },
          ...imageContents
        ]
      };
    }

   // const analysisResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
     // method: 'POST',
     /// headers: {
       // 'Authorization': `Bearer ${LOVABLE_API_KEY}`,
       // 'Content-Type': 'application/json',
     // },
    //  body: JSON.stringify({
        //model: 'google/gemini-2.5-flash',
      //  messages: [
      //    { role: 'system', content: systemPrompts[language] || systemPrompts['ar'] },
        //  messagesContent
     //   ],
    ///  }),
    //});

   // if (!analysisResponse.ok) {
      //const errorText = await analysisResponse.text();
    //  console.error('Analysis API error:', analysisResponse.status, errorText);
      
     // if (analysisResponse.status === 402) {
       // const errorMessages: Record<string, string> = {
          //'ar': 'نفاد رصيد الاستخدام. يرجى إضافة رصيد من إعدادات مساحة العمل.',
         // 'fr': 'Crédits épuisés. Veuillez ajouter des crédits.',
         // 'en': 'Out of credits. Please add credits in workspace settings.'
       // };
       // return new Response(
        //  JSON.stringify({ error: errorMessages[language] || errorMessages['ar'] }),
         // { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      //  );
    //  }
      
     // if (analysisResponse.status === 429) {
       // const errorMessages: Record<string, string> = {
       //   'ar': 'تم تجاوز حد الطلبات. يرجى المحاولة لاحقاً.',
          //'fr': 'Limite dépassée. Réessayez plus tard.',
          //'en': 'Rate limit exceeded. Please try again later.'
       // };
       // return new Response(
        //  JSON.stringify({ error: errorMessages[language] || errorMessages['ar'] }),
        //  { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       // );
    //  }
      
     // throw new Error(`AI gateway error: ${analysisResponse.status}`);
   // }

    //const analysisData = await analysisResponse.json();
   // const analysis = analysisData.choices[0].message.content;

    //console.log('Analysis completed successfully');

   // return new Response(
    //  JSON.stringify({ analysis }),
      //{ headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
   // );

  //} catch (error) {
    //console.error('Error in analyze-schematic function:', error);
   // return new Response(
   //   JSON.stringify({ error: 'Failed to analyze schematic' }),
     // { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    //);
  //}
//});
