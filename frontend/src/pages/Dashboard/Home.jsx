import React, { useContext, useEffect } from 'react';
import { 
  LayoutDashboard, ArrowUpCircle, ArrowDownCircle, LogOut, 
  Wallet, TrendingUp, TrendingDown, MoreVertical, Plus, 
  Calendar
} from 'lucide-react';
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import StatCard from '../../components/statsCard';
import AppStore from '../../context/expense_tracker_store';
import TransactionItem from '../../components/transactionItem';
import DateSwitcher from '../../components/dateSwitcher';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const {setCurrentPage,expensesList,incomeList,data,graphData,totalList} = useContext(AppStore);
  useEffect(()=>
  {
    setCurrentPage("Dashboard");
  });
  const navigate = useNavigate();
  return (
    <div className=" pt-14 lg:pt-0 md:flex flex min-h-screen bg-slate-50" id='Dashboard'>
      
      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 w-var(100vh - 64)">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Overview</h1>
            <p className="text-slate-500 font-medium">Welcome back, here's what's happening today.</p>
          </div>

          {/* DATE SWITCHER CONTROL */}
          <DateSwitcher/>
        </header>

        {/* TOP STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Balance" amount={data.Balance} icon={<Wallet className="text-indigo-600"/>} bg="bg-white" />
          <StatCard title="Total Income" amount={data.Income} icon={<TrendingUp className="text-emerald-600"/>} bg="bg-emerald-50" />
          <StatCard title="Total Expenses" amount={data.Expenses} icon={<TrendingDown className="text-rose-600"/>} bg="bg-rose-50" />
        </div>

        {/* SECTION 1: RECENT TRANSACTIONS & OVERVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className='flex items-start justify-between pr-3'>
              <h3 className="font-bold text-slate-800 mb-4">Recent Transactions</h3>
              <button
              onClick={()=>navigate('/Home/AllTransaction')}
              type='button' 
              className='text-sky-600 text-xs font-bold cursor-pointer pt-2'
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {totalList.slice(0,4).map(t => (
                <TransactionItem key={t.id} t={t} />
              ))}
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Financial Overview</h3>
            <div className="h-70">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={graphData.pieChartData} innerRadius={70} outerRadius={90} paddingAngle={0.5} dataKey="value">
                    {graphData.pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="middle" align="right" layout="vertical" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECTION 2: EXPENSES (List & Bar Graph) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className='flex items-start justify-between pr-3'>
              <h3 className="font-bold text-slate-800 mb-4">Recent Expenses</h3>
              <button
              type='button'
              className='text-sky-600 text-xs font-bold cursor-pointer pt-2'
              onClick={()=>navigate('/home/Expenses')}
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              {expensesList.slice(0,4).map(t => (
                <TransactionItem key={t.id} t={t} />
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Expenses: Last 30 Days</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={graphData.lastThirtyDayExpensesData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECTION 3: INCOME (List & Pie Chart) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className='flex items-start justify-between pr-3'>
              <h3 className="font-bold text-slate-800 mb-4">Recent Income Added</h3>
              <button
              type='button'
              className='text-sky-600 text-xs font-bold cursor-pointer pt-2'
              onClick={()=>navigate('/home/Income')}
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {incomeList.slice(0,4).map(t => (
                <TransactionItem key={t.id} t={t} />
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Income Sources: Last 30 Days</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={graphData.IncomePieChartData} outerRadius={80} dataKey="value">
                    {graphData.IncomePieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Home;