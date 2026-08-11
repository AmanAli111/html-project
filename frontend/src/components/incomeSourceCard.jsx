// import { Target, Briefcase, PieChart as PieChartIcon,MoreHorizontal } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useContext, useState } from "react";
import { deleteInocmeSource, UpdateToggle } from "../utils/helper";
import AppStore from "../context/expense_tracker_store";

const IncomeSourceCard = ({source,handleOnEdit})=>
{
    const {dataStatus,setDataStatus,incomeListStatus,setincomeListStatus,setActiveToggleUpdate} = useContext(AppStore);
    const [activeToggle,setActiveToggle] = useState(source.active);
    const handleOnToggleClick = async (id)=>
    {
        const toggle = await UpdateToggle(id);
        if(toggle)
        {
            setActiveToggleUpdate(false);
            setActiveToggle(false);
        }
    }

    const handleOnDelete = async ()=>
    {
        const deletedStatus = await deleteInocmeSource(source.id);
        if(deletedStatus.Status)
        {
            setincomeListStatus(!incomeListStatus);
            setDataStatus(!dataStatus);
            // const incomeListAfterDelete = incomeList.filter((card)=>card.id !==id);
            // const deletedItem = incomeList.filter((card)=>card.id ===id);
            // const finalAmount = 
            // {
            //     ...data,
            //     Income: data - deletedItem.amount
            // };
            // setData(finalAmount );
            // setIncomeList(incomeListAfterDelete);
        }
    };
    const IconComponent = LucideIcons[source.icon];
    
    
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors group">
            <div className="flex justify-between items-start mb-6">

                <div className={`${source.color} p-3 rounded-2xl shadow-lg shadow-inherit`}>
                    {IconComponent ? <IconComponent size={20} /> : null}
                </div>
                <div className="flex gap-4">
                    {source.frequency!== 'oneTime'?
                        (activeToggle?
                        <button type="button" disabled={!activeToggle} onClick={() => handleOnToggleClick(source.id)}  className=" text-green-500">
                        <LucideIcons.ToggleRight size={20} />
                        </button>
                        :<button type="button" disabled={!activeToggle} onClick={() => handleOnToggleClick(source.id)} className=" text-red-500">
                        <LucideIcons.ToggleLeft size={20} />
                        </button>)
                    :''
                    }
                    <button
                        type="button"
                        onClick={() => handleOnEdit(source.id)}
                        disabled={!activeToggle}
                        className={`text-slate-400 ease-in-out ${activeToggle ? "hover:text-cyan-500" : "opacity-50 cursor-not-allowed"}`}
                    >
                    <LucideIcons.Pencil size={16} />
                    </button>
                    
                    <button className="text-slate-400 hover:text-red-500 ease-in-out">
                    <LucideIcons.X size={20} onClick={()=>handleOnDelete(source.id)} />
                    </button>
                </div>
            </div>
                
            <div>
                <h4 className="text-lg font-bold text-slate-900">{source.sourceName}</h4>
                <p className="text-slate-500 text-sm mb-4">{source.company}</p>
                <p className="text-slate-500 text-sm mb-4">{source.date} • {source.time}</p>
                <div className="flex items-end justify-between border-t border-slate-50 pt-4">
                    <div>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block">{source.frequency}</span>
                        <span className="text-xl font-black text-slate-900">
                            <div className="flex items-center gap-1">
                                <LucideIcons.IndianRupee/>
                                {source.amount.toLocaleString()}
                            </div>
                        </span>
                    </div>
                    {source.frequency !== 'oneTime' ? 
                        <div className="flex lg:flex-col gap-2">
                            <div className={"text-xs font-bold px-3 py-1 rounded-full " + (activeToggle ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')}>
                                <p>
                                    {activeToggle ? 'Active':'Inactive'}
                                </p>
                            </div>
                            {!activeToggle?
                            <div className=' text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-600'>
                                <p>
                                    {source.inactivatedAt}
                                </p>
                            </div>:
                            ""}
                        </div>
                    :''}
                </div>
            </div>
        </div>
    )
}

export default IncomeSourceCard;