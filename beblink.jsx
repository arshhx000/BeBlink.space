import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { 
  Zap, ArrowRight, ChevronLeft, ChevronRight, 
  Disc, Sliders, Activity, Download, Save, 
  Power, Cpu, Grid, Layout, Play, Square, Circle, 
  Triangle, X, Plus, Home, Check, FileText, Monitor, 
  AlertTriangle, Code, File, ArrowLeft, Eye, Edit3, 
  Maximize, Smartphone, Tablet, Monitor as MonitorIcon, 
  PlayCircle, User, LogOut, Settings, HelpCircle,
  Image as ImageIcon, Type, Palette, MousePointer,
  Layers, Box, Share2, Printer, Heart, DollarSign, ShoppingCart, Gamepad
} from 'lucide-react';

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================

// ⚠️ FIXED: Simplified API Key declaration to ensure compatibility.
// If running locally in Vite, you can uncomment the line below:
// const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const apiKey = ""; 

// We can keep this one hardcoded for the demo to work immediately
const convertioApiKey = "f6e75d9613d46bdcf890c760b7c22b7b";

const APP_VERSION = "v3.1.0-EXPANDED";

// Standard PPT Dimensions (16:9)
const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;

// ==========================================
// ASSETS & DATA (EXPANDED)
// ==========================================

const CATEGORIES = [
  { id: 'school', label: "School", icon: "🎓", desc: "Assignments & Projects" },
  { id: 'corporate', label: "Corporate", icon: "💼", desc: "QBRs & Strategy" },
  { id: 'design', label: "Design", icon: "🎨", desc: "Portfolios & Pitch" },
  { id: 'marketing', label: "Marketing", icon: "📈", desc: "Campaigns & SEO" },
  { id: 'tech', label: "Tech", icon: "💻", desc: "Code & Architecture" },
  { id: 'startup', label: "Startup", icon: "🚀", desc: "Seed & Series A" },
  { id: 'gaming', label: "Gaming", icon: "🎮", desc: "Game Design & Streaming" },
  { id: 'health', label: "Health", icon: "🏥", desc: "Medical & Wellness" },
  { id: 'finance', label: "Finance", icon: "💰", desc: "Stocks & Crypto" },
  { id: 'ecommerce', label: "E-Comm", icon: "🛒", desc: "Products & Sales" }
];

const THEMES = [
  { id: 'minimal', name: 'MINIMAL', bg: 'bg-[#e4e4e4] text-black pattern-grid-lg', font: 'font-mono', desc: "Clean & Simple" },
  { id: 'bold', name: 'BOLD', bg: 'bg-black text-white pattern-dots', font: 'font-sans', desc: "High Contrast" },
  { id: 'creative', name: 'CREATIVE', bg: 'bg-orange-50 text-orange-900', font: 'font-serif', desc: "Artistic Flair" },
  { id: 'elegant', name: 'ELEGANT', bg: 'bg-slate-900 text-white', font: 'font-sans', desc: "Sophisticated" },
  { id: 'neon', name: 'NEON', bg: 'bg-gray-900 text-green-400', font: 'font-mono', desc: "Cyberpunk Style" },
  { id: 'swiss', name: 'SWISS', bg: 'bg-red-600 text-white', font: 'font-sans', desc: "Grid Systems" },
  { id: 'retro', name: 'RETRO', bg: 'bg-yellow-100 text-blue-800', font: 'font-serif', desc: "80s Aesthetics" },
  { id: 'brutalist', name: 'BRUTAL', bg: 'bg-stone-300 text-black border-4 border-black', font: 'font-mono', desc: "Raw & Rugged" }
];

const PALETTES = [
  { id: 'professional', name: 'PRO', colors: ['bg-slate-900', 'bg-blue-600', 'bg-slate-200'] },
  { id: 'energetic', name: 'VIBE', colors: ['bg-orange-500', 'bg-yellow-400', 'bg-red-500'] },
  { id: 'modern', name: 'MOD', colors: ['bg-purple-600', 'bg-pink-500', 'bg-indigo-500'] },
  { id: 'nature', name: 'ECO', colors: ['bg-green-600', 'bg-emerald-400', 'bg-teal-700'] },
  { id: 'bw', name: 'MONO', colors: ['bg-black', 'bg-gray-500', 'bg-white'] },
  { id: 'sunset', name: 'SUNSET', colors: ['bg-orange-500', 'bg-rose-500', 'bg-purple-600'] },
  { id: 'ocean', name: 'OCEAN', colors: ['bg-cyan-500', 'bg-blue-600', 'bg-indigo-700'] },
  { id: 'berry', name: 'BERRY', colors: ['bg-pink-500', 'bg-red-600', 'bg-purple-800'] },
  { id: 'forest', name: 'FOREST', colors: ['bg-green-800', 'bg-yellow-600', 'bg-orange-700'] },
];

// ==========================================
// UTILITY COMPONENTS
// ==========================================

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            {title}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- ONBOARDING TOUR ---
const OnboardingTour = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Welcome to BeBlink", desc: "The ultimate AI presentation generator. Let's show you around.", icon: <Zap size={40} className="text-yellow-500"/> },
    { title: "Choose a Topic", desc: "Start by entering any topic. Our AI understands context and nuance.", icon: <Edit3 size={40} className="text-blue-500"/> },
    { title: "Customize Style", desc: "Select from professional themes and palettes to match your brand.", icon: <Palette size={40} className="text-purple-500"/> },
    { title: "Export Anywhere", desc: "Download as high-fidelity PDF or editable PPTX instantly.", icon: <Download size={40} className="text-green-500"/> },
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6 backdrop-blur-md">
      <div className="bg-white rounded-[32px] p-8 max-w-md w-full text-center shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        <div className="mb-6 flex justify-center">{steps[step].icon}</div>
        <h2 className="text-2xl font-black mb-2">{steps[step].title}</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">{steps[step].desc}</p>
        
        <div className="flex gap-2 justify-center mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-black' : 'w-2 bg-gray-200'}`} />
          ))}
        </div>

        <button 
          onClick={() => {
            if (step < steps.length - 1) setStep(step + 1);
            else onComplete();
          }}
          className="w-full bg-black text-white py-4 rounded-[17px] font-bold hover:bg-gray-800 transition-transform active:scale-95"
        >
          {step < steps.length - 1 ? "Next" : "Get Started"}
        </button>
      </div>
    </div>
  );
};

// --- PRESENTATION OVERLAY COMPONENT ---
const PresentationOverlay = ({ htmlCode, onClose }) => {
  const [slides, setSlides] = useState([]);
  const [headContent, setHeadContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlCode, 'text/html');
    setHeadContent(doc.head.innerHTML);
    const slideElements = doc.querySelectorAll('.slide');
    const slideStrings = Array.from(slideElements).map(el => el.outerHTML);
    setSlides(slideStrings);
  }, [htmlCode]);

  useEffect(() => {
    const handleResize = () => {
      const windowW = window.innerWidth;
      const windowH = window.innerHeight;
      const scaleX = windowW / SLIDE_WIDTH;
      const scaleY = windowH / SLIDE_HEIGHT;
      setScale(Math.min(scaleX, scaleY) * 0.95); 
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentIndex(prev => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides, onClose]);

  const currentSlideHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        ${headContent}
        <style>
          body { 
            background: transparent; 
            margin: 0; padding: 0; 
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .slide { box-shadow: none; margin: 0; }
        </style>
      </head>
      <body>
        ${slides[currentIndex] || '<h1 style="color:white">Loading...</h1>'}
      </body>
    </html>
  `;

  return (
    <div className="fixed inset-0 z-[150] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
        <div className="text-white/50 text-sm font-mono bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          {currentIndex + 1} / {slides.length}
        </div>
        <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md">
          <X size={24} />
        </button>
      </div>

      <div 
        style={{
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
        className="relative shadow-2xl"
      >
        <iframe 
          srcDoc={currentSlideHtml}
          className="w-full h-full border-none bg-white rounded-lg"
          sandbox="allow-same-origin allow-scripts"
          title="Presentation Slide"
        />
      </div>

      <div className="absolute bottom-8 flex gap-4 z-50">
        <button 
          onClick={() => setCurrentIndex(p => Math.max(p - 1, 0))}
          disabled={currentIndex === 0}
          className="p-4 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white rounded-full transition-all backdrop-blur-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => setCurrentIndex(p => Math.min(p + 1, slides.length - 1))}
          disabled={currentIndex === slides.length - 1}
          className="p-4 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white rounded-full transition-all backdrop-blur-sm"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

// --- VIEW COMPONENTS (MOVED OUTSIDE FOR STABILITY) ---

const LandingView = ({ setView, user, setShowAuthModal }) => (
  <div className="min-h-screen bg-[#e3e3e3] text-black font-mono relative overflow-hidden flex flex-col justify-center items-center">
    <div className="absolute inset-0 pointer-events-none" 
         style={{ backgroundImage: 'radial-gradient(#a1a1a1 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.3 }}>
    </div>

    <nav className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
       <div className="flex items-center gap-2">
          <Zap className="text-orange-600" />
          <span className="font-bold text-lg">BeBlink</span>
       </div>
       <div className="flex gap-4">
          {user ? (
             <div className="flex items-center gap-2 cursor-pointer hover:bg-black/5 p-2 rounded-[12px]" onClick={() => setShowAuthModal(true)}>
                <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold">
                   {user.name[0]}
                </div>
             </div>
          ) : (
             <button onClick={() => setShowAuthModal(true)} className="text-sm font-bold hover:underline">Sign In</button>
          )}
       </div>
    </nav>

    <main className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
      <div className="bg-white border-2 border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[24px] w-full text-center">
          
          <div className="inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-xs font-bold mb-6">
             {APP_VERSION}
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
            AI-POWERED <br/> <span className="text-orange-600">SLIDE DECK</span> CREATOR
          </h1>
          
          <p className="text-gray-500 mb-10 max-w-lg mx-auto text-lg">
            Generate beautiful, structured HTML presentations in seconds. Export to PDF & PPTX seamlessly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full max-w-2xl mx-auto">
             <button onClick={() => setView('input')} className="group flex flex-col items-center p-6 border-2 border-black rounded-[17px] hover:bg-black hover:text-white transition-all">
                <Plus size={32} className="mb-2"/>
                <span className="font-bold">New Project</span>
                <span className="text-xs opacity-60">Start from scratch</span>
             </button>
             <button className="group flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-[17px] hover:border-black hover:bg-gray-50 transition-all">
                <Layout size={32} className="mb-2 text-gray-400 group-hover:text-black"/>
                <span className="font-bold text-gray-400 group-hover:text-black">Open Template</span>
                <span className="text-xs opacity-60 text-gray-400 group-hover:text-black">Browse gallery</span>
             </button>
          </div>
      </div>
    </main>
  </div>
);

const InputView = ({ 
  reset, activeTab, setActiveTab, topic, setTopic, 
  category, setCategory, theme, setTheme, palette, setPalette, 
  startSequence 
}) => (
  <div className="min-h-screen bg-[#f0f0f0] text-black font-mono flex flex-col">
    <div className="bg-white border-b-2 border-black p-4 flex items-center justify-between sticky top-0 z-20">
      <button onClick={reset} className="flex items-center gap-2 hover:text-orange-600 font-bold text-sm">
        <ChevronLeft size={16} /> ABORT
      </button>
      
      <div className="flex gap-2">
         <button 
           onClick={() => setActiveTab('basic')}
           className={`px-4 py-1 rounded-[17px] text-xs font-bold transition-all ${activeTab === 'basic' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
         >
           Basic
         </button>
         <button 
           onClick={() => setActiveTab('studio')}
           className={`px-4 py-1 rounded-[17px] text-xs font-bold transition-all ${activeTab === 'studio' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
         >
           Studio
         </button>
      </div>

      <div className="w-12"></div>
    </div>

    <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Left Column */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-[24px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
          <label className="text-xs font-bold uppercase flex items-center gap-2 text-gray-500 mb-4">
             <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
             Input Stream / Topic
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="> Enter presentation topic, context, or detailed prompt..."
            className="w-full h-[250px] bg-gray-50 border-2 border-gray-200 p-6 font-mono text-sm resize-none focus:outline-none focus:bg-white focus:border-black transition-all placeholder:text-gray-400 rounded-[17px]"
          />
          <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold">
             <span>MIN 10 CHARS</span>
             <span>{topic.length} CHARS</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {CATEGORIES.map(cat => (
             <button
               key={cat.id}
               onClick={() => setCategory(cat.id)}
               className={`p-4 rounded-[17px] border-2 text-left transition-all hover:translate-y-[-2px] ${category === cat.id ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' : 'border-gray-200 bg-white hover:border-black'}`}
             >
               <div className="text-2xl mb-1">{cat.icon}</div>
               <div className="font-bold text-xs">{cat.label}</div>
             </button>
           ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {activeTab === 'basic' ? (
          <>
            <div className="bg-white border-2 border-black p-5 rounded-[24px] shadow-sm">
              <h3 className="text-xs font-bold uppercase border-b border-black/10 pb-2 mb-3 flex items-center gap-2">
                <Layout size={14}/> Visual Theme
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex flex-col items-start p-3 border-2 transition-all text-xs font-bold rounded-[17px] text-left
                      ${theme === t.id ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-500 hover:border-black hover:text-black'}`}
                  >
                    <span>{t.name}</span>
                    <span className={`text-[9px] font-normal ${theme === t.id ? 'text-gray-400' : 'text-gray-400'}`}>{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border-2 border-black p-5 rounded-[24px] shadow-sm">
              <h3 className="text-xs font-bold uppercase border-b border-black/10 pb-2 mb-3 flex items-center gap-2">
                <Palette size={14}/> Color Palette
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto">
                {PALETTES.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPalette(p.id)}
                    className={`h-10 border-2 flex items-center justify-center gap-2 transition-all rounded-[17px]
                      ${palette === p.id ? 'border-black shadow-md bg-gray-50' : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400'}`}
                  >
                     <div className="flex -space-x-1">
                        <div className={`w-3 h-3 rounded-full border border-white ${p.colors[0]}`}></div>
                        <div className={`w-3 h-3 rounded-full border border-white ${p.colors[1]}`}></div>
                     </div>
                     <span className="text-[9px] font-bold uppercase">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white border-2 border-black p-6 rounded-[24px] shadow-sm flex-1">
             <h3 className="text-xs font-bold uppercase mb-6">Studio Fine-Tuning</h3>
             <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block">Font Pairing</label>
                  <select className="w-full p-2 border-2 border-gray-200 rounded-[12px] text-sm font-bold">
                     <option>Modern (Inter / Roboto)</option>
                     <option>Classic (Merriweather / Open Sans)</option>
                     <option>Tech (Mono / Sans)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block">Slide Density</label>
                  <div className="flex gap-2 bg-gray-100 p-1 rounded-[12px]">
                     {['Low', 'Medium', 'High'].map(d => (
                       <button key={d} className="flex-1 py-1 text-xs font-bold rounded-[8px] bg-white shadow-sm hover:bg-gray-50">{d}</button>
                     ))}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-[17px] text-xs text-blue-800 leading-relaxed border border-blue-100">
                   <Monitor size={16} className="mb-2"/>
                   Advanced studio settings adjust the AI prompt engineering to fine-tune the output structure.
                </div>
             </div>
          </div>
        )}

        <button 
          onClick={startSequence}
          disabled={!topic || !category}
          className={`
            h-20 border-2 border-black flex items-center justify-center gap-3 font-bold text-xl uppercase tracking-widest transition-all rounded-[24px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            ${(!topic || !category)
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 shadow-none'
              : 'bg-orange-500 text-white hover:bg-orange-600 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'}`}
        >
          <Zap size={24} className={(!topic || !category) ? "" : "fill-white"} />
          GENERATE
        </button>
      </div>
    </div>
  </div>
);

const LoadingView = ({ loadingStep }) => (
  <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-6">
    <div className="w-full max-w-md border border-gray-800 p-8 relative overflow-hidden rounded-[24px] bg-gray-900">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-[shimmer_2s_infinite]"></div>
      
      <div className="flex justify-between items-end mb-8">
         <h2 className="text-2xl font-bold tracking-tight">BUILDING DECK</h2>
         <Activity className="w-6 h-6 text-orange-500 animate-pulse" />
      </div>
      
      <div className="space-y-4 mb-10 text-xs font-mono text-gray-500">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${loadingStep > 10 ? 'bg-green-500' : 'bg-gray-700'}`}></div> ANALYZING CONTEXT</span>
          <span className={loadingStep > 10 ? "text-green-500" : ""}>{loadingStep > 10 ? "DONE" : "..."}</span>
        </div>
        <div className="flex justify-between items-center">
           <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${loadingStep > 40 ? 'bg-green-500' : 'bg-gray-700'}`}></div> STRUCTURING SLIDES</span>
           <span className={loadingStep > 40 ? "text-green-500" : ""}>{loadingStep > 40 ? "DONE" : "..."}</span>
        </div>
        <div className="flex justify-between items-center">
           <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${loadingStep > 70 ? 'bg-orange-500 animate-pulse' : 'bg-gray-700'}`}></div> RENDERING HTML (16:9)</span>
           <span className={loadingStep > 70 ? "text-green-500" : "text-orange-500"}>{loadingStep > 70 ? "DONE" : "WORKING..."}</span>
        </div>
      </div>

      <div className="w-full h-3 bg-gray-800 mb-2 overflow-hidden rounded-full">
         <div 
           className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-300"
           style={{ width: `${Math.min(loadingStep, 100)}%` }}
         ></div>
      </div>
      <div className="text-right text-[10px] font-bold text-orange-500 tracking-widest">{Math.floor(loadingStep)}% COMPLETE</div>
    </div>
  </div>
);

const OutputView = ({ 
  reset, setIsPresenting, downloadPDF, downloadPPTX, isExporting, conversionStatus, getPreviewHtml, isPresenting, htmlCode 
}) => {
  const iframeRef = useRef(null);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-black border-b border-gray-700 p-4 flex items-center justify-between sticky top-0 z-20">
        <button onClick={reset} className="flex items-center gap-2 text-white hover:text-orange-500 font-bold text-sm">
          <Home size={16} /> HOME
        </button>

        <div className="flex gap-2">
          <button 
            onClick={() => setIsPresenting(true)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-[12px] text-xs font-bold flex items-center gap-2"
          >
            <PlayCircle size={14} /> PRESENT
          </button>
          <button 
            onClick={downloadPDF}
            disabled={isExporting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[12px] text-xs font-bold flex items-center gap-2"
          >
            <Download size={14} /> PDF
          </button>
          <button 
            onClick={downloadPPTX}
            disabled={isExporting}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-[12px] text-xs font-bold flex items-center gap-2"
          >
            <Download size={14} /> PPTX
          </button>
        </div>
      </div>

      {isExporting && (
        <div className="bg-yellow-500 text-black p-3 text-center text-sm font-bold">
          {conversionStatus || "Processing..."}
        </div>
      )}

      <div className="flex-1 p-6 overflow-auto bg-gray-800">
        <iframe
          ref={iframeRef}
          srcDoc={getPreviewHtml()}
          className="w-full h-full border-none rounded-lg shadow-2xl"
          style={{ minHeight: '80vh' }}
          title="Presentation Preview"
          sandbox="allow-same-origin"
        />
      </div>

      {isPresenting && (
        <PresentationOverlay htmlCode={htmlCode} onClose={() => setIsPresenting(false)} />
      )}
    </div>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [view, setView] = useState('landing'); 
  
  // Data State
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('');
  const [theme, setTheme] = useState('minimal');
  const [palette, setPalette] = useState('professional');
  const [htmlCode, setHtmlCode] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState(null);
  
  // UI States
  const [loadingStep, setLoadingStep] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [conversionStatus, setConversionStatus] = useState('');
  const [previewScale, setPreviewScale] = useState(1);
  const [isPresenting, setIsPresenting] = useState(false); 
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  const previewContainerRef = useRef(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('beblink_onboarded');
    if (!hasOnboarded) {
      setShowOnboarding(true);
    }

    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // --- MOCK AUTH ---
  const handleLogin = () => {
    setUser({ name: "Demo User", email: "user@beblink.ai" });
    setShowAuthModal(false);
  };

  // --- API HELPER FUNCTIONS ---

  const fetchPresentationHTML = async () => {
    let paletteKeyword = "Professional";
    if (palette === 'energetic' || palette === 'modern') paletteKeyword = "Energetic";
    if (palette === 'bw') paletteKeyword = "Minimal";

    const prompt = `
      You are an expert HTML presentation designer. Generate a complete, professional HTML presentation.
      IMPORTANT: Return ONLY valid HTML code. No markdown.

      Topic: "${topic}"
      Category: ${category}
      Theme: ${theme}
      Color Palette: ${paletteKeyword}

      Requirements:
      1. Analyze the topic "${topic}" and determine the appropriate number of slides (minimum 5, maximum 15) to cover it comprehensively.
      2. DIMENSIONS: Strictly 1280px width x 720px height (16:9 ratio).
      3. Use Tailwind CSS (via CDN) + custom styling.
      4. Each slide must be a separate <div class="slide">.
      5. Include:
         - Decorative top bar (gradient)
         - Professional typography (headings, body text)
         - Icons (FontAwesome)
         - Cards with content
         - Left-right column layout or centered layout
         - Footer with slide number
         - MANDATORY: A watermark "Made With BeBlink" at the top-right of EVERY slide.
      6. Content should be relevant to: ${topic}

      Color codes for "${paletteKeyword}":
      - Professional: #00629B (dark blue), #3B82F6 (blue), #F1F5F9 (light)
      - Energetic: #EF4444 (red), #FBBF24 (yellow), #14B8A6 (teal)
      - Minimal: #FFFFFF (white), #000000 (black), #E5E7EB (gray)

      HTML Structure Template:
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="utf-8"/>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet"/>
      <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
      <style>
      body { font-family: 'Open Sans', sans-serif; background: transparent; margin: 0; padding: 0; }
      h1, h2, h3, h4 { font-family: 'Roboto', sans-serif; }
      .slide { 
        width: 1280px; 
        height: 720px; 
        position: relative; 
        overflow: hidden; 
        background: white; 
        display: flex; 
        flex-direction: column; 
        border: 1px solid #e5e7eb;
        page-break-after: always;
        break-after: page;
      }
      .watermark {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 10px;
        font-weight: 800;
        color: rgba(0,0,0,0.5);
        text-transform: uppercase;
        letter-spacing: 1px;
        z-index: 100;
        font-family: 'Roboto', sans-serif;
        background: rgba(255, 255, 255, 0.4);
        padding: 6px 14px;
        border-radius: 9999px;
        border: 1px solid rgba(0,0,0,0.05);
        backdrop-filter: blur(2px);
      }
      .card-shadow { box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
      .tech-grid {
        background-image: linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px);
        background-size: 40px 40px;
      }
      @media print {
        .slide { border: none; box-shadow: none; margin: 0; page-break-after: always; }
      }
      </style>
      </head>
      <body>
      <!-- EACH SLIDE MUST HAVE: <div class="watermark">Made With BeBlink</div> -->
      <!-- SLIDES GO HERE -->
      </body>
      </html>

      Return ONLY the raw HTML code.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!response.ok) throw new Error(`HTML API Error: ${response.statusText}`);
    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("No HTML content generated.");

    return rawText.replace(/```html|```/g, '').trim();
  };

  // --- GENERATION SEQUENCE ---

  const startSequence = async () => {
    if (!topic || !category) return;

    setView('loading');
    setLoadingStep(0);
    setErrorMessage('');

    const progressInterval = setInterval(() => {
      setLoadingStep(prev => (prev < 90 ? prev + (Math.random() * 2) : prev));
    }, 100);

    try {
      const htmlData = await fetchPresentationHTML();
      
      clearInterval(progressInterval);
      setLoadingStep(100);
      setHtmlCode(htmlData);

      setTimeout(() => {
        setView('output');
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      console.error("Sequence Error:", error);
      setErrorMessage(error.message || "Failed to generate presentation.");
      setView('error');
    }
  };

  // --- CLEAN CONTENT EXTRACTOR ---
  const getCleanBodyContent = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlCode, 'text/html');
    return doc.body.innerHTML;
  };

  const getExportStyles = () => `
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
    <style>
       body { margin: 0; padding: 0; background: white; font-family: 'Open Sans', sans-serif; }
       h1, h2, h3, h4 { font-family: 'Roboto', sans-serif; }
       .slide {
         width: 1280px;
         height: 720px;
         position: relative;
         overflow: hidden;
         background: white;
         margin: 0;
         padding: 0;
         page-break-after: always;
         break-after: page;
       }
    </style>
  `;

  // --- PDF GENERATOR ---
  const generatePDFBlob = async () => {
    if (!window.html2pdf) throw new Error("PDF Engine not loaded");

    const container = document.createElement('div');
    container.id = 'export-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 1280px;
      z-index: 10000;
      background: white;
      visibility: visible;
    `;
    
    container.innerHTML = getExportStyles() + getCleanBodyContent();
    document.body.appendChild(container);

    try {
      // Wait for fonts to load
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 2000));

      const opt = {
        margin: 0,
        filename: 'presentation.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          allowTaint: true, 
          width: 1280,
          windowWidth: 1280,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: { 
          orientation: 'landscape', 
          unit: 'px', 
          format: [1280, 720], 
          hotfixes: ['px_scaling']
        }
      };

      const pdf = await window.html2pdf().set(opt).from(container).outputPdf('datauristring');
      return pdf;

    } finally {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }
  };

  const downloadPDF = async () => {
    setIsExporting(true);
    setConversionStatus('Rendering High-Res PDF...');
    
    try {
      const pdfDataUri = await generatePDFBlob();
      
      const link = document.createElement('a');
      link.href = pdfDataUri;
      link.download = `${topic.substring(0, 10).trim()}_presentation.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('✅ PDF Downloaded Successfully!');
    } catch (error) {
      console.error('PDF error:', error);
      alert('Error downloading PDF: ' + error.message);
    } finally {
      setIsExporting(false);
      setConversionStatus('');
    }
  };

  const downloadPPTX = async () => {
    setIsExporting(true);
    setConversionStatus('Step 1: Generating PDF...');

    try {
        const pdfDataUri = await generatePDFBlob();
        const cleanBase64 = pdfDataUri.split(',')[1];

        setConversionStatus('Step 2: Uploading to Convertio...');

        const startResponse = await fetch('https://api.convertio.co/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apikey: convertioApiKey,
                input: 'base64',
                file: cleanBase64,
                filename: 'presentation.pdf',
                outputformat: 'pptx'
            })
        });

        const startData = await startResponse.json();
        
        if (startData.status !== 'ok') {
            throw new Error(`Convertio Error: ${startData.error || 'Unknown start error'}`);
        }

        const conversionId = startData.data.id;
        setConversionStatus('Step 3: Converting (Waiting)...');

        let isFinished = false;
        let attempts = 0;
        
        while (!isFinished && attempts < 60) {
            await new Promise(r => setTimeout(r, 2000));
            attempts++;
            
            const statusRes = await fetch(`https://api.convertio.co/convert/${conversionId}/status`);
            const statusData = await statusRes.json();
            
            if (statusData.data.step === 'finished') {
                isFinished = true;
                setConversionStatus('Downloading PPTX...');
                
                const link = document.createElement('a');
                link.href = statusData.data.output.url;
                link.download = `${topic.substring(0, 10).trim()}_presentation.pptx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                alert("✅ PPTX Downloaded Successfully!");
            } else if (statusData.data.step === 'failed') {
                throw new Error("Conversion failed on Server.");
            }
        }
        
        if (!isFinished) throw new Error("Conversion timed out.");

    } catch (error) {
        console.error('PPTX Export Error:', error);
        if (error.message.includes("Failed to fetch")) {
             alert("❌ Network Error: CORS blocked. This demo requires a backend proxy for PPTX.");
        } else {
             alert(`❌ PPTX Error: ${error.message}`);
        }
    } finally {
        setIsExporting(false);
        setConversionStatus('');
    }
  };

  const reset = () => {
    setView('landing');
    setTopic('');
    setCategory('');
    setTheme('minimal');
    setPalette('professional');
    setLoadingStep(0);
    setHtmlCode('');
    setErrorMessage('');
  };

  // --- VIEWS ---

  const LandingView = () => (
    <div className="min-h-screen bg-[#e3e3e3] text-black font-mono relative overflow-hidden flex flex-col justify-center items-center">
      <div className="absolute inset-0 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#a1a1a1 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.3 }}>
      </div>

      <nav className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
         <div className="flex items-center gap-2">
            <Zap className="text-orange-600" />
            <span className="font-bold text-lg">BeBlink</span>
         </div>
         <div className="flex gap-4">
            {user ? (
               <div className="flex items-center gap-2 cursor-pointer hover:bg-black/5 p-2 rounded-[12px]" onClick={() => setShowAuthModal(true)}>
                  <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold">
                     {user.name[0]}
                  </div>
               </div>
            ) : (
               <button onClick={() => setShowAuthModal(true)} className="text-sm font-bold hover:underline">Sign In</button>
            )}
         </div>
      </nav>

      <main className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
        <div className="bg-white border-2 border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[24px] w-full text-center">
            
            <div className="inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-xs font-bold mb-6">
               {APP_VERSION}
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
              AI-POWERED <br/> <span className="text-orange-600">SLIDE DECK</span> CREATOR
            </h1>
            
            <p className="text-gray-500 mb-10 max-w-lg mx-auto text-lg">
              Generate beautiful, structured HTML presentations in seconds. Export to PDF & PPTX seamlessly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full max-w-2xl mx-auto">
               <button onClick={() => setView('input')} className="group flex flex-col items-center p-6 border-2 border-black rounded-[17px] hover:bg-black hover:text-white transition-all">
                  <Plus size={32} className="mb-2"/>
                  <span className="font-bold">New Project</span>
                  <span className="text-xs opacity-60">Start from scratch</span>
               </button>
               <button className="group flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-[17px] hover:border-black hover:bg-gray-50 transition-all">
                  <Layout size={32} className="mb-2 text-gray-400 group-hover:text-black"/>
                  <span className="font-bold text-gray-400 group-hover:text-black">Open Template</span>
                  <span className="text-xs opacity-60 text-gray-400 group-hover:text-black">Browse gallery</span>
               </button>
            </div>
        </div>
      </main>
    </div>
  );

  const InputView = () => (
    <div className="min-h-screen bg-[#f0f0f0] text-black font-mono flex flex-col">
      <div className="bg-white border-b-2 border-black p-4 flex items-center justify-between sticky top-0 z-20">
        <button onClick={reset} className="flex items-center gap-2 hover:text-orange-600 font-bold text-sm">
          <ChevronLeft size={16} /> ABORT
        </button>
        
        <div className="flex gap-2">
           <button 
             onClick={() => setActiveTab('basic')}
             className={`px-4 py-1 rounded-[17px] text-xs font-bold transition-all ${activeTab === 'basic' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
           >
             Basic
           </button>
           <button 
             onClick={() => setActiveTab('studio')}
             className={`px-4 py-1 rounded-[17px] text-xs font-bold transition-all ${activeTab === 'studio' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
           >
             Studio
           </button>
        </div>

        <div className="w-12"></div>
      </div>

      <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[24px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            <label className="text-xs font-bold uppercase flex items-center gap-2 text-gray-500 mb-4">
               <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
               Input Stream / Topic
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="> Enter presentation topic, context, or detailed prompt..."
              className="w-full h-[250px] bg-gray-50 border-2 border-gray-200 p-6 font-mono text-sm resize-none focus:outline-none focus:bg-white focus:border-black transition-all placeholder:text-gray-400 rounded-[17px]"
            />
            <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold">
               <span>MIN 10 CHARS</span>
               <span>{topic.length} CHARS</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             {CATEGORIES.map(cat => (
               <button
                 key={cat.id}
                 onClick={() => setCategory(cat.id)}
                 className={`p-4 rounded-[17px] border-2 text-left transition-all hover:translate-y-[-2px] ${category === cat.id ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' : 'border-gray-200 bg-white hover:border-black'}`}
               >
                 <div className="text-2xl mb-1">{cat.icon}</div>
                 <div className="font-bold text-sm">{cat.label}</div>
                 <div className="text-[10px] text-gray-500">{cat.desc}</div>
               </button>
             ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {activeTab === 'basic' ? (
            <>
              <div className="bg-white border-2 border-black p-5 rounded-[24px] shadow-sm">
                <h3 className="text-xs font-bold uppercase border-b border-black/10 pb-2 mb-3 flex items-center gap-2">
                  <Layout size={14}/> Visual Theme
                </h3>
                <div className="space-y-2">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 border-2 transition-all text-xs font-bold rounded-[17px]
                        ${theme === t.id ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-500 hover:border-black hover:text-black'}`}
                    >
                      <span className="flex flex-col text-left">
                        <span>{t.name}</span>
                        <span className={`text-[9px] font-normal ${theme === t.id ? 'text-gray-400' : 'text-gray-400'}`}>{t.desc}</span>
                      </span>
                      {theme === t.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border-2 border-black p-5 rounded-[24px] shadow-sm">
                <h3 className="text-xs font-bold uppercase border-b border-black/10 pb-2 mb-3 flex items-center gap-2">
                  <Palette size={14}/> Color Palette
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {PALETTES.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setPalette(p.id)}
                      className={`h-12 border-2 flex items-center justify-center gap-2 transition-all rounded-[17px]
                        ${palette === p.id ? 'border-black shadow-md bg-gray-50' : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400'}`}
                    >
                       <div className="flex -space-x-1">
                          <div className={`w-4 h-4 rounded-full border border-white ${p.colors[0]}`}></div>
                          <div className={`w-4 h-4 rounded-full border border-white ${p.colors[1]}`}></div>
                       </div>
                       <span className="text-[10px] font-bold uppercase">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border-2 border-black p-6 rounded-[24px] shadow-sm flex-1">
               <h3 className="text-xs font-bold uppercase mb-6">Studio Fine-Tuning</h3>
               <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 block">Font Pairing</label>
                    <select className="w-full p-2 border-2 border-gray-200 rounded-[12px] text-sm font-bold">
                       <option>Modern (Inter / Roboto)</option>
                       <option>Classic (Merriweather / Open Sans)</option>
                       <option>Tech (Mono / Sans)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 block">Slide Density</label>
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-[12px]">
                       {['Low', 'Medium', 'High'].map(d => (
                         <button key={d} className="flex-1 py-1 text-xs font-bold rounded-[8px] bg-white shadow-sm hover:bg-gray-50">{d}</button>
                       ))}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-[17px] text-xs text-blue-800 leading-relaxed border border-blue-100">
                     <Monitor size={16} className="mb-2"/>
                     Advanced studio settings adjust the AI prompt engineering to fine-tune the output structure.
                  </div>
               </div>
            </div>
          )}

          <button 
            onClick={startSequence}
            disabled={!topic || !category}
            className={`
              h-20 border-2 border-black flex items-center justify-center gap-3 font-bold text-xl uppercase tracking-widest transition-all rounded-[24px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              ${(!topic || !category)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 shadow-none'
                : 'bg-orange-500 text-white hover:bg-orange-600 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'}`}
          >
            <Zap size={24} className={(!topic || !category) ? "" : "fill-white"} />
            GENERATE
          </button>
        </div>
      </div>
    </div>
  );

  const LoadingView = () => (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md border border-gray-800 p-8 relative overflow-hidden rounded-[24px] bg-gray-900">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-[shimmer_2s_infinite]"></div>
        
        <div className="flex justify-between items-end mb-8">
           <h2 className="text-2xl font-bold tracking-tight">BUILDING DECK</h2>
           <Activity className="w-6 h-6 text-orange-500 animate-pulse" />
        </div>
        
        <div className="space-y-4 mb-10 text-xs font-mono text-gray-500">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${loadingStep > 10 ? 'bg-green-500' : 'bg-gray-700'}`}></div> ANALYZING CONTEXT</span>
            <span className={loadingStep > 10 ? "text-green-500" : ""}>{loadingStep > 10 ? "DONE" : "..."}</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${loadingStep > 40 ? 'bg-green-500' : 'bg-gray-700'}`}></div> STRUCTURING SLIDES</span>
             <span className={loadingStep > 40 ? "text-green-500" : ""}>{loadingStep > 40 ? "DONE" : "..."}</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${loadingStep > 70 ? 'bg-orange-500 animate-pulse' : 'bg-gray-700'}`}></div> RENDERING HTML (16:9)</span>
             <span className={loadingStep > 70 ? "text-green-500" : "text-orange-500"}>{loadingStep > 70 ? "DONE" : "WORKING..."}</span>
          </div>
        </div>

        <div className="w-full h-3 bg-gray-800 mb-2 overflow-hidden rounded-full">
           <div 
             className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-300"
             style={{ width: `${Math.min(loadingStep, 100)}%` }}
           ></div>
        </div>
        <div className="text-right text-[10px] font-bold text-orange-500 tracking-widest">{Math.floor(loadingStep)}% COMPLETE</div>
      </div>
    </div>
  );

  const OutputView = () => {
    const iframeRef = useRef(null);

    const getPreviewHtml = () => {
      const cdnLinks = `
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet"/>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Open Sans', sans-serif !important; 
            background: #e2e8f0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            min-height: 100vh;
            padding: 40px 0;
            overflow-x: hidden;
          }
          h1, h2, h3, h4 { font-family: 'Roboto', sans-serif !important; font-weight: 700; }
          .slide-container { width: 100%; display: flex; justify-content: center; margin-bottom: 20px; }
          .slide {
            width: 1280px;
            height: 720px;
            background: white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            position: relative;
            overflow: hidden;
            border: 1px solid #cbd5e1;
          }
        </style>
      `;

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlCode, 'text/html');
      const slides = doc.querySelectorAll('.slide');
      
      let bodyContent = '';
      slides.forEach(slide => {
        bodyContent += `<div class="slide-container">${slide.outerHTML}</div>`;
      });

      return `
        <!DOCTYPE html>
        <html>
          <head>${cdnLinks}</head>
          <body>${bodyContent}</body>
        </html>
      `;
    };

    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <div className="bg-black border-b border-gray-700 p-4 flex items-center justify-between sticky top-0 z-20">
          <button onClick={reset} className="flex items-center gap-2 text-white hover:text-orange-500 font-bold text-sm">
            <Home size={16} /> HOME
          </button>

          <div className="flex gap-2">
            <button 
              onClick={() => setIsPresenting(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-[12px] text-xs font-bold flex items-center gap-2"
            >
              <PlayCircle size={14} /> PRESENT
            </button>
            <button 
              onClick={downloadPDF}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[12px] text-xs font-bold flex items-center gap-2"
            >
              <Download size={14} /> PDF
            </button>
            <button 
              onClick={downloadPPTX}
              disabled={isExporting}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-[12px] text-xs font-bold flex items-center gap-2"
            >
              <Download size={14} /> PPTX
            </button>
          </div>
        </div>

        {isExporting && (
          <div className="bg-yellow-500 text-black p-3 text-center text-sm font-bold">
            {conversionStatus || "Processing..."}
          </div>
        )}

        <div ref={previewContainerRef} className="flex-1 p-6 overflow-auto bg-gray-800">
          <iframe
            ref={iframeRef}
            srcDoc={getPreviewHtml()}
            className="w-full h-full border-none rounded-lg shadow-2xl"
            style={{ minHeight: '80vh' }}
            title="Presentation Preview"
            sandbox="allow-same-origin"
          />
        </div>

        {isPresenting && (
          <PresentationOverlay htmlCode={htmlCode} onClose={() => setIsPresenting(false)} />
        )}
      </div>
    );
  };

  // --- RENDER ROUTER ---
  return (
    <>
      {showOnboarding && (
        <OnboardingTour 
          onComplete={() => {
            setShowOnboarding(false);
            localStorage.setItem('beblink_onboarded', 'true');
          }}
        />
      )}

      {showAuthModal && (
        <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} title="Authentication">
          <div className="text-center py-6">
            <p className="text-gray-600 mb-6">Demo Mode - Click to continue as guest</p>
            <button 
              onClick={handleLogin}
              className="w-full bg-black text-white py-3 rounded-[17px] font-bold hover:bg-gray-800"
            >
              Continue as Guest
            </button>
          </div>
        </Modal>
      )}

      {view === 'landing' && <LandingView />}
      {view === 'input' && <InputView />}
      {view === 'loading' && <LoadingView />}
      {view === 'output' && <OutputView />}
      {view === 'error' && <ErrorView errorMessage={errorMessage} setView={setView} reset={reset} />}
    </>
  );
}
