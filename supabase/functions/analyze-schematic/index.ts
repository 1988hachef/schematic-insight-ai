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
    const { imageBase64, allImages, language = 'ar', mode = 'detailed', textToCorrect } = await req.json();
    
    if (!imageBase64) {
      throw new Error('Image is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Use all images if provided, otherwise use single image
    const images = allImages && allImages.length > 0 ? allImages : [imageBase64];
    console.log(`Starting schematic analysis for ${images.length} image(s)...`);

    // Step 1: Validate the first image only
    console.log('Starting image validation...');
    
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
            content: 'You are an expert electrical engineer. Determine if this image contains ANY electrical, electronic, or technical schematic content including: circuit diagrams, wiring diagrams, control schematics, single-line diagrams, P&ID diagrams, electrical symbols, technical drawings with electrical components, or any electrical engineering documentation. Be INCLUSIVE and accept borderline cases. Only reject if the image is clearly NOT electrical/technical (like photos of people, landscapes, animals, etc.). Answer ONLY "YES" or "NO".'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Does this image contain electrical or technical schematic content? Be lenient - accept any electrical/technical diagrams. Answer ONLY YES or NO.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: images[0]
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
      
      // If validation fails, proceed with analysis anyway
      console.log('Validation failed, but proceeding with analysis...');
    } else {
      const validationData = await validationResponse.json();
      const responseContent = validationData.choices[0].message.content.trim().toUpperCase();
      
      console.log('Validation response:', responseContent);

      // Only reject if explicitly "NO" - but to avoid blocking the user,
      // we will just log a warning and continue with the analysis.
      if (responseContent.includes('NO') && !responseContent.includes('YES')) {
        console.warn('Image validation model returned NO (not a schematic), but proceeding with analysis anyway.');
      }
      
      console.log('Image validation completed, proceeding with analysis');
    }

    // Step 2: Analyze all images together
    console.log(`Starting ${mode} analysis for ${images.length} image(s)...`);

    // Build the content array with all images
    const imageContents = images.map((img: string, index: number) => [
      {
        type: 'text',
        text: images.length > 1 
          ? `صورة ${index + 1} من ${images.length} للمخطط الكهربائي:`
          : 'المخطط الكهربائي:'
      },
      {
        type: 'image_url',
        image_url: { url: img }
      }
    ]).flat();

    const systemPrompts = {
      'ar': mode === 'correct' ?
        'أنت خبير في مراجعة وتصحيح التحاليل الفنية للمخططات الكهربائية. مهمتك:\n1. فحص النص للأخطاء الإملائية والنحوية\n2. التحقق من دقة المعلومات التقنية\n3. إصلاح أي معلومات خاطئة أو غير دقيقة\n4. تحسين الصياغة إذا لزم الأمر\n\nأرجع النص المصحح مع قائمة بالتصحيحات المطبقة بهذا التنسيق:\n\n## النص المصحح\n[النص المحسن والمصحح]\n\n## التصحيحات المطبقة\n- التصحيح الأول\n- التصحيح الثاني' :
        mode === 'summary' ?
        `أنت خبير في تلخيص المخططات الكهربائية. مهمتك هي تقديم ملخص مبسط وواضح للمخطط.

${images.length > 1 ? `ملاحظة: سيتم تقديم ${images.length} صورة تمثل أجزاء من مخطط واحد متكامل. قدم ملخصاً شاملاً للمخطط الكامل بناءً على جميع الصور.` : ''}

قواعد الملخص:
1. ابدأ بجملة واحدة توضح الغرض الرئيسي من المخطط
2. قدم شرحاً مبسطاً في فقرة واحدة (2-3 أسطر)
3. اختم بخلاصة على شكل نقاط (3-5 نقاط رئيسية)

تنسيق الإخراج:
## 🎯 الغرض من المخطط
شرح موجز في سطر واحد عن الهدف الأساسي

## 📝 الشرح المبسط
فقرة واحدة توضح الفكرة الأساسية والمكونات الرئيسية

## ✅ الخلاصة
• النقطة الرئيسية الأولى
• النقطة الرئيسية الثانية
• النقطة الرئيسية الثالثة

كن موجزاً وواضحاً.` :
        `أنت مهندس كهربائي محترف متخصص في تحليل المخططات الكهربائية بدقة عالية.

${images.length > 1 ? `ملاحظة مهمة: سيتم تقديم ${images.length} صورة لك. هذه الصور تمثل أجزاء من مخطط كهربائي واحد متكامل. يجب عليك تحليل جميع الصور معاً وربط المعلومات من كل صورة لتقديم تحليل شامل للمخطط الكامل.` : ''}

قم بتحليل المخطط الكهربائي بشكل شامل ومفصل للغاية واحترافي:

نظم التحليل باستخدام هذا التنسيق الدقيق:

## 📋 نوع المخطط وتصنيفه
[حدد نوع المخطط بدقة: مخطط خط واحد، مخطط تحكم، مخطط توصيل، مخطط P&ID كهربائي، إلخ]

## 🔌 المكونات الرئيسية والعناصر الكهربائية
[قدم قائمة تفصيلية شاملة لكل المكونات مع:
- اسم العنصر الكهربائي ورمزه
- موقعه الدقيق في المخطط
- وظيفته المحددة
- مواصفاته التقنية إن وجدت]

## ⚡ مسار تدفق الطاقة والتحكم
[وضح بالتفصيل:
- مصدر الطاقة ومواصفاته (الجهد، التيار، التردد)
- المسار الكامل للتيار من المصدر إلى الحمل
- نقاط التوصيل الرئيسية
- عناصر التحكم في المسار
- الأحمال الكهربائية ومواصفاتها]

## 🛡️ نظام الحماية والأمان
[حدد بدقة:
- جميع أجهزة الحماية المستخدمة (قواطع، فيوزات، relay حماية، إلخ)
- مواصفات كل جهاز حماية
- موقع كل جهاز حماية ووظيفته
- أنواع الحماية المتوفرة (حماية من زيادة التيار، القصر، الجهد، إلخ)]

## 🔧 مبدأ العمل والتشغيل
[اشرح بالتفصيل:
- كيف يعمل النظام خطوة بخطوة
- تسلسل التشغيل
- الحالات المختلفة للتشغيل
- التداخلات والاشتراطات]

## ⚙️ المواصفات الفنية والقيم الكهربائية
[اذكر جميع القيم الموجودة:
- الجهود الكهربائية
- التيارات المقننة
- القدرات الكهربائية
- معاملات الأمان
- أي قيم فنية أخرى]

## ⚠️ نقاط مهمة وملاحظات السلامة
[قدم تحليل شامل للسلامة:
- نقاط الخطر المحتملة
- احتياطات السلامة الضرورية
- توصيات التشغيل الآمن
- ملاحظات على التصميم
- توصيات للتحسين إن وجدت]

## 📊 تقييم المخطط
[قيم المخطط من حيث:
- الوضوح والدقة
- الامتثال للمعايير
- الكفاءة والأمان
- أي ملاحظات إضافية]

استخدم دائماً:
- فقرات منفصلة ومنظمة بشكل احترافي
- عناوين واضحة ومميزة مع الرموز التعبيرية الملونة
- نقاط مرقمة ونقاط تعداد للتفاصيل
- لغة هندسية واضحة ومهنية ودقيقة
- تفاصيل فنية شاملة وعميقة`,

      'fr': mode === 'correct' ?
        'Vous êtes un expert en révision et correction d\'analyses techniques de schémas électriques. Votre tâche:\n1. Vérifier le texte pour les fautes d\'orthographe et de grammaire\n2. Vérifier l\'exactitude des informations techniques\n3. Corriger toute information incorrecte ou imprécise\n4. Améliorer la formulation si nécessaire\n\nRetournez le texte corrigé avec une liste des corrections appliquées.' :
        mode === 'summary' ?
        `Vous êtes un expert en résumé de schémas électriques. Votre tâche est de fournir un résumé clair et simplifié.

Règles du résumé:
1. Commencez par une phrase expliquant l'objectif principal
2. Fournissez une explication simplifiée en un paragraphe (2-3 lignes)
3. Terminez par un résumé sous forme de points clés (3-5 points)

Format de sortie:
## 🎯 Objectif du Schéma
Explication brève en une ligne

## 📝 Explication Simplifiée
Un paragraphe expliquant l'idée principale et les composants clés

## ✅ Résumé
• Premier point clé
• Deuxième point clé
• Troisième point clé

Soyez concis et clair.` :
        `Vous êtes un ingénieur électricien professionnel hautement spécialisé dans l'analyse détaillée de schémas électriques.

Analysez le schéma électrique de manière exhaustive et professionnelle:

Organisez l'analyse selon ce format précis:

## 📋 Type et Classification du Schéma
[Identifiez précisément: schéma unifilaire, schéma de commande, schéma de câblage, P&ID électrique, etc.]

## 🔌 Composants Principaux et Éléments Électriques
[Fournissez une liste détaillée complète avec:
- Nom et symbole de chaque composant
- Position exacte dans le schéma
- Fonction spécifique
- Spécifications techniques si disponibles]

## ⚡ Flux de Puissance et Contrôle
[Décrivez en détail:
- Source d'alimentation et ses caractéristiques
- Chemin complet du courant
- Points de connexion principaux
- Éléments de contrôle
- Charges et leurs spécifications]

## 🛡️ Système de Protection et Sécurité
[Identifiez précisément:
- Tous les dispositifs de protection
- Spécifications de chaque dispositif
- Position et fonction
- Types de protection disponibles]

## 🔧 Principe de Fonctionnement
[Expliquez en détail:
- Fonctionnement étape par étape
- Séquence d'opération
- Différents états de fonctionnement
- Interlocks et conditions]

## ⚙️ Spécifications Techniques
[Mentionnez toutes les valeurs:
- Tensions électriques
- Courants nominaux
- Puissances
- Facteurs de sécurité
- Autres valeurs techniques]

## ⚠️ Points Importants et Sécurité
[Analyse complète de sécurité:
- Points de danger potentiels
- Précautions nécessaires
- Recommandations d'exploitation
- Notes sur la conception
- Suggestions d'amélioration]

## 📊 Évaluation du Schéma
[Évaluez selon:
- Clarté et précision
- Conformité aux normes
- Efficacité et sécurité
- Observations supplémentaires]

Utilisez toujours:
- Paragraphes professionnels bien organisés
- Titres clairs avec emojis colorés
- Listes numérotées et à puces
- Langage technique précis
- Détails techniques approfondis`,

      'en': mode === 'correct' ?
        'You are an expert in reviewing and correcting technical analyses of electrical schematics. Your task:\n1. Check the text for spelling and grammar errors\n2. Verify the accuracy of technical information\n3. Fix any incorrect or inaccurate information\n4. Improve wording if necessary\n\nReturn the corrected text with a list of corrections applied.' :
        mode === 'summary' ?
        `You are an expert in summarizing electrical schematics. Your task is to provide a clear and simplified summary.

Summary rules:
1. Start with one sentence explaining the main purpose
2. Provide a simplified explanation in one paragraph (2-3 lines)
3. End with a summary in key points (3-5 points)

Output format:
## 🎯 Schematic Purpose
Brief one-line explanation

## 📝 Simplified Explanation
One paragraph explaining the main idea and key components

## ✅ Summary
• First key point
• Second key point
• Third key point

Be concise and clear.` :
        `You are a highly specialized professional electrical engineer expert in detailed electrical schematic analysis.

Analyze the electrical schematic comprehensively and professionally:

Organize the analysis using this precise format:

## 📋 Schematic Type and Classification
[Identify precisely: single-line diagram, control diagram, wiring diagram, electrical P&ID, etc.]

## 🔌 Main Components and Electrical Elements
[Provide comprehensive detailed list with:
- Name and symbol of each component
- Exact location in the schematic
- Specific function
- Technical specifications if available]

## ⚡ Power and Control Flow
[Describe in detail:
- Power source and characteristics
- Complete current path
- Main connection points
- Control elements
- Loads and their specifications]

## 🛡️ Protection and Safety System
[Identify precisely:
- All protection devices
- Specifications of each device
- Position and function
- Types of protection available]

## 🔧 Operating Principle
[Explain in detail:
- Step-by-step operation
- Operation sequence
- Different operating states
- Interlocks and conditions]

## ⚙️ Technical Specifications
[Mention all values:
- Electrical voltages
- Rated currents
- Powers
- Safety factors
- Other technical values]

## ⚠️ Important Points and Safety
[Complete safety analysis:
- Potential hazard points
- Necessary precautions
- Safe operation recommendations
- Design notes
- Improvement suggestions]

## 📊 Schematic Evaluation
[Evaluate according to:
- Clarity and accuracy
- Standards compliance
- Efficiency and safety
- Additional observations]

Always use:
- Well-organized professional paragraphs
- Clear headings with colored emojis
- Numbered and bullet lists
- Precise technical language
- In-depth technical details`
    };

    // Prepare messages content based on mode
    let messagesContent;
    
    if (mode === 'correct' && textToCorrect) {
      messagesContent = {
        role: 'user',
        content: `قم بمراجعة وتصحيح النص التالي:\n\n${textToCorrect}`
      };
    } else {
      messagesContent = {
        role: 'user',
        content: [
          {
            type: 'text',
            text: images.length > 1
              ? `قم بتحليل هذا المخطط الكهربائي الكامل بشكل ${mode === 'summary' ? 'ملخص' : 'مفصل'} واحترافي. المخطط مقسم إلى ${images.length} صورة. قم بتحليل جميع الأجزاء وربطها معاً لتقديم تحليل متكامل.`
              : `قم بتحليل هذا المخطط الكهربائي بشكل ${mode === 'summary' ? 'ملخص' : 'مفصل'} واحترافي.`
          },
          ...imageContents
        ]
      };
    }

    