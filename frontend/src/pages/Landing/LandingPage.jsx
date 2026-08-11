import React, { useContext } from "react";
import { motion as Motion } from "framer-motion";
import {
  ChevronRight,
  PieChart,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Github,
  Twitter,
  Calendar,
  CreditCard,
} from "lucide-react";
import AppStore from "../../context/expense_tracker_store";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const { isAuthenticated } = useContext(AppStore);
  const navigate = useNavigate();
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const handleOnTracking = () => 
{
    console.log(isAuthenticated);
    
    if (isAuthenticated) 
    {
      navigate("/Home");
    } else {
      navigate("/Login");
    }
};

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-rose-100 selection:text-rose-900">
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
              <Zap
                className="text-white"
                size={20}
                fill="currentColor"
              />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">
              SpendWise
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a
              href="#features"
              className="hover:text-rose-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#logic"
              className="hover:text-rose-600 transition-colors"
            >
              Income Engine
            </a>
            <a href="/Login" className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-md active:scale-95">
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* <Motion.div {...fadeIn} className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-4 py-2 rounded-full mb-8">
            <span className="text-rose-600 text-xs font-black uppercase tracking-widest">v2.0 is live</span>
            <div className="w-1 h-1 bg-rose-300 rounded-full" />
            <span className="text-rose-900/60 text-xs font-bold">New Smart Income Logic</span>
          </Motion.div> */}

          <Motion.h1
            {...fadeIn}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight"
          >
            Master your spend's, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-indigo-600">
              don’t let it master you.
            </span>
          </Motion.h1>

          <Motion.p
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed"
          >
            The only expense tracker that understands life happens. Manage
            recurring income, track every cent, and see your financial future
            with absolute clarity.
          </Motion.p>

          <Motion.div
            {...fadeIn}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={handleOnTracking}
              className="w-full sm:w-auto bg-rose-600 text-white px-10 py-5 rounded-3xl font-bold text-lg hover:bg-rose-700 transition-all shadow-2xl shadow-rose-200 flex items-center justify-center gap-2 group"
            >
              Start Tracking Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Motion.div>
        </div>

        {/* --- APP MOCKUP PREVIEW --- */}
        <Motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-5xl mx-auto mt-20 relative"
        >
          <div className="absolute -inset-4 bg-linear-to-b from-rose-100 to-transparent rounded-[40px] blur-2xl opacity-50 -z-10" />
          <div className="bg-white rounded-4xl p-4 shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 rounded-3xl video border border-slate-100 flex items-center justify-center relative overflow-hidden">
              {/* Visual placeholder for your actual dashboard */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                  <div className="w-32 h-32 bg-rose-500/10 rounded-full flex items-center justify-center">
                    <PieChart
                      size={48}
                      className="text-rose-600"
                    />
                  </div>
                </div>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                  Dashboard Preview
                </p>
              </div>
            </div>
          </div>
        </Motion.div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section
        id="features"
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
              Everything you need to thrive.
            </h2>
            <p className="text-slate-500 font-medium">
              Built for speed, accuracy, and ease of use.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-amber-500" />,
                title: "Smart Income Engine",
                desc: "Handles weekly, monthly, and one-time income with deactivation logic that preserves historical data.",
              },
              {
                icon: <Calendar className="text-indigo-500" />,
                title: "Month/Year Switcher",
                desc: "Teleport through your financial history with our high-performance Headless UI date switcher.",
              },
              {
                icon: <CreditCard className="text-rose-500" />,
                title: "Instant Entry",
                desc: "Add expenses in seconds with our optimized mobile-first category grid and date picker.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-10 rounded-4xl bg-slate-50 border border-slate-100 hover:border-rose-200 transition-colors group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- THE LOGIC BREAKOUT --- */}
      <section
        id="logic"
        className="py-24 px-6 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[48px] p-12 md:p-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/20 rounded-full blur-[120px] -mr-48 -mt-48" />

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
                  Data accuracy that <br />
                  <span className="text-rose-500">won't break.</span>
                </h2>
                <div className="space-y-6">
                  {[
                    "Past records stay intact after deactivating income",
                    "Weekly income automatically calculates per month",
                    "One-time entries won't clutter future reports",
                    "Bank-level encryption for all data",
                  ].map((text, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 text-slate-300 font-medium"
                    >
                      <CheckCircle2
                        className="text-rose-500 shrink-0"
                        size={20}
                      />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <pre className="text-rose-400 text-xs md:text-sm font-mono leading-relaxed overflow-x-auto">
                    <code>{`// Smart Life-Span Logic
                        const incomeEnd = income.active 
                        ? new Date(8640000000000000) 
                        : new Date(income.inactivatedAt);

                        if (incomeEnd < monthStart) return acc;`}
                    </code>
                </pre>
                <div className="mt-6 pt-6 border-t border-white/10 text-white/40 text-xs font-bold uppercase tracking-widest">
                  SpendWise Calculation Engine
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8">
          Ready to take control?
        </h2>
        <a href="/Signup" className="bg-rose-600 text-white px-12 py-6 rounded-3xl font-black text-xl hover:bg-rose-700 transition-all shadow-2xl shadow-rose-200 active:scale-95">
          Join SpendWise Today
        </a>
        <p className="mt-6 text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">
          Free forever • Cloud Sync • No Ads
        </p>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Zap
                className="text-white"
                size={16}
                fill="currentColor"
              />
            </div>
            <span className="text-lg font-black tracking-tighter">
              SpendWise
            </span>
          </div>

          <p className="text-slate-400 text-sm font-medium">
            © 2026 SpendWise Systems. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-slate-400">
            <Github
              className="hover:text-slate-900 cursor-pointer transition-colors"
              size={20}
            />
            <Twitter
              className="hover:text-rose-500 cursor-pointer transition-colors"
              size={20}
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
