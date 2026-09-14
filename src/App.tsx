import React, { useEffect, useState } from "react";
import {
  Globe,
  Radio,
  Search,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Compass,
  FileText,
  Activity,
  Award,
  BookOpen,
  Eye,
  Server,
  Terminal,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Cpu,
  Sun,
  Moon,
  Languages
} from "lucide-react";
import { TelegramNewsPost, FactCheckResult, EmergencyBulletin, IntelligenceBriefing } from "./types";
import LiveBroadcastTerminal from "./components/LiveBroadcastTerminal";
import BreakingNewsTicker from "./components/BreakingNewsTicker";
import EmergencyWebsiteWall from "./components/EmergencyWebsiteWall";
import { translations } from "./translations";

export default function App() {
  // Localization & Visual Mode States
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const t = translations[language];

  // Navigation Section State
  const [activeTab, setActiveTab] = useState<"monitor" | "fact-check" | "emergency" | "strategy">("monitor");

  // Core Data State
  const [newsPosts, setNewsPosts] = useState<TelegramNewsPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<TelegramNewsPost | null>(null);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);
  
  // Translation Cache
  const [translatedPosts, setTranslatedPosts] = useState<Record<string, string>>({});
  const [translatingIds, setTranslatingIds] = useState<Record<string, boolean>>({});

  // Fact-Check State
  const [factCheckInput, setFactCheckInput] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [factCheckError, setFactCheckError] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<FactCheckResult | null>(null);
  const [factCheckHistory, setFactCheckHistory] = useState<FactCheckResult[]>([
    {
      claim: "Deepfake video alleges that coastal boundaries in the West Pacific were shifted by a synthetic territorial declaration.",
      verdict: "FALSE",
      confidence: 96,
      analysis: "This video has been thoroughly audited by regional cryptographic intelligence firms. The voice synthesizer patterns and frame jitter match third-party generative networks rather than official state broadcasting channels. No boundary treaties have been altered.",
      sources: [{ title: "UN Territorial Defense Ledger", uri: "https://www.unmas.org" }]
    },
    {
      claim: "Atmospheric tracking stations in the North Sea registered elevated particle levels consistent with localized sub-surface seismic releases.",
      verdict: "MIXED",
      confidence: 78,
      analysis: "While active seismic sensors did detect a minor magnitude-3 event, environmental protection and nuclear tracking agencies have confirmed that isotope counts remain at safe baseline levels. No anomalous elements have leaked.",
      sources: [{ title: "Ready.gov Nuclear Advisory Panel", uri: "https://www.ready.gov" }]
    }
  ]);

  // Emergency Bulletins
  const [bulletins, setBulletins] = useState<EmergencyBulletin[]>([]);
  const [isLoadingBulletins, setIsLoadingBulletins] = useState<boolean>(true);

  // Strategic Option for surprise section
  const [selectedSector, setSelectedSector] = useState<string>("Cyber Threat Operations");
  const [intelBriefing, setIntelBriefing] = useState<IntelligenceBriefing | null>(null);
  const [isLoadingIntel, setIsLoadingIntel] = useState<boolean>(false);

  // System status
  const [currentTime, setCurrentTime] = useState<string>(new Date().toISOString());

  // Fetch news list
  const fetchNews = async () => {
    setIsLoadingNews(true);
    try {
      const res = await fetch("/api/news/telegram");
      const data = await res.json();
      if (data.success) {
        setNewsPosts(data.posts);
        // Default select the first post
        if (data.posts.length > 0) {
          setSelectedPost(data.posts[0]);
        }
      }
    } catch (err) {
      console.error("Error retrieving network news feed:", err);
    } finally {
      setIsLoadingNews(false);
    }
  };

  // Fetch emergency feeds
  const fetchBulletins = async () => {
    setIsLoadingBulletins(true);
    try {
      const res = await fetch("/api/news/emergency-bulletins");
      const data = await res.json();
      if (data.success) {
        setBulletins(data.bulletins);
      }
    } catch (err) {
      console.error("Error retrieving emergency bulletins:", err);
    } finally {
      setIsLoadingBulletins(false);
    }
  };

  // Fetch Surprise Intel Briefing
  const generateIntelBriefing = async (sector: string) => {
    setIsLoadingIntel(true);
    try {
      const res = await fetch("/api/intelligence/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sector })
      });
      const data = await res.json();
      if (data.success) {
        setIntelBriefing(data.briefing);
      }
    } catch (err) {
      console.error("Error generating cyber strategy intel:", err);
    } finally {
      setIsLoadingIntel(false);
    }
  };

  // Run dynamic single-post translation
  const translateSinglePost = async (post: TelegramNewsPost) => {
    if (translatedPosts[post.id] || translatingIds[post.id]) return;

    setTranslatingIds(prev => ({ ...prev, [post.id]: true }));
    try {
      const res = await fetch("/api/news/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: post.text })
      });
      const data = await res.json();
      if (data.success && data.translation) {
        setTranslatedPosts(prev => ({ ...prev, [post.id]: data.translation }));
      }
    } catch (err) {
      console.error("Translation command failed:", err);
    } finally {
      setTranslatingIds(prev => ({ ...prev, [post.id]: false }));
    }
  };

  // Initial trigger for claim check
  const submitFactCheck = async () => {
    if (!factCheckInput.trim()) return;
    setIsChecking(true);
    setFactCheckError(null);
    try {
      const res = await fetch("/api/news/fact-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim: factCheckInput })
      });
      if (!res.ok) {
        throw new Error(`Audit server returned unexpected diagnostic status ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        const newResult: FactCheckResult = {
          claim: factCheckInput,
          verdict: data.verdict,
          confidence: data.confidence || 85,
          analysis: data.analysis,
          sources: data.sources || []
        };
        setCheckResult(newResult);
        setFactCheckHistory(prev => [newResult, ...prev]);
        setFactCheckInput("");
      } else {
        throw new Error(data.error || "Factual auditing failed to formulate response");
      }
    } catch (err: any) {
      console.error("Verification engine failed:", err);
      setFactCheckError(err.message || "Factual auditing encountered an internal execution failure. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchBulletins();
    generateIntelBriefing(selectedSector);

    // Update real-time clock
    const clock = setInterval(() => {
      setCurrentTime(new Date().toISOString());
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  // Update Intel Scenario if drop-down changes
  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector);
    generateIntelBriefing(sector);
  };

  // Quick categories breakdown based on feed texts for the Geopolitics, Ops, and Economics Bento Cards
  const filterCategorizedNews = (keywords: string[]) => {
    return newsPosts.filter(post => 
      keywords.some(kw => post.text.toLowerCase().includes(kw.toLowerCase()))
    ).slice(0, 3);
  };

  const geopoliticsNews = filterCategorizedNews(["مجلس", "اتحاد", "بلد", "رئيس", "G7", "G20", "وزير", "دبلوماسي"]);
  const emergencyNews = filterCategorizedNews(["عاجل", "شهداء", "وفاة", "انفجار", "إصابة", "دفاع", "صليب", "غارة"]);
  const economicNews = filterCategorizedNews(["نفط", "دولار", "اقتصاد", "سوق", "تجارة", "غاز", "تضخم", "بورصة"]);

  const isLight = theme === "light";
  const bgClass = isLight ? "bg-slate-50 text-zinc-900" : "bg-zinc-950 text-slate-100";
  const cardBgClass = isLight ? "bg-white border-zinc-200 shadow-sm text-zinc-800" : "bg-zinc-900 border-zinc-800 shadow-xl text-slate-100";
  const headerBgClass = isLight ? "bg-white border-zinc-200" : "border-b border-zinc-900 bg-zinc-950/70";
  const subtextClass = isLight ? "text-zinc-500" : "text-zinc-400";
  const textClass = isLight ? "text-zinc-900" : "text-white";
  const borderClass = isLight ? "border-zinc-200" : "border-zinc-805";
  const btnClass = isLight ? "bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200" : "bg-zinc-900 border-zinc-800 text-slate-300 hover:bg-zinc-850 hover:text-white";
  const navBgClass = isLight ? "bg-zinc-200/80 border-zinc-350" : "bg-zinc-900/80 border-zinc-800";
  const inputBgClass = isLight ? "bg-white border-zinc-350 text-zinc-800 placeholder-zinc-400" : "bg-zinc-950 border-zinc-800 text-zinc-300 placeholder-zinc-500";
  const innerCardClass = isLight ? "bg-zinc-50 border-zinc-200 text-zinc-800" : "bg-zinc-950/80 border-zinc-850 text-slate-200";
  const mutedTextClass = isLight ? "text-zinc-400" : "text-zinc-500";

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col font-sans transition-colors duration-200`} id="main-terminal" dir={language === "ar" ? "rtl" : "ltr"}>
      
      {/* Dynamic Breaking News Ticker Line at top */}
      <BreakingNewsTicker posts={newsPosts} />

      {/* Top Professional Navigation & Status Header bar */}
      <header className={`border-b ${headerBgClass} backdrop-blur-md sticky top-0 z-40 px-4 py-3 sm:px-6 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Dashboard Branding with Human Literal approach */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h1 className={`text-sm font-bold uppercase tracking-wider ${textClass} flex items-center gap-2`}>
                {t.title}
                <span className="text-[10px] bg-red-950 text-red-00 font-mono px-2 py-0.5 rounded border border-red-900/60 font-semibold animate-pulse">
                  {t.versionLabel}
                </span>
              </h1>
              <p className={`text-[10px] ${subtextClass}`}>
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Nav Items to toggle bento categories easily */}
          <nav className={`flex items-center ${navBgClass} p-0.5 rounded-lg border text-xs shadow-inner`}>
            <button
              onClick={() => setActiveTab("monitor")}
              className={`px-4 py-1.5 rounded-md font-medium tracking-wide transition-all uppercase text-[10px] flex items-center gap-2 cursor-pointer ${
                activeTab === "monitor"
                  ? isLight ? "bg-white text-red-600 shadow-sm border border-zinc-200" : "bg-zinc-850 text-red-400 shadow-sm border border-zinc-750"
                  : isLight ? "text-zinc-500 hover:text-zinc-850" : "text-zinc-400 hover:text-slate-300"
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              {t.liveWall}
            </button>
            <button
              onClick={() => setActiveTab("fact-check")}
              className={`px-4 py-1.5 rounded-md font-medium tracking-wide transition-all uppercase text-[10px] flex items-center gap-2 cursor-pointer ${
                activeTab === "fact-check"
                  ? isLight ? "bg-white text-red-600 shadow-sm border border-zinc-200" : "bg-zinc-850 text-red-400 shadow-sm border border-zinc-750"
                  : isLight ? "text-zinc-500 hover:text-zinc-850" : "text-zinc-400 hover:text-slate-300"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              {t.factCheck}
            </button>
            <button
              onClick={() => setActiveTab("emergency")}
              className={`px-4 py-1.5 rounded-md font-medium tracking-wide transition-all uppercase text-[10px] flex items-center gap-2 cursor-pointer ${
                activeTab === "emergency"
                  ? isLight ? "bg-white text-red-600 shadow-sm border border-zinc-200" : "bg-zinc-850 text-red-400 shadow-sm border border-zinc-750"
                  : isLight ? "text-zinc-500 hover:text-zinc-850" : "text-zinc-400 hover:text-slate-300"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              {t.emergencyAlerts}
            </button>
            <button
              onClick={() => setActiveTab("strategy")}
              className={`px-4 py-1.5 rounded-md font-medium tracking-wide transition-all uppercase text-[10px] flex items-center gap-2 cursor-pointer ${
                activeTab === "strategy"
                  ? isLight ? "bg-white text-red-600 shadow-sm border border-zinc-200" : "bg-zinc-850 text-red-400 shadow-sm border border-zinc-750"
                  : isLight ? "text-zinc-500 hover:text-zinc-850" : "text-zinc-400 hover:text-slate-300"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              {t.intelBrief}
            </button>
          </nav>

          {/* Active Toggles panel for Mode/Language */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(prev => prev === "en" ? "ar" : "en")}
              className={`p-1.5 rounded-lg border cursor-pointer hover:scale-[1.02] ${isLight ? "bg-zinc-150 hover:bg-zinc-200 border-zinc-250 text-zinc-750" : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300"} transition-all flex items-center gap-1.5 text-[10px] font-bold`}
              title="Toggle English/Arabic Translate"
            >
              <Languages className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>{language === "en" ? "العربية" : "English"}</span>
            </button>

            {/* Light Mode Toggle */}
            <button
              onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
              className={`p-1.5 rounded-lg border cursor-pointer hover:scale-[1.02] ${isLight ? "bg-zinc-150 hover:bg-zinc-200 border-zinc-250 text-zinc-750" : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300"} transition-all`}
              title="Toggle Visual Mode Theme"
            >
              {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-yellow-500" />}
            </button>

            {/* UTC Clock Block */}
            <div className="hidden md:flex flex-col text-right font-mono text-[9px] text-zinc-500">
              <span className="block text-[8px] text-zinc-600 font-bold">{t.clockLabel}</span>
              <span className={`${isLight ? "text-zinc-700 font-bold" : "text-zinc-300"} tracking-wider`}>{currentTime}</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container Area with Bento Grid layouts */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6" id="bento-content-container">
        
        {/* Dynamic section injection based on selected top nav tabs */}
        {activeTab === "monitor" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="bento-monitor-grid">
            
            {/* Bento block 1: Live Stream Monitor Feed (Optimized/Configured) [Full Width Span] */}
            <div className="col-span-1 lg:col-span-12 flex flex-col gap-5">
              <LiveBroadcastTerminal language={language} theme={theme} />

              {/* Bento block 2: Real-time Al Jazeera arabic proxy feed with translation [Included below] */}
              <div className={`${cardBgClass} border rounded-2xl overflow-hidden shadow-xl flex flex-col h-[400px] transition-colors duration-200`}>
                <div className={`${innerCardClass} px-4 py-3 border-b flex items-center justify-between transition-colors duration-200`}>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {language === "ar" ? "بروكسي تلغرام المباشر (الجزيرة)" : "Telegram Proxy feed (Al Jazeera Arabic)"}
                    </span>
                  </div>
                  <button
                    onClick={fetchNews}
                    disabled={isLoadingNews}
                    className={`p-1.5 ${btnClass} transition-all rounded text-[10px] flex items-center gap-1.5`}
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingNews ? "animate-spin" : ""}`} />
                    <span>{language === "ar" ? "مزامنة السجل الأساسي" : "Synchronize Feed"}</span>
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 overflow-hidden">
                  
                  {/* Left Column Feed list */}
                  <div className={`md:col-span-2 border-r ${borderClass} overflow-y-auto max-h-[350px] transition-colors duration-200`}>
                    {isLoadingNews ? (
                      <div className="p-10 flex flex-col items-center justify-center text-zinc-500 gap-3">
                        <RefreshCw className="w-6 h-6 animate-spin text-zinc-650" />
                        <span className="text-xs font-mono">Synchronizing state loops...</span>
                      </div>
                    ) : newsPosts.length === 0 ? (
                      <div className="p-10 text-center text-zinc-550 text-xs">
                        {language === "ar" ? "لا توجد أخبار حالياً" : "No feeds available currently"}
                      </div>
                    ) : (
                      <div className={`divide-y ${isLight ? "divide-zinc-200" : "divide-zinc-850"}`}>
                        {newsPosts.map((post) => {
                          const isActive = selectedPost?.id === post.id;
                          return (
                            <button
                              key={post.id}
                              onClick={() => setSelectedPost(post)}
                              className={`w-full p-3.5 text-left transition-colors flex flex-col gap-2 relative ${
                                isActive 
                                  ? isLight ? "bg-zinc-100" : "bg-zinc-800/60" 
                                  : isLight ? "hover:bg-zinc-50/80" : "hover:bg-zinc-900"
                              }`}
                            >
                              {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-655 font-bold" />
                              )}
                              <div className="flex items-center justify-between text-[10px]">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wide ${
                                  post.isBreaking
                                    ? "bg-red-955 text-red-500 border border-red-900/60 font-black animate-pulse"
                                    : "bg-zinc-800 text-zinc-350"
                                }`}>
                                  {post.isBreaking ? (language === "ar" ? "عاجل" : "ALERT") : "WIRE FEED"}
                                </span>
                                <span className={`${mutedTextClass} font-mono`}>
                                  {new Date(post.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className={`text-xs ${isLight ? "text-zinc-800" : "text-zinc-300"} line-clamp-2 truncate font-sans text-right dir-rtl leading-relaxed`}>
                                {post.text}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right Column Details & Translation view */}
                  <div className={`md:col-span-3 p-5 ${isLight ? "bg-zinc-50/50" : "bg-zinc-950/40"} overflow-y-auto flex flex-col h-full justify-between transition-colors duration-200`}>
                    {selectedPost ? (
                      <div className="flex flex-col gap-4">
                        <div className={`flex justify-between items-center ${isLight ? "bg-white" : "bg-zinc-900"} p-2.5 rounded-lg border ${borderClass}`}>
                          <div>
                            <span className={`text-[8px] ${mutedTextClass} uppercase tracking-widest block font-mono font-bold`}>
                              {language === "ar" ? "توقيت النشر الأصلي" : "MONITOR FEED TIME"}
                            </span>
                            <span className={`text-xs ${isLight ? "text-zinc-700" : "text-zinc-300"} font-mono font-medium`}>
                              {new Date(selectedPost.time).toLocaleString()}
                            </span>
                          </div>
                          {selectedPost.isBreaking && (
                            <span className="px-2 py-0.5 bg-red-900 text-white font-bold text-[9px] rounded font-mono uppercase tracking-wider animate-pulse flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {language === "ar" ? " تنبيه عاجل " : "Breaking Alert"}
                            </span>
                          )}
                        </div>

                        {/* Raw Source In Arabic block */}
                        <div>
                          <span className={`text-[9px] ${mutedTextClass} font-bold uppercase tracking-wider block mb-1`}>
                            {language === "ar" ? "البث المباشر الملتقط (المصدر الأصلي):" : "Ingested Arabic Broadcast (Raw Source):"}
                          </span>
                          <div className={`p-4 ${isLight ? "bg-white text-zinc-900" : "bg-zinc-950/80 text-slate-200"} rounded-xl border ${borderClass} text-right dir-rtl text-sm leading-relaxed font-sans shadow-inner selection:bg-zinc-800`}>
                            {selectedPost.text}
                          </div>
                        </div>

                        {/* Translation Block dynamically proxying translation */}
                        <div>
                          <span className={`text-[9px] ${mutedTextClass} font-bold uppercase tracking-wider block mb-1`}>
                            {language === "ar" ? "الترجمة الفورية (مكتوبة بالإنجليزية):" : "Live Translation (Transcribed to EN):"}
                          </span>
                          
                          {translatedPosts[selectedPost.id] ? (
                            <div className={`p-4 ${isLight ? "bg-red-50 text-red-900 border-red-200" : "bg-red-950/10 border-red-950 text-zinc-300"} rounded-xl text-xs leading-relaxed font-sans relative`}>
                              <span className="absolute bottom-2 right-2 text-[8px] text-red-500/70 uppercase tracking-widest font-mono font-bold">
                                {language === "ar" ? "ترجمة مدققة تكتيكياً" : "verified translation"}
                              </span>
                              {translatedPosts[selectedPost.id]}
                            </div>
                          ) : translatingIds[selectedPost.id] ? (
                            <div className={`p-6 ${isLight ? "bg-white" : "bg-zinc-400/10"} rounded-xl border ${borderClass} flex items-center justify-center gap-2.5`}>
                              <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
                              <span className={`text-xs ${mutedTextClass} font-mono`}>{language === "ar" ? "جاري ترجمة الخبر عبر نظام الترجمة التكتيكي..." : "Translating broadcast signal via Gemini..."}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => translateSinglePost(selectedPost)}
                              className={`w-full py-3 px-4 ${isLight ? "bg-white text-zinc-855 border-zinc-250 hover:bg-zinc-50" : "bg-zinc-900 text-slate-300 border-zinc-800 hover:bg-zinc-850 hover:text-white"} transition-all rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer`}
                            >
                              <RefreshCw className={`w-4.5 h-4.5 ${isLight ? "text-red-500" : "text-zinc-500"}`} />
                              <span>{t.translateBtn}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className={`h-full flex items-center justify-center ${mutedTextClass} italic text-xs`}>
                        {t.emptyFeedPrompt}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`text-[10px] ${mutedTextClass} mt-2 italic flex items-center gap-2 font-mono`}>
                <Terminal className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span>{language === "ar" ? "قنوات البث التكتيكية مدعومة بمحركات الرصد المستمر لوكالة الأنباء." : "Tactical broadcast channels connected to continuous news ingestion relays."}</span>
              </div>
            </div>
          </div>
        )}

        {/* FACT CHECK TAB */}
        {activeTab === "fact-check" && (
          <div className="space-y-6" id="bento-factcheck-panel">
            <div className={`${cardBgClass} border rounded-2xl p-6 shadow-xl transition-colors duration-200`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-950 text-blue-400 rounded-lg border border-blue-900/60 shadow-lg">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h2 className={`text-base font-bold ${textClass} uppercase tracking-wider`}>
                    {t.auditClaimLabel}
                  </h2>
                  <p className={`text-xs ${subtextClass} mt-0.5`}>
                    {t.auditClaimDesc}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-xs ${subtextClass} uppercase font-mono font-bold mb-2`}>
                    {t.claimLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={factCheckInput}
                    onChange={(e) => setFactCheckInput(e.target.value)}
                    placeholder={t.placeholderClaim}
                    className={`w-full ${inputBgClass} border text-sm p-4 rounded-xl focus:outline-none focus:border-blue-500 transition-all`}
                  />
                </div>

                {factCheckError && (
                  <div className="p-4 bg-red-955/20 border border-red-900/40 text-red-500 text-xs rounded-xl flex items-start gap-2.5 animate-fade-in font-sans">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase tracking-wider block text-[10px] mb-0.5 text-red-400">
                        {language === "ar" ? "تم رصد خطأ في فحص المصداقية:" : "Auditing Error Detected:"}
                      </span>
                      <p className="leading-normal">{factCheckError}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <span className={`text-[10px] ${mutedTextClass} italic`}>
                    {t.notesDisclaimer}
                  </span>
                  <button
                    onClick={submitFactCheck}
                    disabled={isChecking || !factCheckInput.trim()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-655 text-white font-sans text-xs uppercase font-extrabold tracking-wider rounded-lg border border-blue-500 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {isChecking ? (
                      <>
                        <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                        <span>{t.checkingMsg}</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-4.5 h-4.5" />
                        <span>{t.auditBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Display primary audit result */}
              {checkResult && (
                <div className="mt-8 p-6 bg-zinc-950 rounded-2xl border border-zinc-800/80 space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-900">
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                        VERIFIED AUDIT RECORD
                      </span>
                      <h3 className="text-xs font-bold text-zinc-300 mt-1">
                        "{checkResult.claim}"
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[9px] text-zinc-500 block font-mono">CONFIDENCE INDEX</span>
                        <span className="text-xs font-bold font-mono text-zinc-300">
                          {checkResult.confidence}%
                        </span>
                      </div>
                      
                      <span className={`px-3 py-1 text-xs font-black rounded border font-mono tracking-wider ${
                        checkResult.verdict === "TRUE"
                          ? "bg-emerald-950 text-emerald-400 border-emerald-900"
                          : checkResult.verdict === "FALSE"
                          ? "bg-red-950 text-red-400 border-red-900"
                          : "bg-amber-950 text-amber-500 border-amber-900"
                      }`}>
                        {checkResult.verdict}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-850">
                    <p className="whitespace-pre-line">{checkResult.analysis}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block mb-2">
                      GROUNDING CITATIONS & CITATION NODES:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {checkResult.sources?.length === 0 ? (
                        <div className="text-zinc-600 text-xs italic">
                          No external sources cited. Verifiable via primary intelligence ledger.
                        </div>
                      ) : (
                        checkResult.sources.map((source, index) => (
                          <a
                            key={index}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-zinc-900/60 hover:bg-zinc-900 p-3 rounded-lg border border-zinc-850 flex items-center justify-between transition-all"
                          >
                            <div className="flex items-center gap-2 overflow-hidden mr-3">
                              <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                              <span className="text-xs text-slate-200 truncate">
                                {source.title}
                              </span>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                          </a>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Tactical Forensic & OSINT Verification Toolkit */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                    {language === "ar" ? "حقيبة أدوات التحقق الجنائي الرقمي والـ (OSINT)" : "OSINT Verification & Digital Forensics Toolkit"}
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {language === "ar" 
                      ? "أدوات متخصصة للتحقق من مصداقية الأنباء، تواريخ الوسائط المرجعية، صور الثبيث، وعناوين هويات البلوكشين."
                      : "Specialized utilities to audit metadata, reverse-search visual assets, investigate routing, and profile blockchain ledgers."}
                  </p>
                </div>
                <span className="text-[9px] bg-emerald-950/40 text-emerald-500 border border-emerald-900/40 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                  {language === "ar" ? "٨ أدوات معتمدة" : "8 SECURED UTILITIES"}
                </span>
              </div>

              {/* Grid of OSINT tools */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    name: "Amnesty Citizen Evidence",
                    arName: "أداة منظمة العفو الدولية للأدلة الجنائية",
                    url: "https://citizenevidence.amnestyusa.org/",
                    desc: "Forensic YouTube metadata viewer. Extract exact timing coordinates, video keys, and reverse-lookup fallback thumbnails.",
                    arDesc: "مستخرج البيانات والتواريخ الأصلية العكسية لمقاطع الفيديو المشبوهة لتدقيق طابع النشر الجغرافي والجنائي.",
                    label: "META VERIFICATION",
                    color: "text-emerald-450 border-emerald-900"
                  },
                  {
                    name: "ImageOps",
                    arName: "محلل الصور الجنائي ImageOps",
                    url: "https://imageops.org/",
                    desc: "Instant reverse image searching, tag indexers, camera metadata recovery, and photo alteration detectors.",
                    arDesc: "أدوات التشريح الفورية لفحص أصالة الصور، كشف التعديلات البصرية، والبحث العكسي متعدد المحركات.",
                    label: "IMAGE FORENSICS",
                    color: "text-blue-400 border-blue-900"
                  },
                  {
                    name: "PikaOSINT",
                    arName: "بوابة الاستعلام PikaOSINT",
                    url: "https://pikaosint.pages.dev/",
                    desc: "Distributed lookup portal designed to locate phone registers, nicknames, leaked emails, and digital accounts.",
                    arDesc: "منصة تجميع تكتيكية للاستفسار عن الحسابات المسربة وأرقام الهاتف والبصمات الرقمية المفتوحة.",
                    label: "IDENTITY AUDITOR",
                    color: "text-zinc-300 border-zinc-800"
                  },
                  {
                    name: "IP Logger Tracker",
                    arName: "متعقب المسارات IP Logger",
                    url: "https://iplogger.org/",
                    desc: "Profile network transit headers, check redirection chains, inspect malicious URLs, and identify source IPs.",
                    arDesc: "تحليل بصمات الروابط المشبوهة، اختبار تحويل النطاقات، ورصد بوابات المتسللين الأمنية.",
                    label: "NETWORK FOOTPRINT",
                    color: "text-red-400 border-red-900"
                  },
                  {
                    name: "Intelligence On Chain",
                    arName: "ذكاء معاملة البلوكشين",
                    url: "https://osint.intelligenceonchain.com/",
                    desc: "Trace Web3 wallet links, crypto movement paths, and smart contract transaction pipelines.",
                    arDesc: "رصد شبكات العملات المشفرة ومطابقة تحويلات العناوين الرقمية لتأكيد ممولي الحملات.",
                    label: "WEB3 TRANSIT",
                    color: "text-indigo-455 border-indigo-900"
                  },
                  {
                    name: "BOSINT",
                    arName: "مدقق أصول العملات BOSINT",
                    url: "https://app.bosint.gg/",
                    desc: "Strategic blockchain node query audit. Pinpoint wall ownership networks, illicit labels, and multi-signature assets.",
                    arDesc: "بوابة استخبارات شبكات البلوكشين التفاعلية لبيان ملكية الأرصدة الرقمية وتتبع النقل المباشر.",
                    label: "LEDGER CRYPTOGRAPHY",
                    color: "text-purple-400 border-purple-900"
                  },
                  {
                    name: "Waybien Tactical Map",
                    arName: "خريطة التحرك الجيوسياسي Waybien",
                    url: "https://waybien.com/",
                    desc: "Live border dispute overlays, international aviation transponders, and active regional threat telemetry.",
                    arDesc: "تمثيل خرائطي حي للنزاعات والمحيط الدفاعي فوق الإحداثيات الجغرافية والترددات الجوية النشطة.",
                    label: "SPATIAL RECON",
                    color: "text-cyan-400 border-cyan-900"
                  },
                  {
                    name: "Insecam CCTV Wire",
                    arName: "كاميرات المراقبة المباشرة Insecam",
                    url: "https://www.insecam.org/",
                    desc: "Real-time feed access to thousands of public security and town surveillance cameras worldwide.",
                    arDesc: "البث المرئي الحي لآلاف الكاميرات العامة المكشوفة لتأكيد الأوضاع الميدانية والجوية عيانياً وعاجلاً.",
                    label: "VISUAL CONFIRMATION",
                    color: "text-amber-450 border-amber-900"
                  }
                ].map((tool, idx) => (
                  <div 
                    key={idx} 
                    className="bg-zinc-950/70 hover:bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-4 flex flex-col justify-between transition-all group h-[195px]"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border border-zinc-850/60 bg-zinc-900 text-zinc-400 uppercase tracking-wide">
                          {tool.label}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-60 group-hover:opacity-100 group-hover:animate-ping" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                        {language === "ar" ? tool.arName : tool.name}
                      </h4>
                      <p className="text-[10px] text-zinc-400/90 leading-relaxed mt-1.5 line-clamp-3">
                        {language === "ar" ? tool.arDesc : tool.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-zinc-900/60 flex items-center justify-between">
                      <span className="text-[9px] text-zinc-500 font-mono truncate max-w-[120px]">
                        {tool.url.replace("https://", "").replace("www.", "")}
                      </span>
                      <a 
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold font-mono tracking-wider flex items-center gap-1 transition-all group-hover:translate-x-0.5"
                      >
                        <span>{language === "ar" ? "تشغيل" : "LAUNCH"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fact Check History Bento List */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Audit Logs and Disinformation Archive
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {factCheckHistory.map((item, idx) => (
                  <div key={idx} className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2.5">
                        <span className={`text-[10px] px-2 py-0.5 font-mono font-bold rounded border uppercase ${
                          item.verdict === "TRUE"
                            ? "bg-emerald-950 text-emerald-400 border-emerald-900/50"
                            : item.verdict === "FALSE"
                            ? "bg-red-950 text-red-400 border-red-900/50"
                            : "bg-amber-950 text-amber-500 border-amber-900/50"
                        }`}>
                          {item.verdict}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          Confidence: {item.confidence}%
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200 line-clamp-2 italic mb-2">
                        "{item.claim}"
                      </p>
                      <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                        {item.analysis}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center text-[10px]">
                      {item.sources?.[0] ? (
                        <a
                          href={item.sources[0].uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <span>Ref: {item.sources[0].title}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-zinc-600">No reference links</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EMERGENCY FEEDS TAB */}
        {activeTab === "emergency" && (
          <div className="space-y-6" id="bento-emergency-panel">
            <EmergencyWebsiteWall language={language} theme={theme} />
          </div>
        )}

        {/* STRATEGY & THREAT BRIEF TAB */}
        {activeTab === "strategy" && (
          <div className="space-y-6" id="bento-threat-panel">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-950 text-indigo-400 rounded-lg border border-indigo-950 shadow-lg">
                  <Compass className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider">
                    OSINT Strategic Threat Assessment (Scenario Generator)
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Generate deep-dive scenarios and evaluate geo-environmental threats around selected operational vector parameters.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sector Picker Panel */}
                <div className="space-y-4">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                    Choose Evaluation Vector:
                  </span>
                  <div className="space-y-3">
                    {[
                      "Cyber Threat Operations",
                      "Geopolitical Maritime Security",
                      "Climate Resource Scarcity",
                      "Advanced Technology & Space Defense"
                    ].map((sector) => {
                      const isSelected = selectedSector === sector;
                      return (
                        <button
                          key={sector}
                          onClick={() => handleSectorChange(sector)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-slate-900 border-indigo-500 text-indigo-400 shadow-lg"
                              : "bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          <span className="text-xs font-semibold">{sector}</span>
                          <ChevronRight className="w-4 h-4 text-zinc-600" />
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-indigo-950/10 border border-indigo-900/35 rounded-xl text-xs text-indigo-300 leading-normal gap-2 flex flex-col">
                    <span className="font-bold flex items-center gap-1">
                      <Cpu className="w-4 h-4 text-indigo-400" />
                      Dynamic Intel Relay
                    </span>
                    <p>
                      Simulations assess operational vulnerabilities, strategic adversaries, regional friction metrics, and tactical OSINT datasets in 2026.
                    </p>
                  </div>
                </div>

                {/* Briefing Detailed Panel */}
                <div className="lg:col-span-2">
                  {isLoadingIntel ? (
                    <div className="h-64 flex flex-col justify-center items-center gap-2.5 text-zinc-500 bg-zinc-950 rounded-2xl border border-zinc-800">
                      <RefreshCw className="w-7 h-7 animate-spin text-indigo-500" />
                      <span className="text-xs font-mono">Aggregating geo-strategic intelligence parameters...</span>
                    </div>
                  ) : intelBriefing ? (
                    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-5">
                      <div className="flex justify-between items-center pb-3 border-b border-zinc-900">
                        <div>
                          <span className="text-[9px] text-indigo-400 font-mono uppercase tracking-widest block font-bold">
                            Active OSINT Briefing
                          </span>
                          <h3 className="text-sm font-extrabold text-white mt-1">
                            {intelBriefing.sector}
                          </h3>
                        </div>

                        <div className="text-right">
                          <span className="text-[8px] text-zinc-500 block font-mono">THREAT CLASSIFICATION</span>
                          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                            intelBriefing.threatLevel === "CRITICAL" || intelBriefing.threatLevel === "SEVERE"
                              ? "bg-red-950/60 border-red-900 text-red-400"
                              : "bg-amber-950/50 border-amber-900 text-amber-500"
                          }`}>
                            {intelBriefing.threatLevel} ({intelBriefing.threatRating}%)
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-zinc-900 p-3.5 rounded-lg border border-zinc-850">
                          <span className="text-[10px] text-zinc-500 block mb-1 font-mono font-bold">AFFECTED REGIONS:</span>
                          <ul className="list-disc pl-4 text-xs text-zinc-300 space-y-1">
                            {intelBriefing.affectedRegions?.map((r, i) => <li key={i}>{r}</li>)}
                          </ul>
                        </div>
                        <div className="bg-zinc-900 p-3.5 rounded-lg border border-zinc-850">
                          <span className="text-[10px] text-zinc-500 block mb-1 font-mono font-bold">MONITORED PLAYERS:</span>
                          <ul className="list-disc pl-4 text-xs text-zinc-300 space-y-1">
                            {intelBriefing.actors?.map((r, i) => <li key={i}>{r}</li>)}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[11px] text-zinc-500 font-mono block font-bold uppercase">Narrative & Strategic Assessment:</span>
                        <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl text-slate-300 text-xs leading-relaxed font-sans space-y-2">
                          <p>{intelBriefing.narrative}</p>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <span className="text-[11px] text-zinc-500 font-mono block font-bold uppercase">Actionable Recommendations & Mitigations:</span>
                        <div className="space-y-2">
                          {intelBriefing.recommendations?.map((rec, i) => (
                            <div key={i} className="flex gap-2.5 items-start text-xs text-zinc-300 bg-zinc-900 p-2.5 rounded border border-zinc-850/60">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5" />
                              <p>{rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

              </div>
            </div>
          </div>
        )}

      </main>

      {/* Bento Categorized Section footer panel (Fulfills Bento Grid Layout Spec) */}
      <footer className="mt-8 bg-zinc-950 border-t border-zinc-900 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6 items-center text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-mono">AJANEWS PROXY INGESTION: CONNECTED</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-mono">OSINT EMERGENCY FEED: SECURE</span>
            </div>
          </div>
          <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest text-center md:text-right">
            Universal Global News Terminal v3.2.0-STABLE • 2026
          </div>
        </div>
      </footer>

    </div>
  );
}
