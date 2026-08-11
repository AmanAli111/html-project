import React, { useContext, useRef, useState } from 'react';
import { Utensils, ShoppingBag, Car, Home, Zap, Heart, Plus, Calendar, DollarSign, X, Film, BookOpen, Plane, Dumbbell, Gift, PiggyBank, WineIcon, IndianRupee } from 'lucide-react';
import { AddNewExpense } from '../utils/helper';
import AppStore from '../context/expense_tracker_store';

const AddExpense = ({onCancel}) => 
{
  const initialError = 
  {
    amount : [],
    description : [],
    category : [],
    date : [],
  };

  const {expenseListStatus,setExpensesListStatus,dataStatus,setDataStatus} = useContext(AppStore);
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [error, setError] = useState(initialError);
  const [categoriesNo,setCategoriesNo] = useState(6);
  const amountRef = useRef();
  const descriptionRef = useRef();
  const dateRef = useRef();

  const categories = [
    { id: 'Food', icon: <Utensils size={18}/>, color: 'bg-orange-100 text-orange-600' },
    { id: 'Shopping', icon: <ShoppingBag size={18}/>, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'Transport', icon: <Car size={18}/>, color: 'bg-blue-100 text-blue-600' },
    { id: 'Housing', icon: <Home size={18}/>, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'Bills', icon: <Zap size={18}/>, color: 'bg-amber-100 text-amber-600' },
    { id: 'Health', icon: <Heart size={18}/>, color: 'bg-rose-100 text-rose-600' },
    { id: 'Entertainment', icon: <Film size={18}/>, color: 'bg-purple-100 text-purple-600' },
    { id: 'Education', icon: <BookOpen size={18}/>, color: 'bg-cyan-100 text-cyan-600' },
    { id: 'Travel', icon: <Plane size={18}/>, color: 'bg-sky-100 text-sky-600' },
    { id: 'Fitness', icon: <Dumbbell size={18}/>, color: 'bg-lime-100 text-lime-600' },
    { id: 'Gifts', icon: <Gift size={18}/>, color: 'bg-pink-100 text-pink-600' },
    { id: 'Lifestyle', icon: <WineIcon size={18}/>, color: 'bg-fuchsia-100 text-fuchsia-600' },
  ];

    const handleViewAllCategory = ()=>
    {
      if(categoriesNo <=6)
      {
        setCategoriesNo(categories.length);
      }
      else
      {
        setCategoriesNo(6)
      }
    }
  
    const handleOnSubmit = async (e) => 
    {
      e.preventDefault();
  
      const amount = amountRef.current.value;
      const description = descriptionRef.current.value;
      const category = selectedCategory;
      const date = dateRef.current.value;
      
      const activeInp = [];
      let errinput = {};
  
      if(!amount || amount<0)
      {
        activeInp.push("amount");
  
        errinput = 
        {
          ...errinput,
          amount : ['Enter valid amount']
        }
        amountRef.current.focus();
        return setError(errinput)
      };

      if(!description || description.length<2)
      {
        activeInp.push("description");
  
        errinput = 
        {
          ...errinput,
          description : ["Enter where you spent"]
        }
        descriptionRef.current.focus();
        return setError(errinput)
      };

      if(!date)
      {
        activeInp.push("date");
  
        errinput = 
        {
          ...errinput,
          date : ['Select a date']
        };
        dateRef.current.focus();
        return setError(errinput);
      }
      
      const formData = new FormData();
      formData.append("description", description);
      formData.append("category", category);
      formData.append("amount", amount);
      formData.append("date", date);
  
      
  
      // Send FormData directly to SigningUp
      const response = await AddNewExpense(formData);

      if (response.errorMsg) 
      {
        setError(response.errorMsg);

        if(!response.errorMsg.amount.length ==0)
        {
          activeInp.push("amount");
          amountRef.current.focus();
        }
        else if(!response.errorMsg.description.length ==0)
        {
          activeInp.push("description");
          descriptionRef.current.focus();
        }
        else if(!response.errorMsg.date.length == 0)
        {
          activeInp.push("date");
          dateRef.current.focus();
        }
      } 
      else if (response.successMsg) 
      {
        setExpensesListStatus(!expenseListStatus);
        setDataStatus(!dataStatus);
        // const addedExpense = response.addedExpense;
        setError(initialError);
        descriptionRef.current.value = "";
        amountRef.current.value = "";
        setSelectedCategory("Food");
        dateRef.current.value = new Date().toISOString().split('T')[0];
        onCancel();
      }
    }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm w-full max-w-md h-fit">
      <div className='flex flex-row justify-between'>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900">Add New Expense</h3>
          <p className="text-sm text-slate-500">Record your spending to keep budgets on track.</p>
        </div>
        <div>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-rose-100 rounded-full text-rose-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleOnSubmit}>
        {/* Amount Section */}
        <div className="bg-rose-50 p-4 rounded-2xl text-center border border-rose-100">
          <label className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Amount Spent</label>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-2xl font-bold text-rose-600">{<IndianRupee/>}</span>
            <input 
              type="number" 
              name='amount'
              ref={amountRef}
              placeholder="0.00" 
              className="bg-transparent text-3xl font-black text-rose-600 outline-none w-32 placeholder:text-rose-200"
            />
          </div>
          {(error.amount || []).map((msg, idx) => (
            <div key={idx}>
              <p className="text-red-400 pl-1">{msg}</p>
            </div>
          ))}
        </div>

        {/* Description Input */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">What did you buy?</label>
          <input 
            type="text" 
            name='description'
            ref={descriptionRef}
            placeholder="e.g. Weekly Groceries" 
            className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 transition-all text-sm font-medium"
          />
          {(error.description || []).map((msg, idx) => (
            <div key={idx}>
              <p className="text-red-400 pl-1">{msg}</p>
            </div>
          ))}
        </div>

        {/* Category Grid */}
        <div>
          <div className='flex flex-row items-center justify-between pr-3'>
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Category</label>
            <button 
            type='button' 
            className='text-sky-600 text-xs font-bold cursor-pointer'
            onClick={handleViewAllCategory}>
              {categoriesNo<=6? 'View All':'Hide All'}
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-2">
            {categories.slice(0,categoriesNo).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                  selectedCategory === cat.id 
                  ? 'border-rose-500 bg-rose-50' 
                  : 'border-transparent bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className={`${cat.color} p-2 rounded-lg`}>{cat.icon}</div>
                <span className="text-[10px] font-bold text-slate-600">{cat.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date Input */}
        <div className="relative group">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1 block mb-1">When?</label>
          <div className="relative">
            <Calendar 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors pointer-events-none z-10" 
              size={18} 
            />
            <input 
              type="date"
              name='date'
              ref={dateRef}
              className="
                w-full pl-12 pr-4 py-3 
                bg-slate-50 border border-slate-100 rounded-2xl 
                outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 
                text-sm font-semibold text-slate-700
                transition-all cursor-pointer
                accent-rose-600
                scheme-light
                [&::-webkit-calendar-picker-indicator]:absolute
                [&::-webkit-calendar-picker-indicator]:inset-0
                [&::-webkit-calendar-picker-indicator]:w-full
                [&::-webkit-calendar-picker-indicator]:h-full
                [&::-webkit-calendar-picker-indicator]:opacity-0
              "
              defaultValue={new Date().toISOString().split('T')[0]}
              onClick={(e) => e.target.showPicker()}
            />
          </div>
        </div>
        

        <button type='submit' className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-100 active:scale-95">
          Save Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;