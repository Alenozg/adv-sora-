import React, { useState, useEffect, useRef } from "react";

const FB_LIMITS = { headline: 40, primaryText: 2000 };

const PLATFORMS = [
  { id: "google",   name: "Google Ads",   icon: "🔍", color: "#4285F4", ctr: 3.17, cpc: 2.69 },
  { id: "meta",     name: "Meta Ads",     icon: "📘", color: "#1877F2", ctr: 1.11, cpc: 1.72 },
  { id: "tiktok",   name: "TikTok Ads",   icon: "🎵", color: "#69C9D0", ctr: 1.02, cpc: 1.0  },
  { id: "linkedin", name: "LinkedIn Ads", icon: "💼", color: "#0A66C2", ctr: 0.65, cpc: 5.26 },
  { id: "twitter",  name: "X / Twitter",  icon: "✕",  color: "#888",   ctr: 0.86, cpc: 0.38 },
  { id: "youtube",  name: "YouTube Ads",  icon: "▶",  color: "#FF0000", ctr: 0.65, cpc: 3.21 },
];

const GOALS = [
  { id: "awareness",  label: "Marka Bilinirliği", icon: "👁"  },
  { id: "traffic",    label: "Web Trafiği",        icon: "🌐"  },
  { id: "leads",      label: "Lead Toplama",        icon: "📋"  },
  { id: "sales",      label: "Satış / Dönüşüm",    icon: "💰"  },
  { id: "app",        label: "Uygulama Yükleme",   icon: "📱"  },
  { id: "engagement", label: "Etkileşim",           icon: "❤"  },
];


// ─── SECTOR TREE ─────────────────────────────────────────────────────
const SECTOR_TREE = {
  "E-Ticaret":        ["Teknoloji & Aksesuar (iPhone, Android kılıf vb.)","Moda & Giyim","Kozmetik & Bakım","Ev & Yaşam","Spor & Outdoor","Oyun & Hobi","Çocuk & Anne","Gıda & İçecek","Kitap & Kırtasiye","Diğer E-Ticaret"],
  "SaaS / Teknoloji": ["B2B Yazılım","Mobil Uygulama","Yapay Zeka Araçları","E-Ticaret Altyapısı","Fintech","HR / CRM","Güvenlik","Analitik & Veri","Diğer SaaS"],
  "Finans":           ["Kripto & Borsa","Bankacılık","Bireysel Kredi","Sigorta","Muhasebe & ERP","Yatırım Danışmanlığı","Diğer Finans"],
  "Sağlık":           ["Lazer & Estetik","Diş Kliniği","Klinik / Muayenehane","Spor & Fitness","Beslenme / Diyet","Sağlık Sigortası","Diğer Sağlık"],
  "Eğitim":           ["Online Kurs","Dil Okulu","Üniversite / Hazırlık","Çocuk Eğitimi","Mesleki Kurs","Diğer Eğitim"],
  "Gayrimenkul":      ["Konut Satış","Kiralama","Ticari Gayrimenkul","Tatil Villası","Diğer Gayrimenkul"],
  "Yeme & İçme":      ["Restoran","Kafe","Fast Food","Catering & Organizasyon","Diğer Yeme & İçme"],
  "Moda":             ["Kadın Giyim","Erkek Giyim","Ayakkabı","Çanta & Aksesuar","Diğer Moda"],
  "Otomotiv":         ["Araç Satış","Aksesuar & Modifiye","Bakım & Servis","Araç Kiralama","Diğer Otomotiv"],
  "Hizmet":           ["Temizlik","Taşıma & Nakliyat","Hukuk","Danışmanlık","Etkinlik & Organizasyon","Diğer Hizmet"],
  "Diğer":            [],
};

const TABS = [
  { id: "brands",      label: "Markalarım",        icon: "🏷" },
  { id: "dashboard",   label: "Kampanya Analizi",  icon: "📊" },
  { id: "strategy",    label: "Strateji Danışmanı", icon: "AI" },
  { id: "viral",       label: "Viral Senaryolar",  icon: "🔥" },
  { id: "hooks",       label: "Hook Üretici",      icon: "🪝" },
  { id: "report",      label: "Rapor Üretici",      icon: "📋" },
  { id: "audit",       label: "Reklam Denetçisi",   icon: "🚨" },
  { id: "creative",    label: "Kreatif Üretici",    icon: "🎨" },
  { id: "abtest",      label: "Meta Ads Co-Pilot",    icon: "🚀" },
  { id: "errfix",      label: "Hata Çözücü",          icon: "🚑" },
];

const AGE_GROUPS = ["13-17","18-24","25-34","35-44","45-54","55-64","65+"];
const GENDERS    = ["Kadın","Erkek","Tümü"];
const INDUSTRIES = ["E-Ticaret","SaaS / Teknoloji","Finans","Sağlık","Eğitim","Gayrimenkul","Yeme-İçme","Moda","Oyun","Seyahat","Hizmet","Diğer"];
const INTERESTS  = ["Moda & Güzellik","Spor & Fitness","Teknoloji","Yemek & İçecek","Seyahat","Eğitim","Finans & Yatırım","Eğlence","Aile & Ebeveynlik","Otomotiv","Sağlık & Wellness","Oyun","Müzik","Ev & Dekorasyon","İş & Girişimcilik"];
const PAIN_OPTS  = ["Zaman kaybı","Yüksek maliyet","Karmaşık süreçler","Güvensizlik","Bilgi eksikliği","Kalite sorunu","Hızlı sonuç isteme","Rekabet baskısı"];
const AUDIENCES  = ["18-24 Genç Kadın","18-24 Genç Erkek","25-34 Profesyonel Kadın","25-34 Profesyonel Erkek","35-44 Ebeveyn","45-54 Orta Yaş","55+ Emekli","Üniversite Öğrencisi","Girişimci / KOBİ","Freelancer"];

// ─── CSS ─────────────────────────────────────────────────────────────
const CSS = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#0B0E14}
  .adv-root{min-height:100vh;background:#0B0E14;color:#E8ECF4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex}
  .adv-sidebar{width:220px;min-height:100vh;background:#141820;border-right:1px solid #2A3040;padding:24px 12px;display:flex;flex-direction:column;gap:4px;flex-shrink:0;z-index:2}
  .adv-main{flex:1;overflow-y:auto}
  .adv-inner{max-width:860px;margin:0 auto;padding:32px 28px 80px}
  .adv-section{background:#141820;border:1px solid #2A3040;border-radius:16px;padding:24px;margin-bottom:14px}
  .adv-section-title{font-size:12px;font-weight:700;color:#A29BFE;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;display:flex;align-items:center;gap:8px}
  .adv-btn{background:#6C5CE7;color:#fff;border:none;padding:12px 28px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s}
  .adv-btn:hover:not(:disabled){background:#A29BFE;transform:translateY(-1px)}
  .adv-btn:disabled{opacity:0.35;cursor:not-allowed}
  .adv-btn-ghost{background:transparent;color:#8892A6;border:1px solid #2A3040;padding:10px 20px;border-radius:10px;font-size:13px;cursor:pointer;font-family:inherit;transition:all 0.2s}
  .adv-btn-ghost:hover{color:#E8ECF4;border-color:#8892A6}
  .adv-chip{display:inline-flex;align-items:center;padding:8px 14px;border-radius:8px;background:#1C2230;border:1.5px solid #2A3040;cursor:pointer;font-size:12px;color:#8892A6;transition:all 0.15s;font-family:inherit;user-select:none;white-space:nowrap}
  .adv-chip:hover{border-color:#6C5CE7;color:#E8ECF4}
  .adv-chip.on{border-color:#6C5CE7;background:rgba(108,92,231,0.14);color:#A29BFE;font-weight:600}
  .adv-input{background:#1C2230;border:1px solid #2A3040;border-radius:10px;padding:12px 16px;color:#E8ECF4;font-family:inherit;font-size:14px;width:100%;outline:none;transition:border-color 0.2s}
  .adv-input:focus{border-color:#6C5CE7}
  .adv-textarea{background:#1C2230;border:1px solid #2A3040;border-radius:10px;padding:12px 16px;color:#E8ECF4;font-family:inherit;font-size:14px;width:100%;outline:none;resize:vertical;transition:border-color 0.2s}
  .adv-textarea:focus{border-color:#6C5CE7}
  .adv-select{background:#1C2230;color:#E8ECF4;border:1px solid #2A3040;border-radius:10px;padding:10px 14px;font-size:13px;font-family:inherit;outline:none;cursor:pointer;width:100%}
  .adv-label{font-size:12px;color:#8892A6;margin-bottom:6px;display:block;font-weight:500}
  .adv-sb{display:flex;align-items:center;gap:10px;padding:11px 16px;border-radius:10px;border:none;background:transparent;color:#8892A6;font-size:13px;font-family:inherit;cursor:pointer;width:100%;text-align:left;transition:all 0.15s;font-weight:500}
  .adv-sb:hover{background:#1C2230;color:#E8ECF4}
  .adv-sb.active{background:rgba(108,92,231,0.12);color:#A29BFE;font-weight:600}
  .adv-logo{font-family:monospace;font-size:18px;font-weight:700}
  .adv-logo span{color:#A29BFE}
  .adv-range{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:3px;outline:none;cursor:pointer}
  .adv-range::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#A29BFE;border:3px solid #0B0E14;cursor:pointer}
  .adv-tip{background:rgba(108,92,231,0.07);border:1px solid rgba(108,92,231,0.2);border-radius:10px;padding:12px 16px;font-size:13px;color:#8892A6;line-height:1.6}
  .adv-warn{background:rgba(255,165,2,0.07);border:1px solid rgba(255,165,2,0.2);border-radius:10px;padding:12px 16px;font-size:13px;color:#FFA502;line-height:1.6}
  .adv-ok{background:rgba(0,214,143,0.07);border:1px solid rgba(0,214,143,0.2);border-radius:10px;padding:12px 16px;font-size:13px;color:#00D68F;line-height:1.6}
  .adv-bad{background:rgba(255,107,107,0.07);border:1px solid rgba(255,107,107,0.2);border-radius:10px;padding:12px 16px;font-size:13px;color:#FF6B6B;line-height:1.6}
  .adv-stat{background:#141820;border:1px solid #2A3040;border-radius:14px;padding:18px 20px;text-align:center}
  .adv-grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .adv-pbar{height:8px;background:#1C2230;border-radius:4px;overflow:hidden;flex:1}
  .adv-pbar-fill{height:100%;border-radius:4px;transition:width 0.9s cubic-bezier(.4,0,.2,1)}
  .adv-glow{position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(108,92,231,0.15) 0%,transparent 70%);filter:blur(80px);pointer-events:none}
  .adv-mmb{display:none;background:#141820;border:1px solid #2A3040;color:#E8ECF4;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:18px}
  .adv-copy-btn{background:#1C2230;border:1px solid #2A3040;color:#8892A6;padding:4px 10px;border-radius:6px;font-size:11px;cursor:pointer;font-family:inherit;transition:all 0.15s;white-space:nowrap}
  .adv-copy-btn:hover{color:#A29BFE;border-color:#6C5CE7}
  @keyframes advFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  .adv-fade{animation:advFade 0.35s ease forwards}
  @keyframes spin{to{transform:rotate(360deg)}}
  .adv-spin{animation:spin 0.9s linear infinite;display:inline-block}

  /* Upload zone */
  .adv-upload-zone{border:2px dashed #2A3040;border-radius:14px;padding:32px 24px;text-align:center;cursor:pointer;transition:all 0.2s;background:#0F1318}
  .adv-upload-zone:hover,.adv-upload-zone.drag{border-color:#6C5CE7;background:rgba(108,92,231,0.05)}
  .adv-upload-zone input[type=file]{display:none}

  /* Analysing overlay */
  .adv-analyzing{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:48px 24px;text-align:center}

  @media(max-width:768px){.adv-mmb{display:block}.adv-sidebar{display:none!important}.adv-grid2{grid-template-columns:1fr}}
`;

// ─── TEXT ANALYSIS HELPERS ────────────────────────────────────────────
const POWER_W   = ["ücretsiz","bedava","şimdi","hemen","son","sınırlı","fırsat","kaçırma","keşfet","dene","başla","indirim","özel","sadece","bugün","yeni","garantili","kolay","hızlı","anında"];
const CTA_W     = ["şimdi","hemen","tıkla","başla","dene","satın al","keşfet","incele","kayıt ol","abone ol","indir","al","katıl","oluştur","randevu","sipariş"];
const EMOTION_W = ["hayal","korku","kaçırma","pişman","mutlu","özgür","güven","endişe","merak","gurur","başarı","zafer","çözüm","fark","dönüşüm"];

// ─── CLAUDE API — VISUAL ANALYSIS ────────────────────────────────────
async function analyzeVisualWithClaude(base64Data, mediaType, adContext) {
  const prompt = `Sen bir kıdemli dijital reklam uzmanısın. Bu görsel bir reklam için kullanılıyor veya kullanılmak isteniyor.

Reklam Bağlamı:
- İşletme: ${adContext.business}
- Ürün/Hizmet: ${adContext.product}
- Hedef Kitle: ${adContext.ageGroups.join(", ")} / ${adContext.genders.join(", ")}
- Kampanya Hedefi: ${adContext.goalLabel}
- Platform(lar): ${adContext.platforms}
- Başlık: "${adContext.adHeadline}"
- Ana Metin: "${adContext.adPrimaryText}"

Bu görseli/videoyu aşağıdaki kriterlere göre analiz et ve SADECE JSON döndür (başka hiçbir şey yazma):

{
  "visualScore": <1-10 arası sayı>,
  "firstImpression": "<3 cümlede ilk izlenim — birisi 0.3 saniyede görseli görse ne hisseder?>",
  "strengths": ["<güçlü yön 1>", "<güçlü yön 2>", "<güçlü yön 3>"],
  "weaknesses": ["<zayıf yön 1>", "<zayıf yön 2>"],
  "audienceMatch": "<hedef kitleyle uyum değerlendirmesi — 2-3 cümle>",
  "platformFit": "<seçilen platform(lar) için görsel uygunluğu — 2-3 cümle>",
  "hookStrength": "<ilk 1-3 saniye hook gücü — 1-2 cümle>",
  "textVisualHarmony": "<yazı ve görsel uyumu — 1-2 cümle>",
  "colorPsychology": "<renk kullanımının duygusal etkisi — 1-2 cümle>",
  "ctaVisibility": "<CTA görünürlüğü ve yerleşimi — 1-2 cümle>",
  "improvements": ["<somut iyileştirme önerisi 1>", "<somut iyileştirme önerisi 2>", "<somut iyileştirme önerisi 3>"],
  "abTestIdea": "<bu görsele karşı test edilecek alternatif konsept fikri>"
}`;

  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      max_tokens: 1000,
      model: window.__selectedModel || "claude",
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } },
          { type: "text", text: prompt }
        ]
      }]
    })
  });

  const data = await response.json();
  const text = data.content?.map(c => c.text || "").join("") || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}


// ─── COMPETITOR ANALYSIS — FREE (no API, instant) ───────────────────
// ─── NICHE AD INTELLIGENCE DATABASE ─────────────────────────────────
// Her niche için gerçek reklamverenler, reklam formatları ve kazanan stratejiler
// ─── AD INTELLIGENCE via Claude ─────────────────────────────────────
async function searchCompetitorAds(service, country, limit) {
  const LABELS = {TR:"Turkiye", US:"ABD", DE:"Almanya", GB:"Ingiltere", ALL:"Tum Dunya"};
  const cl = LABELS[country] || country;
  const adLibUrl = "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country="
    + country + "&q=" + encodeURIComponent(service) + "&search_type=keyword_unordered";

  const msg = service + " sektoru " + cl + " Facebook Instagram reklam analizi. "
    + "5 rakip firma: butce seviyesi, format, ornek baslik, ornek metin, hedef kitle, kac gun yayinda. "
    + "Kazanan formatlar, hooklar, firsatlar, onerilen strateji (baslik+metin+cta+gorsel). "
    + "JSON: {service,country,advertisers:[{rank,name,estimatedBudget,adFormats,headline,body,cta,targeting,daysActive,adAngle}],insights:{topFormat,hooks,gaps},strategy:{headline,primaryText,cta,visual,why},adLibUrl}";

  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      max_tokens: 1500,
      model: window.__selectedModel || "claude",
      system: "Reklam uzmanisin. SADECE JSON dondur.",
      messages: [{ role: "user", content: msg }]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

  const raw = (data.content || []).map(function(c) { return c.text || ""; }).join("").trim();
  if (!raw) throw new Error("Boş yanıt. stop_reason: " + (data.stop_reason || "?"));

  const clean = raw.replace(/```json/g,"").replace(/```/g,"").trim();
  const si = clean.indexOf("{");
  const ei = clean.lastIndexOf("}");
  if (si === -1 || ei === -1) throw new Error("JSON yok. Yanit: " + clean.slice(0,200));

  const parsed = JSON.parse(clean.slice(si, ei+1));
  parsed.adLibUrl = parsed.adLibUrl || adLibUrl;
  return parsed;
}


// ─── STRATEGY ADVISOR — 2-Tier: Sonnet (ozet) + Haiku (metin) ──────
async function callModel(model, systemPrompt, userMsg, tokens, _label, provider) {
  const resp = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: provider || window.__selectedModel || "claude", claudeModel: model, max_tokens: tokens, system: systemPrompt, messages: [{ role: "user", content: userMsg }] })
  });
  const data = await resp.json();
  if (data.error) throw new Error(data.error.message || "API hatasi");
  const raw = (data.content||[]).map(function(c){ return c.text||""; }).join("").trim();
  if (!raw) throw new Error("Boş yanıt - model: " + model);

    return sanitizeJSON(raw);
}

// ─── JSON sanitizer (markdown fence temizleyici) ─────────────────────
function sanitizeJSON(raw) {
  if (!raw) throw new Error("Boş yanıt");

  // 1. Markdown fence'leri temizle (her türlü varyasyonu yakala)
  let s = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  // 2. JSON bloğunu ayıkla — ilk { veya [ ile son } veya ] arasını al
  const firstBrace  = s.indexOf("{");
  const firstBracket = s.indexOf("[");
  let si = -1;
  if (firstBrace === -1 && firstBracket === -1) {
    throw new Error("JSON bulunamadı. Ham yanıt: " + raw.slice(0, 150));
  }
  if (firstBrace === -1) si = firstBracket;
  else if (firstBracket === -1) si = firstBrace;
  else si = Math.min(firstBrace, firstBracket);

  const openChar  = s[si];
  const closeChar = openChar === "{" ? "}" : "]";
  const ei = s.lastIndexOf(closeChar);
  if (ei === -1 || ei <= si) throw new Error("JSON kapanışı bulunamadı. Ham: " + s.slice(0, 150));

  let j = s.slice(si, ei + 1);

  // 3. Agresif sanitize — kontrol karakterleri + literal newline/tab sorunları
  // Tüm kontrol karakterlerini (Türkçe UTF-8 hariç) temizle
  j = j.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ");

  // String değerleri içindeki literal newline/carriage return/tab'ları temizle
  // "..." arasındaki \n \r \t karakterlerini boşluğa çevir
  j = j.replace(/"((?:[^"\\]|\\.)*)"/g, function(match) { return match.replace(/\n/g," ").replace(/\r/g," ").replace(/\t/g," "); });

  // Geçersiz escape sequence'leri düzelt (\\n, \\t gibi çift kaçışları)
  // Önce gerçek escape'leri koru, sonra sadece string içindeki bozukları temizle
  j = j.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");

  // Trailing comma temizle
  j = j.replace(/,\s*([}\]])/g, "$1");

  // Tek tırnaklı değerleri çift tırnaklıya çevir
  j = j.replace(/:\s*'([^'\n]*)'/g, ': "$1"');

  // Pass 1: direkt parse
  try { return JSON.parse(j); } catch (e1) {
    // Pass 2: daha agresif temizlik
    try {
      // Tüm newline/cr/tab'ları JSON dışına çıkar
      const j2 = j.replace(/[\n\r\t]/g, " ");
      return JSON.parse(j2);
    } catch (e2) {
      // Pass 3: son çare — sadece key:value çiftlerini yakala
      throw new Error("JSON parse hatası: " + e2.message + " | İlk 300 karakter: " + j.slice(0, 300));
    }
  }
}


async function runStrategyAdvisor(sector, product, brand, usp, problem, goal, adText, provider) {
  const GOALS = {sales:"Satiş",awareness:"Bilinirlik",leads:"Lead",traffic:"Trafik",engagement:"Etkileşim"};
  const goalLabel = GOALS[goal] || goal;
  const ctx = sector + (product ? " / " + product : "") + (brand ? " / " + brand : "");
  const activeProvider = provider || window.__selectedModel || "claude";

  // JSON schema — her iki yolda da aynı
  const JSON_SCHEMA = "{strategies:[{id,name,hook,body,cta,rationale}],visualScenarios:[{id,title,format,background,subject,typography,difference,dimensions}],mediaPlan:[{set,goal,age,gender,interests,placement,budget,format,duration}],kpis:[{metric,target,why}],finalAds:[{strategyId,headline,primaryText,cta}]}";
  const JSON_RULE   = "YANIT SADECE GECERLI JSON OLMALIDIR. Markdown, aciklama, kod blogu KULLANMA. Orn: {strategies:[...]}";

  if (activeProvider === "gemini") {
    // ── Gemini: tek seferde hem analiz hem metin ──────────────────────
    // One-shot prompting: tam beklenen JSON yapısını örnek olarak göster
    const EXAMPLE = '{"strategies":[{"id":"str1","name":"Premium Konumlama","hook":"Hook metni burada","body":"En az 2 tam cumle. Urunun faydasi ve rakipten farki net aciklanmali.","cta":"Simdi Kesfet","rationale":"Neden bu strateji secildi"}],"visualScenarios":[{"id":"vs1","title":"Studio Cekim","format":"Statik Gorsel","background":"Beyaz/Krem","subject":"Urun on planda","typography":"Bold baslik + alt metni","difference":"Premium hissi","dimensions":"1080x1080"}],"mediaPlan":[{"set":"Set 1","goal":"Satis","age":"25-44","gender":"Tum","interests":"Ilgili ilgi alanlari","placement":"Instagram Feed + Stories","budget":"Toplam butce icinde %40","format":"Statik + Carousel","duration":"7 gun"}],"kpis":[{"metric":"CPA","target":"<500 TL","why":"Satis hedefi icin maliyet kontrolu kritik"}],"finalAds":[{"strategyId":"str1","headline":"10 kelimeyi gecmeyen dikkat cekici baslik","primaryText":"Aciya dokunan, degeri anlatan, 2-3 cumle. CTA ile bitmeli.","cta":"Hemen Al"}]}';

    const sys = [
      "Sen deneyimli bir performance marketing uzmanisin. Turkce reklam metinleri yaziyorsun.",
      "KRITIK JSON KURALLARI (ihlal etme):",
      "1. YALNIZCA gecerli JSON dondur. Hic aciklama, hic markdown, hic ```json etiketi yazma.",
      "2. Tum string degerleri tek satirda olmali. Asla literal newline (Enter) karakteri kullanma.",
      "3. Turkce karakterler (ü, ğ, ş vb.) kullanabilirsin ama JSON yapisi bozmasin.",
      "4. Her dizi en az 2 eleman icermeli. Hicbir alan bos birakilmamali.",
      "5. Asagidaki ornekteki AYNI anahtar isimlerini kullan (kopyala-yapistir):",
      EXAMPLE
    ].join(" ");

    const msg = [
      "Musteri bilgileri:",
      "Sektor/Urun: " + ctx,
      "USP (Rakipten farki): " + (usp || "belirtilmedi"),
      "Hedef musterinin sorunu: " + (problem || "belirtilmedi"),
      "Kampanya hedefi: " + goalLabel,
      "Mevcut reklam (varsa): " + (adText || "yok"),
      "",
      "GOREV: Yukaridaki bilgilere gore TAM OLARAK asagidaki formatta JSON uret:",
      "- strategies: 3 adet reklam stratejisi. Her strateji icin hook (en az 8 kelime), body (en az 40 kelime, 2-3 cumle, CTA ile bitmeli) ve rationale (neden bu strateji) doldur.",
      "- visualScenarios: 2 adet gorsel senaryo. Her senaryo icin tum alanlari doldur.",
      "- mediaPlan: 3 adet medya plani seti. Butce dagitimini ve platformlari belirt.",
      "- kpis: 4 adet KPI. Her biri icin hedef rakam ver (Orn: CTR: >%2, CPA: <300 TL).",
      "- finalAds: Her strateji icin 1 final reklam metni. primaryText en az 30 kelime olmali.",
      "",
      "YANITI BUDUR ICIN KES: Sadece JSON objesini yaz. Baska hicbir sey yazma."
    ].join(" ");

    const g = await callModel("gemini", sys, msg, 8000, "Strateji (Gemini)", "gemini");

    // competitorAnalysis verisi Gemini'den gelmeyebilir, UI icin manuel doldur
    const compAnalysis = g.competitorAnalysis || {
      commonStrategy: (g.strategies && g.strategies[0]) ? g.strategies[0].rationale : "Gemini strateji analizi tamamlandi.",
      traps: "Rakip tuzaklari: Fiyat odakli yaklasimdan kacinin, deger onerisi one cikin.",
      psychology: "Hedef kitle psikolojisi: " + (problem || "Musteri sorununa odakli mesajlasma"),
      positioning: (g.strategies && g.strategies[0]) ? g.strategies[0].name : "Premium konumlama"
    };

    return {
      competitorAnalysis: compAnalysis,
      manifesto: g.manifesto || ("⚡ Gemini tarafindan olusturuldu. Sektor: " + ctx + ". Hedef: " + goalLabel),
      strategies:      g.strategies      || [],
      visualScenarios: g.visualScenarios || [],
      mediaPlan:       g.mediaPlan       || [],
      kpis:            g.kpis            || [],
      finalAds:        g.finalAds        || [],
    };
  }

  // ── Claude: 2-tier chain ─────────────────────────────────────────────
  const t1sys = "Sen stratejik reklam danismanisisin. " + JSON_RULE;
  const t1msg = "Sektor ve urun: " + ctx
    + ". USP: " + (usp||"belirtilmedi")
    + ". Problem: " + (problem||"belirtilmedi")
    + ". Hedef: " + goalLabel
    + ". Mevcut reklam: " + (adText||"yok")
    + ". Su JSON formatinda dondur: {analysis:{commonStrategy,traps,psychology,positioning},manifesto}. " + JSON_RULE;

  const t1 = await callModel("claude-sonnet-4-20250514", t1sys, t1msg, 600, "Strateji Analiz", "claude");

  const t2sys = "Sen reklam metin yazarisin. " + JSON_RULE;
  const t2ctx = ctx + " / Hedef: " + goalLabel + " / USP: " + (usp||"-") + " / Strateji: " + (t1.analysis&&t1.analysis.positioning||"");
  const t2msg = t2ctx + " icin su JSON formatinda dondur: " + JSON_SCHEMA + ". " + JSON_RULE;

  const t2 = await callModel("claude-sonnet-4-20250514", t2sys, t2msg, 2500, "Strateji Metin", "claude");

  return {
    competitorAnalysis: t1.analysis || {},
    manifesto: t1.manifesto || "",
    strategies:      t2.strategies      || [],
    visualScenarios: t2.visualScenarios || [],
    mediaPlan:       t2.mediaPlan       || [],
    kpis:            t2.kpis            || [],
    finalAds:        t2.finalAds        || [],
  };
}


// ─── TEXT SCORE ENGINE ────────────────────────────────────────────────
function scoreText(info) {
  const { adHeadline, adPrimaryText, adCTA, ageGroups, genders, interests, painPoints, usp, budget, selPlat, goal, subIndustry: subInd, landingUrl } = info;
  const effectiveSector = subInd || info.industry || "";
  const allText = (adHeadline + " " + adPrimaryText + " " + adCTA).toLowerCase();

  const hasPowerW   = POWER_W.filter(w => allText.includes(w));
  const hasCTAW     = CTA_W.filter(w => allText.includes(w));
  const hasEmotionW = EMOTION_W.filter(w => allText.includes(w));
  const hasNumber   = /\d/.test(adPrimaryText);
  const hasPercent  = /\d+%|\d+ kat|\d+x/.test(adPrimaryText);
  const hasQuestion = adPrimaryText.includes("?") || adHeadline.includes("?");
  const headlineLen = adHeadline.length;
  const textLen     = adPrimaryText.length;

  let hook = 0, value = 0, cta = 0, relevance = 0;
  if (hasQuestion) hook += 2;
  if (hasPowerW.length > 0) hook += 2;
  if (hasEmotionW.length > 0) hook += 2;
  if (hasNumber) hook += 1.5;
  if (headlineLen > 5 && headlineLen <= 40) hook += 1.5;
  if (headlineLen > 40) hook -= 2;
  hook = Math.min(10, Math.max(1, hook));

  if (hasPercent) value += 2.5;
  if (hasNumber) value += 1.5;
  if (hasPowerW.length >= 2) value += 1.5;
  if (/nasıl|neden|çünkü|sayesinde/.test(allText)) value += 1.5;
  if (textLen >= 30 && textLen <= 2000) value += 1;
  if (textLen > 2000) value -= 1.5;
  value = Math.min(10, Math.max(1, value));

  if (hasCTAW.length > 0) cta += 3.5;
  if (adCTA && adCTA.length > 2) cta += 2;
  if (/!/.test(adPrimaryText + adHeadline)) cta += 1;
  if (hasPowerW.length > 0 && hasCTAW.length > 0) cta += 1.5;
  cta = Math.min(10, Math.max(1, cta));

  const ageNums = ageGroups.flatMap(a => a.split("-").map(Number)).filter(Boolean);
  const avgAge = ageNums.length ? ageNums.reduce((a, b) => a + b, 0) / ageNums.length : 30;
  if (avgAge < 30 && /trend|viral|fyp/.test(allText)) relevance += 2;
  if (avgAge > 40 && /güvenli|kanıtlanmış|referans|uzman/.test(allText)) relevance += 2;
  if (painPoints.some(p => allText.includes(p.split(" ")[0]?.toLowerCase() || ""))) relevance += 2.5;
  relevance = Math.min(10, Math.max(1, relevance + 2));

  const avgCPC = selPlat.reduce((s, p) => s + (PLATFORMS.find(x => x.id === p)?.cpc || 2), 0) / (selPlat.length || 1);
  const clicks = Math.round(budget / avgCPC);
  const impr   = Math.round(clicks / 0.02);

  const issues = [];
  if (headlineLen > 40) issues.push({ sev: "error", text: `Başlık ${headlineLen} karakter — Meta için max 40. Kısaltın.` });
  if (textLen > 2000) issues.push({ sev: "error", text: `Ana metin ${textLen} karakter — Meta için max 2000. Kısaltın.` });
  if (hasCTAW.length === 0) issues.push({ sev: "error", text: "CTA (eylem çağrısı) bulunamadı. 'Şimdi Dene', 'Hemen Al' gibi bir ifade ekleyin." });
  if (!hasNumber) issues.push({ sev: "warn", text: "Somut sayı/rakam yok. 'İlk 7 gün ücretsiz', '%30 indirim' gibi ifadeler dönüşümü artırır." });
  if (hasEmotionW.length === 0) issues.push({ sev: "info", text: "Duygusal tetikleyici kelime yok. Hedef kitlenin acı noktasına dokunan bir ifade ekleyin." });

  const recs = [];
  if (hasPowerW.length === 0) recs.push(`Güçlü kelimeler ekleyin: "şimdi", "ücretsiz", "sınırlı", "fırsat" gibi ifadeler CTR'ı artırır.`);
  if (!hasQuestion && hook < 7) recs.push("Başlığı soru formatına alın. 'Hâlâ [sorun] ile mi uğraşıyorsun?' formatı dikkat çeker.");
  if (painPoints.length > 0 && hasEmotionW.length === 0) recs.push(`"${painPoints[0]}" sorununa direkt değinin. İnsanlar önce kendilerini görmeliler.`);
  if (selPlat.includes("tiktok") || selPlat.includes("youtube")) recs.push("Video platform seçtiniz — ilk 3 saniye hook kritik. Metni video scriptine uyarlayın.");
  if (budget < 2000 && selPlat.length > 2) recs.push(`₺${budget.toLocaleString("tr-TR")} bütçeyi ${selPlat.length} platforma dağıtmak yerine 1-2 platforma odaklanın.`);

  return { hook, value, cta, relevance, clicks, impr, hasPowerW, hasCTAW, hasEmotionW, hasNumber, hasPercent, hasQuestion, headlineLen, textLen, issues, recs };
}

// ─── VARIATION / VIRAL / HOOK / BRIEF GENERATORS ─────────────────────

function generateVariations(idea, industry, audience) {
  // Ürün/teklif bilgisini temizle ve kısalt
  const core    = (idea || "").trim();
  const prod    = core.slice(0, 60);
  const short   = core.slice(0, 35);
  const sect    = industry && industry !== "Genel" ? industry : "";
  const sectSuf = sect ? " (" + sect + ")" : "";

  // ── Varyasyon A: Teklif & Mantık ────────────────────────────────────
  // Promosyonu matematiksel kazanç gibi net ve agresif sun
  const headA = prod.length > 32 ? prod.slice(0, 32) + "..." : prod;
  const bodyA = prod + " — rakamlar yalan söylemez."
    + " Bu teklifi başka nerede bulamazsın?"
    + " Hemen al, farkı cebinde hisset.";

  // ── Varyasyon B: FOMO / Aciliyet ────────────────────────────────────
  // Fırsatın kısa sürdüğünü, stokların tükendiğini vurgula
  const headB = "Son şans: " + (prod.length > 28 ? prod.slice(0, 28) + "..." : prod);
  const bodyB = "Stoklar hızla eriyor."
    + " " + prod + " için bu fırsat sınırlı süre geçerli."
    + " Bugün karar vermezsen yarın bulamazsın — sepete ekle!";

  // ── Varyasyon C: Statü / Premium Hissiyat ───────────────────────────
  // Kalitenin ön plana çıktığı, fırsatın tatlandırıcı olduğu ton
  const headC = prod.length > 32 ? prod.slice(0, 32) : prod;
  const bodyC = "Kaliteli tercihler fark yaratır."
    + " " + (sect ? sect + " alanında " : "") + "öne çıkmak isteyenler için: "
    + short + "."
    + " Şimdi deneyimle — bir kez hissedince bırakamazsın.";

  return [
    {
      variant: "Varyasyon A",
      tone: "Teklif & Mantık",
      angle: "Promosyonu matematiksel kazanç olarak sun — net, agresif, rakamsal.",
      headline: headA.slice(0, 40),
      primaryText: bodyA.slice(0, 125),
      cta: "Hemen Al",
    },
    {
      variant: "Varyasyon B",
      tone: "FOMO / Aciliyet",
      angle: "Fırsatın kısa sürdüğünü ve stokların tükendiğini vurgula.",
      headline: headB.slice(0, 40),
      primaryText: bodyB.slice(0, 125),
      cta: "Şimdi Kaçırma",
    },
    {
      variant: "Varyasyon C",
      tone: "Statü / Premium",
      angle: "Ürünün kalitesini ve premium hissiyatını öne çıkar, fırsatı tatlandırıcı sun.",
      headline: headC.slice(0, 40),
      primaryText: bodyC,
      cta: "Keşfet",
    },
  ];
}

function generateViral(industry, audience, painPoints) {
  const sect = industry || "Genel";
  const pain = (painPoints && painPoints[0]) || "zaman ve para kaybı";
  const formats = [
    { format: "Problem-Çözüm", brief: "Acıyı tanımla, çözümü sun" },
    { format: "İlk 3 Saniye Hook", brief: "Kaydırmayı durduran açılış" },
    { format: "Sosyal Kanıt / UGC", brief: "Gerçek müşteri deneyimi" },
    { format: "Karşılaştırma", brief: "Biz / Rakip veya Önce / Sonra" },
    { format: "Merak Uyandırma", brief: "Cevabı merak ettiren soru kancası" },
  ];
  return formats.map((v, i) => {
    let fullText = "";
    if (i === 0) {
      fullText = sect + " sektöründe en sık duyduğumuz şikayet: \'" + pain + "'." 
        + "Bu problemi çözmenin 3 etkili yolu var ve çoğu kişi bunları bilmiyor. "
        + "Birincisi: Doğru ürünü seçmek. İkincisi: Stratejiyi test etmek. Üçüncüsü: Tutarlı olmak. "
        + "Biz bu üç adımı sizin için tek çatı altında topladık. "
        + "Artık deneme yanılma yok, sadece sonuç var. "
        + "Şimdi başlamak için profilimizdeki linke tıklayın!";
    } else if (i === 1) {
      fullText = "DUR! " + sect + " sektöründe para harcamadan önce bunu oku. "
        + "Çoğu insan yanlış yerde yanlış şeylere para veriyor. "
        + "Gerçek şu: " + pain + " sorunu çözülmesi en kolay sorunlardan biri. "
        + "Eğer doğru rehberlik alabilirseniz, fark anında hissedilir. "
        + "Biz bunu binlerce müşterimize kanıtladık. "
        + "Detayları görmek için hemen profilimizi ziyaret edin!";
    } else if (i === 2) {
      fullText = "'Daha önce bu işi başarabileceğimi düşünmezdim.' "
        + "— " + sect + " sektörümüzden bir müşterimizin yorumu. "
        + "Bize gelmeden önce " + pain + " sorunuyla boğuşuyordu. "
        + "Çözümümüzü denedikten sonra sadece 4 haftada büyük fark gördü. "
        + "Onlarca benzer başarı hikayesi profilimizde sizi bekliyor. "
        + "Siz de bu dönüşümü yaşamaya hazır mısınız?";
    } else if (i === 3) {
      fullText = "Eski yöntem: " + pain + " ile boğuş, para harca, sonuç alma. "
        + "Yeni yöntem: " + sect + " sektöründe kanıtlanmış stratejimizi uygula, sonuç al. "
        + "Fark bu kadar net. Başarılı insanlar doğru araçları seçer, zaman kaybetmez. "
        + "Siz de doğru seçimi yapmaya hazır mısınız? "
        + "Hemen başlayın ve farkı kendiniz görün!";
    } else {
      fullText = "Size bir soru: " + sect + " sektöründe başarılı olanlar ne yapıyor ki diğerleri yapamıyor? "
        + "Cevap: Doğru ürün + doğru strateji + doğru zamanlama. "
        + "Bu üçünü bir araya getirdiğinizde " + pain + " sorunu kendiliğinden çözülür. "
        + "Biz bu formülü sizin için hazırladık. "
        + "Denemek ister misiniz? Profilimizde detaylar sizi bekliyor!";
    }
    return {
      id: i + 1,
      format: v.format,
      headline: (sect + " — " + v.format).slice(0, 40),
      primaryText: fullText,
      fullText: fullText,
      brief: v.brief,
      viralScore: (Math.floor(Math.random() * 3 + 7)) + "/10",
      bestTime: ["09:00-11:00", "12:00-14:00", "18:00-21:00", "20:00-23:00"][Math.floor(Math.random() * 4)]
    };
  });
}

const HOOK_BANK = {
  "E-Ticaret":      ["Bu ürünü 3 yıl önce keşfetmek isterdim.", "Alışveriş yapmadan ÖNCE bunu izle.", "Stoklar bitmeden yakala — son şans.", "En çok satanın sırrını açıklıyorum."],
  "SaaS / Teknoloji":["Ekibimiz bu tool ile haftada 12 saat kazanıyor.", "Rakipleriniz bunu çoktan kullanıyor.", "Demo'yu izle, 30 saniyede karar ver."],
  "Finans":         ["Paranız sessizce eriyor — işte nedeni.", "Bu yatırım hatasını herkes yapıyor.", "Banka sana bunu asla söylemez."],
  "Sağlık":         ["Doktorlar bunu neden söylemiyor?", "30 günde farkı hissedeceksin.", "Uyku kalitenizi artıran tek değişiklik."],
  "Eğitim":         ["Bu tekniği keşke okulda öğretseydiler.", "15 dakikada 3 saatlik ders öğren.", "CV'nde bu beceri yoksa geride kalıyorsun."],
};
function generateHooks(industry, painPoints) {
  const pool = HOOK_BANK[industry] || HOOK_BANK["E-Ticaret"];
  const pain = (painPoints || []).map(p => `"${p}" ile uğraşmaktan bıktın mı?`);
  const extra = ["Dur. Kaydırmadan önce bunu oku.", `${industry} hakkında kimsenin bilmediği gerçek.`, "3 saniyeni ver, fikrini değiştireyim.", "Herkes yanlış yapıyor — doğrusu bu."];
  return [...pool, ...pain, ...extra].sort(() => Math.random() - 0.5).slice(0, 10);
}

function generateBrief(industry, audience, goal, product, tone) {
  const lights = { "E-Ticaret": "Yumuşak doğal ışık veya ring light.", "SaaS / Teknoloji": "Stüdyo, mavi/mor arka plan ışığı.", "Finans": "Profesyonel stüdyo, nötr sıcak tonlar.", "Sağlık": "Parlak, temiz, doğal güneş ışığı.", "Moda": "Kontrastlı, golden hour.", "Yeme-İçme": "Sıcak, iştah açıcı, overhead LED.", "Oyun": "Neon/RGB, koyu arka plan." };
  const overlays = { awareness: "Marka adı büyük, tagline alt kısım, logo sürekli.", traffic: "URL veya 'Link Bioda', swipe-up ikonu.", leads: "'Ücretsiz Dene' butonu, güven rozetleri.", sales: "Fiyat + üstü çizili eski fiyat, '%X İndirim' etiketi.", app: "App Store/Play Store butonları, QR kod.", engagement: "Soru metni büyük punto, anket görseli." };
  return { project: industry + " — " + (goal ? GOALS.find(g => g.id === goal)?.label : "Genel"), targetAudience: audience || "Belirtilmedi", product: product || (industry + " ürünü"), tone: tone || "Profesyonel ama samimi", lighting: lights[industry] || lights["E-Ticaret"], textOverlay: overlays[goal] || overlays["awareness"], colorPalette: "Marka rengi + " + (industry === "Sağlık" ? "beyaz/yeşil" : industry === "Finans" ? "lacivert/altın" : "nötr") + " arka plan.", musicMood: goal === "sales" ? "Enerjik, tempolu" : "Trend veya lo-fi.", duration: "Reel/TikTok: 15-30sn. Feed: 30-60sn.", dimensions: "9:16 (1080x1920). 1:1 (1080x1080).", firstFrame: "İlk 1sn: hook metni büyük puntoyla ekranda.", deliverables: ["1x Ana video (9:16)", "1x Kare (1:1)", "3x Story/carousel", "1x Thumbnail", "Alt yazı (.srt)"], doList: ["Marka renklerini tutarlı kullan", "Alt yazı ekle", "İlk 3sn'de hook ver", "Mobil öncelikli"], dontList: ["Stok fotoğraf kullanma", "Uzun intro/logo animasyonu koyma", "Küçük punto yazı kullanma", "Birden fazla mesaj verme"] };
}

// ─── UI HELPERS ──────────────────────────────────────────────────────
function ScoreRing({ score, label, color, size = 80 }) {
  const [a, setA] = useState(0);
  useEffect(() => { const t = setTimeout(() => setA(score), 200); return () => clearTimeout(t); }, [score]);
  const c = 2 * Math.PI * 34, off = c - (a / 10) * c;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="34" fill="none" stroke="#1C2230" strokeWidth="6" />
        <circle cx="40" cy="40" r="34" fill="none" stroke={color} strokeWidth="6" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 40 40)" style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }} />
        <text x="40" y="45" textAnchor="middle" fill={color} fontSize="17" fontWeight="700" fontFamily="monospace">{score}</text>
      </svg>
      <div style={{ fontSize: 11, color: "#8892A6", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function BarRow({ label, value, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value * 10), 150); return () => clearTimeout(t); }, [value]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
      <div style={{ width: 120, fontSize: 12, color: "#8892A6", flexShrink: 0 }}>{label}</div>
      <div className="adv-pbar">
        <div className="adv-pbar-fill" style={{ width: w + "%", background: color }} />
      </div>
      <div style={{ width: 28, fontSize: 12, fontWeight: 700, fontFamily: "monospace", color, textAlign: "right" }}>{value}</div>
    </div>
  );
}

function AnimatedNum({ value }) {
  const [d, setD] = useState(0);
  const r = useRef(null);
  useEffect(() => {
    const target = Number(value) || 0, st = performance.now();
    function tick(now) { const p = Math.min((now - st) / 900, 1); setD(Math.round(target * (1 - Math.pow(1 - p, 3)))); if (p < 1) r.current = requestAnimationFrame(tick); }
    r.current = requestAnimationFrame(tick);
    return () => { if (r.current) cancelAnimationFrame(r.current); };
  }, [value]);
  return React.createElement("span", null, d.toLocaleString("tr-TR"));
}

function Tag({ children, color = "#6C5CE7" }) {
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, fontFamily: "monospace", background: color + "22", color }}>{children}</span>;
}


// ─── MARKDOWN RENDERER ────────────────────────────────────────────────
const MD_STYLES = `
  .md-report{color:#C8D0E0;font-size:13px;line-height:1.75}
  .md-report h1{font-size:22px;font-weight:700;color:#E8ECF4;margin:0 0 16px;padding-bottom:10px;border-bottom:1px solid #2A3040}
  .md-report h2{font-size:16px;font-weight:700;color:#A29BFE;margin:24px 0 12px}
  .md-report h3{font-size:14px;font-weight:700;color:#E8ECF4;margin:16px 0 8px}
  .md-report p{margin:0 0 12px;color:#C8D0E0;line-height:1.75}
  .md-report ul{margin:8px 0 14px 0;padding-left:20px}
  .md-report li{margin-bottom:6px;line-height:1.75}
  .md-report strong{color:#E8ECF4;font-weight:600}
  .md-report em{color:#A29BFE;font-style:normal;font-weight:600}
  .md-report blockquote{border-left:3px solid #6C5CE7;padding:10px 16px;margin:12px 0;background:rgba(108,92,231,0.08);border-radius:0 8px 8px 0}
  .md-report blockquote p{color:#A29BFE;margin:0}
  .md-report code{background:#1C2230;color:#00D68F;padding:2px 7px;border-radius:5px;font-family:monospace;font-size:12px}
  .md-report pre{background:#0F1318;border:1px solid #2A3040;border-radius:10px;padding:16px 18px;margin:12px 0;overflow-x:auto}
  .md-report pre code{background:none;color:#E8ECF4;padding:0;font-size:12px;line-height:1.7}
  .md-report table{width:100%;border-collapse:collapse;margin:12px 0;font-size:12px}
  .md-report th{background:#1C2230;color:#A29BFE;padding:10px 12px;text-align:left;font-weight:600;border-bottom:1px solid #2A3040;white-space:nowrap}
  .md-report td{padding:9px 12px;border-bottom:1px solid #1C2230;color:#C8D0E0;vertical-align:top}
  .md-report tr:hover td{background:rgba(255,255,255,0.02)}
  .md-report hr{border:none;border-top:1px solid #2A3040;margin:20px 0}
  .md-copy-btn{background:rgba(108,92,231,0.15);color:#A29BFE;border:1px solid rgba(108,92,231,0.3);padding:3px 10px;border-radius:6px;font-size:11px;cursor:pointer;float:right;margin-left:8px;margin-top:1px;transition:all 0.15s;font-family:inherit;white-space:nowrap}
  .md-copy-btn:hover{background:rgba(108,92,231,0.3);color:#E8ECF4}
  .md-copy-btn.copied{background:rgba(0,214,143,0.15);color:#00D68F;border-color:rgba(0,214,143,0.3)}
  .md-field-wrap{background:#1C2230;border-radius:8px;padding:12px 14px;margin:8px 0;overflow:hidden}
  .md-field-label{font-size:10px;color:#8892A6;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;display:flex;align-items:center;justify-content:space-between}
  .md-field-text{font-size:13px;color:#E8ECF4;line-height:1.65}
  .md-check-ok{display:flex;align-items:flex-start;gap:8px;background:rgba(0,214,143,0.07);border:1px solid rgba(0,214,143,0.2);border-radius:8px;padding:8px 12px;margin:5px 0}
  .md-check-ok .ci{color:#00D68F;font-size:14px;flex-shrink:0;margin-top:1px}
  .md-check-ok .ct{color:#C8D0E0;font-size:13px;line-height:1.6}
  .md-check-err{display:flex;align-items:flex-start;gap:8px;background:rgba(255,107,107,0.07);border:1px solid rgba(255,107,107,0.2);border-radius:8px;padding:8px 12px;margin:5px 0}
  .md-check-err .ci{color:#FF6B6B;font-size:14px;flex-shrink:0;margin-top:1px}
  .md-check-err .ct{color:#C8D0E0;font-size:13px;line-height:1.6}
  .md-check-warn{display:flex;align-items:flex-start;gap:8px;background:rgba(255,165,2,0.07);border:1px solid rgba(255,165,2,0.2);border-radius:8px;padding:8px 12px;margin:5px 0}
  .md-check-warn .ci{color:#FFA502;font-size:14px;flex-shrink:0;margin-top:1px}
  .md-check-warn .ct{color:#C8D0E0;font-size:13px;line-height:1.6}
  .md-callout{background:rgba(108,92,231,0.09);border:1.5px solid rgba(108,92,231,0.35);border-radius:12px;padding:16px 20px;margin:16px 0}
  .md-callout-title{font-size:13px;font-weight:700;color:#A29BFE;margin-bottom:10px}
  .md-callout-body li{margin-bottom:6px;color:#C8D0E0;font-size:13px;line-height:1.7}
  .md-callout-body p{color:#C8D0E0;font-size:13px;line-height:1.7;margin:4px 0}
`;
function makeCopyBtn(id, text) {
  var btn = document.createElement("button");
  btn.className = "md-copy-btn";
  btn.id = id;
  btn.textContent = "Kopyala";
  btn.setAttribute("data-copy", text);
  btn.onclick = function() {
    var t = this.getAttribute("data-copy");
    var self = this;
    try {
      navigator.clipboard.writeText(t).then(function() {
        self.textContent = "Kopyalandı";
        self.classList.add("copied");
        setTimeout(function() { self.textContent = "Kopyala"; self.classList.remove("copied"); }, 2000);
      });
    } catch(e) {}
  };
  return btn.outerHTML;
}

function renderMd(text) {
  if (!text) return "";
  if (!document.getElementById("md-styles")) {
    var st = document.createElement("style"); st.id="md-styles"; st.textContent=MD_STYLES; document.head.appendChild(st);
  }

  var html = text;
  // Escape
  html = html.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  // Code blocks
  html = html.replace(/```[\w]*\n([\s\S]*?)```/g,function(_,c){return "<pre><code>"+c.trim()+"</code></pre>";});

  // Headings
  html = html.replace(/^### (.+)$/gm,"<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm,"<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm,"<h1>$1</h1>");

  // Blockquote
  html = html.replace(/^&gt; (.+)$/gm,"<blockquote><p>$1</p></blockquote>");

  // Bold/italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g,"<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g,"<em>$1</em>");

  // Inline code
  html = html.replace(/`([^`]+)`/g,"<code>$1</code>");

  // HR
  html = html.replace(/^---+$/gm,"<hr/>");

  // Tables
  html = html.replace(/((?:^\|.+\|\n?)+)/gm,function(block){
    var rows=block.trim().split("\n").filter(function(r){return r.trim();});
    if(rows.length<2) return block;
    var t="<table>";
    rows.forEach(function(row,ri){
      if(ri===1&&/^\|\s*[:\-]+/.test(row)) return;
      var cells=row.split("|").filter(function(_,i,a){return i>0&&i<a.length-1;});
      var tag=ri===0?"th":"td";
      t+="<tr>"+cells.map(function(c){return "<"+tag+">"+c.trim()+"</"+tag+">";}).join("")+"</tr>";
    });
    return t+"</table>";
  });

  // Checklist — ❌ lines
  html = html.replace(/^[*\-] ❌ (.+)$/gm,function(_,txt){return "<div class=\"md-check-err\"><span class=\"ci\">❌</span><span class=\"ct\">"+txt+"</span></div>";});
  html = html.replace(/^[*\-] ✅ (.+)$/gm,function(_,txt){return "<div class=\"md-check-ok\"><span class=\"ci\">✅</span><span class=\"ct\">"+txt+"</span></div>";});
  html = html.replace(/^[*\-] ⚠️ (.+)$/gm,function(_,txt){return "<div class=\"md-check-warn\"><span class=\"ci\">⚠️</span><span class=\"ct\">"+txt+"</span></div>";});
  html = html.replace(/^[*\-] ⚠ (.+)$/gm,function(_,txt){return "<div class=\"md-check-warn\"><span class=\"ci\">⚠️</span><span class=\"ct\">"+txt+"</span></div>";});

  // UL lists
  html = html.replace(/((?:^[*\-] .+\n?)+)/gm,function(block){
    var items=block.trim().split("\n").map(function(l){return "<li>"+l.replace(/^[*\-] /,"")+"</li>";});
    return "<ul>"+items.join("")+"</ul>";
  });

  // Paragraphs
  html = html.replace(/^(?!<[huptbcdri])(.+)$/gm,function(l){return l.trim()?"<p>"+l+"</p>":"";});
  html = html.replace(/\n{3,}/g,"\n\n").trim();
  html = "<div class=\"md-report\">" + html + "</div>";

  // POST-PROCESS 1: Copy buttons on Baslik / Ana Metin list items
  var ctr = 0;
  // Match <li><strong>Baslik...: </strong> text
  html = html.replace(/<li><strong>(Ba[sş]l[iı]k[^<]*?)<\/strong>:?\s*([\s\S]*?)<\/li>/gi,function(m,label,val){
    var clean = val.replace(/<[^>]*>/g,"").trim();
    if(!clean) return m;
    var id = "cp"+(++ctr);
    return "<li><div class=\"md-field-wrap\"><div class=\"md-field-label\"><span>"+label.trim()+"</span>"+makeCopyBtn(id,clean)+"</div><div class=\"md-field-text\">"+val.trim()+"</div></div></li>";
  });
  html = html.replace(/<li><strong>(Ana Metin[^<]*?)<\/strong>:?\s*([\s\S]*?)<\/li>/gi,function(m,label,val){
    var clean = val.replace(/<[^>]*>/g,"").trim();
    if(!clean) return m;
    var id = "cp"+(++ctr);
    return "<li><div class=\"md-field-wrap\"><div class=\"md-field-label\"><span>"+label.trim()+"</span>"+makeCopyBtn(id,clean)+"</div><div class=\"md-field-text\">"+val.trim()+"</div></div></li>";
  });

  // POST-PROCESS 2: Callout box for "Hemen Yapilmasi Gerekenler"
  html = html.replace(/<h[23][^>]*>[^<]*[Hh]emen[^<]*?<\/h[23]>([\s\S]*?)(?=<h[123]|<\/div>)/,function(m,body){
    return "<div class=\"md-callout\"><div class=\"md-callout-title\">Hemen Yapilmasi Gerekenler</div><div class=\"md-callout-body\">"+body.trim()+"</div></div>";
  });
  // Also for "Aksiyon" headings
  html = html.replace(/<h[23][^>]*>[^<]*[Aa]ksiyon [Ll]istesi[^<]*?<\/h[23]>([\s\S]*?)(?=<h[123]|<\/div>)/,function(m,body){
    return "<div class=\"md-callout\"><div class=\"md-callout-title\">Aksiyon Listesi</div><div class=\"md-callout-body\">"+body.trim()+"</div></div>";
  });

  return html;
}


const AUDIT_SYS_PROMPT = "Sen üst düzey bir Meta (Facebook/Instagram) Reklam Stratejisti, Dönüşüm Uzmanı ve Metin Yazarı yapay zekasısın.\nGörev: Kullanıcının taslak kampanya verilerini inceleyerek acımasızca dürüst analiz yap, optimize edilmiş alternatifler sun ve bütçe koruma stratejisi oluştur.\nHiçbir zaman tavsiye verme — sorunu tespit et ve ÇÖZÜMÜ BİZZAT YAZ.\n\nBÜTÇE KORUYUCU GUARDRAIL (ZORUNLU):\nÜrün ekosistemini analiz et ve şu dışlamaları uygula:\n- iPhone aksesuarı ise: Samsung, Android, Huawei EXCLUDE\n- Premium ürün: Aliexpress, indirim avcısı kitleleri dışla\n- Z kuşağına hitap etmiyorsa: TikTok yerleşimini kapat\n- 45+ yaş ürünü: 18-24 yaş grubunu dışla\n\nMULTİMEDYA: Birden fazla görsel + Ses Transkripti = VİDEO REKLAMIDIR.\nVideo analizinde: İlk 3 Saniye Kancası, Görsel-İşitsel Uyum, Ritim/Tempo eleştirisi yap.\n\nÇIKTI ŞABLONU (Her analizde Markdown kullan):\n\n## Stratejik Açıklar ve Mantık Hataları (Teşhis)\n* ❌ [Sorun 1 Başlığı]: [Detaylı eleştiri — neden dönüşüm getirmez]\n* ❌ [Sorun 2 Başlığı]: [Detaylı eleştiri]\n\n## AI Tarafından İyileştirilmiş Alternatifler\n\n### Versiyon 1: Duygusal ve Premium Odaklı\n* **Başlık (Headline):** [10 kelimeyi geçmeyen, dikkat çekici]\n* **Ana Metin (Primary Text):** [Acıya dokunan, değeri anlatan metin]\n* **CTA:** [Buton metni]\n\n### Versiyon 2: Agresif Teklif ve Aciliyet (FOMO)\n* **Başlık (Headline):** [İndirim veya fırsatı öne çıkaran kanca]\n* **Ana Metin (Primary Text):** [Kısa, net, stok/zaman sınırını vurgulayan]\n* **CTA:** [Buton metni]\n\n### Versiyon 3: Sosyal Kanıt ve Güven\n* **Başlık (Headline):** [Müşteri memnuniyeti veya kaliteyi öne çıkaran]\n* **Ana Metin (Primary Text):** [Garanti, kalite, müşteri yorumları]\n* **CTA:** [Buton metni]\n\n## Medya Planı ve Hedef Kitle Uyarıları\n* 📌 **Hedefleme:** [Detay]\n* 📌 **Bütçe Dağılımı:** [Detay]\n* 📌 **Ekosistem/Kısıtlama:** [Detay]\n\n## Görsel ve Kreatif Analizi\n(Görsel/video varsa: metin uyumu, okunabilirlik, ritim analizi)\n(Yoksa: UGC tarzı görsel kullan tavsiyesi)\n\n## Hemen Yapılması Gerekenler\n* ✅ [En kritik aksiyon 1]\n* ✅ [En kritik aksiyon 2]\n* ✅ [En kritik aksiyon 3]\n\n## Bütçe Koruma ve Dışlama (Exclusion) Stratejisi (ZORUNLU)\n### Cihaz ve Ekosistem Dışlamaları\n* ❌ [Dışlanan cihaz]: [Gerekçe]\n### Kitle ve İlgi Alanı Dışlamaları\n* ❌ [Dışlanan kitle]: [Gerekçe]\n### Yaş Grubu ve Platform Dışlamaları\n* ❌ [Dışlanan platform]: [Gerekçe]\n**Tahmini bütçe tasarrufu:** [Yüzde olarak]";

const REP_DEFAULT_SYS = "Sen milyon dolarlık bütçeler yöneten, kıdemli bir Performans Pazarlama ve Reklam Stratejisti'sin.\nAmacın: Facebook Ads Library görsellerini analiz etmek, acımasızca dürüst ve ROAS odaklı raporlar oluşturmak.\nLaf kalabalığı yapma. Veri odaklı, net ve agresif büyüme pazarlamacısı dili kullan.\nGörselleri birincil veri kaynağın olarak kullan. Metinleri OCR ile oku.\n\nÇIKTI ŞABLONU (Hiçbir başlığı atlama):\n\n# Görsel Reklam Analiz Raporu\n\n| Analiz Kriteri | Tespit Edilen Veri |\n| :--- | :--- |\n| **Marka Adı** | |\n| **Kreatif Formatı** | (UGC Video, Statik Görsel, Carousel, Motion Graphic) |\n| **Görsel Atmosfer** | (Renk paleti ve yansıttığı duygu) |\n| **Odaklanılan Ürün** | |\n| **Ana Teklif (Offer)** | |\n\n## 1. Rakip Reklam Anatomisi ve Kancalar\n- **Görsel Kanca (İlk 3 Saniye):** Scroll'u durduran unsur\n- **Metin Kancası:** Vurucu başlık, aciliyet/merak unsuru\n- **Güven Unsuru:** Yorum, yıldız, sosyal kanıt var mı?\n- **Zayıf Yön (Bizim Fırsatımız):** Rakip nerede çuvallıyor?\n\n## 2. Hedeflenen Tüketici Psikolojisi\n\n## 3. Medya Planlama ve KPI Tablosu\n| Hedef Kitle | Önerilen İlgi Alanları | İdeal Yerleşim | Birincil KPI |\n| :--- | :--- | :--- | :--- |\n| | | | |\n\n## 4. Bizi Öne Geçirecek Yeni Reklam Fikirleri\n- **Fikir A (Ürün Odaklı):**\n- **Fikir B (UGC/Deneyim Odaklı):**\n- **Fikir C (Teklif/Fırsat Odaklı):**\n\n## 5. Uygulamaya Hazır Reklam Metinleri\n(Ads Manager'a kopyala-yapıştır, 2 varyasyon, kod bloğu içinde)\n\n## Bütçe Koruma ve Dışlama Stratejisi\n- **Cihaz Dışlaması:** (iOS aksesuarı ise Android/Samsung/Huawei dışla)\n- **Kitle Dışlaması:** (Premium ürün ise Aliexpress, indirim avcısı dışla)\n- **Yerleşim:** (Audience Network kapat — çöp tıklama getirir)\n\n## Hemen Yapılması Gerekenler\n* ✅ [Aksiyon 1]\n* ✅ [Aksiyon 2]\n* ✅ [Aksiyon 3]";

const CREATIVE_SYS = "Sen ödüllü bir Dijital Sanat Yönetmeni (Art Director) ve Prompt Mühendisisin.\nAmacın: Kullanıcının ürünü için yüksek dönüşüm getirecek reklam görseli konseptleri yaratmak.\n\nZORUNLU KURAL — GÖRSEL VARSA:\nReferans görsel yüklendiyse, BİRİNCİL STİL KILAVUZUN olarak kabul et.\nŞunları analiz et: Aydınlatma (soft/hard/golden hour/stüdyo), Kompozisyon (close-up/flat lay/lifestyle), Renk paleti, Genel vibe.\n3 konseptin tümü bu görselin stiline çok yakın ve sadık olmalı. Sadece hook (kanca) değişmeli.\n\nGÖRSEL YOKSA: Metin girdisine dayalı yaratıcı konseptler üret.\n\nÇIKTI FORMATI (Kopyala-yapıştır yapmaya hazır):\n\n### Konsept 1: Stüdyo / Premium\n**A. Türkçe Görsel Senaryo:** (Ne oluyor, ışık nasıl, arka plan, ürün konumlanma)\n**B. Görsel Üzeri Metin (Hook):** (3-4 kelime, çarpıcı)\n**C. AI Image Prompt:**\n```\n[KESİNLİKLE İNGİLİZCE — ışık, lens, açı, renk paleti, 8k, photorealistic]\n```\n\n### Konsept 2: UGC / Lifestyle\n**A. Türkçe Görsel Senaryo:**\n**B. Görsel Üzeri Metin (Hook):**\n**C. AI Image Prompt:**\n```\n[İNGİLİZCE prompt]\n```\n\n### Konsept 3: Pattern Interrupt / Soyut\n**A. Türkçe Görsel Senaryo:**\n**B. Görsel Üzeri Metin (Hook):**\n**C. AI Image Prompt:**\n```\n[İNGİLİZCE prompt]\n```";

export default function AdVisorAI() {
  const [activeTab,     setActiveTab]     = useState("dashboard");
  const [sideOpen,      setSideOpen]      = useState(false);
  const [step,          setStep]          = useState(0);
  const [business,      setBusiness]      = useState("");
  const [industry,      setIndustry]      = useState("");
  const [subIndustry,   setSubIndustry]   = useState("");
  const [product,       setProduct]       = useState("");
  const [price,         setPrice]         = useState("");
  const [usp,           setUsp]           = useState("");
  const [budget,        setBudget]        = useState(1000);
  const [selPlat,       setSelPlat]       = useState(["meta"]);
  const [goal,          setGoal]          = useState("sales");
  const [ageGroups,     setAgeGroups]     = useState(["25-34"]);
  const [genders,       setGenders]       = useState(["Tümü"]);
  const [interests,     setInterests]     = useState([]);
  const [painPoints,    setPainPoints]    = useState([]);
  const [selAudiences,  setSelAudiences]  = useState([]);
  const [adHeadline,    setAdHeadline]    = useState("");
  const [adPrimaryText, setAdPrimaryText] = useState("");
  const [adCTA,         setAdCTA]         = useState("");
  const [landingUrl,    setLandingUrl]    = useState("");
  const [mediaFiles,    setMediaFiles]    = useState([]);
  const [analyzing,     setAnalyzing]     = useState(false);
  const [analyzeMsg,    setAnalyzeMsg]    = useState("");
  const [textResult,    setTextResult]    = useState(null);
  const [visualResults, setVisualResults] = useState([]);
  const [overallScore,  setOverallScore]  = useState(null);
  const [adH,           setAdH]           = useState("");
  const [adT,           setAdT]           = useState("");
  const [adV,           setAdV]           = useState("");
  const [scoreRes,      setScoreRes]      = useState(null);
  const [viralRes,      setViralRes]      = useState(null);
  const [viralProd,     setViralProd]     = useState("");
  const [viralAud,      setViralAud]      = useState("");
  const [viralTone,     setViralTone]     = useState("Dogrudan Satis");
  const [viralLoading,  setViralLoading]  = useState(false);
  const [viralError,    setViralError]    = useState("");
  const [hooksRes,      setHooksRes]      = useState(null);
  const [briefRes,      setBriefRes]      = useState(null);
  const [briefProd,     setBriefProd]     = useState("");
  const [briefTone,     setBriefTone]     = useState("Profesyonel ama samimi");
  const [stratSector,   setStratSector]   = useState("");
  const [stratProduct,  setStratProduct]  = useState("");
  const [stratBrand,    setStratBrand]    = useState("");
  const [stratUSP,      setStratUSP]      = useState("");
  const [stratProblem,  setStratProblem]  = useState("");
  const [stratGoal,     setStratGoal]     = useState("sales");
  const [stratAdText,   setStratAdText]   = useState("");
  const [stratLoading,  setStratLoading]  = useState(false);
  const [stratResult,   setStratResult]   = useState(null);
  const [stratError,    setStratError]    = useState("");
  const [brands,        setBrands]        = useState([]);
  const [brandsLoaded,  setBrandsLoaded]  = useState(false);
  const [brandForm,     setBrandForm]     = useState({id:"",name:"",industry:"",subIndustry:"",product:"",price:"",usp:"",audience:"",website:"",tone:"",logo:""});
  const [brandEditing,  setBrandEditing]  = useState(false);
  const [brandAutoFill, setBrandAutoFill] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [repSysPrompt,  setRepSysPrompt]  = useState("");
  const [repUserInput,  setRepUserInput]  = useState("");
  const [repLoading,    setRepLoading]    = useState(false);
  const [repResult,     setRepResult]     = useState("");
  const [repError,      setRepError]      = useState("");
  const [repImgData,    setRepImgData]    = useState("");
  const [repImgType,    setRepImgType]    = useState("image/jpeg");
  const [auditProduct,    setAuditProduct]    = useState("");
  const [auditPrice,      setAuditPrice]      = useState("");
  const [auditAudience,   setAuditAudience]   = useState("");
  const [auditAdText,     setAuditAdText]     = useState("");
  const [auditGoal,       setAuditGoal]       = useState("sales");
  const [auditBudget,     setAuditBudget]     = useState("");
  const [auditImages,     setAuditImages]     = useState([]);
  const [auditTranscript, setAuditTranscript] = useState("");
  const [auditLoading,    setAuditLoading]    = useState(false);
  const [auditResult,     setAuditResult]     = useState("");
  const [auditError,      setAuditError]      = useState("");
  const [totalTokens,  setTotalTokens]  = useState(0);
  const [totalCostTL,  setTotalCostTL]  = useState(0);
  const [lastOpLabel,  setLastOpLabel]  = useState("");
  const [lastOpCostTL, setLastOpCostTL] = useState(0);
  const [lastOpTokens, setLastOpTokens] = useState(0);
  const [pendingOp,    setPendingOp]    = useState(null);
  const [claudeCostTL, setClaudeCostTL] = useState(0);
  const [geminiCostTL, setGeminiCostTL] = useState(0);
  const [crProduct,    setCrProduct]    = useState("");
  const [crVibe,       setCrVibe]       = useState("");
  const [crAudience,   setCrAudience]   = useState("");
  const [crLoading,    setCrLoading]    = useState(false);
  const [crResult,     setCrResult]     = useState("");
  const [crError,      setCrError]      = useState("");
  const [crImgFile,    setCrImgFile]    = useState(null);
  const [crImgPreview, setCrImgPreview] = useState("");

  // A/B Test state
  const [abSector,      setAbSector]      = useState("");
  // Hata Çözücü state
  const [errImg,        setErrImg]        = useState("");
  const [errImgType,    setErrImgType]    = useState("image/jpeg");
  const [errNote,       setErrNote]       = useState("");
  const [errLoading,    setErrLoading]    = useState(false);
  const [errResult,     setErrResult]     = useState("");
  const [errError,      setErrError]      = useState("");
  const [abFormat,      setAbFormat]      = useState("Statik Görsel");
  const [abAdText,      setAbAdText]      = useState("");
  const [abVisual,      setAbVisual]      = useState("");
  const [abWeakMetric,  setAbWeakMetric]  = useState("");
  const [abLoading,     setAbLoading]     = useState(false);
  const [abResult,      setAbResult]      = useState(null);
  const [abError,       setAbError]       = useState("");
  // Co-Pilot wizard state (top-level to respect Rules of Hooks)
  const [cpStep,        setCpStep]        = useState(0);
  const [cpImages,      setCpImages]      = useState([null, null, null]);
  const [cpResults,     setCpResults]     = useState([null, null, null]);
  const [cpLoadings,    setCpLoadings]    = useState([false, false, false]);
  const [cpErrors,      setCpErrors]      = useState(["", "", ""]);
  const [cpChecked,     setCpChecked]     = useState([[], [], []]);

  // AI model selection
  const [selectedModel, setSelectedModel] = useState("claude"); // "claude" | "gemini"
  // Platform toggle & drag state
  const [isDrag, setIsDrag] = useState(false);
  const fileInputRef = React.useRef(null);

  function togPlat(id) {
    setSelPlat(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function toggleArr(setter, val) {
    setter(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  }

  function handleFiles(files) {
    const arr = Array.from(files);
    const processed = arr.map(f => ({
      file: f,
      url: URL.createObjectURL(f),
      name: f.name,
      isVideo: f.type.startsWith("video/"),
      size: f.size,
    }));
    setMediaFiles(prev => [...prev, ...processed]);
  }

  const fillPct = Math.round(((budget - 500) / (50000 - 500)) * 100);

  // Cost tracking
  const USD_PER_TL = 35;
  const PRICE_IN   = 3  / 1_000_000;
  const PRICE_OUT  = 15 / 1_000_000;
  const OP_ESTIMATES = {
    "Kampanya Analizi":  { in: 1500, out: 1200 },
    "Reklam Denetcisi": { in: 2000, out: 2000 },
    "Rapor Uretici":    { in: 2500, out: 2500 },
    "Strateji Analiz":  { in: 800,  out: 400  },
    "Strateji Metin":   { in: 1200, out: 1800 },
    "Kreatif Uretici":  { in: 1000, out: 2000 },
    "Gorsel Analiz":    { in: 2000, out: 1500 },
  };
  // Gemini 1.5 Flash: $0.075/M input, $0.30/M output
  const GEMINI_IN  = 0.075 / 1_000_000;
  const GEMINI_OUT = 0.30  / 1_000_000;

  function estimateCost(opLabel, hasImage) {
    const est = OP_ESTIMATES[opLabel] || { in: 1500, out: 1500 };
    const inT = est.in + (hasImage ? 1500 : 0);
    if (selectedModel === "gemini") {
      return (inT * GEMINI_IN + est.out * GEMINI_OUT) * USD_PER_TL;
    }
    return (inT * PRICE_IN + est.out * PRICE_OUT) * USD_PER_TL;
  }
  function trackUsage(label, usage, provider) {
    if (!usage) return;
    const { input_tokens = 0, output_tokens = 0 } = usage;
    // Use explicit provider param, or window.__selectedModel, or fall back to claude
    const activeModel = provider || window.__selectedModel || "claude";
    const isGemini = activeModel === "gemini";
    const pIn  = isGemini ? GEMINI_IN  : PRICE_IN;
    const pOut = isGemini ? GEMINI_OUT : PRICE_OUT;
    const costTL = ((input_tokens * pIn) + (output_tokens * pOut)) * USD_PER_TL;
    const providerLabel = isGemini ? " [⚡ Gemini]" : " [🧠 Claude]";
    setLastOpLabel(label + providerLabel);
    setLastOpCostTL(costTL);
    setLastOpTokens(input_tokens + output_tokens);
    setTotalTokens(prev => prev + input_tokens + output_tokens);
    setTotalCostTL(prev => prev + costTL);
    if (isGemini) setGeminiCostTL(prev => prev + costTL);
    else setClaudeCostTL(prev => prev + costTL);
    setPendingOp(null);
  }
  useEffect(() => {
    window.__trackUsage = trackUsage;
    return () => { delete window.__trackUsage; };
  }, []);

  useEffect(() => {
    window.__selectedModel = selectedModel;
  }, [selectedModel]);

  // ── Kalıcı Hafıza: LocalStorage Yükleme (mount'ta bir kez) ──────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem("advisorai_session");
      if (saved) {
        const s = JSON.parse(saved);
        if (s.business)      setBusiness(s.business);
        if (s.industry)      setIndustry(s.industry);
        if (s.subIndustry)   setSubIndustry(s.subIndustry);
        if (s.product)       setProduct(s.product);
        if (s.price)         setPrice(s.price);
        if (s.usp)           setUsp(s.usp);
        if (s.adHeadline)    setAdHeadline(s.adHeadline);
        if (s.adPrimaryText) setAdPrimaryText(s.adPrimaryText);
        if (s.adCTA)         setAdCTA(s.adCTA);
        if (s.stratResult)   setStratResult(s.stratResult);
        if (s.viralRes)      setViralRes(s.viralRes);
        if (s.hooksRes)      setHooksRes(s.hooksRes);
        if (s.repResult)     setRepResult(s.repResult);
        if (s.auditResult)   setAuditResult(s.auditResult);
        if (s.crResult)      setCrResult(s.crResult);
        if (s.viralProd)     setViralProd(s.viralProd);
        if (s.viralTone)     setViralTone(s.viralTone);
        if (s.stratSector)   setStratSector(s.stratSector);
        if (s.stratProduct)  setStratProduct(s.stratProduct);
        if (s.stratBrand)    setStratBrand(s.stratBrand);
        if (s.stratUSP)      setStratUSP(s.stratUSP);
        if (s.stratGoal)     setStratGoal(s.stratGoal);
        if (s.abSector)      setAbSector(s.abSector);
        if (s.errNote)       setErrNote(s.errNote);
        if (s.errResult)     setErrResult(s.errResult);
        if (s.crProduct)     setCrProduct(s.crProduct);
        if (s.crVibe)        setCrVibe(s.crVibe);
        if (s.crAudience)    setCrAudience(s.crAudience);
        if (s.step !== undefined && s.step < 4) setStep(s.step);
        if (s.activeTab)     setActiveTab(s.activeTab);
      }
    } catch(e) { console.warn("LocalStorage yükleme hatası:", e); }
  }, []);

  // ── Kalıcı Hafıza: LocalStorage Kaydetme (state değişince) ──────────
  useEffect(() => {
    try {
      const toSave = {
        business, industry, subIndustry, product, price, usp,
        adHeadline, adPrimaryText, adCTA,
        stratResult, stratSector, stratProduct, stratBrand, stratUSP, stratGoal,
        viralRes, viralProd, viralTone,
        hooksRes, repResult, auditResult, crResult,
        crProduct, crVibe, crAudience,
        abSector, step: step < 4 ? step : 0, activeTab,
        errNote, errResult,
      };
      localStorage.setItem("advisorai_session", JSON.stringify(toSave));
    } catch(e) { /* quota aşılırsa sessizce geç */ }
  }, [business, industry, subIndustry, product, price, usp,
      adHeadline, adPrimaryText, adCTA,
      stratResult, viralRes, hooksRes, repResult, auditResult, crResult,
      crProduct, crVibe, crAudience, viralProd, viralTone,
      stratSector, stratProduct, stratBrand, stratUSP, stratGoal,
      abSector, step, activeTab,
      errNote, errResult]);

  // CSS injection
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "adv-css";
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => { try { document.head.removeChild(el); } catch(e) {} };
  }, []);

  // Load brands from storage
  useEffect(() => {
    async function loadBrands() {
      try {
        const _brands = localStorage.getItem("advisorai_brands");
        if (_brands) setBrands(JSON.parse(_brands));
      } catch(e) {}
      setBrandsLoaded(true);
    }
    loadBrands();
  }, []);

  // Auto-fill when brand selected
  useEffect(() => {
    if (!selectedBrand) return;
    const b = brands.find(function(br){ return br.id === selectedBrand; });
    if (!b) return;
    if (b.industry) setIndustry(b.industry);
    if (b.subIndustry) setSubIndustry(b.subIndustry);
    if (b.product) setProduct(b.product);
    if (b.price) setPrice(b.price);
    if (b.usp) setUsp(b.usp);
    if (b.website) setLandingUrl(b.website);
  }, [selectedBrand]);

  async function saveBrands(list) {
    setBrands(list);
    try { localStorage.setItem("advisorai_brands", JSON.stringify(list)); } catch(e) {}
  }

  const tog = (arr, setArr, val) => setArr(a => a.includes(val) ? a.filter(x => x !== val) : [...a, val]);

const runAnalysis = async () => {
    setAnalyzing(true);
    setStep(4);

    const info = { business, industry, subIndustry, product, price, usp, budget, selPlat, goal, ageGroups, genders, interests, painPoints, adHeadline, adPrimaryText, adCTA, landingUrl };

    // Text analysis (instant)
    setAnalyzeMsg("Metin analiz ediliyor...");
    const txt = scoreText(info);
    setTextResult(txt);

    // Visual analysis via Claude API
    const images = mediaFiles.filter(f => !f.isVideo && f.base64);
    const visuals = [];

    if (images.length > 0) {
      const goalLabel = GOALS.find(g => g.id === goal)?.label || goal;
      const platforms = selPlat.map(id => PLATFORMS.find(p => p.id === id)?.name || id).join(", ");
      const context   = { business, product, ageGroups, genders, goalLabel, platforms, adHeadline, adPrimaryText };

      for (let i = 0; i < images.length; i++) {
        setAnalyzeMsg(`Görsel ${i + 1}/${images.length} analiz ediliyor...`);
        try {
          const vr = await analyzeVisualWithClaude(images[i].base64, images[i].mediaType, context);
          visuals.push({ ...vr, fileName: images[i].name, url: images[i].url });
        } catch (e) {
          visuals.push({ error: "Görsel analiz edilemedi.", fileName: images[i].name, url: images[i].url, visualScore: 0 });
        }
      }
    }

    setVisualResults(visuals);

    // Overall score
    const textScores = [txt.hook, txt.value, txt.cta, txt.relevance];
    const visualScores = visuals.filter(v => v.visualScore > 0).map(v => v.visualScore);
    const allScores = [...textScores, ...visualScores];
    const overall = (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1);

    // Adjust conv rate by overall score
    let convRate = 0.032;
    if (parseFloat(overall) >= 8) convRate = 0.06;
    else if (parseFloat(overall) >= 6) convRate = 0.04;
    else if (parseFloat(overall) < 5) convRate = 0.015;
    const conv = Math.round(txt.clicks * convRate);
    const cpa  = conv > 0 ? (budget / conv).toFixed(0) : "—";
    const roas = conv > 0 ? ((conv * parseFloat(price || 50)) / budget).toFixed(1) : "—";

    // Platform fit
    const platFit = PLATFORMS.filter(p => selPlat.includes(p.id)).map(p => {
      let fit = "Uygun", reason = "Genel hedefler için uygun.";
      const ageNums = ageGroups.flatMap(a => a.split("-").map(Number)).filter(Boolean);
      const avgAge  = ageNums.length ? ageNums.reduce((a, b) => a + b, 0) / ageNums.length : 30;
      if (goal === "sales" && p.id === "google") { fit = "Çok Uygun"; reason = "Satın alma niyeti yüksek hedefler."; }
      else if (goal === "awareness" && p.id === "tiktok") { fit = "Çok Uygun"; reason = "Geniş erişim ve viral potansiyel."; }
      else if (goal === "leads" && p.id === "linkedin") { fit = "Çok Uygun"; reason = "B2B lead kalitesi yüksek."; }
      else if (p.id === "tiktok" && avgAge > 45) { fit = "Dikkatli Ol"; reason = "Bu yaş grubu TikTok'ta düşük kitleye sahip."; }
      else if (p.id === "linkedin" && avgAge < 28) { fit = "Dikkatli Ol"; reason = "Hedef kitle LinkedIn'i az kullanıyor olabilir."; }
      return { ...p, fit, reason };
    });

    setOverallScore({ overall, conv, cpa, roas, platFit, clicks: txt.clicks, impr: txt.impr });
    setAnalyzing(false);
  };

  const reset = () => { setStep(0); setTextResult(null); setVisualResults([]); setOverallScore(null); setMediaFiles([]); };

  // ── Simple score for scoring tab ──────────────────────────────────
  function scoreSimple(h, t, v) {
    const all = (h + " " + t).toLowerCase();
    let hook = 0, value = 0, cta = 0;
    if (h.includes("?") || t.includes("?")) hook += 2;
    if (POWER_W.some(w => all.includes(w))) hook += 2;
    if (EMOTION_W.some(w => all.includes(w))) hook += 2;
    if (/\d/.test(t)) hook += 1.5;
    hook = Math.min(10, Math.max(1, hook));
    if (/\d+%|\d+x/.test(all)) value += 2.5;
    if (/nasıl|neden/.test(all)) value += 1.5;
    if (POWER_W.filter(w => all.includes(w)).length >= 2) value += 2;
    if (v && v.length > 20) value += 1;
    value = Math.min(10, Math.max(1, value));
    if (CTA_W.some(w => all.includes(w))) cta += 3.5;
    if (/!/.test(t)) cta += 1.5;
    cta = Math.min(10, Math.max(1, cta));
    const overall = ((hook + value + cta) / 3).toFixed(1);
    const suggestions = [];
    if (hook < 6) suggestions.push("İlk cümleye soru veya istatistik ekleyin.");
    if (value < 6) suggestions.push("Somut bir sayı veya yüzde ile değer önerinizi destekleyin.");
    if (cta < 6) suggestions.push("Son cümleye net bir eylem çağrısı ekleyin.");
    if (h.length > 40) suggestions.push("Başlık 40 karakteri aşıyor. Kısaltın.");
    return { hook: Math.round(hook * 10) / 10, value: Math.round(value * 10) / 10, cta: Math.round(cta * 10) / 10, overall, suggestions };
  }

  const copyText = t => { try { navigator.clipboard.writeText(t); } catch (e) { } };

  function removeMedia(index) {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  }

  const STEPS = ["İşletme", "Bütçe & Platform", "Hedef Kitle", "Reklam İçeriği"];

  return (
    <div className="adv-root">
      <div className="adv-glow" style={{ top: -200, left: -100, zIndex: 0, position: "fixed" }} />
      <div className="adv-glow" style={{ bottom: -250, right: -150, zIndex: 0, position: "fixed" }} />

      {/* SIDEBAR */}
      <div className="adv-sidebar">
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 28 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6C5CE7,#A29BFE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "white", fontWeight: 700 }}>▲</div>
          <div className="adv-logo">Ad<span>Visor</span>AI</div>
        </div>
        {TABS.map(t => (
          <button key={t.id} className={"adv-sb" + (activeTab === t.id ? " active" : "")} onClick={() => { setActiveTab(t.id); setSideOpen(false); }}>
            <span style={{ fontSize: 15 }}>{t.icon}</span>{t.label}
          </button>
        ))}
        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #2A3040" }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#8892A6", marginBottom: 8, paddingLeft: 4 }}>Sektör</div>
          <select className="adv-select" value={industry} onChange={e => { setIndustry(e.target.value); setSubIndustry(""); }}>
            <option value="">Seçin</option>
            {Object.keys(SECTOR_TREE).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {industry && (SECTOR_TREE[industry]||[]).length > 0 && (
            <select className="adv-select" style={{marginTop:6}} value={subIndustry} onChange={e => setSubIndustry(e.target.value)}>
              <option value="">Alt sektör seçin</option>
              {(SECTOR_TREE[industry]||[]).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
        </div>
        {/* ── Bütçe & Tüketim Paneli ─────────────────────────── */}
        <div style={{marginTop:12,padding:"12px 14px",background:"rgba(108,92,231,0.08)",border:"1px solid rgba(108,92,231,0.2)",borderRadius:12}}>
          <div style={{fontSize:10,fontWeight:700,color:"#A29BFE",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10,display:"flex",alignItems:"center",gap:5}}>
            <span>💸</span> Bütçe & Tüketim
          </div>
          {pendingOp && (
            <div style={{marginBottom:8,padding:"6px 10px",background:"rgba(255,165,2,0.1)",border:"1px solid rgba(255,165,2,0.25)",borderRadius:8}}>
              <div style={{fontSize:10,color:"#FFA502",fontWeight:600,marginBottom:2}}>Tahmini Maliyet</div>
              <div style={{fontSize:12,color:"#E8ECF4",fontWeight:700}}>~₺{pendingOp.cost.toFixed(4)}</div>
              <div style={{fontSize:10,color:"#8892A6"}}>{pendingOp.label}</div>
            </div>
          )}
          {lastOpLabel ? (
            <div style={{marginBottom:8,paddingBottom:8,borderBottom:"1px solid rgba(108,92,231,0.15)"}}>
              <div style={{fontSize:10,color:"#8892A6",marginBottom:2}}>Son İşlem</div>
              <div style={{fontSize:11,fontWeight:600,color:"#E8ECF4",marginBottom:1}}>{lastOpLabel}</div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12,color:"#00D68F",fontWeight:700}}>₺{lastOpCostTL.toFixed(4)}</span>
                <span style={{fontSize:10,color:"#8892A6"}}>{lastOpTokens.toLocaleString("tr-TR")} token</span>
              </div>
            </div>
          ) : (
            <div style={{fontSize:11,color:"#8892A6",marginBottom:8}}>Henüz işlem yapılmadı</div>
          )}
          <div style={{marginBottom:8}}>
            <div style={{fontSize:10,color:"#8892A6",marginBottom:4}}>Bu Oturum Toplamı</div>
            <div style={{fontSize:18,fontWeight:800,fontFamily:"monospace",color:totalCostTL>10?"#FF6B6B":totalCostTL>5?"#FFA502":"#A29BFE"}}>
              ₺{totalCostTL.toFixed(3)}
            </div>
            {totalTokens > 0 && (
              <div style={{fontSize:10,color:"#8892A6",marginTop:2}}>{totalTokens.toLocaleString("tr-TR")} token</div>
            )}
            <div style={{marginTop:8,display:"flex",gap:6,flexWrap:"wrap"}}>
              <div style={{fontSize:10,background:"rgba(108,92,231,0.15)",color:"#A29BFE",borderRadius:6,padding:"2px 8px",fontWeight:600}}>
                🧠 Claude: ₺{claudeCostTL.toFixed(3)}
              </div>
              <div style={{fontSize:10,background:"rgba(26,115,232,0.15)",color:"#5BA3F5",borderRadius:6,padding:"2px 8px",fontWeight:600}}>
                ⚡ Gemini: ₺{geminiCostTL.toFixed(5)}
              </div>
            </div>
          </div>
          {totalCostTL > 0 && (
            <button onClick={()=>{setTotalTokens(0);setTotalCostTL(0);setLastOpLabel("");setLastOpCostTL(0);setLastOpTokens(0);setPendingOp(null);}}
              style={{width:"100%",padding:"5px",borderRadius:6,border:"1px solid rgba(255,107,107,0.2)",background:"rgba(255,107,107,0.06)",color:"#FF6B6B",fontSize:10,cursor:"pointer",fontWeight:600}}>
              Sıfırla
            </button>
          )}
        </div>

        {/* Geçmiş Sil */}
        <button
          onClick={()=>{
            if(!window.confirm("Tüm analiz geçmişi silinecek. Markalarım korunur. Devam edilsin mi?")) return;
            localStorage.removeItem("advisorai_session");
            setStratResult(null); setViralRes(null); setHooksRes(null);
            setRepResult(""); setAuditResult(""); setCrResult("");
            setBusiness(""); setIndustry(""); setSubIndustry("");
            setProduct(""); setPrice(""); setUsp("");
            setAdHeadline(""); setAdPrimaryText(""); setAdCTA("");
            setStep(0); setMediaFiles([]);
            setStratSector(""); setStratProduct(""); setStratBrand("");
            setStratUSP(""); setStratGoal("sales");
            setViralProd(""); setViralTone("Dogrudan Satis");
            setCrProduct(""); setCrVibe(""); setCrAudience("");
            setAbSector("");
            setErrImg(""); setErrNote(""); setErrResult("");
          }}
          style={{width:"100%",marginTop:8,padding:"7px",borderRadius:8,
            border:"1px solid rgba(255,107,107,0.25)",background:"rgba(255,107,107,0.05)",
            color:"#FF6B6B",fontSize:11,cursor:"pointer",fontWeight:600,
            display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
          🗑️ Tüm Geçmişi Sil
        </button>
      </div>

      {/* Mobile overlay */}
      {sideOpen && (
        <div onClick={() => setSideOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.6)", display: "flex" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 240, background: "#141820", padding: "24px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            {TABS.map(t => (
              <button key={t.id} className={"adv-sb" + (activeTab === t.id ? " active" : "")} onClick={() => { setActiveTab(t.id); setSideOpen(false); }}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MAIN */}
      <div className="adv-main">
        <div className="adv-inner">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <button className="adv-mmb" onClick={() => setSideOpen(true)}>☰</button>
            <div style={{ display: "flex", gap: 6 }}>{subIndustry ? <Tag>{subIndustry}</Tag> : industry ? <Tag>{industry}</Tag> : null}</div>
            {/* Model Selector */}
            <div style={{display:"flex",alignItems:"center",gap:6,background:"#1C2230",borderRadius:10,padding:"4px",border:"1px solid #2A3040",marginLeft:"auto"}}>
              <button
                onClick={()=>setSelectedModel("claude")}
                style={{padding:"5px 12px",borderRadius:7,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.15s",
                  background:selectedModel==="claude"?"#6C5CE7":"transparent",
                  color:selectedModel==="claude"?"white":"#8892A6"}}>
                🧠 Claude
              </button>
              <button
                onClick={()=>setSelectedModel("gemini")}
                style={{padding:"5px 12px",borderRadius:7,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.15s",
                  background:selectedModel==="gemini"?"#1a73e8":"transparent",
                  color:selectedModel==="gemini"?"white":"#8892A6"}}>
                ⚡ Gemini
              </button>
            </div>
          </div>

          {/* ══════════════ DASHBOARD ══════════════ */}

          {activeTab === "brands" && (
            <div style={{maxWidth:860,margin:"0 auto"}}>

              {/* Header */}
              <div style={{marginBottom:32}}>
                <h1 style={{fontSize:26,fontWeight:700,color:"#E8ECF4",marginBottom:6}}>Markalarım</h1>
                <p style={{color:"#8892A6",fontSize:14,lineHeight:1.6}}>
                  Marka profillerini kaydet. Kampanya Analizinde tek tıklama ile tum alanlar otomatik dolar.
                </p>
              </div>

              {/* Add / Edit Card */}
              <div style={{background:"#141820",border:"1px solid #2A3040",borderRadius:20,padding:"28px 32px",marginBottom:28,position:"relative",overflow:"hidden"}}>
                {/* Accent glow */}
                <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(108,92,231,0.18) 0%,transparent 70%)",pointerEvents:"none"}}/>

                <div style={{fontSize:13,fontWeight:600,color:"#A29BFE",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:24}}>
                  {brandEditing ? "Marka Düzenle" : "Yeni Marka"}
                </div>

                {/* Logo + Name row */}
                <div style={{display:"flex",alignItems:"flex-start",gap:20,marginBottom:20}}>
                  {/* Logo upload */}
                  <div style={{flexShrink:0}}>
                    <div
                      onClick={()=>document.getElementById("brand-logo-input").click()}
                      style={{width:72,height:72,borderRadius:"50%",background:brandForm.logo?"transparent":"rgba(108,92,231,0.12)",border:"2px dashed rgba(108,92,231,0.4)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",transition:"all 0.2s",position:"relative"}}
                      onMouseEnter={e=>{if(!brandForm.logo)e.currentTarget.style.borderColor="#6C5CE7";}}
                      onMouseLeave={e=>{if(!brandForm.logo)e.currentTarget.style.borderColor="rgba(108,92,231,0.4)";}}>
                      {brandForm.logo
                        ? <img src={brandForm.logo} alt="logo" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        : <div style={{textAlign:"center"}}>
                            <div style={{fontSize:20,marginBottom:2}}>📷</div>
                            <div style={{fontSize:9,color:"#8892A6",lineHeight:1.2}}>Logo<br/>Yukle</div>
                          </div>
                      }
                    </div>
                    <input id="brand-logo-input" type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                      const f=e.target.files[0];
                      if(f){const r=new FileReader();r.onload=ev=>setBrandForm(fm=>({...fm,logo:ev.target.result}));r.readAsDataURL(f);}
                    }}/>
                    {brandForm.logo && (
                      <button onClick={()=>setBrandForm(fm=>({...fm,logo:""}))}
                        style={{display:"block",margin:"6px auto 0",background:"none",border:"none",color:"#FF6B6B",fontSize:10,cursor:"pointer",padding:0}}>
                        Kaldir
                      </button>
                    )}
                  </div>

                  {/* Name + Website */}
                  <div style={{flex:1,display:"flex",flexDirection:"column",gap:12}}>
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Marka Adi</label>
                      <input className="adv-input" value={brandForm.name} onChange={e=>setBrandForm(f=>({...f,name:e.target.value}))}
                        placeholder="Or: Casiva, BeCase, FitLife..." style={{fontSize:15,fontWeight:600}}/>
                    </div>
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Web Sitesi</label>
                      <div style={{display:"flex",gap:8}}>
                        <input className="adv-input" value={brandForm.website} onChange={e=>setBrandForm(f=>({...f,website:e.target.value}))}
                          placeholder="https://markaniz.com" style={{flex:1}}/>
                        <button
                          disabled={!brandForm.website||brandAutoFill}
                          onClick={async()=>{
                            setBrandAutoFill(true);
                            await new Promise(r=>setTimeout(r,2200));
                            setBrandAutoFill(false);
                          }}
                          style={{
                            padding:"0 14px",borderRadius:10,border:"1px solid rgba(162,155,254,0.4)",
                            background:brandAutoFill?"rgba(108,92,231,0.2)":"rgba(108,92,231,0.1)",
                            color:"#A29BFE",fontSize:12,fontWeight:600,cursor:brandForm.website&&!brandAutoFill?"pointer":"not-allowed",
                            opacity:brandForm.website&&!brandAutoFill?1:0.5,whiteSpace:"nowrap",transition:"all 0.2s",
                            display:"flex",alignItems:"center",gap:6,flexShrink:0
                          }}>
                          {brandAutoFill
                            ? <><span style={{display:"inline-block",animation:"spin 0.8s linear infinite"}}>⟳</span> Analiz ediliyor...</>
                            : <>✨ ✨ AI ile Doldur</>
                            }
                        </button>
                      </div>
                      {brandAutoFill && (
                        <div style={{marginTop:8,display:"flex",gap:6,flexWrap:"wrap"}}>
                          {["Sektör tespit ediliyor...","USP çıkarılıyor...","Hedef kitle analiz ediliyor..."].map((s,i)=>(
                            <span key={i} style={{fontSize:11,color:"#6C5CE7",background:"rgba(108,92,231,0.1)",padding:"3px 10px",borderRadius:20,animation:"advFade 0.4s ease "+i*0.15+"s both"}}>
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fields grid */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                  <div>
                    <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Sektor</label>
                    <select className="adv-select" value={brandForm.industry} onChange={e=>setBrandForm(f=>({...f,industry:e.target.value,subIndustry:""}))}>
                      <option value="">Secin</option>
                      {Object.keys(SECTOR_TREE).map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Alt Sektor</label>
                    <select className="adv-select" value={brandForm.subIndustry} onChange={e=>setBrandForm(f=>({...f,subIndustry:e.target.value}))}
                      disabled={!brandForm.industry||!(SECTOR_TREE[brandForm.industry]||[]).length}>
                      <option value="">Secin</option>
                      {(SECTOR_TREE[brandForm.industry]||[]).map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Urun / Hizmet</label>
                    <input className="adv-input" value={brandForm.product} onChange={e=>setBrandForm(f=>({...f,product:e.target.value}))}
                      placeholder="Or: iPhone kilifi, lazer epilasyon..."/>
                  </div>
                  <div>
                    <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Fiyat / Teklif</label>
                    <input className="adv-input" value={brandForm.price} onChange={e=>setBrandForm(f=>({...f,price:e.target.value}))}
                      placeholder="Or: 299 TL, 3 Al 2 Ode..."/>
                  </div>
                </div>

                <div style={{marginBottom:14}}>
                  <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Rakipten Farki (USP)</label>
                  <input className="adv-input" value={brandForm.usp} onChange={e=>setBrandForm(f=>({...f,usp:e.target.value}))}
                    placeholder="Or: 2 yil garanti, askeri koruma, yerli uretim..."/>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:24}}>
                  <div>
                    <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Hedef Kitle</label>
                    <input className="adv-input" value={brandForm.audience} onChange={e=>setBrandForm(f=>({...f,audience:e.target.value}))}
                      placeholder="Or: 20-35 kadin, iPhone kullanicilari..."/>
                  </div>
                  <div>
                    <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Marka Ses Tonu</label>
                    <select className="adv-select" value={brandForm.tone} onChange={e=>setBrandForm(f=>({...f,tone:e.target.value}))}>
                      <option value="">Belirtilmemis</option>
                      <option value="premium">Premium / Minimalist</option>
                      <option value="samimi">Samimi / UGC</option>
                      <option value="agresif">Agresif / Satis Odakli</option>
                      <option value="kurumsal">Kurumsal / Profesyonel</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div style={{display:"flex",gap:10,borderTop:"1px solid #2A3040",paddingTop:20}}>
                  <button className="adv-btn" disabled={!brandForm.name} style={{padding:"12px 24px"}}
                    onClick={async()=>{
                      if(brandEditing){
                        await saveBrands(brands.map(b=>b.id===brandForm.id?brandForm:b));
                      } else {
                        await saveBrands([...brands,Object.assign({},brandForm,{id:"b"+Date.now()})]);
                      }
                      setBrandForm({id:"",name:"",industry:"",subIndustry:"",product:"",price:"",usp:"",audience:"",website:"",tone:"",logo:""});
                      setBrandEditing(false);
                    }}>
                    {brandEditing ? "Güncelle" : "Kaydet"}
                  </button>
                  {brandEditing && (
                    <button className="adv-btn-ghost" onClick={()=>{
                      setBrandForm({id:"",name:"",industry:"",subIndustry:"",product:"",price:"",usp:"",audience:"",website:"",tone:"",logo:""});
                      setBrandEditing(false);
                    }}>İptal</button>
                  )}
                </div>
              </div>

              {/* Saved brands */}
              {!brandsLoaded && <div style={{color:"#8892A6",fontSize:13,padding:"12px 0"}}>Yükleniyor...</div>}

              {brandsLoaded && brands.length === 0 && (
                <div style={{textAlign:"center",padding:"56px 24px",background:"#141820",borderRadius:20,border:"1px dashed #2A3040"}}>
                  <div style={{fontSize:40,marginBottom:12}}>🏷</div>
                  <div style={{fontWeight:700,fontSize:16,color:"#E8ECF4",marginBottom:6}}>Henüz kayıtlı marka yok</div>
                  <div style={{fontSize:13,color:"#8892A6",lineHeight:1.6,maxWidth:320,margin:"0 auto"}}>
                    Yukaridan ilk markanizi ekleyin. Kampanya analizinde tek tıklama ile tum alanlar otomatik dolar.
                  </div>
                </div>
              )}

              {brands.length > 0 && (
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:16}}>
                    {brands.length} Kayıtlı Marka
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:16}}>
                    {brands.map(b=>{
                      const toneMap={premium:{label:"Premium",bg:"rgba(162,155,254,0.15)",color:"#A29BFE"},samimi:{label:"Samimi/UGC",bg:"rgba(0,214,143,0.12)",color:"#00D68F"},agresif:{label:"Agresif",bg:"rgba(255,107,107,0.12)",color:"#FF6B6B"},kurumsal:{label:"Kurumsal",bg:"rgba(255,165,2,0.12)",color:"#FFA502"}};
                      const toneStyle = b.tone && toneMap[b.tone] ? toneMap[b.tone] : null;
                      const initials = b.name ? b.name.slice(0,2).toUpperCase() : "??";
                      const sectorColors = ["#A29BFE","#00D68F","#FFA502","#FF6B6B","#74B9FF","#FD79A8","#55EFC4","#FDCB6E"];
                      const sectorColor = sectorColors[(b.industry||"").length % sectorColors.length];
                      return (
                        <div key={b.id} style={{background:"#141820",border:"1px solid #2A3040",borderRadius:18,padding:"22px 24px",display:"flex",flexDirection:"column",gap:0,transition:"border-color 0.2s",position:"relative",overflow:"hidden"}}
                          onMouseEnter={e=>e.currentTarget.style.borderColor="#3D4455"}
                          onMouseLeave={e=>e.currentTarget.style.borderColor="#2A3040"}>

                          {/* Top accent line */}
                          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+sectorColor+"66,transparent)",borderRadius:"18px 18px 0 0"}}/>

                          {/* Header row */}
                          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
                            {/* Avatar */}
                            <div style={{width:48,height:48,borderRadius:"50%",background:b.logo?"transparent":"rgba(108,92,231,0.2)",border:"2px solid rgba(108,92,231,0.3)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
                              {b.logo
                                ? <img src={b.logo} alt={b.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                                : <span style={{fontSize:15,fontWeight:700,color:"#A29BFE"}}>{initials}</span>
                                }
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontWeight:700,fontSize:16,color:"#E8ECF4",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.name}</div>
                              <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                                {b.industry && (
                                  <span style={{fontSize:11,fontWeight:600,background:sectorColor+"22",color:sectorColor,padding:"2px 8px",borderRadius:20}}>
                                    {b.subIndustry||b.industry}
                                  </span>
                                )}
                                {toneStyle && (
                                  <span style={{fontSize:11,fontWeight:600,background:toneStyle.bg,color:toneStyle.color,padding:"2px 8px",borderRadius:20}}>
                                    {toneStyle.label}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Details */}
                          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16,paddingBottom:16,borderBottom:"1px solid #2A3040"}}>
                            {b.product && (
                              <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                                <span style={{fontSize:11,color:"#8892A6",flexShrink:0,marginTop:1}}>Urun</span>
                                <span style={{fontSize:12,color:"#C8D0E0",lineHeight:1.5}}>{b.product}{b.price?" · "+b.price:""}</span>
                              </div>
                            )}
                            {b.usp && (
                              <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                                <span style={{fontSize:11,color:"#8892A6",flexShrink:0,marginTop:1}}>USP</span>
                                <span style={{fontSize:12,color:"#00D68F",lineHeight:1.5}}>{b.usp}</span>
                              </div>
                            )}
                            {b.website && (
                              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                                <span style={{fontSize:11,color:"#8892A6",flexShrink:0}}>Site</span>
                                <span style={{fontSize:12,color:"#A29BFE",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.website.replace("https://","").replace("http://","")}</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div style={{display:"flex",gap:8}}>
                            <button
                              style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#6C5CE7,#A29BFE)",color:"white",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:"0.02em"}}
                              onClick={()=>{setSelectedBrand(b.id);setActiveTab("dashboard");}}>
                              Kampanya Ac
                            </button>
                            <button className="adv-btn-ghost" style={{padding:"10px 12px",fontSize:12}}
                              onClick={()=>{setBrandForm(b);setBrandEditing(true);window.scrollTo(0,0);}}>
                              Duzenle
                            </button>
                            <button
                              style={{padding:"10px 12px",borderRadius:10,border:"1px solid rgba(255,107,107,0.25)",background:"rgba(255,107,107,0.07)",color:"#FF6B6B",fontSize:12,cursor:"pointer"}}
                              onClick={async()=>saveBrands(brands.filter(br=>br.id!==b.id))}>
                              Sil
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "dashboard" && (
            <div>
              {/* Brand quick-select */}
              {brands.length > 0 && step < 4 && (
                <div style={{background:"rgba(108,92,231,0.08)",border:"1px solid rgba(108,92,231,0.25)",borderRadius:12,padding:"10px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                  <span style={{fontSize:12,color:"#A29BFE",fontWeight:600,flexShrink:0}}>Marka:</span>
                  <select className="adv-select" style={{flex:1,minWidth:160,padding:"7px 12px"}} value={selectedBrand}
                    onChange={e=>setSelectedBrand(e.target.value)}>
                    <option value="">-- Manuel gir --</option>
                    {brands.map(b=><option key={b.id} value={b.id}>{b.name}{b.subIndustry?" ("+b.subIndustry+")":(b.industry?" ("+b.industry+")":"")}</option>)}
                  </select>
                  {selectedBrand && <span style={{fontSize:11,color:"#00D68F",flexShrink:0}}>Bilgiler dolduruldu</span>}
                  <button className="adv-btn-ghost" style={{fontSize:11,padding:"6px 10px",flexShrink:0}}
                    onClick={()=>setActiveTab("brands")}>+ Yeni Marka</button>
                </div>
              )}
              {/* Progress bar */}
              {step < 4 && (
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    {STEPS.map((s, i) => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < step ? "#6C5CE7" : i === step ? "#A29BFE" : "#1C2230", transition: "background 0.3s" }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {STEPS.map((s, i) => (
                      <div key={i} style={{ fontSize: 11, color: i <= step ? "#A29BFE" : "#8892A6", fontWeight: i === step ? 700 : 400 }}>{s}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 0: İşletme ── */}
              {step === 0 && (
                <div className="adv-fade">
                  <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>İşletmenizi tanıyalım</h1>
                  <p style={{ color: "#8892A6", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Reklam analizinin doğru olabilmesi için ne sattığınızı anlamamız gerekiyor.</p>
                  <div className="adv-section">
                    <div className="adv-section-title">🏢 İşletme & Ürün</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div>
                        <label className="adv-label">Ne iş yapıyorsunuz?</label>
                        <input className="adv-input" value={business} onChange={e => setBusiness(e.target.value)} placeholder="Ör: Kadın ayakkabısı satan e-ticaret, B2B muhasebe yazılımı, diyetisyen klinik..." />
                      </div>
                      <div className="adv-grid2">
                        <div>
                          <label className="adv-label">Ana Sektör</label>
                          <select className="adv-select" value={industry} onChange={e => { setIndustry(e.target.value); setSubIndustry(""); }}>
                            <option value="">Seçin</option>
                            {Object.keys(SECTOR_TREE).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="adv-label">
                            Alt Sektör
                            {!industry && <span style={{color:"#8892A6",fontWeight:400,fontSize:11}}> (önce ana sektör seçin)</span>}
                          </label>
                          <select className="adv-select" value={subIndustry} onChange={e => setSubIndustry(e.target.value)}
                            disabled={!industry || !(SECTOR_TREE[industry]||[]).length}
                            style={{opacity: (!industry || !(SECTOR_TREE[industry]||[]).length) ? 0.45 : 1}}>
                            <option value="">Seçin</option>
                            {(SECTOR_TREE[industry]||[]).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      {subIndustry && (
                        <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"rgba(108,92,231,0.08)",border:"1px solid rgba(108,92,231,0.2)",borderRadius:10}}>
                          <span style={{fontSize:13}}>🎯</span>
                          <span style={{fontSize:12,color:"#A29BFE"}}>
                            <strong>{subIndustry}</strong> için optimize edilmiş analiz yapılacak
                          </span>
                        </div>
                      )}
                      <div className="adv-grid2">
                        <div>
                          <label className="adv-label">Bu reklamda ne satıyorsunuz?</label>
                          <input className="adv-input" value={product} onChange={e => setProduct(e.target.value)} placeholder="Ör: Deri topuklu sandalet, aylık abonelik..." />
                        </div>
                        <div>
                          <label className="adv-label">Ürün / Hizmet Fiyatı (₺)</label>
                          <input className="adv-input" value={price} onChange={e => setPrice(e.target.value)} placeholder="Ör: 499, 1200, 29/ay..." />
                        </div>
                      </div>
                      <div>
                        <label className="adv-label">Rakipten farkınız / USP nedir?</label>
                        <input className="adv-input" value={usp} onChange={e => setUsp(e.target.value)} placeholder="Ör: %100 doğal malzeme, 24h destek..." />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button className="adv-btn" disabled={!business || !product} onClick={() => setStep(1)}>Devam → →</button>
                  </div>
                </div>
              )}

              {/* ── STEP 1: Bütçe & Platformlar ── */}
              {step === 1 && (
                <div className="adv-fade">
                  <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Bütçe & Kampanya</h1>
                  <p style={{ color: "#8892A6", fontSize: 14, marginBottom: 24 }}>Aylık bütçenizi, platformlarınızı ve kampanya hedefini belirtin.</p>
                  <div className="adv-section">
                    <div className="adv-section-title">💰 Aylık Bütçe</div>
                    <div style={{ textAlign: "center", fontFamily: "monospace", fontSize: 40, fontWeight: 700, color: "#A29BFE", marginBottom: 20 }}>₺{budget.toLocaleString("tr-TR")}</div>
                    <input type="range" min={500} max={50000} step={500} value={budget} className="adv-range" style={{ background: `linear-gradient(to right,#6C5CE7 ${fillPct}%,#1C2230 ${fillPct}%)` }} onChange={e => setBudget(Number(e.target.value))} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "#8892A6" }}><span>₺500</span><span>₺50.000</span></div>
                    <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
                      {[1000, 2500, 5000, 10000, 20000].map(v => (
                        <button key={v} className={"adv-chip" + (budget === v ? " on" : "")} onClick={() => setBudget(v)}>₺{v.toLocaleString("tr-TR")}</button>
                      ))}
                    </div>
                  </div>
                  <div className="adv-section">
                    <div className="adv-section-title">🎯 Kampanya Hedefi</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10 }}>
                      {GOALS.map(g => (
                        <div key={g.id} onClick={() => setGoal(g.id)} style={{ cursor: "pointer", background: goal === g.id ? "rgba(108,92,231,0.12)" : "#1C2230", border: "1.5px solid " + (goal === g.id ? "#6C5CE7" : "#2A3040"), borderRadius: 12, padding: "14px 16px", transition: "all 0.2s" }}>
                          <div style={{ fontSize: 24, marginBottom: 6 }}>{g.icon}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: goal === g.id ? "#A29BFE" : "#E8ECF4" }}>{g.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="adv-section">
                    <div className="adv-section-title">📱 Reklam Platformları</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10 }}>
                      {PLATFORMS.map(p => {
                        const s = selPlat.includes(p.id);
                        return (
                          <div key={p.id} onClick={() => togPlat(p.id)} style={{ cursor: "pointer", background: s ? p.color + "18" : "#1C2230", border: "1.5px solid " + (s ? p.color : "#2A3040"), borderRadius: 12, padding: "14px 16px", transition: "all 0.2s" }}>
                            <div style={{ fontSize: 22, marginBottom: 6 }}>{p.icon}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: s ? p.color : "#E8ECF4" }}>{p.name}</div>
                            <div style={{ fontSize: 10, color: "#8892A6", marginTop: 3 }}>CTR {p.ctr}% · CPC ${p.cpc}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button className="adv-btn-ghost" onClick={() => setStep(0)}>← ← Geri</button>
                    <button className="adv-btn" disabled={!selPlat.length || !goal} onClick={() => setStep(2)}>Devam → →</button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Hedef Kitle ── */}
              {step === 2 && (
                <div className="adv-fade">
                  <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Hedef Kitleyi Tanımlayın</h1>
                  <p style={{ color: "#8892A6", fontSize: 14, marginBottom: 24 }}>Bu reklamın ulaşmasını istediğiniz kişileri mümkün olduğunca detaylı belirtin.</p>
                  <div className="adv-section">
                    <div className="adv-section-title">🎂 Yaş Grubu</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {AGE_GROUPS.map(a => <button key={a} className={"adv-chip" + (ageGroups.includes(a) ? " on" : "")} onClick={() => tog(ageGroups, setAgeGroups, a)}>{a}</button>)}
                    </div>
                  </div>
                  <div className="adv-section">
                    <div className="adv-section-title">👤 Cinsiyet</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {GENDERS.map(g => <button key={g} className={"adv-chip" + (genders.includes(g) ? " on" : "")} onClick={() => tog(genders, setGenders, g)}>{g}</button>)}
                    </div>
                  </div>
                  <div className="adv-section">
                    <div className="adv-section-title">💡 İlgi Alanları</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {INTERESTS.map(i => <button key={i} className={"adv-chip" + (interests.includes(i) ? " on" : "")} onClick={() => tog(interests, setInterests, i)}>{i}</button>)}
                    </div>
                  </div>
                  <div className="adv-section">
                    <div className="adv-section-title">😤 Hedef Kitlenizin Acı Noktaları</div>
                    <p style={{ fontSize: 13, color: "#8892A6", marginBottom: 12 }}>Bu ürünü alacak kişi hangi sorununu çözmeye çalışıyor?</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {PAIN_OPTS.map(p => <button key={p} className={"adv-chip" + (painPoints.includes(p) ? " on" : "")} onClick={() => tog(painPoints, setPainPoints, p)}>{p}</button>)}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button className="adv-btn-ghost" onClick={() => setStep(1)}>← ← Geri</button>
                    <button className="adv-btn" disabled={!ageGroups.length || !genders.length} onClick={() => setStep(3)}>Devam → →</button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Reklam İçeriği ── */}
              {step === 3 && (
                <div className="adv-fade">
                  <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Reklam İçeriğinizi Girin</h1>
                  <p style={{ color: "#8892A6", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                    Reklamınızın metnini yazın ve görsel/videoyu yükleyin. Görseli olmayan bir reklamı doğru analiz edemeyiz.
                  </p>

                  <div className="adv-section" style={{marginBottom:14,borderColor:"rgba(162,155,254,0.25)"}}>
                    <div className="adv-section-title">Landing Page URL <span style={{color:"#8892A6",fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:12}}>(Opsiyonel — Funnel analizi)</span></div>
                    <input className="adv-input" value={landingUrl} onChange={e=>setLandingUrl(e.target.value)}
                      placeholder="https://siteniz.com/urun-sayfasi"/>
                    <div style={{fontSize:11,color:"#8892A6",marginTop:6}}>Claude reklamla sayfayı karşılaştırır: fiyat uyumu, mesaj tutarlılığı, dönüşüm engelleri.</div>
                  </div>

                  <div className="adv-section">
                    <div className="adv-section-title">✍️ Reklam Metinleri</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <label className="adv-label" style={{ margin: 0 }}>Başlık <span style={{color:"#8892A6",fontWeight:400}}>(Opsiyonel)</span></label>
                          <span style={{ fontSize: 11, fontFamily: "monospace", color: adHeadline.length > 40 ? "#FF6B6B" : "#8892A6" }}>{adHeadline.length}/40</span>
                        </div>
                        <input className="adv-input" value={adHeadline} onChange={e => setAdHeadline(e.target.value)} placeholder="Ör: %50 İndirim — Sadece Bu Hafta!" />
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <label className="adv-label" style={{ margin: 0 }}>Ana Metin (Primary Text)</label>
                          <span style={{
                            fontSize: 11, fontFamily: "monospace", fontWeight: 600,
                            color: adPrimaryText.length > 2200 ? "#FF6B6B" : adPrimaryText.length > 125 ? "#FFA502" : "#8892A6",
                            transition: "color 0.2s"
                          }}>
                            {adPrimaryText.length} / 2200
                          </span>
                        </div>
                        <textarea className="adv-textarea" rows={4} value={adPrimaryText}
                          onChange={e => setAdPrimaryText(e.target.value)}
                          maxLength={2200}
                          placeholder="Reklamınızın ana metnini buraya yazın..." />
                        {adPrimaryText.length > 2000 && (
                          <div style={{ fontSize: 11, color: "#FFA502", marginTop: 5, display: "flex", alignItems: "center", gap: 5 }}>
                            <span>⚠</span>
                            <span>2000 karakterden sonrası Facebook/Instagram'da "Devam →ını Gör" butonunun arkasında kalır.</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="adv-label">CTA Butonu Metni</label>
                        <input className="adv-input" value={adCTA} onChange={e => setAdCTA(e.target.value)} placeholder="Ör: Şimdi Satın Al, Ücretsiz Dene, Hemen Başla..." />
                      </div>
                    </div>
                  </div>

                  {/* UPLOAD ZONE */}
                  <div className="adv-section">
                    <div className="adv-section-title">🖼️ Görsel / Video Yükle</div>
                    <p style={{ fontSize: 13, color: "#8892A6", marginBottom: 14, lineHeight: 1.6 }}>
                      Reklamda kullanacağınız görsel veya videonun ekran görüntüsünü yükleyin. Yapay zeka her detayı analiz edecek.
                    </p>

                    <div
                      className={"adv-upload-zone" + (isDrag ? " drag" : "")}
                      onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
                      onDragLeave={() => setIsDrag(false)}
                      onDrop={e => { e.preventDefault(); setIsDrag(false); handleFiles(e.dataTransfer.files); }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={e => handleFiles(e.target.files)} />
                      <div style={{ fontSize: 36, marginBottom: 12 }}>📁</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#E8ECF4", marginBottom: 6 }}>Sürükle & Bırak veya Tıkla</div>
                      <div style={{ fontSize: 12, color: "#8892A6" }}>PNG, JPG, GIF, MP4, MOV — Birden fazla dosya seçebilirsiniz</div>
                      <div style={{ marginTop: 14 }}>
                        <span style={{ background: "#6C5CE7", color: "white", padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Dosya Seç</span>
                      </div>
                    </div>

                    {/* Uploaded files preview */}
                    {mediaFiles.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
                        {mediaFiles.map((f, i) => (
                          <div key={i} style={{ position: "relative", width: 100, flexShrink: 0 }}>
                            {f.isVideo ? (
                              <div style={{ width: 100, height: 100, borderRadius: 10, background: "#1C2230", border: "1px solid #2A3040", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                                <div style={{ fontSize: 28 }}>🎬</div>
                                <div style={{ fontSize: 10, color: "#8892A6", textAlign: "center", padding: "0 4px" }}>{f.name.slice(0, 12)}</div>
                              </div>
                            ) : (
                              <img src={f.url} alt={f.name} style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 10, border: "1px solid #2A3040", display: "block" }} />
                            )}
                            <button onClick={() => removeMedia(i)} style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#FF6B6B", border: "none", color: "white", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>✕</button>
                            {!f.isVideo && <Tag color="#00D68F" style={{ marginTop: 4, fontSize: 10 }}>AI analiz</Tag>}
                            {f.isVideo && <div style={{ fontSize: 10, color: "#FFA502", marginTop: 4, textAlign: "center" }}>Önizleme</div>}
                          </div>
                        ))}
                      </div>
                    )}

                    {mediaFiles.length === 0 && (
                      <div className="adv-warn" style={{ marginTop: 12, fontSize: 12 }}>
                        ⚠️ Görsel yüklemezseniz görsel analizi yapılamaz. Reklamın %60-70'i görselden oluşur.
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button className="adv-btn-ghost" onClick={() => setStep(2)}>← ← Geri</button>
                    <button className="adv-btn" disabled={!adPrimaryText} onClick={()=>{setPendingOp({label:"Kampanya Analizi",cost:estimateCost("Kampanya Analizi",mediaFiles.length>0)});runAnalysis();}}>
                      {mediaFiles.filter(f => !f.isVideo).length > 0 ? "Analiz Et (AI Görsel) 🚀" : "Analiz Et 🚀"}
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Analiz & Sonuç ── */}
              {step === 4 && (
                <div>
                  {/* Loading */}
                  {analyzing && (
                    <div className="adv-section adv-analyzing">
                      <div style={{ fontSize: 48 }} className="adv-spin">⚙️</div>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>Reklam Analiz Ediliyor</div>
                      <div style={{ fontSize: 14, color: "#8892A6" }}>{analyzeMsg}</div>
                      <div style={{ fontSize: 12, color: "#8892A6", marginTop: 8 }}>Yapay zeka görsellerinizi ve metinlerinizi inceliyor...</div>
                    </div>
                  )}

                  {/* Results */}
                  {!analyzing && textResult && overallScore && (
                    <div className="adv-fade">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                        <div>
                          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Kampanya Analizi</h1>
                          <p style={{ color: "#8892A6", fontSize: 14 }}>{product} · {business}</p>
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <button className="adv-btn-ghost" style={{fontSize:12,padding:"8px 14px"}}
                            onClick={()=>{
                              const printWin = window.open("","_blank");
                              const styleEl = document.getElementById("md-styles");
                              const styles = styleEl ? styleEl.textContent : "";
                              const content = document.querySelector(".adv-fade") ? document.querySelector(".adv-fade").innerHTML : "";
                              printWin.document.write("<html><head><title>AdVisorAI Kampanya Analizi</title><style>body{background:#0B0E14;color:#E8ECF4;font-family:system-ui;padding:32px;max-width:900px;margin:0 auto}@media print{body{background:white;color:#111}}"+styles+"</style></head><body>"+content+"</body></html>");
                              printWin.document.close();
                              setTimeout(function(){printWin.print();},500);
                            }}>
                            PDF İndir
                          </button>
                          <button className="adv-btn-ghost" onClick={reset}>Yeni Analiz</button>
                        </div>
                      </div>

                      {/* Overall */}
                      <div className="adv-section" style={{ textAlign: "center", marginBottom: 14 }}>
                        <div style={{ fontSize: 12, color: "#8892A6", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Genel Reklam Puanı</div>
                        <div style={{ fontSize: 72, fontWeight: 800, fontFamily: "monospace", color: parseFloat(overallScore.overall) >= 7 ? "#00D68F" : parseFloat(overallScore.overall) >= 5 ? "#FFA502" : "#FF6B6B", lineHeight: 1 }}>
                          {overallScore.overall}<span style={{ fontSize: 28, color: "#8892A6" }}>/10</span>
                        </div>
                        <div style={{ fontSize: 14, color: "#8892A6", marginTop: 8 }}>
                          {parseFloat(overallScore.overall) >= 8 ? "Güçlü reklam — optimize etmeye devam et" : parseFloat(overallScore.overall) >= 6 ? "İyi temel — iyileştirme fırsatları var" : parseFloat(overallScore.overall) >= 4 ? "Orta düzey — önemli eksikler mevcut" : "Zayıf içerik — köklü revizyon gerekiyor"}
                        </div>
                      </div>

                      {/* Text score breakdown */}
                      <div className="adv-section" style={{ marginBottom: 14 }}>
                        <div className="adv-section-title">📝 Metin Analizi</div>
                        <BarRow label="Hook / Kanca" value={textResult.hook} color="#FFA502" />
                        <BarRow label="Değer Önerisi" value={textResult.value} color="#00D68F" />
                        <BarRow label="CTA Gücü" value={textResult.cta} color="#A29BFE" />
                        <BarRow label="Kitle Uyumu" value={textResult.relevance} color="#6C5CE7" />

                        <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
                          <Tag color={textResult.headlineLen <= 40 ? "#00D68F" : "#FF6B6B"}>{textResult.headlineLen} karakter başlık {textResult.headlineLen <= 40 ? "✓" : "— Uzun!"}</Tag>
                          {textResult.hasQuestion && <Tag color="#00D68F">Soru formatı ✓</Tag>}
                          {textResult.hasPowerW.length > 0 && <Tag color="#00D68F">Güç: {textResult.hasPowerW.slice(0, 2).join(", ")}</Tag>}
                          {textResult.hasCTAW.length > 0 ? <Tag color="#00D68F">CTA: {textResult.hasCTAW.slice(0, 2).join(", ")}</Tag> : <Tag color="#FF6B6B">CTA eksik!</Tag>}
                          {textResult.hasPercent && <Tag color="#00D68F">Yüzde/oran ✓</Tag>}
                          {textResult.hasEmotionW.length > 0 ? <Tag color="#00D68F">Duygu: {textResult.hasEmotionW.slice(0, 1).join(", ")}</Tag> : <Tag color="#FFA502">Duygusal tetikleyici yok</Tag>}
                        </div>
                      </div>

                      {/* Visual AI results */}
                      {visualResults.length > 0 && visualResults.map((vr, i) => (
                        <div key={i} className="adv-section" style={{ marginBottom: 14 }}>
                          <div className="adv-section-title">🖼️ Görsel AI Analizi — {vr.fileName}</div>

                          {vr.error ? (
                            <div className="adv-warn">{vr.error}</div>
                          ) : (
                            <div>
                              <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                                <img src={vr.url} alt="ad" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 12, border: "1px solid #2A3040", flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 200 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                    <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "monospace", color: vr.visualScore >= 7 ? "#00D68F" : vr.visualScore >= 5 ? "#FFA502" : "#FF6B6B" }}>{vr.visualScore}<span style={{ fontSize: 18, color: "#8892A6" }}>/10</span></div>
                                    <div style={{ fontSize: 13, color: "#8892A6" }}>Görsel Puan</div>
                                  </div>
                                  <div style={{ fontSize: 13, lineHeight: 1.65, color: "#E8ECF4" }}>{vr.firstImpression}</div>
                                </div>
                              </div>

                              <div className="adv-grid2" style={{ gap: 10, marginBottom: 12 }}>
                                <div style={{ background: "rgba(0,214,143,0.06)", border: "1px solid rgba(0,214,143,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: "#00D68F", marginBottom: 8 }}>✅ Güçlü Yönler</div>
                                  {(vr.strengths || []).map((s, j) => <div key={j} style={{ fontSize: 12, color: "#8892A6", marginBottom: 4, lineHeight: 1.5 }}>• {s}</div>)}
                                </div>
                                <div style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: "#FF6B6B", marginBottom: 8 }}>⚠️ Zayıf Yönler</div>
                                  {(vr.weaknesses || []).map((s, j) => <div key={j} style={{ fontSize: 12, color: "#8892A6", marginBottom: 4, lineHeight: 1.5 }}>• {s}</div>)}
                                </div>
                              </div>

                              {[
                                { label: "🎯 Hedef Kitle Uyumu", val: vr.audienceMatch },
                                { label: "📱 Platform Uygunluğu", val: vr.platformFit },
                                { label: "⚡ Hook Gücü (ilk 1-3sn)", val: vr.hookStrength },
                                { label: "🎨 Renk Psikolojisi", val: vr.colorPsychology },
                                { label: "📝 Yazı-Görsel Uyumu", val: vr.textVisualHarmony },
                                { label: "👆 CTA Görünürlüğü", val: vr.ctaVisibility },
                              ].filter(x => x.val).map((x, j) => (
                                <div key={j} style={{ background: "#1C2230", borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#A29BFE", marginBottom: 4, fontWeight: 600 }}>{x.label}</div>
                                  <div style={{ fontSize: 13, color: "#E8ECF4", lineHeight: 1.6 }}>{x.val}</div>
                                </div>
                              ))}

                              {vr.improvements && vr.improvements.length > 0 && (
                                <div style={{ background: "rgba(108,92,231,0.06)", border: "1px solid rgba(108,92,231,0.15)", borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: "#A29BFE", marginBottom: 8 }}>💡 İyileştirme Önerileri</div>
                                  {vr.improvements.map((s, j) => <div key={j} style={{ fontSize: 12, color: "#8892A6", marginBottom: 4, lineHeight: 1.5 }}>• {s}</div>)}
                                </div>
                              )}

                              {vr.abTestIdea && (
                                <div style={{ background: "#1C2230", borderRadius: 10, padding: "10px 14px" }}>
                                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#FFA502", marginBottom: 4, fontWeight: 600 }}>🔀 A/B Test Önerisi</div>
                                  <div style={{ fontSize: 13, color: "#E8ECF4", lineHeight: 1.6 }}>{vr.abTestIdea}</div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Tahmini performans */}
                      <div className="adv-section" style={{ marginBottom: 14 }}>
                        <div className="adv-section-title">📈 Tahmini Aylık Performans</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 10 }}>
                          {[
                            { l: "Aylık Bütçe", v: "₺" + budget.toLocaleString("tr-TR"), c: "#A29BFE" },
                            { l: "Tıklama",     v: overallScore.clicks, num: true, c: "#00D68F" },
                            { l: "Gösterim",    v: overallScore.impr,   num: true, c: "#FFA502" },
                            { l: "Dönüşüm",    v: overallScore.conv,   num: true, c: "#A29BFE" },
                            { l: "CPA",         v: "₺" + overallScore.cpa, c: "#FF6B6B" },
                            { l: "ROAS",        v: overallScore.roas + "x", c: "#00D68F" },
                          ].map((x, i) => (
                            <div key={i} className="adv-stat">
                              <div style={{ fontSize: 10, color: "#8892A6", marginBottom: 6, textTransform: "uppercase", letterSpacing: .7 }}>{x.l}</div>
                              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: x.c }}>
                                {x.num ? <AnimatedNum value={x.v} /> : x.v}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="adv-tip" style={{ marginTop: 12, fontSize: 12 }}>
                          💡 Dönüşüm tahmini içerik puanınıza ({overallScore.overall}/10) göre ayarlandı. İçerik kalitesi arttıkça conversion rate da artar.
                        </div>
                      </div>

                      {/* Platform fit */}
                      <div className="adv-section" style={{ marginBottom: 14 }}>
                        <div className="adv-section-title">📱 Platform Uyum Analizi</div>
                        {overallScore.platFit.map((p, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 0", borderBottom: i < overallScore.platFit.length - 1 ? "1px solid #2A3040" : "none" }}>
                            <div style={{ fontSize: 22, flexShrink: 0 }}>{p.icon}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                                <Tag color={p.fit === "Çok Uygun" ? "#00D68F" : p.fit === "Dikkatli Ol" ? "#FFA502" : "#8892A6"}>{p.fit}</Tag>
                              </div>
                              <div style={{ fontSize: 12, color: "#8892A6" }}>{p.reason}</div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <div style={{ fontSize: 11, color: "#8892A6" }}>CPC</div>
                              <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#A29BFE" }}>${p.cpc}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Metin sorunları */}
                      {textResult.issues.length > 0 && (
                        <div className="adv-section" style={{ marginBottom: 14 }}>
                          <div className="adv-section-title">⚠️ Tespit Edilen Sorunlar</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {textResult.issues.map((issue, i) => (
                              <div key={i} className={issue.sev === "error" ? "adv-bad" : issue.sev === "warn" ? "adv-warn" : "adv-tip"}>
                                {issue.sev === "error" ? "🔴" : issue.sev === "warn" ? "🟡" : "🔵"} {issue.text}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Metin önerileri */}
                      {textResult.recs.length > 0 && (
                        <div className="adv-section">
                          <div className="adv-section-title">💡 Aksiyon Önerileri</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {textResult.recs.map((rec, i) => (
                              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                <div style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(108,92,231,0.2)", color: "#A29BFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                                <div style={{ fontSize: 13, color: "#E8ECF4", lineHeight: 1.6 }}>{rec}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}


          {/* ══════════════ COMPETITOR ANALYSIS ══════════════ */}

          {activeTab === "strategy" && (
            <div>
              <h1 style={{fontSize:24,fontWeight:700,marginBottom:6}}>Strateji Danışmanı</h1>
              <p style={{color:"#8892A6",fontSize:14,marginBottom:20,lineHeight:1.6}}>
                {selectedModel === "gemini" ? "⚡ Gemini tek seferde stratejinizi ve reklam metinlerinizi oluşturuyor." : "🧠 Claude Sonnet analiz yapar, Sonnet metinleri yazar."}
              </p>
              <div className="adv-section" style={{marginBottom:14}}>
                <div className="adv-section-title">Isletme Bilgileri</div>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div className="adv-grid2">
                    <div>
                      <label className="adv-label">Sektorunuz / Hizmetiniz</label>
                      <input className="adv-input" value={stratSector} onChange={e=>setStratSector(e.target.value)} placeholder="Or: telefon kilifi, lazer epilasyon..."/>
                    </div>
                    <div>
                      <label className="adv-label">Urun adi</label>
                      <input className="adv-input" value={stratProduct} onChange={e=>setStratProduct(e.target.value)} placeholder="Or: iPhone premium kilif..."/>
                    </div>
                  </div>
                  <div className="adv-grid2">
                    <div>
                      <label className="adv-label">Marka adiniz</label>
                      <input className="adv-input" value={stratBrand} onChange={e=>setStratBrand(e.target.value)} placeholder="Or: BeCase, FitLife..."/>
                    </div>
                    <div>
                      <label className="adv-label">Rakipten farkiniz</label>
                      <input className="adv-input" value={stratUSP} onChange={e=>setStratUSP(e.target.value)} placeholder="Or: 2 yil garanti..."/>
                    </div>
                  </div>
                  <div>
                    <label className="adv-label">Hedef musterinin sorunu</label>
                    <input className="adv-input" value={stratProblem} onChange={e=>setStratProblem(e.target.value)} placeholder="Or: ucuz kilif aliyor bozuluyor..."/>
                  </div>
                  <div>
                    <label className="adv-label">Kampanya hedefi</label>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                      {[{id:"sales",l:"Satis"},{id:"leads",l:"Lead"},{id:"awareness",l:"Bilinirlik"},{id:"traffic",l:"Trafik"},{id:"engagement",l:"Etkilesim"}].map(g=>(
                        <button key={g.id} className={"adv-chip"+(stratGoal===g.id?" on":"")} onClick={()=>setStratGoal(g.id)}>{g.l}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="adv-label">Mevcut reklam metni (opsiyonel)</label>
                    <textarea className="adv-textarea" rows={3} value={stratAdText} onChange={e=>setStratAdText(e.target.value)} placeholder="Su an kullandiginiz metin varsa yazin..."/>
                  </div>
                  <button className="adv-btn" disabled={!stratSector||stratLoading} style={{alignSelf:"flex-start"}}
                    onClick={async()=>{
                      setStratLoading(true); setStratError(""); setStratResult(null);
                      try {
                        const r = await runStrategyAdvisor(stratSector,stratProduct,stratBrand,stratUSP,stratProblem,stratGoal,stratAdText,selectedModel);
                        setStratResult(r);
                      } catch(e) { setStratError(e.message||String(e)); }
                      setStratLoading(false);
                    }}>
                    {stratLoading ? (selectedModel === "gemini" ? "⚡ Gemini Analiz Ediyor..." : "🧠 Claude Analiz Ediyor...") : "Strateji Analizi Yap"}
                  </button>
                </div>
              </div>

              {stratLoading && (
                <div className="adv-section" style={{textAlign:"center",padding:"40px 24px"}}>
                  <div style={{fontSize:30,marginBottom:12}} className="adv-spin">*</div>
                  <div style={{fontSize:15,fontWeight:600,marginBottom:8}}>Analiz Yapılıyor</div>
                  {selectedModel === "gemini"
                    ? <div style={{fontSize:12,color:"#00D68F"}}>⚡ Gemini stratejinizi ve tüm reklam metinlerinizi tek seferde oluşturuyor...</div>
                    : <><div style={{fontSize:12,color:"#A29BFE",marginBottom:4}}>🧠 Adım 1: Claude stratejik özet yapıyor...</div>
                       <div style={{fontSize:12,color:"#00D68F"}}>🧠 Adım 2: Claude reklam metinleri yazıyor...</div></>
                       }
                  <div style={{fontSize:11,color:"#8892A6",marginTop:8}}>30-60 saniye sürebilir</div>
                </div>
              )}

              {stratError && (
                <div className="adv-bad" style={{marginBottom:14}}>
                  <div style={{fontWeight:600,marginBottom:4}}>Hata</div>
                  <div style={{fontSize:13}}>{stratError}</div>
                </div>
              )}

              {stratResult && !stratLoading && (
                <div className="adv-fade">
                  <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                    {selectedModel === "gemini"
                      ? <span style={{background:"rgba(26,115,232,0.15)",color:"#5BA3F5",padding:"3px 12px",borderRadius:20,fontSize:11,fontWeight:600}}>⚡ Gemini 2.5 Flash</span>
                      : <><span style={{background:"rgba(162,155,254,0.15)",color:"#A29BFE",padding:"3px 12px",borderRadius:20,fontSize:11,fontWeight:600}}>🧠 Claude Sonnet</span>
                         <span style={{background:"rgba(0,214,143,0.12)",color:"#00D68F",padding:"3px 12px",borderRadius:20,fontSize:11,fontWeight:600}}>🧠 Claude Sonnet</span></>
                         }
                    <span style={{background:"rgba(255,165,2,0.12)",color:"#FFA502",padding:"3px 12px",borderRadius:20,fontSize:11,fontWeight:600}}>Maliyet yaklasik %85 dusuk</span>
                  </div>

                  {stratResult.manifesto && (
                    <div style={{background:"rgba(108,92,231,0.08)",border:"1.5px solid rgba(108,92,231,0.3)",borderRadius:16,padding:"20px 24px",marginBottom:14,textAlign:"center"}}>
                      <div style={{fontSize:11,color:"#A29BFE",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:8}}>Marka Manifestosu</div>
                      <div style={{fontSize:19,fontWeight:700,color:"#E8ECF4",lineHeight:1.5}}>{stratResult.manifesto}</div>
                    </div>
                  )}

                  {stratResult.competitorAnalysis && (
                    <div className="adv-section" style={{marginBottom:14}}>
                      <div className="adv-section-title">Rakip Ekosistemi Analizi</div>
                      <div style={{display:"flex",flexDirection:"column",gap:10}}>
                        {stratResult.competitorAnalysis.commonStrategy && (
                          <div style={{background:"#1C2230",borderRadius:10,padding:"12px 16px"}}>
                            <div style={{fontSize:11,color:"#A29BFE",fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Ortak Strateji</div>
                            <div style={{fontSize:13,color:"#E8ECF4",lineHeight:1.7}}>{stratResult.competitorAnalysis.commonStrategy}</div>
                          </div>
                        )}
                        {stratResult.competitorAnalysis.traps && (
                          <div style={{background:"rgba(255,107,107,0.07)",border:"1px solid rgba(255,107,107,0.2)",borderRadius:10,padding:"12px 16px"}}>
                            <div style={{fontSize:11,color:"#FF6B6B",fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Rakiplerin Dusugu Tuzaklar</div>
                            <div style={{fontSize:13,color:"#E8ECF4",lineHeight:1.7}}>{stratResult.competitorAnalysis.traps}</div>
                          </div>
                        )}
                        {stratResult.competitorAnalysis.psychology && (
                          <div style={{background:"rgba(0,214,143,0.07)",border:"1px solid rgba(0,214,143,0.2)",borderRadius:10,padding:"12px 16px"}}>
                            <div style={{fontSize:11,color:"#00D68F",fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Hedef Kitle Psikolojisi</div>
                            <div style={{fontSize:13,color:"#E8ECF4",lineHeight:1.7}}>{stratResult.competitorAnalysis.psychology}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(stratResult.strategies||[]).length > 0 && (
                    <div className="adv-section" style={{marginBottom:14}}>
                      <div className="adv-section-title">3 Strateji Onerisi</div>
                      <div style={{display:"flex",flexDirection:"column",gap:12}}>
                        {stratResult.strategies.map((s,si)=>{
                          const clr=["#A29BFE","#00D68F","#FFA502"][si]||"#A29BFE";
                          const sbg=["rgba(108,92,231,0.15)","rgba(0,214,143,0.15)","rgba(255,165,2,0.15)"][si]||"rgba(108,92,231,0.15)";
                          const sbr=["rgba(108,92,231,0.4)","rgba(0,214,143,0.4)","rgba(255,165,2,0.4)"][si]||"rgba(108,92,231,0.4)";
                          return (
                            <div key={si} style={{border:"1px solid "+sbr,borderRadius:14,overflow:"hidden"}}>
                              <div style={{background:sbg,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
                                <span style={{fontWeight:700,fontSize:14,color:clr}}>Strateji {s.id}</span>
                                <span style={{fontWeight:600,fontSize:13,color:"#E8ECF4"}}>{s.name}</span>
                              </div>
                              <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
                                <div style={{background:"#1C2230",borderRadius:10,padding:"12px 14px"}}>
                                  <div style={{fontSize:10,color:clr,fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Hook</div>
                                  <div style={{fontSize:14,fontWeight:600,color:"#E8ECF4"}}>{s.hook}</div>
                                  <div style={{fontSize:10,color:"#8892A6",marginTop:2}}>{(s.hook||"").length}/40</div>
                                </div>
                                <div style={{background:"#1C2230",borderRadius:10,padding:"12px 14px"}}>
                                  <div style={{fontSize:10,color:clr,fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Ana Metin</div>
                                  <div style={{fontSize:13,color:"#E8ECF4",lineHeight:1.65}}>{s.body}</div>
                                  <div style={{fontSize:10,color:"#8892A6",marginTop:2}}>{(s.body||"").length}/125</div>
                                </div>
                                <div style={{display:"flex",alignItems:"center",gap:8}}>
                                  <span style={{fontSize:11,color:"#8892A6"}}>CTA:</span>
                                  <span style={{background:sbg,color:clr,padding:"4px 14px",borderRadius:20,fontSize:13,fontWeight:600}}>{s.cta}</span>
                                </div>
                                {s.rationale && <div style={{fontSize:12,color:"#8892A6",lineHeight:1.6,borderTop:"1px solid #2A3040",paddingTop:10}}>{s.rationale}</div>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {(stratResult.visualScenarios||[]).length > 0 && (
                    <div className="adv-section" style={{marginBottom:14}}>
                      <div className="adv-section-title">Görsel Senaryolar</div>
                      <div className="adv-grid2">
                        {stratResult.visualScenarios.map((v,vi)=>(
                          <div key={vi} style={{background:"#1C2230",borderRadius:12,padding:"16px"}}>
                            <div style={{fontSize:12,fontWeight:600,color:vi===0?"#A29BFE":"#00D68F",marginBottom:10}}>{v.title}</div>
                            {[["Format",v.format],["Arka Plan",v.background],["Konu",v.subject],["Tipografi",v.typography],["Fark",v.difference],["Boyut",v.dimensions]].map(function(pair,pi){ return pair[1]&&(
                              <div key={pi} style={{marginBottom:6}}>
                                <div style={{fontSize:10,color:"#8892A6",fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>{pair[0]}</div>
                                <div style={{fontSize:12,color:"#E8ECF4",lineHeight:1.5}}>{pair[1]}</div>
                              </div>
                            ); })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(stratResult.mediaPlan||[]).length > 0 && (
                    <div className="adv-section" style={{marginBottom:14}}>
                      <div className="adv-section-title">Medya Plani</div>
                      <div style={{overflowX:"auto"}}>
                        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:560}}>
                          <thead>
                            <tr style={{borderBottom:"1px solid #2A3040"}}>
                              {["Set","Amac","Yas","Cinsiyet","Ilgi","Yer","Butce","Format","Sure"].map(h=>(
                                <th key={h} style={{textAlign:"left",padding:"7px 8px",color:"#8892A6",fontWeight:600,fontSize:10,textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {stratResult.mediaPlan.map((r,ri)=>(
                              <tr key={ri} style={{borderBottom:"1px solid #2A3040",background:ri%2===0?"transparent":"rgba(255,255,255,0.02)"}}>
                                <td style={{padding:"8px",fontWeight:600,color:"#E8ECF4",whiteSpace:"nowrap"}}>{r.set}</td>
                                <td style={{padding:"8px",color:"#8892A6"}}>{r.goal}</td>
                                <td style={{padding:"8px",color:"#8892A6",whiteSpace:"nowrap"}}>{r.age}</td>
                                <td style={{padding:"8px",color:"#8892A6"}}>{r.gender}</td>
                                <td style={{padding:"8px",color:"#8892A6"}}>{r.interests}</td>
                                <td style={{padding:"8px",color:"#8892A6"}}>{r.placement}</td>
                                <td style={{padding:"8px",color:"#FFA502",fontWeight:600,whiteSpace:"nowrap"}}>{r.budget}</td>
                                <td style={{padding:"8px",color:"#8892A6"}}>{r.format}</td>
                                <td style={{padding:"8px",color:"#8892A6",whiteSpace:"nowrap"}}>{r.duration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {(stratResult.kpis||[]).length > 0 && (
                    <div className="adv-section" style={{marginBottom:14}}>
                      <div className="adv-section-title">KPI Tablosu</div>
                      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                        <thead>
                          <tr style={{borderBottom:"1px solid #2A3040"}}>
                            {["Metrik","Hedef","Neden Onemli"].map(h=>(
                              <th key={h} style={{textAlign:"left",padding:"8px 12px",color:"#8892A6",fontWeight:600,fontSize:11,textTransform:"uppercase"}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {stratResult.kpis.map((k,ki)=>(
                            <tr key={ki} style={{borderBottom:"1px solid #2A3040"}}>
                              <td style={{padding:"10px 12px",fontWeight:600,color:"#E8ECF4"}}>{k.metric}</td>
                              <td style={{padding:"10px 12px",color:"#00D68F",fontWeight:600}}>{k.target}</td>
                              <td style={{padding:"10px 12px",color:"#8892A6",lineHeight:1.5}}>{k.why}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {(stratResult.finalAds||[]).length > 0 && (
                    <div className="adv-section" style={{borderColor:"rgba(108,92,231,0.4)",background:"rgba(108,92,231,0.03)"}}>
                      <div className="adv-section-title">Ads Manager — Kopyalanabilir Metinler</div>
                      <div style={{display:"flex",flexDirection:"column",gap:12}}>
                        {stratResult.finalAds.map((ad,ai)=>{
                          const clr=["#A29BFE","#00D68F","#FFA502"][ai]||"#A29BFE";
                          const abg=["rgba(108,92,231,0.15)","rgba(0,214,143,0.15)","rgba(255,165,2,0.15)"][ai]||"rgba(108,92,231,0.15)";
                          return (
                            <div key={ai} style={{background:"#1C2230",borderRadius:12,padding:"16px",border:"1px solid #2A3040"}}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                                <span style={{fontSize:12,fontWeight:700,color:clr}}>Strateji {ad.strategyId}</span>
                                <button className="adv-copy-btn" onClick={()=>{ try{ navigator.clipboard.writeText("BASLIK: "+(ad.headline||"")+"\n\nMETIN: "+(ad.primaryText||"")+"\n\nCTA: "+(ad.cta||"")); }catch(ce){} }}>Kopyala</button>
                              </div>
                              <div style={{marginBottom:8}}>
                                <div style={{fontSize:10,color:clr,fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Baslik</div>
                                <div style={{fontSize:14,fontWeight:600,color:"#E8ECF4",padding:"8px 12px",background:"#141820",borderRadius:8}}>{ad.headline}</div>
                                <div style={{fontSize:10,color:"#8892A6",marginTop:2}}>{(ad.headline||"").length}/40</div>
                              </div>
                              <div style={{marginBottom:8}}>
                                <div style={{fontSize:10,color:clr,fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Ana Metin</div>
                                <div style={{fontSize:13,color:"#E8ECF4",padding:"10px 12px",background:"#141820",borderRadius:8,lineHeight:1.65}}>{ad.primaryText}</div>
                                <div style={{fontSize:10,color:"#8892A6",marginTop:2}}>{(ad.primaryText||"").length}/125</div>
                              </div>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <span style={{fontSize:11,color:"#8892A6"}}>CTA:</span>
                                <span style={{background:abg,color:clr,padding:"5px 16px",borderRadius:20,fontSize:13,fontWeight:600}}>{ad.cta}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}


          {/* ══════════════ VARIATIONS ══════════════ */}

          {/* ══════════════ VIRAL ══════════════ */}
          {activeTab === "viral" && (
            <div style={{maxWidth:860,margin:"0 auto"}}>
              <h1 style={{fontSize:26,fontWeight:700,color:"#E8ECF4",marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
                <span>🔥</span> Viral Senaryolar
              </h1>
              <p style={{color:"#8892A6",fontSize:14,marginBottom:24,lineHeight:1.6}}>
                Ürününüz için TikTok ve Reels'de viral potansiyeli yüksek, ilk 3 saniyesi kanca barındıran video senaryoları üretin.
              </p>

              {/* Form */}
              <div style={{background:"#141820",border:"1px solid #2A3040",borderRadius:20,padding:"24px 28px",marginBottom:20}}>
                <div style={{fontSize:12,fontWeight:700,color:"#FF6B6B",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:20}}>
                  🎬 Senaryo Bilgileri
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>

                  <div>
                    <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>
                      Ürün / Kampanya Fikri <span style={{color:"#FF6B6B"}}>*</span>
                    </label>
                    <textarea className="adv-textarea" rows={3} value={viralProd} onChange={e=>setViralProd(e.target.value)}
                      placeholder="Ör: UV baskılı telefon kılıfı — her telefona özel tasarım, dayanıklı malzeme, 48 saat teslimat..."
                      style={{fontSize:14,resize:"vertical"}}/>
                  </div>

                  <div className="adv-grid2">
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>
                        Hedef Kitle <span style={{color:"#8892A6",fontWeight:400,textTransform:"none",letterSpacing:0}}>(opsiyonel)</span>
                      </label>
                      <input className="adv-input" value={viralAud} onChange={e=>setViralAud(e.target.value)}
                        placeholder="Ör: 18-28 kadın, iPhone kullanıcısı, estetik seven..."/>
                    </div>
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>
                        Videonun Tonu
                      </label>
                      <select className="adv-select" value={viralTone} onChange={e=>setViralTone(e.target.value)}>
                        <option value="Eglenceli & Mizahi">😂 Eğlenceli & Mizahi</option>
                        <option value="Estetik & ASMR">✨ Estetik & ASMR</option>
                        <option value="Dogrudan Satis">🎯 Doğrudan Satış (Hard Sell)</option>
                        <option value="Hikaye Anlatimi">📖 Hikaye Anlatımı (Storytelling)</option>
                        <option value="Kutu Acilimi UGC">📦 Kutu Açılımı (UGC)</option>
                      </select>
                    </div>
                  </div>

                  <button className="adv-btn" disabled={!viralProd||viralLoading}
                    style={{alignSelf:"flex-start",display:"flex",alignItems:"center",gap:8}}
                    onClick={async()=>{
                      setViralLoading(true); setViralError(""); setViralRes(null);
                      try {
                        const sys = [
                          "Sen TikTok ve Instagram Reels için viral video senaryoları yazan uzman bir içerik stratejistisin.",
                          "Ton: " + viralTone + ".",
                          "KURALLAR:",
                          "1. Her senaryonun İLK 3 SANİYESİ aşırı dikkat çekici bir HOOK içermeli (soru, şok, merak, cesur iddia).",
                          "2. Senaryo ton olarak '" + viralTone + "' stiline tam uymalı.",
                          "3. Her senaryo 150-400 kelime arasında, eksiksiz tamamlanmış olmalı.",
                          "4. Senaryolar genel değil, tamamen kullanıcının girdiği ÜRÜNE özel olmalı.",
                          "5. Her senaryo için: Format (ör: POV, Before/After, Tutorial), Hook (ilk cümle), Senaryo Akışı ve CTA yaz.",
                          "6. Cümleleri asla yarıda kesme. Tüm 5 senaryoyu eksiksiz tamamla.",
                        ].join(" ");

                        const msg = [
                          "ÜRÜN / KAMPANYA: " + viralProd,
                          viralAud ? "HEDEF KİTLE: " + viralAud : "",
                          "VİDEO TONU: " + viralTone,
                          "",
                          "Bu ürün için TikTok/Reels'de viral olacak 5 farklı video senaryosu yaz.",
                          "Her senaryo şu yapıda olsun:",
                          "## Senaryo [N]: [Format Adı]",
                          "🪝 HOOK (İlk 3 Saniye): [Kaydırmayı durduran çarpıcı açılış cümlesi]",
                          "🎬 SENARYO AKIŞI: [Sahne sahne video senaryosu — en az 5-7 adım]",
                          "📢 CTA: [Harekete geçirici kapanış]",
                          "⏱️ Tahmini Süre: [15sn / 30sn / 60sn]",
                          "📊 Viral Potansiyel: [Neden viral olur?]",
                        ].filter(Boolean).join(" ");

                        const resp = await fetch("/api/claude", {
                          method: "POST",
                          headers: {"Content-Type":"application/json"},
                          body: JSON.stringify({
                            model: selectedModel,
                            claudeModel: "claude-sonnet-4-20250514",
                            max_tokens: 6000,
                            system: sys,
                            messages: [{role:"user",content:msg}]
                          })
                        });
                        const data = await resp.json();
                        if (data.error) throw new Error(data.error.message || "API hatası");
                        if (data.usage && typeof window.__trackUsage === "function") window.__trackUsage("Viral Senaryolar", data.usage, selectedModel);
                        const txt = (data.content||[]).map(c=>c.text||"").join("").trim();
                        if (!txt) throw new Error("Boş yanıt");
                        // Parse into array of scenarios
                        var parts2 = txt.split("## Senaryo").filter(function(s){return s.trim();});
                        var parsed = parts2.filter(function(s){return s.trim();}).map(function(p,i){
                          function extractLine(text, kw) {
                            var ll = text.split("\n");
                            for (var li=0; li<ll.length; li++) {
                              if (ll[li].toLowerCase().indexOf(kw.toLowerCase()) !== -1 && ll[li].indexOf(":") !== -1)
                                return ll[li].slice(ll[li].indexOf(":")+1).trim();
                            } return "";
                          }
                          var titleM = (p+" ").split("\n")[0].replace(/^## Senaryo [\d]+[:\s]+/, "").trim();
                          return {
                            id: i+1,
                            format: (titleM || ("Senaryo " + (i+1))),
                            hook: extractLine(p, "HOOK"),
                            fullText: p.trim(),
                            cta: extractLine(p, "CTA"),
                            duration: extractLine(p, "Süre") || "30sn",
                            viralScore: (7 + Math.floor(Math.random()*3)) + "/10",
                            bestTime: ["09:00-11:00","12:00-14:00","18:00-21:00","20:00-23:00"][Math.floor(Math.random()*4)]
                          };
                        });
                        setViralRes(parsed.length > 0 ? parsed : [{id:1,format:"Tam Senaryo",fullText:txt,hook:"",cta:"",duration:"30sn",viralScore:"8/10",bestTime:"18:00-21:00"}]);
                      } catch(e){ setViralError(e.message||String(e)); }
                      setViralLoading(false);
                    }}>
                    {viralLoading ? (selectedModel==="gemini"?"⚡ Gemini Senaryo Yazıyor...":"🧠 Claude Senaryo Yazıyor...") : "5 Viral Senaryo Üret 🔥"}
                  </button>
                </div>
              </div>

              {/* Loading */}
              {viralLoading && (
                <div style={{background:"#141820",border:"1px solid #2A3040",borderRadius:16,padding:"32px 24px",textAlign:"center"}}>
                  <div style={{fontSize:36,marginBottom:12}} className="adv-spin">🔥</div>
                  <div style={{fontWeight:700,fontSize:15,color:"#E8ECF4",marginBottom:6}}>Viral senaryolar yazılıyor...</div>
                  <div style={{fontSize:13,color:"#FF6B6B",marginBottom:3}}>İlk 3 saniye hook'ları hazırlanıyor...</div>
                  <div style={{fontSize:13,color:"#8892A6"}}>Sahne sahne senaryo akışları oluşturuluyor...</div>
                  <div style={{fontSize:11,color:"#6C5CE7",marginTop:8}}>20-40 saniye sürebilir</div>
                </div>
              )}

              {/* Error */}
              {viralError && (
                <div className="adv-bad" style={{marginBottom:16}}>
                  <div style={{fontWeight:600,marginBottom:4}}>Hata</div>
                  <div style={{fontSize:13}}>{viralError}</div>
                </div>
              )}

              {/* Results */}
              {viralRes && !viralLoading && (
                <div className="adv-fade">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#00D68F"}}>🔥 {viralRes.length} senaryo hazır — Ton: {viralTone}</div>
                    <button className="adv-btn-ghost" style={{fontSize:12,padding:"7px 14px"}}
                      onClick={()=>{setViralRes(null);setViralProd("");setViralAud("");setViralTone("Dogrudan Satis");}}>
                      Yeni Senaryo
                    </button>
                  </div>
                  {viralRes.map((s,i)=>(
                    <div key={i} style={{background:"#141820",border:"1.5px solid "+["#6C5CE7","#FF6B6B","#00D68F","#FFA502","#A29BFE"][i%5],borderRadius:16,overflow:"hidden",marginBottom:16}}>
                      <div style={{background:["rgba(108,92,231,0.12)","rgba(255,107,107,0.10)","rgba(0,214,143,0.10)","rgba(255,165,2,0.10)","rgba(162,155,254,0.10)"][i%5],padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                        <div style={{fontWeight:700,fontSize:15,color:"#E8ECF4"}}>#{s.id} {s.format}</div>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                          <Tag color="#00D68F">Viral: {s.viralScore}</Tag>
                          <Tag color="#FFA502">⏱️ {s.duration}</Tag>
                          <Tag color="#8892A6">🕐 {s.bestTime}</Tag>
                        </div>
                      </div>
                      <div style={{padding:"18px 20px"}}>
                        {s.hook && (
                          <div style={{marginBottom:14,padding:"12px 16px",background:"rgba(255,107,107,0.06)",borderRadius:10,border:"1px solid rgba(255,107,107,0.2)"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#FF6B6B",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5}}>🪝 İlk 3 Saniye Hook</div>
                            <div style={{fontSize:15,fontWeight:700,color:"#E8ECF4",lineHeight:1.5}}>{s.hook}</div>
                          </div>
                        )}
                        <div style={{fontSize:13,color:"#C8D0E0",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{s.fullText}</div>
                        {s.cta && (
                          <div style={{marginTop:14,padding:"10px 14px",background:"rgba(0,214,143,0.06)",borderRadius:8,border:"1px solid rgba(0,214,143,0.2)"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#00D68F",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>📢 CTA</div>
                            <div style={{fontSize:13,fontWeight:600,color:"#E8ECF4"}}>{s.cta}</div>
                          </div>
                        )}
                        <button className="adv-btn-ghost" style={{marginTop:14,fontSize:12,padding:"6px 14px"}}
                          onClick={()=>{try{navigator.clipboard.writeText(s.fullText);}catch(e){}}}>
                          Senaryoyu Kopyala
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ HOOKS ══════════════ */}
          {activeTab === "hooks" && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>🪝 Hook Üretici</h1>
              <p style={{ color: "#8892A6", fontSize: 14, marginBottom: 24 }}>Videonun ilk 3 saniyesinde kullanılacak 10 çarpıcı giriş cümlesi.</p>
              {!industry && <div className="adv-warn" style={{ marginBottom: 16 }}>Sol menüden sektör seçin.</div>}
              <button className="adv-btn" disabled={!industry} onClick={() => setHooksRes(generateHooks(industry, painPoints))} style={{ marginBottom: 20 }}>10 Hook Üret 🪝</button>
              {hooksRes && (
                <div className="adv-fade" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {hooksRes.map((h, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "#141820", border: "1px solid #2A3040", borderRadius: 12, padding: "14px 18px" }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(108,92,231,0.12)", color: "#A29BFE", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, fontFamily: "monospace", flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</div>
                      <div style={{ flex: 1, fontSize: 14, lineHeight: 1.5 }}>{h}</div>
                      <button className="adv-copy-btn" onClick={() => copyText(h)}>Kopyala</button>
                    </div>
                  ))}
                  <button className="adv-btn-ghost" onClick={() => setHooksRes(generateHooks(industry, painPoints))} style={{ alignSelf: "center", marginTop: 8 }}>🔄 Yeniden Üret</button>
                </div>
              )}
            </div>
          )}

          {/* ══════════════ BRIEF ══════════════ */}

                    {activeTab === "report" && (
            <div>
              <h1 style={{fontSize:24,fontWeight:700,marginBottom:6}}>Görsel Reklam Analizi</h1>
              <p style={{color:"#8892A6",fontSize:14,marginBottom:20,lineHeight:1.6}}>
                Facebook Ad Library ekran görüntüsünü yükleyin. {selectedModel === "gemini" ? "⚡ Gemini" : "🧠 Claude"} görsel olarak analiz eder, profesyonel raporu Markdown olarak render eder.
              </p>

              {/* System Prompt */}
              <div className="adv-section" style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div className="adv-section-title" style={{marginBottom:0}}>Sistem Promptu</div>
                  <button className="adv-btn-ghost" style={{fontSize:11,padding:"6px 12px"}}
                    onClick={()=>setRepSysPrompt(REP_DEFAULT_SYS)}>
                    Varsayılanı Yükle
                  </button>
                </div>
                <textarea className="adv-textarea" rows={5} value={repSysPrompt}
                  onChange={e=>setRepSysPrompt(e.target.value)}
                  style={{fontFamily:"monospace",fontSize:12}}
                  placeholder="Sistem promptunu yazin veya 'Varsayılanı Yükle' butonuna basin..."/>
              </div>

              {/* Image Upload */}
              <div className="adv-section" style={{marginBottom:14}}>
                <div className="adv-section-title">Reklam Görseli (Zorunlu)</div>
                <div className="adv-upload-zone"
                  onClick={()=>document.getElementById("rep-img-input").click()}
                  onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add("drag");}}
                  onDragLeave={e=>e.currentTarget.classList.remove("drag")}
                  onDrop={e=>{
                    e.preventDefault(); e.currentTarget.classList.remove("drag");
                    const file=e.dataTransfer.files[0];
                    if(file&&file.type.startsWith("image/")){
                      const r=new FileReader();
                      r.onload=ev=>{setRepImgData(ev.target.result);setRepImgType(file.type);};
                      r.readAsDataURL(file);
                    }
                  }}>
                  <input id="rep-img-input" type="file" accept="image/*" onChange={e=>{
                    const file=e.target.files[0];
                    if(file){
                      const r=new FileReader();
                      r.onload=ev=>{setRepImgData(ev.target.result);setRepImgType(file.type);};
                      r.readAsDataURL(file);
                    }
                  }}/>
                  {repImgData ? (
                    <div>
                      <img src={repImgData} alt="yuklu gorsel"
                        style={{maxWidth:"100%",maxHeight:320,borderRadius:10,marginBottom:10,display:"block",margin:"0 auto 10px"}}/>
                      <div style={{fontSize:12,color:"#00D68F",textAlign:"center"}}>Görsel yüklü — degistirmek icin tiklayin</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{fontSize:32,marginBottom:10}}>📸</div>
                      <div style={{fontSize:14,fontWeight:600,color:"#E8ECF4",marginBottom:4}}>Ekran goruntusunu buraya suruklleyin</div>
                      <div style={{fontSize:12,color:"#8892A6"}}>veya tiklayin — PNG, JPG, WEBP desteklenir</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional text */}
              <div className="adv-section" style={{marginBottom:14}}>
                <div className="adv-section-title">Ek Bilgi / Aciklama (Opsiyonel)</div>
                <textarea className="adv-textarea" rows={4} value={repUserInput}
                  onChange={e=>setRepUserInput(e.target.value)}
                  placeholder="Gorsel yeterli — ek aciklama opsiyonel. Ornek: Bu Deercase markasininin aktif reklamidir, benim markam Casiva..."/>
              </div>

              <button className="adv-btn" disabled={!repImgData||!repSysPrompt||repLoading} onMouseEnter={()=>setPendingOp({label:"Rapor Üretici",cost:estimateCost("Rapor Üretici",true)})}
                onClick={async()=>{
                  setRepLoading(true); setRepError(""); setRepResult("");
                  try {
                    const b64 = repImgData.split(",")[1];
                    const mediaType = repImgType || "image/jpeg";
                    const userContent = [
                      { type: "image", source: { type: "base64", media_type: mediaType, data: b64 } }
                    ];
                    if (repUserInput.trim()) {
                      userContent.push({ type: "text", text: repUserInput });
                    } else {
                      userContent.push({ type: "text", text: "Bu reklam gorseli icin tam sablona gore profesyonel analiz raporu olustur." });
                    }
                    const resp = await fetch("/api/claude", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        max_tokens: 4000,
                        system: repSysPrompt,
                        messages: [{ role: "user", content: userContent }],
                        model: selectedModel
                      })
                    });
                    const data = await resp.json();
                    if (data.error) throw new Error(data.error.message || "API hatasi");
                    const md = (data.content||[]).map(function(c){return c.text||"";}).join("").trim();
                    if (!md) throw new Error("Boş yanıt alindi");
                    setRepResult(md);
                    if (data.usage && typeof window.__trackUsage === "function") window.__trackUsage("Rapor Üretici", data.usage, selectedModel);
                  } catch(e) { setRepError(e.message||String(e)); }
                  setRepLoading(false);
                }}
                style={{marginBottom:16,alignSelf:"flex-start"}}>
                {repLoading ? selectedModel === "gemini" ? "⚡ Gemini Analiz Ediyor..." : "🧠 Claude Analiz Ediyor..." : "Gorseli Analiz Et ve Rapor Oluştur"}
              </button>

              {repLoading && (
                <div className="adv-section" style={{textAlign:"center",padding:"40px 24px",marginBottom:14}}>
                  <div style={{fontSize:32,marginBottom:12}} className="adv-spin">*</div>
                  <div style={{fontSize:15,fontWeight:600,marginBottom:6}}>{selectedModel==="gemini"?"⚡ Gemini Analiz Ediyor":"🧠 Claude Analiz Ediyor"}</div>
                  <div style={{fontSize:13,color:"#8892A6"}}>Reklam anatomisi, psikoloji, strateji ve medya planı hazırlanıyor...</div>
                  <div style={{fontSize:11,color:"#6C5CE7",marginTop:8}}>Kapsamli rapor 30-60 saniye sürebilir</div>
                </div>
              )}

              {repError && (
                <div className="adv-bad" style={{marginBottom:14}}>
                  <div style={{fontWeight:600,marginBottom:4}}>Hata</div>
                  <div style={{fontSize:13}}>{repError}</div>
                </div>
              )}

              {repResult && !repLoading && (
                <div className="adv-fade">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#00D68F"}}>Rapor hazır</div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="adv-btn-ghost" style={{fontSize:12,padding:"7px 14px"}}
                        onClick={()=>{ try{navigator.clipboard.writeText(repResult);}catch(ce){} }}>
                        Markdown Kopyala
                      </button>
                      <button className="adv-btn-ghost" style={{fontSize:12,padding:"7px 14px"}}
                        onClick={()=>{
                          const pw=window.open("","_blank");
                          const st=document.getElementById("md-styles");
                          pw.document.write("<html><head><title>AdVisorAI Raporu</title><style>body{background:#0B0E14;color:#E8ECF4;font-family:system-ui;padding:32px;max-width:900px;margin:0 auto}@media print{body{background:white;color:#111}}"+(st?st.textContent:"")+"</style></head><body><div class='md-report'>"+document.querySelector("#rep-report-content").innerHTML+"</div></body></html>");
                          pw.document.close();
                          setTimeout(function(){pw.print();},500);
                        }}>
                        PDF İndir
                      </button>
                      <button className="adv-btn-ghost" style={{fontSize:12,padding:"7px 14px"}}
                        onClick={()=>{setRepResult("");setRepImgData("");setRepUserInput("");}}>
                        Yeni Analiz
                      </button>
                    </div>
                  </div>

                  <div className="adv-section" style={{padding:0,overflow:"hidden"}}>
                    <div style={{background:"#0F1318",borderBottom:"1px solid #2A3040",padding:"8px 16px",display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:"#FF6B6B"}}></div>
                      <div style={{width:10,height:10,borderRadius:"50%",background:"#FFA502"}}></div>
                      <div style={{width:10,height:10,borderRadius:"50%",background:"#00D68F"}}></div>
                      <span style={{fontSize:11,color:"#8892A6",marginLeft:8}}>Görsel Reklam Analiz Raporu</span>
                    </div>
                    <div id="rep-report-content" style={{padding:"24px 28px"}} dangerouslySetInnerHTML={{__html: renderMd(repResult)}} />
                  </div>
                </div>
              )}
            </div>
          )}


          {activeTab === "audit" && (
            <div>
              <h1 style={{fontSize:24,fontWeight:700,marginBottom:6}}>Reklam Denetçisi</h1>
              <p style={{color:"#8892A6",fontSize:14,marginBottom:20,lineHeight:1.6}}>
                Taslak kampanya verilerinizi girin. Claude stratejik aciklari tespit eder ve 3 hazir alternatif metin yazar.
              </p>

              <div className="adv-section" style={{marginBottom:14}}>
                <div className="adv-section-title">Kampanya Bilgileri</div>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>

                  <div className="adv-grid2">
                    <div>
                      <label className="adv-label">Urun / Hizmet</label>
                      <input className="adv-input" value={auditProduct} onChange={e=>setAuditProduct(e.target.value)}
                        placeholder="Or: iPhone 15 Pro kilifi, lazer epilasyon paketi..."/>
                    </div>
                    <div>
                      <label className="adv-label">Fiyat / Teklif</label>
                      <input className="adv-input" value={auditPrice} onChange={e=>setAuditPrice(e.target.value)}
                        placeholder="Or: 299 TL, 3 Al 2 Ode, %30 indirim..."/>
                    </div>
                  </div>

                  <div className="adv-grid2">
                    <div>
                      <label className="adv-label">Hedef Kitle</label>
                      <input className="adv-input" value={auditAudience} onChange={e=>setAuditAudience(e.target.value)}
                        placeholder="Or: 20-35 kadin, iPhone kullanicilari, Ankara..."/>
                    </div>
                    <div>
                      <label className="adv-label">Gunluk Butce</label>
                      <input className="adv-input" value={auditBudget} onChange={e=>setAuditBudget(e.target.value)}
                        placeholder="Or: 200 TL, 500 TL..."/>
                    </div>
                  </div>

                  <div>
                    <label className="adv-label">Kampanya Hedefi</label>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                      {[{id:"sales",l:"Satis"},{id:"leads",l:"Lead"},{id:"awareness",l:"Bilinirlik"},{id:"traffic",l:"Trafik"},{id:"engagement",l:"Etkilesim"}].map(g=>(
                        <button key={g.id} className={"adv-chip"+(auditGoal===g.id?" on":"")} onClick={()=>setAuditGoal(g.id)}>{g.l}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="adv-label">Mevcut Reklam Metniniz (Analiz edilecek taslak)</label>
                    <textarea className="adv-textarea" rows={5} value={auditAdText}
                      onChange={e=>setAuditAdText(e.target.value)}
                      placeholder="Simdi kullandiginiz veya kullanmay planladiginiz reklam metnini yapistirin. Claude teshis edip yenisini yazacak..."/>
                  </div>

                  {/* Multi-image + transcript */}
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <label className="adv-label" style={{marginBottom:0}}>Gorsel / Video Karesi (Opsiyonel)</label>
                      <div style={{display:"flex",gap:6}}>
                        <span style={{fontSize:11,color:"#8892A6"}}>Tek görsel = statik reklam</span>
                        <span style={{fontSize:11,color:"#A29BFE",fontWeight:600}}>Çoklu görsel = video analizi</span>
                      </div>
                    </div>
                    <div className="adv-upload-zone" style={{padding:"16px 20px"}}
                      onClick={()=>document.getElementById("audit-img-input").click()}
                      onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add("drag");}}
                      onDragLeave={e=>e.currentTarget.classList.remove("drag")}
                      onDrop={e=>{
                        e.preventDefault(); e.currentTarget.classList.remove("drag");
                        const files=Array.from(e.dataTransfer.files).filter(f=>f.type.startsWith("image/"));
                        if(!files.length) return;
                        const readers = files.map(f=>new Promise(res=>{const r=new FileReader();r.onload=ev=>res({data:ev.target.result.split(",")[1],type:f.type,url:ev.target.result,name:f.name});r.readAsDataURL(f);}));
                        Promise.all(readers).then(imgs=>setAuditImages(prev=>[...prev,...imgs]));
                      }}>
                      <input id="audit-img-input" type="file" accept="image/*" multiple onChange={e=>{
                        const files=Array.from(e.target.files);
                        const readers=files.map(f=>new Promise(res=>{const r=new FileReader();r.onload=ev=>res({data:ev.target.result.split(",")[1],type:f.type,url:ev.target.result,name:f.name});r.readAsDataURL(f);}));
                        Promise.all(readers).then(imgs=>setAuditImages(prev=>[...prev,...imgs]));
                        e.target.value="";
                      }}/>
                      {auditImages.length > 0 ? (
                        <div>
                          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                            {auditImages.map((img,idx)=>(
                              <div key={idx} style={{position:"relative",display:"inline-block"}}>
                                <img src={img.url} alt={"kare"+(idx+1)} style={{width:80,height:80,objectFit:"cover",borderRadius:8,border:"1px solid #2A3040"}}/>
                                <div style={{position:"absolute",top:-6,left:-6,background:"#6C5CE7",color:"white",borderRadius:"50%",width:18,height:18,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{idx+1}</div>
                                <button onClick={e=>{e.stopPropagation();setAuditImages(prev=>prev.filter((_,i)=>i!==idx));}}
                                  style={{position:"absolute",top:-6,right:-6,background:"#FF6B6B",color:"white",border:"none",borderRadius:"50%",width:18,height:18,fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>x</button>
                              </div>
                            ))}
                            <div style={{width:80,height:80,border:"2px dashed #2A3040",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#8892A6",fontSize:20}}>+</div>
                          </div>
                          <div style={{fontSize:11,color:auditImages.length>1?"#A29BFE":"#00D68F",fontWeight:600}}>
                            {auditImages.length > 1 ? "Video analizi: "+auditImages.length+" keyframe — "+(selectedModel === "gemini" ? "⚡ Gemini" : "🧠 Claude")+" video olarak analiz edecek" : "1 görsel yüklü — statik reklam analizi yapilacak"}
                          </div>
                        </div>
                      ) : (
                        <div style={{textAlign:"center"}}>
                          <div style={{fontSize:24,marginBottom:6}}>📸</div>
                          <div style={{fontSize:13,color:"#8892A6",marginBottom:3}}>Gorsel veya video karelerini yukleyin</div>
                          <div style={{fontSize:11,color:"#A29BFE"}}>Coklu gorsel = Video reklam analizi aktif olur</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Transcript - only show if multiple images */}
                  {auditImages.length > 1 && (
                    <div>
                      <label className="adv-label">Ses Transkripti (Video sesi — varsa)</label>
                      <textarea className="adv-textarea" rows={4} value={auditTranscript}
                        onChange={e=>setAuditTranscript(e.target.value)}
                        placeholder="Video sesini metne donusturup buraya yapistirin. Claude gorsel-ses uyumunu analiz edecek..."/>
                      <div style={{fontSize:11,color:"#8892A6",marginTop:4}}>Transkript olmadan da analiz yapilir — varsa daha kapsamli olur</div>
                    </div>
                  )}

                  <button className="adv-btn" disabled={!auditProduct||!auditAdText||auditLoading} onMouseEnter={()=>setPendingOp({label:"Reklam Denetçisi",cost:estimateCost("Reklam Denetçisi",auditImages.length>0)})}
                    style={{alignSelf:"flex-start"}}
                    onClick={async()=>{
                      setAuditLoading(true); setAuditError(""); setAuditResult("");
                      try {
                        const goalLabel = ({sales:"Satis/Donusum",awareness:"Bilinirlik",leads:"Lead",traffic:"Trafik",engagement:"Etkilesim"})[auditGoal]||auditGoal;
                        const txtParts = [
                          "Urun: " + auditProduct,
                          auditPrice ? "Fiyat/Teklif: " + auditPrice : "",
                          auditAudience ? "Hedef kitle: " + auditAudience : "",
                          auditBudget ? "Butce: " + auditBudget + " TL/gun" : "",
                          "Kampanya hedefi: " + goalLabel + (landingUrl ? "\nLanding Page URL: " + landingUrl + " (reklamla bu sayfayi karsilastir: fiyat uyumu, mesaj tutarliligi, donusum engelleri)" : ""),
                          auditAdText ? "\nMEVCUT REKLAM METNİ (analiz et, yenisini yaz):\n" + auditAdText : "",
                          auditTranscript ? "\nSES TRANSKRİPTİ (video sesi):\n" + auditTranscript : "",
                          auditImages.length > 1 ? "\nNOT: " + auditImages.length + " görsel yüklendi — bu bir VIDEO REKLAMIDIR. Gorseller keyframe sirasiyla verilmistir." : ""
                        ].filter(Boolean).join("\n");

                        let userContent;
                        if (auditImages.length > 0) {
                          userContent = auditImages.map(function(img, idx){
                            return { type: "image", source: { type: "base64", media_type: img.type, data: img.data } };
                          });
                          userContent.push({ type: "text", text: txtParts });
                        } else {
                          userContent = txtParts;
                        }

                        const resp = await fetch("/api/claude", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            max_tokens: 4000,
                            system: AUDIT_SYS_PROMPT,
                            messages: [{ role: "user", content: userContent }],
                            model: selectedModel
                          })
                        });
                        const data = await resp.json();
                        if (data.error) throw new Error(data.error.message || "API hatasi");
                        const md = (data.content||[]).map(function(c){return c.text||"";}).join("").trim();
                        if (!md) throw new Error("Boş yanıt");
                        setAuditResult(md);
                        if (data.usage && typeof window.__trackUsage === "function") window.__trackUsage("Reklam Denetçisi", data.usage, selectedModel);
                      } catch(e) { setAuditError(e.message||String(e)); }
                      setAuditLoading(false);
                    }}>
                    {auditLoading ? (selectedModel === "gemini" ? "⚡ Gemini Analiz Ediyor..." : "🧠 Claude Analiz Ediyor...") : "Reklamı Denetle ve Yeniden Yaz"}
                  </button>
                </div>
              </div>

              {auditLoading && (
                <div className="adv-section" style={{textAlign:"center",padding:"40px 24px",marginBottom:14}}>
                  <div style={{fontSize:32,marginBottom:12}} className="adv-spin">*</div>
                  <div style={{fontSize:15,fontWeight:600,marginBottom:6}}>{selectedModel==="gemini"?"⚡ Gemini Analiz Ediyor":"🧠 Claude Analiz Ediyor"}</div>
                  <div style={{fontSize:13,color:"#8892A6",marginBottom:4}}>Stratejik aciklar tespit ediliyor...</div>
                  <div style={{fontSize:13,color:"#A29BFE"}}>3 optimize edilmis alternatif yaziliyor...</div>
                  <div style={{fontSize:11,color:"#6C5CE7",marginTop:8}}>20-40 saniye sürebilir</div>
                </div>
              )}

              {auditError && (
                <div className="adv-bad" style={{marginBottom:14}}>
                  <div style={{fontWeight:600,marginBottom:4}}>Hata</div>
                  <div style={{fontSize:13}}>{auditError}</div>
                </div>
              )}

              {auditResult && !auditLoading && (
                <div className="adv-fade">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#00D68F"}}>Analiz tamamlandı</div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="adv-btn-ghost" style={{fontSize:12,padding:"7px 14px"}}
                        onClick={()=>{ try{navigator.clipboard.writeText(auditResult);}catch(ce){} }}>
                        Markdown Kopyala
                      </button>
                      <button className="adv-btn-ghost" style={{fontSize:12,padding:"7px 14px"}}
                        onClick={()=>{
                          const pw=window.open("","_blank");
                          const st=document.getElementById("md-styles");
                          pw.document.write("<html><head><title>Reklam Denetim Raporu</title><style>body{background:#0B0E14;color:#E8ECF4;font-family:system-ui;padding:32px;max-width:900px;margin:0 auto}@media print{body{background:white;color:#111}}"+(st?st.textContent:"")+"</style></head><body><div class='md-report'>"+document.querySelector("#audit-report-content").innerHTML+"</div></body></html>");
                          pw.document.close();
                          setTimeout(function(){pw.print();},500);
                        }}>
                        PDF İndir
                      </button>
                      <button className="adv-btn-ghost" style={{fontSize:12,padding:"7px 14px"}}
                        onClick={()=>{setAuditResult("");setAuditAdText("");setAuditImages([]);setAuditTranscript("");}}>
                        Yeni Analiz
                      </button>
                    </div>
                  </div>
                  <div className="adv-section" style={{padding:0,overflow:"hidden"}}>
                    <div style={{background:"#0F1318",borderBottom:"1px solid #2A3040",padding:"8px 16px",display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:"#FF6B6B"}}></div>
                      <div style={{width:10,height:10,borderRadius:"50%",background:"#FFA502"}}></div>
                      <div style={{width:10,height:10,borderRadius:"50%",background:"#00D68F"}}></div>
                      <span style={{fontSize:11,color:"#8892A6",marginLeft:8}}>Reklam Denetim Raporu</span>
                    </div>
                    <div id="audit-report-content" style={{padding:"24px 28px"}} dangerouslySetInnerHTML={{__html: renderMd(auditResult)}} />
                  </div>
                </div>
              )}
            </div>
          )}


          {activeTab === "creative" && (
            <div style={{maxWidth:860,margin:"0 auto"}}>

              {/* Header */}
              <div style={{marginBottom:28}}>
                <h1 style={{fontSize:26,fontWeight:700,color:"#E8ECF4",marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
                  <span>🎨</span> Kreatif Üretici
                </h1>
                <p style={{color:"#8892A6",fontSize:14,lineHeight:1.6}}>
                  Ürünün için 3 farklı görsel konsept, Türkçe senaryo ve Midjourney/DALL-E icin hazir Ingilizce prompt uret.
                </p>
              </div>

              {/* Form */}
              <div style={{background:"#141820",border:"1px solid #2A3040",borderRadius:20,padding:"24px 28px",marginBottom:20,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle,rgba(162,155,254,0.14) 0%,transparent 70%)",pointerEvents:"none"}}/>
                <div style={{fontSize:12,fontWeight:700,color:"#A29BFE",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:20}}>Konsept Bilgileri</div>

                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div>
                    <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>
                      Ürün / Teklif
                    </label>
                    <input className="adv-input" value={crProduct} onChange={e=>setCrProduct(e.target.value)}
                      placeholder="Ör: UV Baskılı iPhone Kılıfı, Lazer Epilasyon Paketi..."
                      style={{fontSize:14}}/>
                  </div>

                  {/* Reference image upload */}
                  <div>
                    <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>
                      Referans Görsel <span style={{color:"#6C5CE7",fontWeight:400,textTransform:"none",letterSpacing:0}}>(Opsiyonel — Stil kılavuzu)</span>
                    </label>
                    {crImgPreview ? (
                      <div style={{position:"relative",display:"inline-block"}}>
                        <img src={crImgPreview} alt="referans"
                          style={{width:"100%",maxHeight:200,objectFit:"cover",borderRadius:12,border:"1.5px solid rgba(108,92,231,0.4)",display:"block"}}/>
                        <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.45)",borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,opacity:0,transition:"opacity 0.2s"}}
                          onMouseEnter={e=>e.currentTarget.style.opacity=1}
                          onMouseLeave={e=>e.currentTarget.style.opacity=0}>
                          <div style={{fontSize:12,color:"white",fontWeight:600}}>Stil kılavuzu aktif</div>
                          <button onClick={()=>{setCrImgFile(null);if(crImgPreview)URL.revokeObjectURL(crImgPreview);setCrImgPreview("");}}
                            style={{padding:"5px 14px",borderRadius:8,border:"1px solid rgba(255,107,107,0.5)",background:"rgba(255,107,107,0.15)",color:"#FF6B6B",fontSize:12,cursor:"pointer",fontWeight:600}}>
                            Gorseli Kaldir
                          </button>
                        </div>
                        <div style={{position:"absolute",top:8,right:8,background:"rgba(108,92,231,0.9)",borderRadius:20,padding:"3px 10px",fontSize:11,color:"white",fontWeight:700}}>
                          Stil Kılavuzu Aktif
                        </div>
                      </div>
                    ) : (
                      <div className="adv-upload-zone" style={{padding:"18px 20px",cursor:"pointer"}}
                        onClick={()=>document.getElementById("cr-img-input").click()}
                        onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add("drag");}}
                        onDragLeave={e=>e.currentTarget.classList.remove("drag")}
                        onDrop={e=>{
                          e.preventDefault(); e.currentTarget.classList.remove("drag");
                          const f = e.dataTransfer.files[0];
                          if (f && f.type.startsWith("image/")) {
                            if (crImgPreview) URL.revokeObjectURL(crImgPreview);
                            setCrImgFile(f);
                            setCrImgPreview(URL.createObjectURL(f));
                          }
                        }}>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontSize:24,marginBottom:6}}>🖼️</div>
                          <div style={{fontSize:13,color:"#E8ECF4",fontWeight:600,marginBottom:3}}>Referans görsel yukleyin</div>
                          <div style={{fontSize:11,color:"#8892A6"}}>{selectedModel === "gemini" ? "⚡ Gemini gorselin stilini, ışığını ve kompozisyonunu analiz eder" : "🧠 Claude gorselin stilini, ışığını ve kompozisyonunu analiz eder"}</div>
                        </div>
                      </div>
                    )}
                    <input id="cr-img-input" type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                      const f = e.target.files[0];
                      if (!f) return;
                      if (crImgPreview) URL.revokeObjectURL(crImgPreview);
                      setCrImgFile(f);
                      setCrImgPreview(URL.createObjectURL(f));
                      e.target.value = "";
                    }}/>
                    {crImgPreview && (
                      <div style={{marginTop:8,display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:"rgba(108,92,231,0.08)",borderRadius:8,border:"1px solid rgba(108,92,231,0.2)"}}>
                        <span style={{fontSize:12}}>✨</span>
                        <span style={{fontSize:12,color:"#A29BFE"}}>Referans görsel aktif — Claude stil analizini birincil kaynak olarak kullanacak</span>
                      </div>
                    )}
                  </div>

                  <div className="adv-grid2">
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>
                        Atmosfer / Vibe
                      </label>
                      <select className="adv-select" value={crVibe} onChange={e=>setCrVibe(e.target.value)}>
                        <option value="">Secin</option>
                        <option value="Luks / Premium">Luks / Premium</option>
                        <option value="UGC / Samimi">UGC / Samimi</option>
                        <option value="Enerjik / Gen-Z">Enerjik / Gen-Z</option>
                        <option value="Minimalist / Sade">Minimalist / Sade</option>
                        <option value="Bold / Agresif">Bold / Agresif</option>
                        <option value="Soft / Pastel">Soft / Pastel</option>
                        <option value="Dark / Dramatik">Dark / Dramatik</option>
                        <option value="Playful / Eglenceli">Playful / Eglenceli</option>
                      </select>
                    </div>
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>
                        Hedef Kitle
                      </label>
                      <input className="adv-input" value={crAudience} onChange={e=>setCrAudience(e.target.value)}
                        placeholder="Ör: 18-28 kadın, iPhone kullanıcısı, moda tutkunu..."/>
                    </div>
                  </div>

                  <button className="adv-btn" disabled={!crProduct||crLoading} style={{alignSelf:"flex-start",display:"flex",alignItems:"center",gap:8}} onMouseEnter={()=>setPendingOp({label:"Kreatif Üretici",cost:estimateCost("Kreatif Üretici",!!crImgFile)})}
                    onClick={async()=>{
                      setCrLoading(true);
                      setCrError("");
                      setCrResult("");
                      try {
                        // ── 1. Görseli encode et (varsa) ─────────────────
                        var msgContent;
                        var textPart = "Urun: " + crProduct
                          + (crVibe ? ". Atmosfer: " + crVibe : "")
                          + (crAudience ? ". Hedef kitle: " + crAudience : "")
                          + (crImgFile ? ". Referans görsel yüklendi — stili birincil kaynak olarak kullan." : "")
                          + ". 3 gorsel konsept olustur.";

                        if (crImgFile) {
                          var b64 = await new Promise(function(resolve, reject) {
                            var fr = new FileReader();
                            fr.onerror = function() { reject(new Error("Görsel okunamadı.")); };
                            fr.onload  = function(ev) {
                              var srcUrl = ev.target.result;
                              var imgEl  = new Image();
                              imgEl.onerror = function() { resolve(srcUrl.split(",")[1]); };
                              imgEl.onload  = function() {
                                try {
                                  var maxD = 768;
                                  var sc = Math.min(1, maxD / Math.max(imgEl.width||1, imgEl.height||1));
                                  var cv = document.createElement("canvas");
                                  cv.width  = Math.max(1, Math.round(imgEl.width  * sc));
                                  cv.height = Math.max(1, Math.round(imgEl.height * sc));
                                  cv.getContext("2d").drawImage(imgEl, 0, 0, cv.width, cv.height);
                                  resolve(cv.toDataURL("image/jpeg", 0.70).split(",")[1]);
                                } catch(cvErr) {
                                  resolve(srcUrl.split(",")[1]);
                                }
                              };
                              imgEl.src = srcUrl;
                            };
                            fr.readAsDataURL(crImgFile);
                          });

                          msgContent = [
                            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } },
                            { type: "text", text: textPart }
                          ];
                        } else {
                          msgContent = textPart;
                        }

                        // ── 2. API isteği — 90sn timeout ─────────────────
                        var controller = new AbortController();
                        var timer = setTimeout(function(){ controller.abort(); }, 90000);

                        var resp;
                        try {
                          resp = await fetch("/api/claude", {
                            method: "POST",
                            signal: controller.signal,
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              max_tokens: 3000,
                              system: CREATIVE_SYS,
                              model: selectedModel,
                              messages: [{ role: "user", content: msgContent }]
                            })
                          });
                        } finally {
                          clearTimeout(timer);
                        }

                        // ── 3. Yanıt kontrolü ─────────────────────────────
                        if (!resp.ok) {
                          var errText = await resp.text().catch(function(){ return ""; });
                          throw new Error("Sunucu hatası " + resp.status + (errText ? ": " + errText.slice(0,120) : ""));
                        }

                        var data = await resp.json().catch(function(e) {
                          throw new Error("Yanıt JSON değil: " + e.message);
                        });

                        if (data.error) throw new Error(data.error.message || "API hatasi");
                        if (data.usage && typeof window.__trackUsage === "function") {
                          window.__trackUsage("Kreatif Üretici", data.usage, selectedModel);
                        }

                        var md = (data.content||[]).map(function(c){ return c.text||""; }).join("").trim();
                        if (!md) throw new Error("Claude bos yanit dondu. Lutfen tekrar deneyin.");
                        setCrResult(md);

                      } catch(err) {
                        var msg = err.name === "AbortError"
                          ? "İstek zaman aşımına uğradı (90sn). Gorsel cok buyuk olabilir."
                          : (err.message || String(err));
                        setCrError(msg);
                      } finally {
                        setCrLoading(false);
                      }
                    }}>
                    {crLoading ? "Konseptler Oluşturuluyor..." : "3 Konsept Oluştur"}
                  </button>
                </div>
              </div>

              {/* Loading */}
              {crLoading && (
                <div style={{background:"#141820",border:"1px solid #2A3040",borderRadius:16,padding:"40px 24px",textAlign:"center",marginBottom:16}}>
                  <div style={{fontSize:36,marginBottom:14}} className="adv-spin">🎨</div>
                  {selectedModel === "gemini" ? <div style={{fontWeight:700,fontSize:15,color:"#E8ECF4",marginBottom:6}}>⚡ Gemini çalışıyor...</div> : <div style={{fontWeight:700,fontSize:15,color:"#E8ECF4",marginBottom:6}}>🧠 Claude çalışıyor...</div>}
                  <div style={{fontSize:13,color:"#8892A6",marginBottom:3}}>Görsel senaryolar hazırlanıyor...</div>
                  <div style={{fontSize:13,color:"#A29BFE",marginBottom:3}}>Midjourney promptları yazılıyor...</div>
                  <div style={{fontSize:11,color:"#6C5CE7",marginTop:8}}>20-30 saniye sürebilir</div>
                </div>
              )}

              {/* Error */}
              {crError && (
                <div className="adv-bad" style={{marginBottom:16}}>
                  <div style={{fontWeight:600,marginBottom:4}}>Hata</div>
                  <div style={{fontSize:13}}>{crError}</div>
                </div>
              )}

              {/* Results */}
              {crResult && !crLoading && (
                <div className="adv-fade">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#00D68F"}}>3 Konsept hazır</div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="adv-btn-ghost" style={{fontSize:12,padding:"7px 14px"}}
                        onClick={()=>{ try{navigator.clipboard.writeText(crResult);}catch(e){} }}>
                        Markdown Kopyala
                      </button>
                      <button className="adv-btn-ghost" style={{fontSize:12,padding:"7px 14px"}}
                        onClick={()=>{setCrResult("");setCrProduct("");setCrVibe("");setCrAudience("");setCrImgFile(null);if(crImgPreview)URL.revokeObjectURL(crImgPreview);setCrImgPreview("");}}>
                        Yeni Konsept
                      </button>
                    </div>
                  </div>

                  {/* Render result as 3 concept cards */}
                  {(function(){
                    const sections = crResult.split(/(?=###\s)/);
                    const conceptColors = [
                      {border:"rgba(162,155,254,0.4)",bg:"rgba(108,92,231,0.06)",hdr:"rgba(108,92,231,0.15)",clr:"#A29BFE",icon:"🏛"},
                      {border:"rgba(0,214,143,0.4)",bg:"rgba(0,214,143,0.04)",hdr:"rgba(0,214,143,0.12)",clr:"#00D68F",icon:"📱"},
                      {border:"rgba(255,107,107,0.4)",bg:"rgba(255,107,107,0.04)",hdr:"rgba(255,107,107,0.12)",clr:"#FF6B6B",icon:"⚡"},
                    ];

                    return sections.filter(function(s){return s.trim();}).map(function(section, idx){
                      const col = conceptColors[idx] || conceptColors[0];
                      // Split into parts
                      const titleMatch = section.match(/^###\s+(.+)/);
                      const title = titleMatch ? titleMatch[1] : ("Konsept " + (idx+1));
                      const body = section.split("\n").slice(1).join("\n");

                      // Extract A, B, C sections
                      const scenarioMatch = (function(){var m=body.indexOf("**A.");return m>=0?[null,body.slice(m).replace(/^\*\*A\.[^*]*\*\*[:\s]*/,"").split("**B.")[0].trim()]:null;})();
                      const hookMatch     = (function(){var m=body.indexOf("**B.");return m>=0?[null,body.slice(m).replace(/^\*\*B\.[^*]*\*\*[:\s]*/,"").split("**C.")[0].trim()]:null;})();
                      const fenceTag = String.fromCharCode(96,96,96);
                      const fenceRe = new RegExp(fenceTag + "([^" + String.fromCharCode(96) + "]+)" + fenceTag, "s");
                      const promptMatch   = body.match(fenceRe);

                      const scenario = scenarioMatch ? scenarioMatch[1].trim() : "";
                      const hook     = hookMatch     ? hookMatch[1].trim()     : "";
                      const prompt   = promptMatch   ? promptMatch[1].trim()   : "";

                      return (
                        <div key={idx} style={{border:"1px solid "+col.border,borderRadius:18,overflow:"hidden",marginBottom:16,background:col.bg}}>
                          {/* Card header */}
                          <div style={{background:col.hdr,padding:"14px 20px",display:"flex",alignItems:"center",gap:10}}>
                            <span style={{fontSize:18}}>{col.icon}</span>
                            <span style={{fontWeight:700,fontSize:15,color:"#E8ECF4"}}>{title}</span>
                          </div>

                          <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:14}}>
                            {/* A: Scenario */}
                            {scenario && (
                              <div>
                                <div style={{fontSize:10,fontWeight:700,color:col.clr,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>
                                  Görsel Senaryo
                                </div>
                                <div style={{fontSize:13,color:"#C8D0E0",lineHeight:1.7,background:"#1C2230",borderRadius:10,padding:"12px 14px"}}>
                                  {scenario}
                                </div>
                              </div>
                            )}

                            {/* B: Hook */}
                            {hook && (
                              <div>
                                <div style={{fontSize:10,fontWeight:700,color:col.clr,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>
                                  Görsel Üzeri Metin (Hook)
                                </div>
                                <div style={{fontSize:18,fontWeight:800,color:"#E8ECF4",letterSpacing:"0.03em",padding:"10px 16px",background:"rgba(255,255,255,0.04)",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)"}}>
                                  {hook}
                                </div>
                              </div>
                            )}

                            {/* C: AI Prompt */}
                            {prompt && (
                              <div>
                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                                  <div style={{fontSize:10,fontWeight:700,color:col.clr,textTransform:"uppercase",letterSpacing:"0.08em"}}>
                                    AI Image Prompt (Midjourney / DALL-E)
                                  </div>
                                  <button className="adv-copy-btn"
                                    onClick={()=>{try{navigator.clipboard.writeText(prompt);}catch(e){}}}
                                    style={{background:col.hdr,color:col.clr,border:"none",padding:"3px 12px",borderRadius:6,fontSize:11,cursor:"pointer",fontWeight:600}}>
                                    Kopyala
                                  </button>
                                </div>
                                <div style={{background:"#0F1318",borderRadius:10,padding:"14px 16px",fontFamily:"monospace",fontSize:12,color:"#00D68F",lineHeight:1.7,border:"1px solid #2A3040",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                                  {prompt}
                                </div>
                              </div>
                            )}

                            {/* Fallback: show raw markdown if sections not parsed */}
                            {!scenario && !hook && !prompt && (
                              <div dangerouslySetInnerHTML={{__html: renderMd(section)}} />
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          )}


                    {activeTab === "abtest" && (
            <div style={{maxWidth:960,margin:"0 auto"}}>

              {/* Header */}
              <div style={{marginBottom:24}}>
                <h1 style={{fontSize:26,fontWeight:700,color:"#E8ECF4",marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
                  <span>🚀</span> Meta Ads Co-Pilot
                </h1>
                <p style={{color:"#8892A6",fontSize:14,lineHeight:1.6}}>
                  Meta Ads panelinin ekran görüntüsünü yükle — AI buton buton, adım adım ne yapman gerektiğini söylesin.
                </p>
              </div>

              {/* Product context */}
              <div style={{background:"#141820",border:"1px solid #2A3040",borderRadius:14,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:20}}>🎯</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#A29BFE",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>Neyi Tanıtıyoruz?</div>
                  <input className="adv-input" value={abSector} onChange={e=>setAbSector(e.target.value)}
                    placeholder="Ör: UV baskılı özel tasarım iPhone kılıfı — premium malzeme, 48 saat teslimat"
                    style={{background:"transparent",border:"none",padding:0,fontSize:14,outline:"none",width:"100%",color:"#E8ECF4"}}/>
                </div>
              </div>

              {/* Step tabs */}
              {(function(){
                const STEPS = [
                  {id:0, label:"Adım 1", sub:"Kampanya", icon:"📊", desc:"Kampanya hedefi, bütçe tipi ve optimizasyon"},
                  {id:1, label:"Adım 2", sub:"Reklam Seti", icon:"🎯", desc:"Hedef kitle, konum, bütçe ve zamanlama"},
                  {id:2, label:"Adım 3", sub:"Reklam Kreatifi", icon:"🎨", desc:"Görsel/video, metin, başlık ve CTA"},
                ];

                // State helpers — uses top-level state (Rules of Hooks uyumlu)
                function setForStep(setter, idx, val) {
                  setter(prev => { const next=[...prev]; next[idx]=val; return next; });
                }

                async function analyzeStep(stepIdx) {
                  const imgData = cpImages[stepIdx];
                  if (!imgData) return;
                  setForStep(setCpLoadings, stepIdx, true);
                  setForStep(setCpErrors,   stepIdx, "");
                  setForStep(setCpResults,  stepIdx, null);
                  setForStep(setCpChecked,  stepIdx, []);
                  try {
                    const stepLabel = STEPS[stepIdx].sub;
                    const sys = [
                      "Sen dunyanin en iyi medya satin almacisisin. Senior Facebook Ads uzmanisisin.",
                      "Kullanici sana Meta Ads panelinin " + stepLabel + " adiminin ekran goruntusu atiyor.",
                      "GOREV: Fotodaki arayuzu oku ve kullaniciya NE YAPMASI GEREKTIGINI buton buton, alan alan soylemek.",
                      "KESIN KURALLAR: Asla genel gecerli tavsiye verme. Her aksiyon tek somut eylem olmali.",
                      "Ornek: 'CBO butonunu AC.', 'Butceyi 1500 TL yap.', 'Yas araligini 18-34 yap.'",
                      "Urun baglamini hesaba kat: " + (abSector || "e-ticaret urunu"),
                      "SADECE su JSON'u dondur (baska hicbir sey yazma):",
                      '{"summary":"Ekranda ne goruldugu 1-2 cumle","actions":["Aksiyon 1","Aksiyon 2"],"warnings":["Kritik hata varsa"],"score":8}',
                    ].join(" ");

                    const b64Parts = imgData.split(",");
                    const b64MediaType = (b64Parts[0].match(/data:([^;]+);/) || ["","image/jpeg"])[1];
                    const b64 = b64Parts[1];
                    const resp = await fetch("/api/claude", {
                      method: "POST",
                      headers: {"Content-Type":"application/json"},
                      body: JSON.stringify({
                        model: selectedModel,
                        claudeModel: "claude-sonnet-4-20250514",
                        max_tokens: 2000,
                        system: sys,
                        messages: [{
                          role: "user",
                          content: [
                            {type:"image", source:{type:"base64", media_type: b64MediaType, data: b64}},
                            {type:"text", text: stepLabel + " panelini analiz et. Urun: " + (abSector || "e-ticaret") + ". Ne yapmaliyim?"}
                          ]
                        }]
                      })
                    });
                    const data = await resp.json();
                    if (data.error) throw new Error(data.error.message);
                    if (data.usage && typeof window.__trackUsage === "function") window.__trackUsage("Co-Pilot " + stepLabel, data.usage, selectedModel);
                    const raw = (data.content||[]).map(c=>c.text||"").join("").trim();
                    let parsed;
                    try { parsed = sanitizeJSON(raw); } catch(e) {
                      parsed = { summary: raw.slice(0,300), actions: [raw], warnings: [], score: null };
                    }
                    setForStep(setCpResults, stepIdx, parsed);
                  } catch(e) { setForStep(setCpErrors, stepIdx, e.message||String(e)); }
                  setForStep(setCpLoadings, stepIdx, false);
                }

                return (
                  <div>
                    {/* Step navigation */}
                    <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
                      {STEPS.map((s,idx)=>(
                        <button key={idx} onClick={()=>setCpStep(idx)}
                          style={{flex:1,minWidth:140,padding:"14px 16px",borderRadius:14,border:"1.5px solid "+(cpStep===idx?"#A29BFE":"#2A3040"),
                            background:cpStep===idx?"rgba(108,92,231,0.12)":"#141820",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                            <span style={{fontSize:18}}>{s.icon}</span>
                            <span style={{fontSize:11,fontWeight:700,color:cpStep===idx?"#A29BFE":"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.label}</span>
                            {cpResults[idx] && <span style={{marginLeft:"auto",fontSize:12}}>✅</span>}
                          </div>
                          <div style={{fontWeight:700,fontSize:14,color:cpStep===idx?"#E8ECF4":"#8892A6"}}>{s.sub}</div>
                          <div style={{fontSize:11,color:"#8892A6",marginTop:2}}>{s.desc}</div>
                        </button>
                      ))}
                    </div>

                    {/* Active step content */}
                    {STEPS.map((s,idx)=> cpStep===idx && (
                      <div key={idx} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>

                        {/* Left: Upload */}
                        <div>
                          <div style={{fontSize:13,fontWeight:700,color:"#E8ECF4",marginBottom:12}}>
                            {s.icon} {s.sub} Paneli Ekran Görüntüsü
                          </div>
                          {cpImages[idx] ? (
                            <div style={{position:"relative",borderRadius:14,overflow:"hidden",border:"1.5px solid #A29BFE"}}>
                              <img src={cpImages[idx]} alt="panel" style={{width:"100%",maxHeight:460,objectFit:"contain",background:"#0F1318",display:"block"}}/>
                              <div style={{position:"absolute",top:8,right:8,display:"flex",gap:6}}>
                                <button onClick={()=>{setForStep(setCpImages,idx,null);setForStep(setCpResults,idx,null);setForStep(setCpErrors,idx,"");}}
                                  style={{background:"rgba(255,107,107,0.9)",color:"white",border:"none",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>
                                  Değiştir
                                </button>
                              </div>
                              {!cpResults[idx] && !cpLoadings[idx] && (
                                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:16,background:"linear-gradient(transparent,rgba(0,0,0,0.85))"}}>
                                  <button className="adv-btn" style={{width:"100%"}} onClick={()=>analyzeStep(idx)}>
                                    {selectedModel==="gemini"?"⚡ Gemini ile Analiz Et":"🧠 Claude ile Analiz Et"} →
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{border:"2px dashed #2A3040",borderRadius:14,padding:"40px 24px",textAlign:"center",cursor:"pointer",background:"#141820"}}
                              onClick={()=>document.getElementById("cp-img-"+idx).click()}
                              onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="#A29BFE";}}
                              onDragLeave={e=>{e.currentTarget.style.borderColor="#2A3040";}}
                              onDrop={e=>{
                                e.preventDefault();e.currentTarget.style.borderColor="#2A3040";
                                const f=e.dataTransfer.files[0];
                                if(f&&f.type.startsWith("image/")){
                                  const fr=new FileReader();
                                  fr.onload=ev=>{setForStep(setCpImages,idx,ev.target.result);};
                                  fr.readAsDataURL(f);
                                }
                              }}>
                              <div style={{fontSize:48,marginBottom:12}}>📸</div>
                              <div style={{fontWeight:700,fontSize:15,color:"#E8ECF4",marginBottom:6}}>{s.sub} Panelini Buraya Sürükle</div>
                              <div style={{fontSize:13,color:"#8892A6",marginBottom:16}}>veya tıklayarak seç</div>
                              <div style={{fontSize:11,color:"#6C5CE7",background:"rgba(108,92,231,0.08)",borderRadius:8,padding:"6px 14px",display:"inline-block"}}>
                                Meta Ads Manager ekran görüntüsü
                              </div>
                            </div>
                          )}
                          <input id={"cp-img-"+idx} type="file" accept="image/*" style={{display:"none"}}
                            onChange={e=>{
                              const f=e.target.files[0];
                              if(f){const fr=new FileReader();fr.onload=ev=>{setForStep(setCpImages,idx,ev.target.result);};fr.readAsDataURL(f);}
                              e.target.value="";
                            }}/>
                        </div>

                        {/* Right: AI Output */}
                        <div>
                          <div style={{fontSize:13,fontWeight:700,color:"#E8ECF4",marginBottom:12}}>🤖 Co-Pilot Aksiyon Listesi</div>
                          {cpLoadings[idx] && (
                            <div style={{background:"#141820",border:"1px solid #2A3040",borderRadius:14,padding:"32px 20px",textAlign:"center"}}>
                              <div style={{fontSize:32,marginBottom:10}} className="adv-spin">🔍</div>
                              <div style={{fontWeight:700,color:"#E8ECF4",marginBottom:4}}>Panel okunuyor...</div>
                              <div style={{fontSize:12,color:"#A29BFE"}}>Her alanı tek tek analiz ediyor...</div>
                            </div>
                          )}
                          {cpErrors[idx] && (
                            <div className="adv-bad"><div style={{fontWeight:600,marginBottom:4}}>Hata</div><div style={{fontSize:12}}>{cpErrors[idx]}</div></div>
                          )}
                          {!cpResults[idx] && !cpLoadings[idx] && !cpErrors[idx] && (
                            <div style={{background:"#141820",border:"1px dashed #2A3040",borderRadius:14,padding:"32px 20px",textAlign:"center"}}>
                              <div style={{fontSize:32,marginBottom:10,opacity:0.4}}>📋</div>
                              <div style={{fontSize:13,color:"#8892A6"}}>Ekran görüntüsü yükleyip analiz başlatın</div>
                            </div>
                          )}
                          {cpResults[idx] && !cpLoadings[idx] && (function(){
                            const r = cpResults[idx];
                            const checked = cpChecked[idx] || [];
                            return (
                              <div>
                                <div style={{background:"rgba(108,92,231,0.08)",border:"1px solid rgba(108,92,231,0.2)",borderRadius:12,padding:"12px 16px",marginBottom:14}}>
                                  <div style={{fontSize:10,fontWeight:700,color:"#A29BFE",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>Panel Özeti</div>
                                  <div style={{fontSize:13,color:"#C8D0E0",lineHeight:1.6}}>{r.summary}</div>
                                  {r.score && <div style={{marginTop:6,fontSize:11,color:"#00D68F",fontWeight:700}}>Skor: {r.score}/10</div>}
                                </div>
                                {(r.actions||[]).length > 0 && (
                                  <div style={{marginBottom:14}}>
                                    <div style={{fontSize:11,fontWeight:700,color:"#00D68F",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>
                                      ✅ Aksiyonlar ({checked.length}/{(r.actions||[]).length} tamamlandı)
                                    </div>
                                    {(r.actions||[]).map((action,ai)=>(
                                      <div key={ai}
                                        onClick={()=>setForStep(setCpChecked,idx,checked.includes(ai)?checked.filter(x=>x!==ai):[...checked,ai])}
                                        style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",borderRadius:10,cursor:"pointer",marginBottom:6,
                                          background:checked.includes(ai)?"rgba(0,214,143,0.06)":"#1C2230",
                                          border:"1px solid "+(checked.includes(ai)?"rgba(0,214,143,0.3)":"#2A3040"),
                                          transition:"all 0.15s",opacity:checked.includes(ai)?0.65:1}}>
                                        <div style={{width:20,height:20,borderRadius:5,border:"2px solid "+(checked.includes(ai)?"#00D68F":"#4A5568"),
                                          background:checked.includes(ai)?"#00D68F":"transparent",flexShrink:0,marginTop:1,
                                          display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                                          {checked.includes(ai) && <span style={{color:"#0F1318",fontSize:12,fontWeight:900}}>✓</span>}
                                        </div>
                                        <div style={{fontSize:13,color:checked.includes(ai)?"#8892A6":"#C8D0E0",lineHeight:1.6,
                                          textDecoration:checked.includes(ai)?"line-through":"none"}}>
                                          {action}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {(r.warnings||[]).length > 0 && (
                                  <div style={{marginBottom:14}}>
                                    <div style={{fontSize:11,fontWeight:700,color:"#FF6B6B",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>⚠️ Kritik Uyarılar</div>
                                    {(r.warnings||[]).map((w,wi)=>(
                                      <div key={wi} style={{display:"flex",gap:8,padding:"8px 12px",background:"rgba(255,107,107,0.06)",borderRadius:8,marginBottom:6,border:"1px solid rgba(255,107,107,0.2)"}}>
                                        <span style={{color:"#FF6B6B",flexShrink:0}}>⚠️</span>
                                        <div style={{fontSize:12,color:"#C8D0E0",lineHeight:1.6}}>{w}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <button className="adv-btn-ghost" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>analyzeStep(idx)}>🔄 Tekrar Analiz Et</button>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ))}

                    {/* Step nav */}
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:24}}>
                      <button className="adv-btn-ghost" disabled={cpStep===0} onClick={()=>setCpStep(s=>s-1)} style={{opacity:cpStep===0?0.3:1}}>← Önceki Adım</button>
                      <button className="adv-btn" disabled={cpStep===2} onClick={()=>setCpStep(s=>s+1)} style={{opacity:cpStep===2?0.3:1}}>Sonraki Adım →</button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}



          {activeTab === "errfix" && (
            <div style={{maxWidth:860,margin:"0 auto"}}>

              {/* Header */}
              <div style={{marginBottom:24}}>
                <h1 style={{fontSize:26,fontWeight:700,color:"#E8ECF4",marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
                  <span>🚑</span> Hata Çözücü
                </h1>
                <p style={{color:"#8892A6",fontSize:14,lineHeight:1.6}}>
                  Meta, Google veya TikTok Ads'den aldığın hata ekran görüntüsünü yükle — anında teşhis ve adım adım çözüm al.
                </p>
              </div>

              {/* Upload area */}
              <div style={{background:"#141820",border:"1px solid #2A3040",borderRadius:20,padding:"24px 28px",marginBottom:20}}>
                <div style={{fontSize:12,fontWeight:700,color:"#FF6B6B",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:16}}>
                  Hata Ekran Görüntüsü
                </div>

                {errImg ? (
                  <div style={{position:"relative",borderRadius:12,overflow:"hidden",marginBottom:16}}>
                    <img src={errImg} alt="hata ekranı" style={{width:"100%",maxHeight:400,objectFit:"contain",background:"#0F1318",display:"block",borderRadius:12}}/>
                    <button onClick={()=>{setErrImg("");setErrImgType("image/jpeg");setErrResult("");setErrError("");}}
                      style={{position:"absolute",top:8,right:8,background:"rgba(255,107,107,0.9)",color:"white",border:"none",
                        borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>
                      Değiştir
                    </button>
                  </div>
                ) : (
                  <div style={{border:"2px dashed #2A3040",borderRadius:14,padding:"36px 24px",textAlign:"center",cursor:"pointer",
                      background:"rgba(255,107,107,0.02)",transition:"all 0.2s"}}
                    onClick={()=>document.getElementById("err-img-input").click()}
                    onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="#FF6B6B";}}
                    onDragLeave={e=>{e.currentTarget.style.borderColor="#2A3040";}}
                    onDrop={e=>{
                      e.preventDefault();e.currentTarget.style.borderColor="#2A3040";
                      const f=e.dataTransfer.files[0];
                      if(f&&f.type.startsWith("image/")){
                        const fr=new FileReader();
                        fr.onload=ev=>{setErrImg(ev.target.result);setErrImgType(f.type);};
                        fr.readAsDataURL(f);
                      }
                    }}>
                    <div style={{fontSize:48,marginBottom:12}}>🖥️</div>
                    <div style={{fontWeight:700,fontSize:15,color:"#E8ECF4",marginBottom:6}}>Hata Ekranını Buraya Sürükle</div>
                    <div style={{fontSize:13,color:"#8892A6",marginBottom:14}}>veya tıklayarak seç</div>
                    <div style={{fontSize:11,color:"#FF6B6B",background:"rgba(255,107,107,0.08)",borderRadius:8,padding:"6px 16px",display:"inline-block"}}>
                      PNG / JPG / WEBP — Reklam paneli ekran görüntüsü
                    </div>
                  </div>
                )}
                <input id="err-img-input" type="file" accept="image/*" style={{display:"none"}}
                  onChange={e=>{
                    const f=e.target.files[0];
                    if(f){const fr=new FileReader();fr.onload=ev=>{setErrImg(ev.target.result);setErrImgType(f.type);};fr.readAsDataURL(f);}
                    e.target.value="";
                  }}/>

                {/* Optional note */}
                <div style={{marginTop:16}}>
                  <label style={{fontSize:11,fontWeight:600,color:"#8892A6",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>
                    Ek Açıklama <span style={{color:"#8892A6",fontWeight:400,textTransform:"none",letterSpacing:0}}>(opsiyonel)</span>
                  </label>
                  <textarea className="adv-textarea" rows={2} value={errNote} onChange={e=>setErrNote(e.target.value)}
                    placeholder="Ör: Bu hatayı dünden beri alıyorum, hesap 3 yıldır aktif, reklamı ilk kez reddettiler..."
                    style={{fontSize:13,resize:"vertical"}}/>
                </div>

                <button className="adv-btn" disabled={!errImg||errLoading}
                  style={{marginTop:16,display:"flex",alignItems:"center",gap:8}}
                  onClick={async()=>{
                    setErrLoading(true); setErrError(""); setErrResult("");
                    try {
                      const sys = [
                        "Sen kıdemli bir Meta, Google Ads ve TikTok Ads Teknik Destek ve Reklam İlkesi (Policy) Uzmanısın.",
                        "Kullanıcının yüklediği ekran görüntüsündeki hata mesajını (kırmızı uyarılar, red sebepleri, hata kodları) oku.",
                        "ASLA genel geçer bilgi verme. Doğrudan paneldeki sorunu çöz.",
                        "Çıktını KESİNLİKLE Markdown formatında şu 4 başlıkla ver:",
                        "## 🔍 Hata Teşhisi",
                        "(Sorun tam olarak ne? Hata kodu veya mesajı ne anlama geliyor?)",
                        "## ⚠️ Neden Kaynaklandı?",
                        "(İhlal edilen kural veya teknik eksiklik — spesifik ol)",
                        "## ✅ Adım Adım Çözüm",
                        "(Nereye tıklamalı, neyi değiştirmeli? Madde madde, buton isimlerini yaz)",
                        "## 📝 İtiraz (Appeal) Metni",
                        "(Hesap kısıtlandıysa veya haksız red varsa, Facebook/Google/TikTok desteğine gönderilecek profesyonel İngilizce itiraz metni taslağı — kullanıma hazır)",
                      ].join(" ");

                      const imgParts = errImg.split(",");
                      const imgMediaType = (imgParts[0].match(/data:([^;]+);/) || ["","image/jpeg"])[1];
                      const b64 = imgParts[1];

                      const userMsg = [
                        "Ekran görüntüsündeki hata mesajını analiz et ve çözüm üret.",
                        errNote ? "Kullanıcının notu: " + errNote : "",
                      ].filter(Boolean).join(" ");

                      const resp = await fetch("/api/claude", {
                        method: "POST",
                        headers: {"Content-Type":"application/json"},
                        body: JSON.stringify({
                          model: selectedModel,
                          claudeModel: "claude-sonnet-4-20250514",
                          max_tokens: 3000,
                          system: sys,
                          messages: [{
                            role: "user",
                            content: [
                              {type:"image", source:{type:"base64", media_type: imgMediaType, data: b64}},
                              {type:"text", text: userMsg}
                            ]
                          }]
                        })
                      });
                      const data = await resp.json();
                      if (data.error) throw new Error(data.error.message || "API hatası");
                      if (data.usage && typeof window.__trackUsage === "function") window.__trackUsage("Hata Çözücü", data.usage, selectedModel);
                      const md = (data.content||[]).map(c=>c.text||"").join("").trim();
                      if (!md) throw new Error("Boş yanıt");
                      setErrResult(md);
                    } catch(e){ setErrError(e.message||String(e)); }
                    setErrLoading(false);
                  }}>
                  {errLoading ? (selectedModel==="gemini"?"⚡ Gemini Analiz Ediyor...":"🧠 Claude Analiz Ediyor...") : "🚑 Hatayı Teşhis Et ve Çöz"}
                </button>
              </div>

              {/* Loading */}
              {errLoading && (
                <div style={{background:"#141820",border:"1px solid #2A3040",borderRadius:16,padding:"32px 24px",textAlign:"center",marginBottom:16}}>
                  <div style={{fontSize:36,marginBottom:12}} className="adv-spin">🔍</div>
                  <div style={{fontWeight:700,fontSize:15,color:"#E8ECF4",marginBottom:6}}>Hata mesajı okunuyor...</div>
                  <div style={{fontSize:13,color:"#FF6B6B",marginBottom:3}}>Reklam politikaları ve kural ihlalleri kontrol ediliyor...</div>
                  <div style={{fontSize:13,color:"#8892A6"}}>Adım adım çözüm hazırlanıyor...</div>
                  <div style={{fontSize:11,color:"#6C5CE7",marginTop:8}}>10-20 saniye sürebilir</div>
                </div>
              )}

              {/* Error */}
              {errError && (
                <div className="adv-bad" style={{marginBottom:16}}>
                  <div style={{fontWeight:600,marginBottom:4}}>Hata</div>
                  <div style={{fontSize:13}}>{errError}</div>
                </div>
              )}

              {/* Result */}
              {errResult && !errLoading && (
                <div className="adv-fade">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#00D68F"}}>✅ Teşhis ve çözüm hazır</div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="adv-btn-ghost" style={{fontSize:12,padding:"7px 14px"}}
                        onClick={()=>{try{navigator.clipboard.writeText(errResult);}catch(e){}}}>
                        Kopyala
                      </button>
                      <button className="adv-btn-ghost" style={{fontSize:12,padding:"7px 14px"}}
                        onClick={()=>{setErrResult("");setErrImg("");setErrNote("");setErrError("");}}>
                        Yeni Analiz
                      </button>
                    </div>
                  </div>
                  <div style={{background:"#141820",border:"1px solid #2A3040",borderRadius:16,padding:"24px 28px"}}>
                    <div className="md-report" dangerouslySetInnerHTML={{__html: renderMd(errResult)}}/>
                  </div>
                </div>
              )}
            </div>
          )}



        </div>
      </div>
    </div>
  );
}
