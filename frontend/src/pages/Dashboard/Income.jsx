import React, { useContext, useEffect, useState } from 'react';
import { 
  Plus, Briefcase, Target, PieChart as PieChartIcon, Wallet, X ,IndianRupee,
  Calendar
} from 'lucide-react';
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import AppStore from '../../context/expense_tracker_store';
import IncomeSourceCard from '../../components/incomeSourceCard';
import AddIncomeSource from '../../components/addIncomeSource';
import DateSwitcher from '../../components/dateSwitcher';

const Income = () => 
{
  const { setCurrentPage,incomeList,data,graphData} = useContext(AppStore);
  // 1. State to manage the slide-over form
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editing,setEditing] = useState(false);
  const [id,setId] = useState(null);

  useEffect(() => 
  {
    setCurrentPage("Income");
  });

  const handleOnEdit = (id)=>
  {
    setEditing(true);
    setId(id);
    setIsPanelOpen(true);
  }

  // const dailyIncomeData = [
  //   { day: '01', amount: 0 },{ day: '02', amount: 100 }, { day: '05', amount: 2500 }, { day: '10', amount: 450 },
  //   { day: '15', amount: 1200 }, { day: '20', amount: 0 }, { day: '25', amount: 800 },
  //   { day: '28', amount: 300 }, { day: '30', amount: 150 },
  // ];

  return (
    <main className="relative flex min-h-screen bg-slate-50 font-sans overflow-hidden pt-14 lg:pt-0">
      
      {/* 2. SLIDE-OVER PANEL (AddIncomeSource) */}
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-400/20 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsPanelOpen(false)}
      />

      {/* The Side Panel */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-lg rounded-2xl bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-out ${
        isPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header of Panel */}
          <div className="p-6 flex  justify-end items-center">
            <button 
              onClick={() => setIsPanelOpen(false)}
              className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
            >
              <X size={25} />
            </button>
          </div>
          
          {/* Content - Passing onClose to the component if needed */}
          <div className="flex flex-1 overflow-y-auto bg-white items-center justify-center">
            <AddIncomeSource onCancel={() => setIsPanelOpen(false)} editing={editing} setEditing={setEditing} id={id} />
          </div>
        </div>
      </div>

      {/* 3. MAIN PAGE CONTENT */}
      <div className="flex-1 p-4 overflow-y-auto">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Income Analytics</h1>
            <p className="text-slate-500">Track and manage your revenue streams</p>
          </div>
          
          <div className='flex justify-between gap-5'>
            <DateSwitcher/>
            <div className="flex gap-3">
              {/* Open Panel Button */}
              <button 
                onClick={() => setIsPanelOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-100 transition-all font-bold active:scale-95"
              >
                <Plus size={20} /> Add New Source
              </button>
            </div>
          </div>
        </header>

        {/* SECTION 1: INCOME OVERVIEW */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Income Overview</h3>
              <p className="text-sm text-slate-400 font-medium">Daily revenue for February 2026</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-slate-400 block uppercase tracking-wider font-bold">Total Monthly Income</span>
              <span className="text-3xl font-black text-emerald-600 flex justify-center items-center gap-1.5 mt-1">
                <IndianRupee size={30} className='-2' />{data.Income.toLocaleString()} 
                </span>
            </div>
          </div>
          
          <div className="h-80 min-h-50 w-full"> {/* Adjusted height to 80 for better layout balance */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphData.incomeBarGraphData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 2: INCOME SOURCES */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-6 px-2">Registered Income Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incomeList.map((source) => (
              <IncomeSourceCard key={source.id} source={source} handleOnEdit={handleOnEdit} />
            ))}

            {/* Empty State / Trigger for Panel */}
            <button 
              onClick={() => setIsPanelOpen(true)}
              className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50/30 transition-all group min-h-40"
            >
              <div className="p-3 bg-slate-100 rounded-full mb-3 group-hover:bg-emerald-100 transition-colors">
                <Plus size={24} />
              </div>
              <span className="font-bold">Add New Stream</span>
            </button>
          </div>
        </div>

      </div>
    </main>
  );
};

export default Income;