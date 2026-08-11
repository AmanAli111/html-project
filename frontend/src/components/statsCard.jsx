import{ IndianRupee } from 'lucide-react';

const StatCard = ({ title, amount, icon, bg }) => (
  <div className={`${bg} p-6 rounded-2xl border border-slate-200 flex items-center justify-between overflow-clip`}>
    <div>

      <p className="text-slate-500 text-sm font-medium">
        {title}
      </p>

      <div className='flex items-center gap-1.5'>
        < IndianRupee size={25}/>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          {amount.toLocaleString() || 0}
        </h2>
      </div>
      

    </div>
    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 ml-5">
      {icon}
    </div>
  </div>
);

export default StatCard;