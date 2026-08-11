import { ArrowDownCircle, ArrowUpCircle, MoreVertical } from "lucide-react";

const TransactionItem = ({ t }) => (
  <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors group">
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg ${t.transactionType === 'Income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
        {t.transactionType === 'Income' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
      </div>
      <div>
        <h4 className="font-semibold text-slate-800 text-sm">{t.sourceName || t.description}</h4>
        <p className="text-xs text-slate-500">{t.category || ""} {t.category? "•": "" } {t.date} • {t.time}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">

      <span className={`font-bold text-sm ${t.transactionType === 'Income' ? 'text-emerald-600' : 'text-red-600'}`}>
        {t.transactionType === 'Income' ? '+' : '- '}{t.amount.toLocaleString() || 0}
      </span>
      {/* <MoreVertical size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" /> */}
    </div>
  </div>
);

export default TransactionItem;