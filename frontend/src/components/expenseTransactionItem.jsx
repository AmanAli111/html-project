import { MoreVertical } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useContext } from "react";
import AppStore from "../context/expense_tracker_store";
import { deleteExpense } from "../utils/helper";

const ExpenseTransactionItem = ({expense}) => 
{
    const {expenseListStatus,setExpensesListStatus,dataStatus,setDataStatus} = useContext(AppStore);

    const IconComponent = LucideIcons[expense.icon];
    
    const handleOnDelete = async ()=>
    {
        const deletedItem = await deleteExpense(expense.id);
        
        if(deletedItem.Status)
        {
            setExpensesListStatus(!expenseListStatus);
            setDataStatus(!dataStatus);

            // const finalExpensesList = expensesList.filter((expenses)=>expenses.id !== expense.id);
            // console.log(finalExpensesList);
            // setExpensesList(finalExpensesList);
        }
    }


    return (
        <div key={expense.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group ">
            <div className="flex items-center gap-4">
                <div 
                className={'p-3 rounded-2xl transition-transform group-hover:scale-110' + (expense.color? ` ${expense.color}`: ` ${expense.color}`)}>
                    {IconComponent ? <IconComponent size={18} /> : null}
                </div>
                <div>
                    <h4 className="font-bold text-slate-900">{expense.description}</h4>
                    <p className="text-sm text-slate-400">{expense.category} • {expense.date} • {expense.time}</p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right">
                    <div className="text-lg font-black text-slate-900 flex flex-row items-center">
                            <div className="pt-0.5 pr-2">
                                <LucideIcons.IndianRupee size={15}/>
                            </div>
                            <div>
                                { expense.amount.toLocaleString() || 0}
                            </div>
                    </div>
                </div>
                <button className="text-slate-300 hover:text-red-600 p-2">
                <LucideIcons.X size={20} onClick={()=>handleOnDelete(expense.id)} />
                </button>
            </div>
        </div>
    );
}

export default ExpenseTransactionItem;