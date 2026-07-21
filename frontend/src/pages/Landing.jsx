import { Link } from 'react-router-dom';
import { Check, Activity, ShieldAlert, BarChart3, Bell } from 'lucide-react';

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] p-6 ${className}`}>
    {children}
  </div>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#111827] font-sans relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] -z-10 opacity-70"></div>
      <div className="absolute top-32 -right-20 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] -z-10 opacity-60"></div>

      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 bg-white/50 backdrop-blur-xl border-b border-white/20 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="text-white font-bold text-lg leading-none">F</span>
            </div>
            <span className="font-bold text-lg tracking-tight">FairSplit</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-[#6B7280]">
            <a href="#features" className="hover:text-[#111827] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#111827] transition-colors">How It Works</a>
            <a href="#modules" className="hover:text-[#111827] transition-colors">Modules</a>
            <Link to="/dashboard" className="hover:text-[#111827] transition-colors">Dashboard</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors">
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-[#111827] text-white px-4 py-2 rounded-full hover:bg-black transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (Responsive & Fits 100vh on Desktop) */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-auto lg:h-screen lg:min-h-[700px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Side: Copy & CTA */}
          <div className="animate-fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-extrabold tracking-tight text-[#111827] mb-6">
              Build Smarter Teams.<br/>
              Predict Risks & Optimize.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">Deliver Faster.</span>
            </h1>
            
            <p className="text-base md:text-lg text-[#6B7280] mb-8 max-w-lg leading-relaxed">
              AI-powered project management that forms balanced teams, predicts risks, and optimizes workloads for fairer delivery.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                to="/register"
                className="flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)]"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 bg-white text-[#111827] px-6 py-3 rounded-full text-sm font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Explore Features
              </a>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-3 max-w-lg">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-blue-50 text-blue-600 text-[11px] md:text-xs font-bold tracking-wide uppercase">
                <Check size={12} strokeWidth={3}/> AI Task Allocation
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-purple-50 text-purple-600 text-[11px] md:text-xs font-bold tracking-wide uppercase">
                <ShieldAlert size={12} strokeWidth={3}/> Risk Prediction
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[11px] md:text-xs font-bold tracking-wide uppercase">
                <Activity size={12} strokeWidth={3}/> Workload Optimization
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-50 text-amber-600 text-[11px] md:text-xs font-bold tracking-wide uppercase">
                <BarChart3 size={12} strokeWidth={3}/> Real-time Analytics
              </span>
            </div>
          </div>

          {/* Right Side: Scaled Unified AI Dashboard */}
          <div className="relative w-full hidden lg:flex justify-end perspective-1000">
            
            <GlassCard className="w-full max-w-[550px] xl:max-w-[620px] shadow-2xl relative z-20 border-white/60">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center shadow-inner">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">Project Alpha</h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Sprint 12 • Active</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full uppercase tracking-widest border border-emerald-100">On Track</span>
              </div>
              
              {/* 2-Column Compact Grid */}
              <div className="grid grid-cols-2 gap-5 mb-6">
                
                {/* Column 1: Health & Balance */}
                <div className="space-y-5">
                  {/* Health */}
                  <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Project Health</p>
                    <div className="flex items-center justify-between">
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-14 h-14 transform -rotate-90 absolute inset-0">
                          <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-gray-100" />
                          <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-blue-600" strokeDasharray="138" strokeDashoffset="24" strokeLinecap="round"/>
                        </svg>
                        <span className="text-sm font-bold text-gray-900">82%</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-rose-500 flex items-center gap-1 justify-end"><ShieldAlert size={14}/> High Risk</p>
                      </div>
                    </div>
                  </div>

                  {/* Team Balance */}
                  <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Team Balance</p>
                    <div className="flex items-center justify-between">
                      <h4 className="text-2xl lg:text-3xl font-bold text-[#7C3AED]">94%</h4>
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-700">A</div>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-700">S</div>
                        <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-amber-700">J</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Workload */}
                <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm h-full flex flex-col">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    <span>Workload</span>
                    <span>Cap</span>
                  </div>
                  <div className="space-y-4 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold w-9 text-gray-700">Alice</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-400 w-[95%] rounded-full"></div>
                      </div>
                      <span className="text-xs font-bold text-rose-500 w-7 text-right">95%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold w-9 text-gray-700">John</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 w-[45%] rounded-full"></div>
                      </div>
                      <span className="text-xs font-bold text-gray-500 w-7 text-right">45%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold w-9 text-gray-700">Sarah</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 w-[60%] rounded-full"></div>
                      </div>
                      <span className="text-xs font-bold text-gray-500 w-7 text-right">60%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Recommendation Panel */}
              <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-[14px] p-4 border border-indigo-100/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><Check size={12} strokeWidth={3}/></div>
                    <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">AI Suggestion</p>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">Reassign <b>Auth Module</b> to John.</p>
                </div>
                <button className="text-xs font-bold bg-white text-indigo-600 px-4 py-2.5 rounded-lg shadow-sm border border-indigo-100 hover:bg-indigo-50 transition-colors">
                  Apply Fix
                </button>
              </div>

              {/* ONE Small Floating Notification tied inside the parent visually but popping out slightly */}
              <div className="absolute -left-8 bottom-12 w-52 animate-float-slow z-30 py-3 px-4 shadow-xl border border-rose-100/50 bg-white/95 rounded-[16px] backdrop-blur-md hidden xl:block">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-tight">Risk Detected</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">API deadline in jeopardy</p>
                  </div>
                </div>
              </div>
            </GlassCard>

          </div>
        </div>
      </main>

      {/* Temporary spacing to demonstrate scrolling for the next section if needed */}
      <section id="features" className="min-h-screen bg-white py-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover the Features</h2>
          <p className="text-gray-500">Scroll down for more information...</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
