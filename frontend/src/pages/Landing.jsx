import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Brain, Network, ShieldAlert, Users, Check, X } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm shadow-blue-200">
              <span className="text-white font-bold text-xl leading-none">F</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">FairSplit</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8">
          <Brain size={16} />
          <span>AI-Powered Project Management</span>
        </div>
        
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
          Don't just manage tasks.
          <span className="block text-blue-600 mt-2">Optimize your team.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-600">
          FairSplit uses machine learning to eliminate bias in task allocation, predict project risks before they happen, and analyze team contributions fairly.
        </p>
        
        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/register"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
          >
            Get started for free
            <ArrowRight size={18} />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            See how it works
          </a>
        </div>

        {/* Dashboard Preview UI Mock */}
        <div className="mt-20 mx-auto max-w-5xl rounded-xl border border-gray-200/60 bg-white shadow-2xl shadow-gray-200/50 overflow-hidden text-left ring-1 ring-black/5">
          {/* Mac-style Window Header */}
          <div className="flex items-center px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
          </div>
          {/* Content Area */}
          <div className="flex h-[450px]">
            {/* Sidebar Mock */}
            <div className="w-56 border-r border-gray-100 bg-gray-50/30 p-4 hidden sm:block">
              <div className="w-24 h-4 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="w-full h-8 bg-blue-50 border border-blue-100 rounded-md"></div>
                <div className="w-3/4 h-8 bg-gray-100 rounded-md"></div>
                <div className="w-5/6 h-8 bg-gray-100 rounded-md"></div>
              </div>
            </div>
            {/* Main Content Mock */}
            <div className="flex-1 p-8 bg-white">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <div className="w-48 h-6 bg-gray-800 rounded mb-2"></div>
                  <div className="w-64 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="w-32 h-10 bg-blue-600 rounded-lg"></div>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="h-24 rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-100 mb-2"></div>
                  <div className="w-16 h-6 bg-gray-800 rounded"></div>
                </div>
                <div className="h-24 rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 mb-2"></div>
                  <div className="w-16 h-6 bg-gray-800 rounded"></div>
                </div>
                <div className="h-24 rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-amber-100 mb-2"></div>
                  <div className="w-16 h-6 bg-gray-800 rounded"></div>
                </div>
              </div>

              {/* Task list mock */}
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <div className="h-12 bg-gray-50 border-b border-gray-100"></div>
                <div className="h-16 border-b border-gray-50 flex items-center px-4 gap-4">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 ml-auto"></div>
                </div>
                <div className="h-16 flex items-center px-4 gap-4">
                  <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 ml-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Highlights */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Everything you need to ship without the stress</h2>
            <p className="mt-4 text-gray-600">FairSplit replaces guesswork with data, ensuring your team stays productive, happy, and on schedule.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Network className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Team Formation</h3>
              <p className="text-gray-600 leading-relaxed text-sm">Our AI analyzes past project success and individual skills to suggest the perfect mix of engineers for any new feature.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                <Users className="text-emerald-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fair Workload Distribution</h3>
              <p className="text-gray-600 leading-relaxed text-sm">Prevent top-performer burnout. Tasks are allocated equitably based on current bandwidth and historical complexity.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                <ShieldAlert className="text-amber-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Predictive Risk Analysis</h3>
              <p className="text-gray-600 leading-relaxed text-sm">XGBoost models predict which tasks are likely to be delayed before they even start, allowing proactive adjustments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">How FairSplit Works</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Define Your Project</h4>
                    <p className="text-gray-600 text-sm">Create a project and add your backlog. FairSplit breaks down complex tasks using historical data.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">AI Allocation</h4>
                    <p className="text-gray-600 text-sm">Our machine learning models assign tasks to the most suitable developers without human bias.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Track & Optimize</h4>
                    <p className="text-gray-600 text-sm">Monitor progress through real-time dashboards that adjust predictions as work gets completed.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Simple Graphic Representation */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex items-center justify-center min-h-[400px]">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-blue-100 blur-3xl opacity-50 rounded-full"></div>
                <div className="relative bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-12 bg-blue-100 rounded"></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-full bg-gray-100 rounded"></div>
                      <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex-shrink-0 border border-blue-100"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-full bg-blue-50 rounded"></div>
                      <div className="h-3 w-1/2 bg-blue-50 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why choose FairSplit?</h2>
            <p className="text-gray-400">Traditional tools track work. FairSplit optimizes it.</p>
          </div>
          
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="grid grid-cols-3 border-b border-gray-700 bg-gray-800/50">
              <div className="p-6 font-medium text-gray-400">Feature</div>
              <div className="p-6 font-semibold border-l border-gray-700 text-gray-300">Traditional PM Tools</div>
              <div className="p-6 font-semibold border-l border-gray-700 text-blue-400">FairSplit</div>
            </div>
            
            <div className="grid grid-cols-3 border-b border-gray-700 text-sm">
              <div className="p-6 text-gray-300">Task Assignment</div>
              <div className="p-6 border-l border-gray-700 text-gray-400 flex items-center gap-2"><X size={16} className="text-red-400" /> Manual & Biased</div>
              <div className="p-6 border-l border-gray-700 text-gray-200 flex items-center gap-2"><Check size={16} className="text-emerald-400" /> AI-Driven & Fair</div>
            </div>
            
            <div className="grid grid-cols-3 border-b border-gray-700 text-sm">
              <div className="p-6 text-gray-300">Deadline Estimation</div>
              <div className="p-6 border-l border-gray-700 text-gray-400 flex items-center gap-2"><X size={16} className="text-red-400" /> Human Guesswork</div>
              <div className="p-6 border-l border-gray-700 text-gray-200 flex items-center gap-2"><Check size={16} className="text-emerald-400" /> ML Predictions (XGBoost)</div>
            </div>
            
            <div className="grid grid-cols-3 text-sm">
              <div className="p-6 text-gray-300">Workload Tracking</div>
              <div className="p-6 border-l border-gray-700 text-gray-400 flex items-center gap-2"><X size={16} className="text-red-400" /> Burnout Prone</div>
              <div className="p-6 border-l border-gray-700 text-gray-200 flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Real-time Balancing</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 text-center px-4">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to transform your team's workflow?</h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Join forward-thinking teams using AI to build software faster and fairer.</p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg"
        >
          Start your free trial
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs leading-none">F</span>
            </div>
            <span className="font-semibold text-gray-900">FairSplit</span>
          </div>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} FairSplit. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
            <a href="https://github.com/PrakharPurwar12/FairSplit" className="hover:text-gray-900">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
