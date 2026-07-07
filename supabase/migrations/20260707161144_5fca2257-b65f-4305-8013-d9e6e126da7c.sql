DO $$
DECLARE tg uuid := gen_random_uuid();
BEGIN
INSERT INTO public.posts(slug,lang,title,excerpt,content,status,published_at,reading_minutes,keywords,translation_group,meta_title,meta_description) VALUES
('rank-beyond-limits','en','Rank Beyond Limits: The Algorithmic Case for Local SEO Tools',
 'Third-party APIs slow you down and leak your data. Here''s why the entire E-SeoMax suite is computed locally, in your browser.',
 E'# Rank Beyond Limits\n\nSEO is a math problem disguised as a marketing problem. Every ranking factor Google publishes has an equivalent local computation — pixel widths, keyword frequency, JSON-LD validity, anchor distribution.\n\n## Why not APIs?\n\n- **Latency**: Round-tripping to a hosted service adds 400–1500ms per call.\n- **Privacy**: Your unreleased title tags should not appear in a vendor''s telemetry.\n- **Cost**: The best tools charge $99+/month for what is essentially a text-processing pipeline.\n\n## The eight instruments\n\n1. SERP Preview — canvas-measured pixel widths.\n2. Keyword Density — trilingual tokenizer with Arabic normalization.\n3. On-Page Auditor — 30+ factors extracted from raw HTML.\n4. Readability — Flesch, Kandel-Moles, and an Arabic heuristic.\n5. Meta & OG — copy-ready `<head>` with JSON-LD validation.\n6. Robots & Sitemap — visual builder with live linting.\n7. Anchor Audit — classify backlinks and score risk.\n8. Keyword Ideas — trilingual expansion with intent classification.\n\nThe **math** is the moat. Not the dashboard.',
 'published', now(), 4, ARRAY['seo','algorithmic','local'], tg,
 'Rank Beyond Limits — Algorithmic SEO','Why the E-SeoMax suite runs locally and beats API-bound tools.'),

('classer-au-dela-des-limites','fr','Classer au-delà des limites : le cas algorithmique du SEO local',
 'Les API tierces ralentissent et exposent vos données. Voici pourquoi toute la suite E-SeoMax se calcule localement dans le navigateur.',
 E'# Classer au-delà des limites\n\nLe SEO est un problème mathématique déguisé en problème marketing. Chaque facteur de classement publié par Google a un équivalent calculable localement.\n\n## Pourquoi pas d''API ?\n\n- **Latence** : chaque appel ajoute 400 à 1500ms.\n- **Confidentialité** : vos titres non publiés n''ont rien à faire dans la télémétrie d''un fournisseur.\n- **Coût** : 99$/mois pour un simple pipeline de traitement de texte.\n\n## Les huit instruments\n\n1. Aperçu SERP — mesures pixel par canvas.\n2. Densité — tokenizer trilingue avec normalisation arabe.\n3. Audit on-page — plus de 30 facteurs.\n4. Lisibilité — Flesch, Kandel-Moles, heuristique arabe.\n5. Meta & OG — `<head>` prêt à copier avec JSON-LD validé.\n6. Robots & Sitemap — constructeur visuel avec linting.\n7. Audit d''ancres — classification et score de risque.\n8. Idées de mots-clés — expansion trilingue.\n\nLes **maths** sont le fossé. Pas le tableau de bord.',
 'published', now(), 4, ARRAY['seo','algorithmique','local'], tg,
 'Classer au-delà des limites — SEO algorithmique','Pourquoi E-SeoMax s''exécute localement et dépasse les outils basés sur API.'),

('tasaddar-bila-hudud','ar','تصدّر بلا حدود: الحجّة الخوارزميّة لأدوات SEO المحليّة',
 'الواجهات الخارجيّة تُبطئ عملك وتُسرّب بياناتك. لهذا تعمل كامل مجموعة E-SeoMax محلياً داخل المتصفّح.',
 E'# تصدّر بلا حدود\n\nالـ SEO مشكلة رياضيّة متنكّرة في هيئة تسويق. كل عامل ترتيب تنشره قوقل له مقابل يمكن حسابه محلياً.\n\n## لماذا لا واجهات خارجيّة؟\n\n- **الكمون**: كل استدعاء يضيف 400 إلى 1500 مللي ثانية.\n- **الخصوصيّة**: عناوينك غير المنشورة لا مكان لها في تتبّع مزوّد خارجي.\n- **التكلفة**: 99 دولاراً شهرياً مقابل خطّ معالجة نصوص بسيط.\n\n## الأدوات الثمانية\n\n1. معاينة SERP — قياسات بكسل عبر canvas.\n2. الكثافة — مُقسّم ثلاثي اللغات مع تطبيع عربي.\n3. مدقّق الصفحة — أكثر من 30 عاملاً.\n4. قابليّة القراءة — Flesch وKandel-Moles وقواعد عربيّة.\n5. Meta و OG — `<head>` جاهز مع JSON-LD.\n6. Robots و Sitemap — منشئ مرئي مع فحص.\n7. تدقيق الروابط — تصنيف ودرجة مخاطر.\n8. أفكار الكلمات — توسيع ثلاثي اللغات.\n\nالرياضيّات هي الحصن، لا لوحة التحكّم.',
 'published', now(), 4, ARRAY['سيو','خوارزمي','محلي'], tg,
 'تصدّر بلا حدود — SEO خوارزمي','لماذا تعمل E-SeoMax محلياً وتتفوّق على الأدوات المعتمدة على واجهات.');
END $$;