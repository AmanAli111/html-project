import { Briefcase, Target, TrendingUp, PieChart, Plus, Globe, Wallet } from 'lucide-react';
import { useContext, useRef, useState } from 'react';
import { AddNewIncomeSource, editInocmeSource } from '../utils/helper';
import AppStore from '../context/expense_tracker_store';
import { useEffect } from 'react';

const AddIncomeSource = ({onCancel,editing,setEditing,id }) => 
{
  const initialError = 
  {
    sourceName : [],
    amount : [],
    frequencyVal : [],
    company : [],
  };

  const {incomeList,dataStatus,setDataStatus,incomeListStatus,setincomeListStatus} = useContext(AppStore);
  const [frequency,setFrequency] = useState("monthly");
  const [activeInput, setActiveInput] = useState([]);
  const [error, setError] = useState(initialError);

  const sourceRef = useRef();
  const amountRef = useRef();
  const monthlyRef = useRef();
  const weeklyRef = useRef();
  const oneTimeRef = useRef();
  const companyRef = useRef();

  // Prefill form fields when editing
  
  useEffect(() => {
    if (editing && id) {
      const editedSource = incomeList.find((income) => income.id === id);
      if (editedSource) {
        if (sourceRef.current) sourceRef.current.value = editedSource.sourceName;
        if (amountRef.current) amountRef.current.value = editedSource.amount;
        if (companyRef.current) companyRef.current.value = editedSource.company;
        if (editedSource.frequency === "monthly" && monthlyRef.current) {
          monthlyRef.current.click();
        } else if (editedSource.frequency === "weekly" && weeklyRef.current) {
          weeklyRef.current.click();
        } else if ((editedSource.frequency === "oneTime" || editedSource.frequency === "one Time") && oneTimeRef.current) {
          oneTimeRef.current.click();
        }
      }
    }
  }, [editing, id, incomeList]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    let sourceName = sourceRef.current.value;
    let amount = amountRef.current.value;
    let company = companyRef.current.value;

    console.log(sourceName, amount, frequency, company);

    const activeInp = [];
    let errinput = {};

    if (!sourceName || sourceName.length < 2) {
      activeInp.push("sourceName");
      setActiveInput(activeInp);
      errinput = {
        ...errinput,
        sourceName: ["Enter the Source of Income"],
      };
      sourceRef.current.focus();
      return setError(errinput);
    }
    if (!amount || amount < 0) {
      activeInp.push("amount");
      setActiveInput(activeInp);
      errinput = {
        ...errinput,
        amount: ["Enter valid amount"],
      };
      amountRef.current.focus();
      return setError(errinput);
    }

    if (!company) {
      activeInp.push("company");
      setActiveInput(activeInp);
      errinput = {
        ...errinput,
        company: ["Enter the company"],
      };
      companyRef.current.focus();
      return setError(errinput);
    }

    const formData = new FormData();
    formData.append("sourceName", sourceName);
    formData.append("frequency", frequency);
    formData.append("amount", amount);
    formData.append("company", company);

    setError(initialError);
    setActiveInput([]);

    let response = {};

    if (editing) {
      response = await editInocmeSource(id, formData);
    } else {
      response = await AddNewIncomeSource(formData);
    }

    console.log(response);

    if (response.errorMsg) 
    {
      setError(response.errorMsg);

      if (!response.errorMsg.sourceName.length == 0) {
        activeInp.push("sourceName");
        setActiveInput(activeInp);
        sourceRef.current.focus();
      }
      if (!response.errorMsg.amount.length == 0) {
        activeInp.push("amount");
        setActiveInput(activeInp);
        amountRef.current.focus();
      }
      if (!response.errorMsg.company.length == 0) {
        activeInp.push("company");
        setActiveInput(activeInp);
        companyRef.current.focus();
      }
    } 
    else if (response.successMsg) 
    {
      // let addedIncomeSource = {};
      // let finalIncomeList = {};

      // if (editing) 
      // {
      //   finalIncomeList = response.finalIncomeList;
        
      // } else 
      // {
      //   addedIncomeSource = response.addedIncomeSource;
      // }

      // let updatedIncomeList = [];
      if (editing) 
      {
        setincomeListStatus(!incomeListStatus);
        setDataStatus(!dataStatus);
        
      } else 
      {
        setincomeListStatus(!incomeListStatus);
        setDataStatus(!dataStatus);
      }

      setError(initialError);
      setActiveInput([]);
      sourceRef.current.value = "";
      amountRef.current.value = "";
      setFrequency("monthly");
      companyRef.current.value = "";
      setEditing(false);
      onCancel();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm w-full max-w-md">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-slate-900">New Income Stream</h3>
          <p className="text-sm text-slate-500">Add a source to track your revenue.</p>
        </div>
        <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
          <TrendingUp size={24} />
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleOnSubmit} method='post'>
        
        {/* Source Name */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">Source Name</label>
          <div className="relative mt-1">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              name='sourceName'
              ref={sourceRef}
              placeholder="e.g. Freelance Design" 
              className={"w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 text-sm font-medium " + (activeInput.includes('sourceName') ? 'focus:ring-red-500' : 'focus:ring-emerald-500')}
            />
          </div>
          {(error.sourceName || []).map((msg, idx) => (
            <div key={idx}>
              <p className="text-red-400 pl-1">{msg}</p>
            </div>
          ))}
        </div>

        {/* Monthly Estimate */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">Estimated Monthly Amount</label>
          <div className="relative mt-1">
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="number" 
              name='amount'
              ref={amountRef}
              placeholder="5,000.00" 
              className={"w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 text-sm font-bold text-slate-900 " + (activeInput.includes('amount') ? 'focus:ring-red-500' : 'focus:ring-emerald-500')}
            />
          </div>
          {(error.amount || []).map((msg, idx) => (
            <div key={idx}>
              <p className="text-red-400 pl-1">{msg}</p>
            </div>
          ))}
        </div>

        {/* Frequency Toggle */}
        <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
          <button 
          type="button" 
          name='monthly'
          ref={monthlyRef} 
          className={'flex-1 py-2 text-xs font-bold ' + (frequency === 'monthly' ? 'bg-white text-emerald-600 rounded-lg shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600')}
          onClick={()=>{setFrequency('monthly')}}>
            Monthly
          </button>
          <button 
          type="button" 
          name='weekly' 
          ref={weeklyRef}
          className={'flex-1 py-2 text-xs font-bold ' + (frequency == 'weekly' ? 'bg-white text-emerald-600 rounded-lg shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600')}
          onClick={()=>{setFrequency('weekly')}}>
            Weekly
          </button>
          <button 
          type="button" 
          name='one Time'
          ref={oneTimeRef} 
          className={'flex-1 py-2 text-xs font-bold ' + (frequency == 'oneTime' ? 'bg-white text-emerald-600 rounded-lg shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600')}
          onClick={()=>{setFrequency('oneTime')}}>
            One-time
          </button>
        </div>
        <p className='text-red-400'>{error.frequencyVal}</p>

        {/* Associated Platform/Company */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">Platform / Company</label>
          <div className="relative mt-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              name='company'
              ref={companyRef}
              placeholder="e.g. Upwork, Google, etc." 
              className={"w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2  text-sm font-medium " + (activeInput.includes('company') ? 'focus:ring-red-500' : 'focus:ring-emerald-500')}
            />
          </div>
          {(error.company || []).map((msg, idx) => (
            <div key={idx}>
              <p className="text-red-400 pl-1">{msg}</p>
            </div>
          ))}
        </div>

        <button type='submit' className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-100 mt-2">
          Activate Income Stream
        </button>
      </form>
    </div>
  );
};

export default AddIncomeSource;