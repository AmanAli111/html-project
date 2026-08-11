import React, {
  useContext,
  useEffect,
  useState,
  Fragment,
  useMemo,
} from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import {
  Plus,
  X,
  IndianRupee,
  ListCheckIcon,
  ChevronDownIcon,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import AppStore from "../../context/expense_tracker_store";
import ExpenseTransactionItem from "../../components/expenseTransactionItem";
import AddExpense from "../../components/addExpenses";
import DateSwitcher from "../../components/dateSwitcher";
import { useNavigate } from "react-router-dom";

const Expense = () => {
  const { setCurrentPage, expensesList, data, graphData } =
    useContext(AppStore);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const categories = [
    "All",
    "Food",
    "Transport",
    "Housing",
    "Bills",
    "Health",
    "Entertainment",
    "Education",
    "Travel",
    "Fitness",
    "Gifts",
    "Lifestyle",
  ];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const navigate = useNavigate();
  useEffect(() => {
    setCurrentPage("Expenses");
  }, [setCurrentPage]);

  const finalList = useMemo(() => {
    if (selectedCategory === "All") {
      return expensesList;
    }

    return expensesList.filter((t) => t.category === selectedCategory);
  }, [expensesList, selectedCategory]);
  console.log(graphData.expenseLineGraphData);

  return (
    // FIX 1: Use h-screen and overflow-hidden on the wrapper
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden pt-14 lg:pt-0">
      {/* 1. SLIDE-OVER PANEL (Right Side) */}
      {/* Backdrop - High z-index (100) */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 transition-opacity duration-300 ${
          isPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsPanelOpen(false)}
      />

      {/* Panel - High z-index (110) */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-lg bg-white z-110 shadow-2xl transform transition-transform duration-500 ease-in-out ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-md mx-auto">
              <AddExpense onCancel={() => setIsPanelOpen(false)} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      {/* FIX 2: flex-1 and overflow-y-auto ensures only this area scrolls */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:pt-8 scroll-smooth">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Expense Analysis
            </h1>
            <p className="text-slate-500 font-medium">
              Monitoring your spending patterns and trends
            </p>
          </div>
          <div className="flex justify-between gap-5">
            <DateSwitcher />
            <button
              onClick={() => setIsPanelOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-rose-200 transition-all font-bold active:scale-95"
            >
              <Plus size={20} /> Log New Expense
            </button>
          </div>
        </header>

        {/* SECTION 1: TREND CHART */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Spending Trend
              </h3>
              <p className="text-sm text-slate-400 font-medium">
                Monthly cash outflow tracking
              </p>
            </div>
            <div className="flex gap-4 md:gap-8">
              <div className="text-right">
                <span className="text-xs text-slate-400 block uppercase tracking-wider font-black">
                  Total Expenses
                </span>
                <div className="text-2xl font-black text-rose-600 flex items-center justify-end gap-1 mt-1">
                  <IndianRupee
                    size={22}
                    strokeWidth={3}
                  />
                  {data.Expenses ? data.Expenses.toLocaleString() : 0}
                </div>
              </div>
              <div className="text-right border-l border-slate-100 pl-4 md:pl-8">
                <span className="text-xs text-slate-400 block uppercase tracking-wider font-black">
                  Avg. Per Day
                </span>
                <div className="text-2xl font-black text-slate-900 flex items-center justify-end gap-1 mt-1">
                  <IndianRupee
                    size={22}
                    strokeWidth={3}
                  />
                  {(data.Expenses / 30).toFixed(0)}
                </div>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart data={graphData.expenseLineGraphData}>
                <defs>
                  <linearGradient
                    id="colorExpense"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#f43f5e"
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="95%"
                      stopColor="#f43f5e"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 2: TRANSACTIONS LIST */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-bold text-slate-800">
              Recent Expenses
            </h3>

            {/* Styled Listbox */}
            <div className="w-full sm:w-42">
              <Listbox
                value={selectedCategory}
                onChange={setSelectedCategory}
              >
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-pointer rounded-xl bg-slate-50 py-2.5 pl-4 pr-10 text-left transition-all hover:bg-slate-100 border border-transparent focus:ring-4 focus:ring-indigo-100 sm:text-sm">
                    <span className="block truncate font-bold text-slate-700">
                      {selectedCategory}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDownIcon className="h-5 w-5 text-slate-400" />
                    </span>
                  </ListboxButton>

                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <ListboxOptions className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white p-1.5 text-base shadow-2xl ring-1 ring-slate-200 focus:outline-none sm:text-sm">
                      {categories.map((category) => (
                        <ListboxOption
                          key={category}
                          value={category}
                          className={({ active, selected }) =>
                            `relative cursor-pointer select-none rounded-xl py-2.5 pl-4 pr-10 transition-colors ${
                              active
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-slate-600"
                            } ${selected ? "bg-indigo-100/50 text-indigo-800 font-bold" : ""}`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className="block truncate">{category}</span>
                              {selected && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600">
                                  <ListCheckIcon className="h-4 w-4" />
                                </span>
                              )}
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>

          <div className="divide-y divide-slate-50 ">
            {expensesList.length > 0 ? (
              finalList.map((expense) => (
                <ExpenseTransactionItem
                  key={expense.id}
                  expense={expense}
                />
              ))
            ) : (
              <div className="p-10 text-center text-slate-400 font-medium">
                No transactions found for this period.
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/Home/AllTransaction")}
            className="w-full py-4 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors border-t border-slate-50"
          >
            View All Transactions
          </button>
        </div>
      </main>
    </div>
  );
};

export default Expense;
