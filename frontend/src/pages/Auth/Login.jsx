import React, { useContext, useRef, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { Mail, Lock, Eye, EyeOff, TrendingUp, DollarSign } from 'lucide-react';
import { loggininIn } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import AppStore from '../../context/expense_tracker_store';

function Login ()
{
  const {setIsAuthenticated,setUserStatus,userStatus} = useContext(AppStore);
  const initialError = 
  {
    email:[],
    password:[],
    extra:[],
  };
  const [error, setError] = useState(initialError);
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();
  const rememberRef = useRef();
  const navigate = useNavigate();

  // Mock data for the interactive chart side
  const data = [
    { amount: 400 }, { amount: 700 }, { amount: 500 },
    { amount: 900 }, { amount: 1100 }, { amount: 800 }, { amount: 1200 }
  ];

  const handleOnLogin = async(e)=> 
  {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const rememberMe = rememberRef.current.checked;
    
    const response = await loggininIn(email,password,rememberMe);
    if(response.Status)
    {
      setIsAuthenticated(true);
      setUserStatus(!userStatus);
      navigate('/Home');
    }
    if(response.Status === false)
    {
      setError(response.errorMsg)
    }
    
  }
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      
      {/* LEFT SIDE: Interactive Branding & Charts */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white mb-8">
            <div className="bg-white p-2 rounded-lg">
              <DollarSign className="text-indigo-600" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">SpendWise</span>
          </div>
          
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Master your finances <br /> with real-time insights.
          </h1>
          <p className="text-indigo-100 text-lg max-w-md">
            Join 50,000+ users tracking their way to financial freedom.
          </p>
        </div>

        {/* Interactive Chart Card */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-indigo-200 text-sm">Monthly Savings</p>
              <h3 className="text-2xl font-bold text-white">$4,250.00</h3>
            </div>
            <div className="flex items-center text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded">
              <TrendingUp size={16} className="mr-1" /> +12.5%
            </div>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#ffffff" 
                  strokeWidth={3} 
                  dot={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="relative z-10 text-indigo-200 text-sm">
          © 2026 SpendWise Inc. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-2">Please enter your details to sign in.</p>
          </div>

          <form className="space-y-6" method='POST' onSubmit={handleOnLogin}>
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  ref={emailRef}
                  type="email" 
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="name@company.com"
                />
              </div>
              {(error.email || []).map((msg, idx) => (
                <div key={idx}>
                  <p className="text-red-400 pl-1">{msg}</p>
                </div>
              ))}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {(error.password || error.extra || []).map((msg, idx) => (
                <div key={idx}>
                  <p className="text-red-400 pl-1">{msg}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" ref={rememberRef} className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Forgot password?</a>
            </div>

            <button type='submit' className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 shadow-lg shadow-indigo-200">
              Sign In
            </button>
          </form>

          <p className="text-center text-slate-600 mt-8">
            Don't have an account? {' '}
            <a href="/Signup" className="font-bold text-indigo-600 hover:text-indigo-700">Sign up for free</a>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Login;