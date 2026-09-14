import React, { useState } from "react";
import {
  Globe,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Maximize2,
  Minimize2,
  Power,
  Search,
  BookOpen,
  Info,
  Layers,
  ExternalLink as OpenIcon
} from "lucide-react";

interface MonitorSite {
  id: string;
  name: string;
  category: "Airspace & Security" | "Emergency & Rad" | "Tactical OSINT" | "Humanitarian";
  url: string;
  desc: string;
  descAr: string;
  embeddableHint: string;
}

const EMERGENCY_SITES: MonitorSite[] = [
  {
    id: "flightradar",
    name: "Flight Radar 24",
    category: "Airspace & Security",
    url: "https://www.flightradar24.com/33.24,45.57/5",
    desc: "Real-time, active transponder and flight tracking map over MENA boundaries.",
    descAr: "خريطة تتبع الرحلات المباشرة وحركة الملاحة الجوية والترددات الجوية النشطة فوق الحدود.",
    embeddableHint: "Embed secure. If map refuses to render, open in external tab."
  },
  {
    id: "liveuamap",
    name: "Live Universal Awareness Map",
    category: "Tactical OSINT",
    url: "https://liveuamap.com/",
    desc: "Interactive live coverage map of hot conflict lines, geopolitical incidents, and drone alerts.",
    descAr: "تغطية فورية وخرائط حية تفاعلية للنزاعات الجارية، الأحداث الجيوسياسية، والإنذارات.",
    embeddableHint: "High defense walls. Direct link recommended for real-time layers."
  },
  {
    id: "safeairspace",
    name: "Safe Airspace Tracking",
    category: "Airspace & Security",
    url: "https://safeairspace.net/",
    desc: "Aggregated risk indices, no-fly parameters, and active missile boundary guidance indices.",
    descAr: "مؤشرات المخاطر المجمعة، معطيات مناطق حظر الطيران، وتوجيهات أمن المقذوفات والملاحة الجوية.",
    embeddableHint: "Strict security frames. Clicking Direct Link opens current threat bulletin index."
  },
  {
    id: "readygov",
    name: "Ready.gov Nuclear & Radiation",
    category: "Emergency & Rad",
    url: "https://www.ready.gov/radiation",
    desc: "Official emergency protection protocols, fallout shelter guides, and post-seismic checklists.",
    descAr: "بروتوكولات الحماية من الإشعاع النووي الرسمية، أدلة الملاجئ، وإرشادات السلامة من الكوارث.",
    embeddableHint: "US Gov security limits embeds. Direct link is optimal for full reading."
  },
  {
    id: "ngo-safety",
    name: "INSO International NGO Safety",
    category: "Humanitarian",
    url: "https://www.ngosafety.org/",
    desc: "Frictional incident indexes and safety advisories for dynamic active conflict borders.",
    descAr: "مؤشرات الحوادث الدورية ومشورات السلامة وتحركات الفرق الميدانية في مناطق النزاع.",
    embeddableHint: "Embedded frames available. Open in direct tab for regional maps."
  },
  {
    id: "wikivoyage-warzones",
    name: "Wikivoyage War Zone Safety",
    category: "Tactical OSINT",
    url: "https://en.wikivoyage.org/wiki/War_zone_safety",
    desc: "Crowdsourced emergency guidelines, communication protocols, and physical border navigation info.",
    descAr: "إرشادات الطوارئ التشاركية، أدلة الاتصال المشفر، ومعلومات العبور ومغادرة المناطق الخطرة.",
    embeddableHint: "Fully embedded. Excellent static database of physical survival checklists."
  },
  {
    id: "globalincident",
    name: "Global Incident Map",
    category: "Tactical OSINT",
    url: "https://www.globalincidentmap.com/",
    desc: "Aggregating chemical leaks, terrorism events, and structural collapses into visual coordinates.",
    descAr: "تجميع التسريبات الكيميائية، وقائع التهديد والخراب الميداني في إحداثيات جغرافية واضحة.",
    embeddableHint: "Embeds successfully. Use secondary controls to reset tracking zoom."
  },
  {
    id: "unmas",
    name: "UNMAS (United Nations Mine Action)",
    category: "Humanitarian",
    url: "https://www.unmas.org/",
    desc: "Dynamic reports pinpointing unexploded ordnance vectors and physical mine fields.",
    descAr: "تقارير وتقييمات تفاعلية لتحديد مواقع الألغام الأرضية ومخلفات الحروب عبر الأمم المتحدة.",
    embeddableHint: "Fully embeddable. Essential for planning local physical maneuvers."
  },
  {
    id: "defensegov",
    name: "Defense.gov Preparedness Guidelines",
    category: "Airspace & Security",
    url: "https://www.defense.gov/Multimedia/Experience/Prepare",
    desc: "Strategic military response frameworks, supply preparedness lists, and crisis guides.",
    descAr: "أطر الاستجابة العسكرية الاستراتيجية، لوائح الاستعداد ومخزونات الطوارئ وإرشادات الأزمات.",
    embeddableHint: "Defense headers might block iframe, click Direct Link if blank."
  },
  {
    id: "foreignpress",
    name: "Foreign Press Journalist Safety",
    category: "Tactical OSINT",
    url: "https://foreignpress.org/journalism-resources/how-journalists-can-stay-safe-in-warzones",
    desc: "Hostile workspace training, crisis digital communication, and civilian safety protocols.",
    descAr: "تدريبات الميدان العدائى، حماية الاتصالات الرقمية في الأزمات وبروتوكولات سلامة الطواقم الصحفية.",
    embeddableHint: "Fully embeddable. Professional advice on signal protection."
  },
  {
    id: "smartraveller",
    name: "Smartraveller (AU Govt)",
    category: "Tactical OSINT",
    url: "https://www.smartraveller.gov.au/",
    desc: "Country-specific threat indexes, warning charts, and travel bans verified by Australian DFAT.",
    descAr: "تحذيرات السفر ومؤشرات الأخطار المحددة لكل دولة والمعتمدة من الخارجية الأسترالية.",
    embeddableHint: "Gov security may refuse frame. Open directly to see the interactive region picker."
  },
  {
    id: "redcross-apps",
    name: "ICRC Red Cross Crisis Apps",
    category: "Humanitarian",
    url: "https://www.icrc.org/en/download-apps",
    desc: "Civilian first aid indexes, offline survival handbooks, and emergency location beacons.",
    descAr: "مؤشرات الإسعافات الأولية للمدنيين، كتيبات الصمود غير المتصلة بالإنترنت، ومنارات تحديد المواقع.",
    embeddableHint: "Fully compatible. Recommends downloading official mobile APKs."
  },
  {
    id: "ifrc",
    name: "IFRC Disaster Portal",
    category: "Humanitarian",
    url: "https://www.ifrc.org/",
    desc: "Global red crescent humanitarian statistics, relief updates, and localized crisis channels.",
    descAr: "إحصائيات الهلال الأحمر والصليب الأحمر، مستجدات الإغاثة الإقليمية وخرائط التدخل العاجل.",
    embeddableHint: "Embed status stable. Use search bars inside to search operational databases."
  },
  {
    id: "unhcr",
    name: "UNHCR Refugee Agency Wire",
    category: "Humanitarian",
    url: "https://www.unhcr.org/",
    desc: "Official border crossing updates, refugee statistics, and legal safe corridor directions.",
    descAr: "مستجدات العبور الحدودية الرسمية، إحصائيات التدفق واللجوء وتوجيهات الممرات الإنسانية الآمنة.",
    embeddableHint: "Fully embeddable. Real-time maps of international displacements."
  },
  {
    id: "windy",
    name: "Windy Fallout Tracker",
    category: "Airspace & Security",
    url: "https://www.windy.com",
    desc: "Predictive atmospheric wind, current barometric pressures, and particulate shift models.",
    descAr: "نماذج التنبؤ بالرياح الجوية، مؤشرات الضغط الجواني وحركة الغبار والجسيمات لتتبع الكوارث.",
    embeddableHint: "Compatible. Turn on 'Particulates/Dust' overlay inside Windy to trace fallout."
  },
  {
    id: "amnesty-citizen",
    name: "Amnesty Citizen Evidence",
    category: "Tactical OSINT",
    url: "https://citizenevidence.amnestyusa.org/",
    desc: "Citizen Evidence Metadata Viewer by Amnesty International. Extract video upload timestamps, reverse-lookup thumbnails, and execute deep visual forensic audits.",
    descAr: "شاشة قراءة بيانات الفيديو العكسية لمنظمة العفو الدولية لاستخراج وقت الرفع الأصلي ومعاينة المشاهد الجنائية.",
    embeddableHint: "YouTube forensics proxy. Open in external tab for instant metadata queries."
  },
  {
    id: "waybien",
    name: "Waybien",
    category: "Tactical OSINT",
    url: "https://waybien.com/",
    desc: "Dynamic live visual tracking matrix mapping signal intercepts, tactical aviation nodes, and geopolitical coordinate updates.",
    descAr: "مصفوفة تتبع بصرية حية لمطابقة مسارات الإشارات الجوية والمحيطية والتحركات الحدودية.",
    embeddableHint: "Interactive intelligence database. Opens in direct tab for best spatial rendering."
  },
  {
    id: "insecam",
    name: "Insecam CCTV Wall",
    category: "Tactical OSINT",
    url: "https://www.insecam.org/",
    desc: "Live directory of public IP security cameras worldwide. Trace seaport gates, city junctions, and border checkpoints in real-time.",
    descAr: "دليل النبض المباشر لكاميرات المراقبة المتاحة عاماً لرصد الموانئ والتقاطعات والأنشطة الميدانية.",
    embeddableHint: "Responsive public CCTV streams. Access external tab if geo-blocking occurs."
  },
  {
    id: "imageops",
    name: "ImageOps Forensic Utility",
    category: "Tactical OSINT",
    url: "https://imageops.org/",
    desc: "Instant image toolkit. Recovers hidden metadata, evaluates color alteration ratios, and runs lightning-fast reverse-search lookups.",
    descAr: "أدوات التشريح الجنائي للصور؛ استخراج الميتا العكسية وبيانات التعديل والبحث البصري السريع.",
    embeddableHint: "Tool heavy client app. Drop web links or files straight into the canvas."
  },
  {
    id: "iplogger",
    name: "IP Logger Tracker",
    category: "Tactical OSINT",
    url: "https://iplogger.org/",
    desc: "Advanced tracking, digital signature locator, and network gateway profiling metrics.",
    descAr: "أداة تتبع بصمات الروابط وتحديد بوابات الخروج الرقمية والمسارات السيبرانية.",
    embeddableHint: "IP validation interface. Recommended to spawn trackers in separate browser tab."
  },
  {
    id: "intelligenceonchain",
    name: "Intelligence On Chain",
    category: "Tactical OSINT",
    url: "https://osint.intelligenceonchain.com/",
    desc: "Web3 OSINT node tracker. Maps blockchain wallet flows, traces funding vectors, and audits cryptographical transactions.",
    descAr: "منصة تتبع محافظ الويب٣ ورسم مسارات تدفق الأموال الرقمية المشفرة وتدقيق التحويلات.",
    embeddableHint: "DeFi analysis node. High memory usage; open in direct tab for charts."
  },
  {
    id: "bosint",
    name: "BOSINT Ledger Auditor",
    category: "Tactical OSINT",
    url: "https://app.bosint.gg/",
    desc: "Advanced Blockchain OSINT auditor centering entity correlations, illicit wallet labels, and high-frequency digital asset paths.",
    descAr: "مدقق بلوكشين متقدم لربط الكيانات وتحديد العناوين الرقمية المشبوهة وحركة الأصول الرقمية.",
    embeddableHint: "Dynamic canvas layout. Use direct tabs to explore full network link graphs."
  },
  {
    id: "pikaosint",
    name: "PikaOSINT Search Board",
    category: "Tactical OSINT",
    url: "https://pikaosint.pages.dev/",
    desc: "Consolidated open-source portal designed to look up usernames, e-mails, phone numbers, and distributed system logs.",
    descAr: "منصة استعلام استخباري موحد عن أسماء المستخدمين والبريد وبصمات المنظومة الرقمية.",
    embeddableHint: "Fully embedded directory. Use search fields to activate distributed filters."
  }
];

export default function EmergencyWebsiteWall({ language, theme }: { language: "en" | "ar"; theme: "dark" | "light" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  
  // Track which indices are active (loaded)
  const [activeSiteIds, setActiveSiteIds] = useState<Record<string, boolean>>({
    flightradar: true, // Auto-load flightradar first as primary
    liveuamap: false
  });

  const [maximizedSiteId, setMaximizedSiteId] = useState<string | null>(null);

  // Toggle dynamic site frame loading
  const toggleSiteState = (id: string) => {
    setActiveSiteIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Turn on/activate all sites sequentially
  const activateAll = () => {
    const freshStates: Record<string, boolean> = {};
    EMERGENCY_SITES.forEach(s => {
      freshStates[s.id] = true;
    });
    setActiveSiteIds(freshStates);
  };

  // Turn off all iframes to rescue resources
  const clearAll = () => {
    setActiveSiteIds({});
  };

  // Reload action for individual frame
  const reloadFrame = (id: string) => {
    setActiveSiteIds(prev => ({ ...prev, [id]: false }));
    setTimeout(() => {
      setActiveSiteIds(prev => ({ ...prev, [id]: true }));
    }, 100);
  };

  const filteredSites = EMERGENCY_SITES.filter(site => {
    const targetDesc = language === "ar" ? site.descAr : site.desc;
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          targetDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || site.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isLight = theme === "light";
  const bgClass = isLight ? "bg-white text-zinc-900 border-zinc-200" : "bg-zinc-900 text-slate-100 border-zinc-800";
  const headerBgClass = isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-950 border-white/5";
  const cardBgClass = isLight ? "bg-white border-zinc-200 hover:border-zinc-350" : "bg-zinc-950 border-white/5";
  const textClass = isLight ? "text-zinc-900" : "text-white";
  const subtextClass = isLight ? "text-zinc-500" : "text-zinc-400";
  const inputBgClass = isLight ? "bg-zinc-50 border-zinc-250 text-zinc-900 placeholder-zinc-400" : "bg-black border-white/10 text-zinc-300 placeholder-zinc-500";
  const borderClass = isLight ? "border-zinc-200" : "border-white/5";
  const badgeClass = isLight ? "bg-zinc-100 border-zinc-200 text-zinc-700" : "bg-amber-950/40 text-amber-550 border-amber-900/60";

  return (
    <div className={`border rounded-2xl overflow-hidden shadow-2xl flex flex-col ${bgClass} transition-colors duration-200`} id="emergency-osint-matrix" dir={language === "ar" ? "rtl" : "ltr"}>
      
      {/* Search & Controller Banner */}
      <div className={`${headerBgClass} p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200`}>
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-950 text-amber-500 rounded-xl border border-amber-900/40 animate-pulse flex-shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-sm font-black uppercase tracking-wider ${textClass}`}>
              {language === "ar" ? "جدار مواقع الطوارئ والـ OSINT التفاعلي" : "Emergency & OSINT Website Wall"}
            </h2>
            <p className={`text-[10px] ${subtextClass}`}>
              {language === "ar" ? "منصة تفاعلية تمثل ١٥ مرصداً أمنياً. انقر على أي نافذة لتشغيل أداة المتابعة الحية." : "Interactive sandbox representing 15 high-risk monitors. Click any window to load the tracking console."}
            </p>
          </div>
        </div>

        {/* Global Controls & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder={language === "ar" ? "تصفية بالكلمات الدليلية..." : "Filter by keyword..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputBgClass} border text-[11px] pl-8 pr-3 py-1.5 rounded-lg w-44 focus:outline-none focus:border-amber-600`}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`${inputBgClass} border text-[11px] px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-amber-600`}
          >
            <option value="ALL">{language === "ar" ? "كل الفئات" : "All Categories"}</option>
            <option value="Airspace & Security">{language === "ar" ? "الملاحة الجوية والمرور" : "Airspace & Traffic"}</option>
            <option value="Emergency & Rad">{language === "ar" ? "الأخطار والإشعاع" : "Hazard & Radiation"}</option>
            <option value="Tactical OSINT">{language === "ar" ? "الاستخبارات مفتوحة المصدر" : "Tactical OSINT"}</option>
            <option value="Humanitarian">{language === "ar" ? "منظمات الإغاثة الإنسانية" : "Humanitarian NGO"}</option>
          </select>

          <button
            onClick={activateAll}
            className="bg-amber-800 hover:bg-amber-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg border border-amber-700 cursor-pointer transition-all"
          >
            {language === "ar" ? "تنشيط جميع النوافذ حياً" : "Activate All Windows"}
          </button>

          <button
            onClick={clearAll}
            className="bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white text-[11px] font-bold py-1.5 px-3 rounded-lg border border-white/5 cursor-pointer transition-all"
            title="Saves local memory by shutting down all active frames"
          >
            {language === "ar" ? "تنظيف الذاكرة (إغلاق الكل)" : "Settle RAM (Shut All)"}
          </button>
        </div>

      </div>

      {/* Main Grid View */}
      <div className={`p-4 ${isLight ? "bg-zinc-50" : "bg-zinc-950/40"} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5`}>
        {filteredSites.map((site) => {
          const isLive = activeSiteIds[site.id];
          const isMaximized = maximizedSiteId === site.id;

          return (
            <div
              key={site.id}
              className={`${isLight ? "bg-white" : "bg-zinc-950"} rounded-2xl overflow-hidden border transition-all flex flex-col relative group ${
                isLive ? "border-amber-600/60 shadow-[0_0_15px_rgba(245,158,11,0.05)]" : borderClass
              } ${isMaximized ? "md:col-span-2 lg:col-span-3 h-[600px]" : "h-[380px]"}`}
            >
              
              {/* Radar Card Header */}
              <div 
                className={`${isLight ? "bg-zinc-50" : "bg-zinc-900"} px-3.5 py-2.5 border-b ${borderClass} flex items-center justify-between cursor-pointer hover:bg-zinc-850`}
                onClick={() => toggleSiteState(site.id)}
              >
                <div className="flex items-center gap-2 overflow-hidden mr-3">
                  <span className={`w-2 h-2 rounded-full ${
                    isLive ? "bg-amber-500 animate-pulse" : "bg-zinc-400"
                  }`} />
                  <div>
                    <h3 className={`text-xs font-bold ${textClass} uppercase tracking-wide truncate`}>
                      {site.name}
                    </h3>
                    <span className="text-[8px] text-zinc-500 font-mono tracking-widest block uppercase">
                      {site.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {/* Activate button */}
                  <button
                    onClick={() => toggleSiteState(site.id)}
                    className={`text-[9px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                      isLive 
                        ? "bg-amber-950/40 text-amber-500 border-amber-900/60 hover:bg-transparent" 
                        : isLight 
                        ? "bg-zinc-100 text-zinc-650 border-zinc-250 hover:bg-zinc-200" 
                        : "bg-zinc-950 text-zinc-500 border-white/5 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    {isLive ? (language === "ar" ? "تعطيل" : "OFFLINE") : (language === "ar" ? "تشغيل" : "CONNECT")}
                  </button>

                  {/* Refresh */}
                  {isLive && (
                    <button
                      onClick={() => reloadFrame(site.id)}
                      className="p-1 text-zinc-500 hover:text-red-500 rounded cursor-pointer"
                      title="Reload feed iframe"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Open Direct Tab */}
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-zinc-500 hover:text-red-500"
                    title="Open directly in responsive new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Maximize Toggle */}
                  <button
                    onClick={() => setMaximizedSiteId(isMaximized ? null : site.id)}
                    className="p-1 text-zinc-500 hover:text-red-500 cursor-pointer"
                    title={isMaximized ? "Minimize window" : "Maximize view"}
                  >
                    {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Terminal View Body */}
              <div className="flex-1 bg-black relative overflow-hidden flex flex-col justify-between">
                
                {isLive ? (
                  <div className="w-full h-full relative">
                    <iframe
                      src={site.url}
                      title={site.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full border-0 bg-black absolute inset-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    />
                    
                    {/* Security Fallback Banner */}
                    <div className="absolute top-2 left-2 right-2 bg-black/95 p-1 px-2.5 rounded border border-white/10 text-[9px] text-zinc-400 leading-normal pointer-events-auto flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
                      <span className="truncate">
                        {language === "ar" ? "🛡️ قيود الأمن تمنع ظهور النافذة؟" : "🛡️ Gov security headers block frame load?"}
                      </span>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline font-bold flex items-center gap-0.5 ml-2 mr-1 shrink-0"
                      >
                        {language === "ar" ? "افتح في علامة تبويب جديدة" : "OPEN NEW TAB"} <OpenIcon className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center cursor-pointer hover:bg-zinc-950/20 transition-all select-none"
                    onClick={() => toggleSiteState(site.id)}
                  >
                    <div className="p-3 bg-zinc-900 rounded-full border border-white/5 text-zinc-650 group-hover:text-amber-500 group-hover:border-amber-500/20 transition-all">
                      <Power className="w-6 h-6 text-amber-500" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 block tracking-widest uppercase mb-1">
                      {language === "ar" ? "حالة الإتصال: غير متصل" : "CONNECTION: OFFLINE"}
                    </span>
                    <h4 className="text-xs font-bold text-slate-300 group-hover:text-amber-400 transition-colors">
                      {site.name}
                    </h4>
                    <p className="text-[10px] text-zinc-500 leading-relaxed max-w-[240px] mt-1">
                      {language === "ar" ? site.descAr : site.desc}
                    </p>
                    <button className="mt-4 px-3 py-1 bg-zinc-900 border border-white/10 text-[9px] font-bold text-zinc-400 group-hover:border-amber-500 group-hover:text-white transition-all uppercase rounded-lg cursor-pointer">
                      {language === "ar" ? "انقر لتنشيط نافذة العرض" : "Click to Activate Stream Window"}
                    </button>
                  </div>
                )}

                {/* Info Footer Block */}
                <div className="bg-zinc-950 p-2.5 px-3.5 border-t border-white/5 text-[9px] text-zinc-500 font-mono flex items-center gap-1.5 justify-between select-none">
                  <span className="truncate">
                    ID: {site.id.toUpperCase()} // HINT: {site.embeddableHint}
                  </span>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white uppercase text-[8px] font-bold shrink-0 flex items-center gap-0.5"
                  >
                    {language === "ar" ? "خارجي" : "External"} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Advice warning footer */}
      <div className={`p-4 ${isLight ? "bg-zinc-50" : "bg-zinc-950"} border-t ${borderClass} text-[10px] ${subtextClass} flex items-start gap-2 transition-colors duration-200`}>
        <Info className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
        <p>
          <strong>{language === "ar" ? "إشعار حماية وحظر التضمين للأطر (CORS / Same-Origin):" : "CORS / Frame Protection Notice:"}</strong> {language === "ar" ? "تفرض بعض قواعد البيانات والوزارات الوطنية الاستراتيجية (مثل Ready.gov، Smartraveller، والملفات العسكرية) شفرات أمان مشددة وواضحة (مثل X-Frame-Options: SAMEORIGIN) تمنع المتصفح من شحن نافذتها داخل إطار مدمج. تفادياً لذلك، يتيح جدارنا المتكامل رابطاً مباشراً وسريعا 'افتح في تبويب جديد' على رأس كل نافذة رصد حتى تتمكنوا من معاينة التوجيهات الرسمية بدون عوائق." : "Many high-security national databases (e.g. Ready.gov, Australian Smartraveller, US Defence guidelines) set explicit cryptographical protection headers (like X-Frame-Options: SAMEORIGIN) that mandate browser blocks inside generic sandbox frameworks. Since security is priority, we provide the 'OPEN NEW TAB' bypass element on every terminal top bar so you can review official directives instantly if embeds restrict access."}
        </p>
      </div>

    </div>
  );
}
