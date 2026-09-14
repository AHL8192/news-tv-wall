import React, { useState, useEffect } from "react";
import {
  Tv,
  Radio,
  RefreshCw,
  AlertTriangle,
  Shield,
  CheckCircle,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  LayoutGrid,
  Maximize2,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from "lucide-react";

interface ChannelPreset {
  id: string;
  name: string;
  nameAr: string;
  youtubeId: string;
  sourceUrl: string;
  desc: string;
  descAr: string;
  category: string;
  categoryAr: string;
}

const PRESET_CHANNELS: ChannelPreset[] = [
  {
    id: "alj-ar",
    name: "Al Jazeera Arabic Live",
    nameAr: "الجزيرة العربية مباشر",
    youtubeId: "bNyUyrR0PHo",
    sourceUrl: "https://www.aljazeera.net/video/live",
    desc: "Arabic live stream covering continuous Middle East crisis indicators.",
    descAr: "البث الحي لقناة الجزيرة الإخبارية لمتابعة التطورات في الشرق الأوسط.",
    category: "MENA News",
    categoryAr: "أخبار الشرق الأوسط"
  },
  {
    id: "alj-mubashir",
    name: "Al Jazeera Mubashir",
    nameAr: "الجزيرة مباشر",
    youtubeId: "NNnZLWHRmd4",
    sourceUrl: "https://www.aljazeera.net/video/live/%D8%A7%D9%84%D8%AC%D8%B2%D9%8E%D9%82%D8%A8%D8%A7-%D9%85%D8%A8%D8%A4%D8%B4%D8%B1",
    desc: "Direct unedited broadcasts of key physical global press conferences.",
    descAr: "بث حي مباشر غير محرر للمؤتمرات الصحفية والفعاليات الدبلوماسية والسياسية.",
    category: "MENA News",
    categoryAr: "أخبار الشرق الأوسط"
  },
  {
    id: "al-arabiya",
    name: "Al Arabiya Live",
    nameAr: "العربية مباشر",
    youtubeId: "n7eQejkXbnM",
    sourceUrl: "https://www.alarabiya.net/live-stream",
    desc: "Major pan-Arab global news stream reporting key defense alerts.",
    descAr: "البث الحي لقناة العربية الإخبارية وتحديثات الساحة العربية والدولية.",
    category: "MENA News",
    categoryAr: "أخبار الشرق الأوسط"
  },
  {
    id: "al-hadath",
    name: "Al Hadath Live",
    nameAr: "الحدث مباشر",
    youtubeId: "SPvxA_UuoYY",
    sourceUrl: "https://www.alarabiya.net/live-stream",
    desc: "Dedicated tactical reports and defense parameters update.",
    descAr: "قناة تابعة للعربية تركز على تحليلات المعارك والأحداث الميدانية العاجلة.",
    category: "MENA News",
    categoryAr: "أخبار الشرق الأوسط"
  },
  {
    id: "trt-world",
    name: "TRT World English",
    nameAr: "تي آر تي التركية العالمية",
    youtubeId: "oNUi_iXNPeo",
    sourceUrl: "https://www.trtworld.com/live",
    desc: "Turkish public wire covering Euro-Mediterranean geo-strategy.",
    descAr: "البث الدولي التركي الناطق بالإنجليزية لتغطية القضايا السياسية العالمية.",
    category: "Global News",
    categoryAr: "أخبار عالمية"
  },
  {
    id: "iran-intl",
    name: "Iran International Live",
    nameAr: "إيران إنترناشيونال",
    youtubeId: "5JDxjsAVaGk",
    sourceUrl: "https://www.iranintl.com/",
    desc: "Persian news monitoring agency focused on Middle East conflicts.",
    descAr: "البث الحي الناطق بالفارسية لتتبع ملفات طهران والإقليم.",
    category: "Regional Intel",
    categoryAr: "إقليمي ومراقبة"
  },
  {
    id: "bbc-persian",
    name: "BBC News Persian TV",
    nameAr: "بي بي سي فارسي",
    youtubeId: "XRHV-9m_WO4",
    sourceUrl: "https://www.bbc.com/persian",
    desc: "BBC Persian division broadcast tracking nuclear and tactical events.",
    descAr: "البث الفارسي لهيئة الإذاعة البريطانية لمراقبة التطورات السياسية.",
    category: "Regional Intel",
    categoryAr: "إقليمي ومراقبة"
  },
  {
    id: "sky-uk",
    name: "Sky News Live UK",
    nameAr: "سكاي نيوز البريطانية",
    youtubeId: "9Auqeyy8B8M",
    sourceUrl: "https://news.sky.com/watch-live",
    desc: "Continuous English premium dispatch monitoring European corridors.",
    descAr: "البث البريطاني المستمر لمتابعة تطورات أوروبا والأنباء العالمية.",
    category: "Global News",
    categoryAr: "أخبار عالمية"
  },
  {
    id: "france24",
    name: "France 24 English",
    nameAr: "فرانس ٢٤ الإنجليزية",
    youtubeId: "h3MuIUNMwzI",
    sourceUrl: "https://www.france24.com/en/",
    desc: "European perspectives on West African and Mediterranean corridors.",
    descAr: "البث الإخباري الفرنسي باللغة الإنجليزية لتتبع السياسات الأفرو-أوروبية.",
    category: "Global News",
    categoryAr: "أخبار عالمية"
  }
];

interface ActiveTV {
  id: string;
  name: string;
  youtubeId: string;
  isMuted: boolean;
  refreshKey: number;
  customUrl?: string;
  quality?: "240p" | "360p" | "480p" | "720p" | "1080p";
}

export default function LiveBroadcastTerminal({ language = "en", theme = "dark" }: { language?: "en" | "ar"; theme?: "dark" | "light" }) {
  // We represent multiple TVs on a wall using an array of ActiveTV elements
  const [screens, setScreens] = useState<ActiveTV[]>([]);

  // Initialize screens once on client to prevent SSR or hot reloading duplication
  useEffect(() => {
    setScreens([
      {
        id: "tv-1",
        name: language === "ar" ? "الجزيرة العربية مباشر" : "Al Jazeera Arabic Live",
        youtubeId: "bNyUyrR0PHo",
        isMuted: false,
        refreshKey: 0,
        quality: "240p"
      },
      {
        id: "tv-2",
        name: language === "ar" ? "الحدث مباشر" : "Al Hadath Live",
        youtubeId: "SPvxA_UuoYY",
        isMuted: true,
        refreshKey: 0,
        quality: "240p"
      },
      {
        id: "tv-3",
        name: language === "ar" ? "تي آر تي التركية العالمية" : "TRT World English",
        youtubeId: "oNUi_iXNPeo",
        isMuted: true,
        refreshKey: 0,
        quality: "240p"
      },
      {
        id: "tv-4",
        name: language === "ar" ? "الجزيرة مباشر" : "Al Jazeera Mubashir",
        youtubeId: "NNnZLWHRmd4",
        isMuted: true,
        refreshKey: 0,
        quality: "240p"
      },
      {
        id: "tv-5",
        name: language === "ar" ? "العربية مباشر" : "Al Arabiya Live",
        youtubeId: "n7eQejkXbnM",
        isMuted: true,
        refreshKey: 0,
        quality: "240p"
      },
      {
        id: "tv-6",
        name: language === "ar" ? "إيران إنترناشيونال" : "Iran International Live",
        youtubeId: "5JDxjsAVaGk",
        isMuted: true,
        refreshKey: 0,
        quality: "240p"
      },
      {
        id: "tv-7",
        name: language === "ar" ? "بي بي سي فارسي" : "BBC News Persian TV",
        youtubeId: "XRHV-9m_WO4",
        isMuted: true,
        refreshKey: 0,
        quality: "240p"
      },
      {
        id: "tv-8",
        name: language === "ar" ? "سكاي نيوز البريطانية" : "Sky News Live UK",
        youtubeId: "9Auqeyy8B8M",
        isMuted: true,
        refreshKey: 0,
        quality: "240p"
      },
      {
        id: "tv-9",
        name: language === "ar" ? "فرانس ٢٤ الإنجليزية" : "France 24 English",
        youtubeId: "h3MuIUNMwzI",
        isMuted: true,
        refreshKey: 0,
        quality: "240p"
      }
    ]);
    setActiveSelectScreenId("tv-1");
  }, [language]);

  const [activeSelectScreenId, setActiveSelectScreenId] = useState<string>("tv-1");
  const [customStreamInput, setCustomStreamInput] = useState<string>("");
  const [customStreamTitle, setCustomStreamTitle] = useState<string>("");

  // Helper to extract clean youtube 11 character ID
  const parseYoutubeId = (url: string): string => {
    if (!url) return "";
    const clean = url.trim();
    const matchId = clean.match(/^([\w-]{11})$/);
    if (matchId) return clean;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = clean.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    return "";
  };

  // Add custom stream to active selected screen or add a brand new screen
  const addCustomStream = (toSelected: boolean = true) => {
    const videoId = parseYoutubeId(customStreamInput);
    const titleObj = customStreamTitle.trim() || (videoId ? "Custom YouTube" : "External Feed");
    
    if (toSelected && screens.some(s => s.id === activeSelectScreenId)) {
      setScreens(prev =>
        prev.map(s => {
          if (s.id === activeSelectScreenId) {
            return {
              ...s,
              name: titleObj,
              youtubeId: videoId,
              customUrl: videoId ? undefined : customStreamInput,
              refreshKey: s.refreshKey + 1
            };
          }
          return s;
        })
      );
    } else {
      // Add as a brand new TV
      const newTV: ActiveTV = {
        id: `tv-custom-${Date.now()}`,
        name: titleObj,
        youtubeId: videoId,
        isMuted: true,
        refreshKey: 0,
        customUrl: videoId ? undefined : customStreamInput,
        quality: "240p"
      };
      setScreens(prev => [...prev, newTV]);
      setActiveSelectScreenId(newTV.id);
    }

    setCustomStreamInput("");
    setCustomStreamTitle("");
  };

  // Switch preset into currently focused active TV
  const handleSelectPreset = (preset: ChannelPreset) => {
    // Click on a TV preset should not replace or remove any active screen. It should add a brand new one to the wall.
    const newTV: ActiveTV = {
      id: `tv-preset-${preset.id}-${Date.now()}`,
      name: language === "ar" ? preset.nameAr : preset.name,
      youtubeId: preset.youtubeId,
      isMuted: true,
      refreshKey: 0,
      customUrl: undefined,
      quality: "240p"
    };
    setScreens(prev => [...prev, newTV]);
    setActiveSelectScreenId(newTV.id);
  };

  // Switch sound focused state
  const toggleMute = (id: string) => {
    setScreens(prev =>
      prev.map(s => {
        if (s.id === id) {
          return { ...s, isMuted: !s.isMuted, refreshKey: s.refreshKey + 1 };
        }
        return s;
      })
    );
  };

  // Clear specific TV screen off the monitor array
  const removeScreen = (id: string) => {
    if (screens.length <= 1) return; // Keep at least one screen
    const remaining = screens.filter(s => s.id !== id);
    setScreens(remaining);
    if (activeSelectScreenId === id) {
      setActiveSelectScreenId(remaining[0].id);
    }
  };

  // Reset/sync refresh triggers for all frames at once
  const refreshAllScreens = () => {
    setScreens(prev => prev.map(s => ({ ...s, refreshKey: s.refreshKey + 1 })));
  };

  // Help quickly auto-mute all screens except the selected one
  const soloAudio = (id: string) => {
    setScreens(prev =>
      prev.map(s => ({
        ...s,
        isMuted: s.id !== id,
        refreshKey: s.refreshKey + 1
      }))
    );
  };

  // Grid styling selection based on screen amounts
  const getGridColsClass = () => {
    const len = screens.length;
    if (len === 1) return "grid-cols-1";
    if (len === 2) return "grid-cols-1 md:grid-cols-2";
    if (len === 3) return "grid-cols-1 md:grid-cols-3";
    if (len === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2";
    if (len <= 6) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  const isLight = theme === "light";
  const bgClass = isLight ? "bg-white text-zinc-900 border-zinc-200" : "bg-zinc-900 border-white/10 text-slate-100";
  const headerBgClass = isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-950 border-white/5";
  const textClass = isLight ? "text-zinc-900" : "text-white";
  const subtextClass = isLight ? "text-zinc-500" : "text-zinc-400";
  const inputBgClass = isLight ? "bg-zinc-100 border-zinc-250 text-zinc-900 placeholder-zinc-450" : "bg-black border-white/10 text-zinc-300 placeholder-zinc-500";
  const borderClass = isLight ? "border-zinc-200" : "border-white/5";

  return (
    <div className={`border rounded-2xl overflow-hidden shadow-2xl flex flex-col ${bgClass} transition-colors duration-200`} id="global-broadcast-matrix" dir={language === "ar" ? "rtl" : "ltr"}>
      
      {/* Upper header section specifying Multi-TV Wall options */}
      <div className={`${headerBgClass} p-4 border-b flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-colors duration-200`}>
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-950 text-red-500 rounded-xl border border-red-900/40 animate-pulse flex-shrink-0">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-sm font-black uppercase tracking-wider ${textClass}`}>
              {language === "ar" ? "جدار الرصد والبث التكتيكي المتعدد" : "Tactical Broadcasters Wall"}
            </h2>
            <p className={`text-[10px] ${subtextClass}`}>
              {language === "ar" ? "شبكة المراقبة والاستعراض المباشر: تلفزيونات مصفوفة تعمل بجانب بعضها مع تحديد جودة النطاق." : "Surveillance Grid: having a bunch of TVs sitting next to each other. YouTube Live embedded via backup routing."}
            </p>
          </div>
        </div>

        {/* Dynamic add customized stream action bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="text"
            placeholder={language === "ar" ? "رابط البث أو رابط اليوتيوب لمشاهدته..." : "Embed link, stream website, or YouTube Watch URL..."}
            value={customStreamInput}
            onChange={(e) => setCustomStreamInput(e.target.value)}
            className={`${inputBgClass} border text-[11px] px-3 py-1.5 rounded-lg min-w-[200px] flex-1 md:flex-initial focus:outline-none focus:border-red-650`}
          />
          <input
            type="text"
            placeholder={language === "ar" ? "عنوان مخصص (اختياري)" : "Custom title (optional)"}
            value={customStreamTitle}
            onChange={(e) => setCustomStreamTitle(e.target.value)}
            className={`${inputBgClass} border text-[11px] px-2 py-1.5 rounded-lg w-32 focus:outline-none focus:border-red-650`}
          />
          
          <button
            onClick={() => addCustomStream(true)}
            disabled={!customStreamInput.trim()}
            className="bg-zinc-850 hover:bg-zinc-800 disabled:opacity-50 text-yellow-500 text-[11px] font-bold py-1.5 px-3 rounded-lg border border-white/5 cursor-pointer transition-all flex items-center gap-1"
            title="Replace stream on the focused screen"
          >
            <span>{language === "ar" ? "حقن التلفزيون المحدد" : "Inject Selected TV"}</span>
          </button>

          <button
            onClick={() => addCustomStream(false)}
            disabled={!customStreamInput.trim()}
            className="bg-red-800 hover:bg-red-700 disabled:opacity-50 text-white text-[11px] font-extrabold py-1.5 px-3 rounded-lg border border-red-700 cursor-pointer transition-all flex items-center gap-1 animate-pulse"
            title="Add a brand new TV frame to the wall grid"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === "ar" ? "إضافة بث شاشة +" : "Add Stream TV +"}</span>
          </button>

          <button
            onClick={refreshAllScreens}
            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-white/10 cursor-pointer transition-colors"
            title="Synchronize/Refresh entire wall array"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Dynamic Viewport Grid representing the TV wall layout */}
      <div className={`p-4 ${isLight ? "bg-zinc-100" : "bg-black/60"} border-b ${borderClass}`}>
        <div className={`grid ${getGridColsClass()} gap-4`}>
          {screens.map((tv) => {
            const isFocused = tv.id === activeSelectScreenId;
            
            // Resolve iframe streaming location
            let srcUrl = "";
            if (tv.customUrl) {
              srcUrl = tv.customUrl;
            } else if (tv.youtubeId) {
              // Standard embed with essential params to enforce background inline playback & bypass error blocks
              const muteArg = tv.isMuted ? "1" : "0";
              const q = tv.quality || "240p";
              let vqParam = "small"; // Default to 240p
              if (q === "360p") vqParam = "medium";
              else if (q === "480p") vqParam = "large";
              else if (q === "720p") vqParam = "hd720";
              else if (q === "1080p") vqParam = "hd1080";
              
              srcUrl = `https://www.youtube.com/embed/${tv.youtubeId}?autoplay=1&mute=${muteArg}&playsinline=1&controls=1&enablejsapi=1&origin=${window.location.origin}&vq=${vqParam}`;
            }

            return (
              <div
                key={`${tv.id}-${tv.refreshKey}`}
                className={`rounded-xl overflow-hidden border transition-all flex flex-col relative ${isLight ? "bg-white" : "bg-zinc-950"} ${
                  isFocused
                    ? "border-red-600 ring-2 ring-red-950 shadow-[0_0_20px_rgba(239,68,68,0.15)] scale-[1.005]"
                    : borderClass
                }`}
                onClick={() => setActiveSelectScreenId(tv.id)}
              >
                {/* Micro TV Header Bar */}
                <div className={`${isLight ? "bg-zinc-50" : "bg-zinc-900"} px-3 py-2 flex items-center justify-between border-b ${borderClass} text-[11px] hover:bg-zinc-850 cursor-pointer`}>
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      tv.isMuted ? "bg-zinc-500" : "bg-emerald-500 animate-pulse"
                    }`} />
                    <span className={`font-bold ${textClass} truncate uppercase font-sans tracking-wide`}>
                      {tv.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Quality Selector */}
                    <select
                      value={tv.quality || "240p"}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setScreens(prev =>
                          prev.map(s => s.id === tv.id ? { ...s, quality: val, refreshKey: s.refreshKey + 1 } : s)
                        );
                      }}
                      className={`${isLight ? "bg-zinc-100 border-zinc-300 text-zinc-900" : "bg-black border-white/10 text-zinc-300"} border text-[9px] font-mono py-0.5 px-1 rounded focus:outline-none focus:border-red-600 cursor-pointer`}
                      title="Set Video Quality / Bandwidth Limit"
                    >
                      <option value="240p">240p ({language === "ar" ? "توفير" : "Saving"})</option>
                      <option value="360p">360p</option>
                      <option value="480p">480p</option>
                      <option value="720p">720p (HD)</option>
                      <option value="1080p">1080p (FHD)</option>
                    </select>

                    {/* Solo Sound Trigger */}
                    <button
                      onClick={() => soloAudio(tv.id)}
                      className={`p-1 text-[9px] font-extrabold px-1.5 rounded border cursor-pointer transition-all ${
                        isLight ? "bg-zinc-100 hover:bg-zinc-200 text-indigo-755 border-zinc-250" : "bg-zinc-950 hover:bg-black text-indigo-400 border-white/5"
                      }`}
                      title="Solo sound: mute other screens"
                    >
                      {language === "ar" ? "منفرد" : "SOLO"}
                    </button>

                    {/* Sound Switch */}
                    <button
                      onClick={() => toggleMute(tv.id)}
                      className={`p-1 rounded cursor-pointer ${
                        tv.isMuted 
                          ? isLight ? "bg-zinc-100 text-zinc-400 border border-zinc-250" : "bg-zinc-950 text-zinc-500"
                          : isLight ? "bg-red-50 text-red-600 border border-red-200" : "bg-red-950 text-red-400"
                      }`}
                      title={tv.isMuted ? "Unmute stream" : "Mute stream"}
                    >
                      {tv.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>

                    {/* Refresh Screen */}
                    <button
                      onClick={() => {
                        setScreens(prev =>
                          prev.map(s => s.id === tv.id ? { ...s, refreshKey: s.refreshKey + 1 } : s)
                        );
                      }}
                      className="p-1 text-zinc-500 hover:text-red-500 cursor-pointer"
                      title="Refresh standard frame"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete screen */}
                    <button
                      onClick={() => removeScreen(tv.id)}
                      className="p-1 text-zinc-400 hover:text-red-600 disabled:opacity-40 cursor-pointer"
                      disabled={screens.length <= 1}
                      title="Turn off this TV"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtitle / Focus outline wrapper & Embed iframe */}
                <div className="bg-black relative aspect-video w-full">
                  {srcUrl ? (
                    <iframe
                      src={srcUrl}
                      title={tv.name}
                      className="w-full h-full border-0 absolute inset-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-zinc-500 space-y-2">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      <p className="text-[10px] font-sans">No stream parameters assigned.</p>
                      <p className="text-[9px] text-zinc-650">Select any preset below or write in custom link to initiate stream.</p>
                    </div>
                  )}

                  {/* Micro Indicators overlay */}
                  <div className="absolute bottom-2 left-2 bg-black/85 px-2 py-0.5 rounded text-[8px] font-mono text-zinc-400 tracking-wider pointer-events-none border border-white/5">
                    TV ID: {tv.id.toUpperCase()} // VOL: {tv.isMuted ? "MUTE" : "ON"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preset Command Center selection deck */}
      <div className={`p-5 ${isLight ? "bg-zinc-50" : "bg-zinc-950/80"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${textClass}`}>
            <Sparkles className="w-4 h-4 text-yellow-500" />
            {language === "ar" ? "اختر وبث القناة لتغيير الشاشة المحددة:" : "Select Broadcast channel to stream into Focused Screen:"}
          </span>
          <span className={`text-[10px] ${subtextClass} italic`}>
            {language === "ar" ? "* لتغيير بث أي شاشة، انقر عليها أولاً ثم اختر قناة من البطاقات أدناه." : "* Note: Simply click a TV screen above to select it, then click any preset channel card below to load the stream."}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {PRESET_CHANNELS.map((ch) => {
            return (
              <button
                key={ch.id}
                onClick={() => handleSelectPreset(ch)}
                className={`rounded-xl p-3 text-left transition-all hover:border-red-600 hover:scale-[1.02] flex flex-col justify-between gap-2 shadow-sm cursor-pointer ${
                  isLight ? "bg-white border-zinc-250 hover:bg-zinc-50" : "bg-zinc-900 hover:bg-zinc-800 border-white/10"
                } border`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`px-1.5 py-0.2 text-[8px] font-mono rounded ${isLight ? "bg-zinc-100 text-zinc-500" : "bg-zinc-950 text-zinc-400"}`}>
                      {language === "ar" ? ch.categoryAr : ch.category}
                    </span>
                    <span className="text-[9px] text-zinc-550 font-mono">EN/AR</span>
                  </div>
                  <h3 className={`text-xs font-bold mt-1.5 truncate ${textClass}`}>
                    {language === "ar" ? ch.nameAr : ch.name}
                  </h3>
                  <p className={`text-[10px] ${subtextClass} leading-normal line-clamp-2 mt-1`}>
                    {language === "ar" ? ch.descAr : ch.desc}
                  </p>
                </div>
                <div className={`flex items-center justify-between text-[8px] ${subtextClass} font-mono pt-2 border-t ${borderClass}`}>
                  <span className="text-emerald-500 flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" /> {language === "ar" ? "نشط" : "Checked Live"}
                  </span>
                  <span>ID: {ch.youtubeId.substring(0, 5)}...</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Help Guide */}
        <div className={`mt-5 p-3 rounded-xl border flex items-start gap-2.5 text-[10px] ${subtextClass} ${
          isLight ? "bg-white border-zinc-250 text-zinc-650" : "bg-zinc-90 w bg-zinc-900 border-white/15"
        }`}>
          <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p>
            {language === "ar" ? 
              "جدار التلفزيونات تفاعلي بالكامل ومناسب لجميع أحجام الشاشات. يرجى استخدام زر 'إضافة بث شاشة +' في الأعلى لإلحاق شاشات جديدة إضافية في الفضاء. يمكنك عزل الصوت لإحدى الشققات بالنقاط على 'منفرد'، مما يصمت سائر البثوت فوراً ليتيح متابعة دقيقة للمصدر المحدد دون تشويش." : 
              "The TV Wall is fully responsive and supports dynamic sizing. Feel free to use the upper Add Stream TV + button to add more screens dynamically. You can solo the audio on one screen by clicking SOLO, which silences all other streams instantly so you can review a specific broadcast uninterrupted."
            }
          </p>
        </div>
      </div>

    </div>
  );
}
