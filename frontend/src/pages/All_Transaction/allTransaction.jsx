import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Calendar as CalendarIcon,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import AppStore from "../../context/expense_tracker_store";

const AllTransactions = () => {
  const { totalList } = useContext(AppStore);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- 1. NORMALIZATION & FILTERING (Memoized for performance) ---
  const filteredTransactions = useMemo(() => {
    const normalized = (totalList || []).map((t) => {
      const type = (t.type || t.transactionType || "").toString().toLowerCase() === "income" ? "income" : "expense";
      const dateText = Array.isArray(t.date) ? t.date.join("") : new Date(t.date).toLocaleDateString();
      
      return {
        ...t,
        id: t.id || t._id,
        type,
        title: t.title || t.sourceName || t.description || "Untitled",
        category: t.category || t.company || "Other",
        frequency: t.frequency || "oneTime",
        date: dateText,
        amount: Number(t.amount) || 0,
      };
    });

    return normalized.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [totalList, searchTerm, filterType]);

  // --- 2. PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentList = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when searching/filtering
  useEffect(() => 
    {
        const a =()=>
        {
            setCurrentPage(1);
        }
        a();
    }, [searchTerm, filterType]);

  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // --- 3. ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 } // Creates the "cascade" effect
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, x: -10, transition: { duration: 0.2 } }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen pb-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 lg:mt-0 mt-15 ">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">All Transaction</h1>
          <p className="text-slate-500 font-medium text-sm">Review and manage your financial flow</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium text-slate-700 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          {["all", "income", "expense"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 py-2 rounded-xl text-xs font-black capitalize transition-all ${filterType === type ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {type}
            </button>
          ))}
        </div>

        <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 p-4 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-50 shadow-sm transition-all">
          <CalendarIcon size={18} /> March 2026
        </button>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
              </tr>
            </thead>
            <Motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key={currentPage + filterType + searchTerm} // Key forces re-animation on page change
              className="divide-y divide-slate-50"
            >
              <AnimatePresence mode="wait">
                {currentList.map((item) => (
                  <Motion.tr
                    key={item.id}
                    variants={rowVariants}
                    layout // Smoothly handles position changes
                    className="group hover:bg-indigo-50/30 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                          {item.type === "income" ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 tracking-tight leading-none mb-1">{item.title}</span>
                          <span className="text-[10px] font-medium uppercase text-indigo-600/80 tracking-tighter">{item.frequency}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl w-fit border border-slate-200/50">
                        <Tag size={12} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-semibold text-slate-500">{item.date}</td>
                    <td className={`px-8 py-5 text-right font-black text-xl tracking-tight ${item.type === "income" ? "text-emerald-600" : "text-red-600/80"}`}>
                      {item.type === "income" ? "+ " : "- "}{item.amount.toLocaleString()}
                    </td>
                  </Motion.tr>
                ))}
              </AnimatePresence>
            </Motion.tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {currentList.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
              <Search className="text-slate-300" size={32} />
            </Motion.div>
            <h3 className="text-xl font-black text-slate-800">No results found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">We couldn't find anything matching your search. Try a different term!</p>
          </div>
        )}

        {/* PAGINATION FOOTER */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 tracking-wide">
            Page <span className="text-slate-900">{currentPage}</span> of {totalPages || 1}
            <span className="mx-2 opacity-20">|</span>
            Showing {currentList.length} of {filteredTransactions.length} items
          </p>
          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="p-3 border border-slate-200 rounded-2xl bg-white hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-3 border border-slate-200 rounded-2xl bg-white hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm active:scale-95"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTransactions;