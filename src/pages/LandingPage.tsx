import { Link } from 'react-router-dom';
import { Shield, Droplets, Users, Navigation } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page min-h-screen bg-gradient-to-b from-white to-[#F5F0E8] text-slate-800 font-sans flex flex-col">
      {/* Top Navigation */}
      <nav className="absolute top-0 w-full px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Navigation className="w-6 h-6 text-slate-800" />
          <span className="text-xl font-bold text-slate-800 tracking-tight">Kinaara</span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/dashboard"
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-12 lg:px-24 pt-24 pb-12 gap-12 max-w-[1440px] mx-auto w-full">
          {/* Left Content */}
          <div className="w-full md:w-[60%] flex flex-col items-start gap-6">
            <span className="text-sm font-semibold tracking-wider text-teal-600 uppercase">
              Kinaara Platform
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Know Before <br /> You Go.
            </h1>
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Real-time coastal safety intelligence for India's beaches. Check conditions, understand risks, stay safe.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
              <Link 
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 text-lg"
              >
                Explore Beaches <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link 
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center text-lg"
              >
                Check Safety
              </Link>
            </div>
          </div>

          {/* Right Decorative Element */}
          <div className="w-full md:w-[40%] flex justify-center mt-12 md:mt-0">
            <div className="w-72 h-96 md:w-96 md:h-[30rem] bg-gradient-to-tr from-teal-400 to-cyan-500 rounded-3xl shadow-2xl relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
              <Navigation className="w-32 h-32 text-white/80 drop-shadow-lg" />
              {/* Decorative wave circles */}
              <div className="absolute -bottom-16 -right-16 w-64 h-64 border-[24px] border-white/20 rounded-full blur-sm"></div>
              <div className="absolute -top-16 -left-16 w-48 h-48 border-[16px] border-white/20 rounded-full blur-sm"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 md:px-12 lg:px-24 py-20 bg-white/50 w-full">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Live Safety Monitoring</h3>
                <p className="text-slate-600 leading-relaxed">
                  Real-time beach safety conditions and alerts driven by authoritative data.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
                  <Droplets className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Water Quality Data</h3>
                <p className="text-slate-600 leading-relaxed">
                  Current water quality from verified sources to ensure safe swimming conditions.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Community Reports</h3>
                <p className="text-slate-600 leading-relaxed">
                  Beach reports from visitors and authorities keeping the community informed.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#07111F] text-slate-400 py-8 px-6 text-center text-sm">
        <p>© 2024 Kinaara. Built for Smart India Hackathon.</p>
      </footer>
    </div>
  );
}
