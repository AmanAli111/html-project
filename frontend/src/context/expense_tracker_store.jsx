import { createContext, useEffect, useState } from "react";
import { authCheck, getExpensesList, getGraphData, getIncomeList, getTotalData, Logout } from "../utils/helper";

const AppStore = createContext({
  currentPage: "",
});

export default AppStore;

export const AppStoreProvider = ({ children }) => 
{
  const [userStatus,setUserStatus] = useState(false);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = [2024, 2025, 2026];
  const [isAuthenticated,setIsAuthenticated] = useState(false);
  const [user,setUser] = useState({});
  const [currentPage, setCurrentPage] = useState("");
  const [expensesList, setExpensesList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [data,setData] = useState(
    {
      Income : [],
      Expenses : [],
      Balance : [],
    }); 
  const [graphData,setGraphData] = useState(
  {
    expenseLineGraphData : [],
    incomeBarGraphData : [],
    lastThirtyDayExpensesData : [],
    pieChartData: [],
    lastSixtyDayPieChartData : [],
    IncomePieChartData : [],
  });
  const [totalList,setTotalList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
  {
    month: new Date().getMonth(), // 0-11
    year: new Date().getFullYear()
  });
  const [activeToggleUpdate,setActiveToggleUpdate] = useState(true);

  const [expenseListStatus,setExpensesListStatus] = useState(true);
  const [incomeListStatus,setincomeListStatus] = useState(true);
  const [dataStatus,setDataStatus] = useState(true);

  useEffect( ()=>
  {
    const AuthCheck = async()=>
    {
      const auth = await authCheck();
      setIsAuthenticated(auth.loggedIn);
      setUser(auth.user);
    }
    AuthCheck();
  },[userStatus]);
  
  
      
  useEffect(()=>
  {
    if(isAuthenticated)
    {
      const fetchExpensesList = async ()=>
      {
        const currentMonth = selectedDate.month;
        const currentYear = selectedDate.year;
        const data = currentMonth + '-' + currentYear;

        const ExpensesListFromServer = await getExpensesList(data);
        ExpensesListFromServer.sort((a, b) => {
          const dateA = Array.isArray(a.date)
            ? new Date(a.date.join(' ') + ' ' + (a.time || '00:00:00'))
            : new Date(a.date + ' ' + (a.time || '00:00:00'));
          const dateB = Array.isArray(b.date)
            ? new Date(b.date.join(' ') + ' ' + (b.time || '00:00:00'))
            : new Date(b.date + ' ' + (b.time || '00:00:00'));
          return dateB - dateA;
        });
        setExpensesList(ExpensesListFromServer);
      };
      fetchExpensesList();
    }
  },[expenseListStatus,selectedDate,isAuthenticated]);

  useEffect(()=>
  {
    if(isAuthenticated)
    {
      
      const fetchIncomeList = async ()=>
      {
        const currentMonth = selectedDate.month;
        const currentYear = selectedDate.year;
        const data = currentMonth + '-' + currentYear;

        const IncomeListFromServer = await getIncomeList(data);
        IncomeListFromServer.sort((a, b) => {
          const dateA = Array.isArray(a.date)
            ? new Date(a.date.join(' ') + ' ' + (a.time || '00:00:00'))
            : new Date(a.date + ' ' + (a.time || '00:00:00'));
          const dateB = Array.isArray(b.date)
            ? new Date(b.date.join(' ') + ' ' + (b.time || '00:00:00'))
            : new Date(b.date + ' ' + (b.time || '00:00:00'));
          return dateB - dateA;
        });
        setIncomeList(IncomeListFromServer);
      };
      fetchIncomeList();
    }
  },[incomeListStatus,selectedDate,activeToggleUpdate,isAuthenticated]);

  useEffect(() => 
  {
    if(isAuthenticated)
    {
      const fetchTotalData = async ()=>
      {
        const currentMonth = selectedDate.month;
        const currentYear = selectedDate.year;
        const data = currentMonth + '-' + currentYear;
        const DataFromServer = await getTotalData(data);
        if(DataFromServer.Status)
        {
          const totalData = 
          {
            Income : DataFromServer.totalIncome,
            Expenses : DataFromServer.totalExpenses,
            Balance : DataFromServer.totalBalance,
          }
          setData(totalData);
        }
      };
      fetchTotalData()
    }
  },[dataStatus,selectedDate,activeToggleUpdate,isAuthenticated]);

  useEffect(() => 
  {
    if(isAuthenticated)
    {
      const fetchGraphData = async ()=>
      {
        const currentMonth = selectedDate.month;
        const currentYear = selectedDate.year;
        const data = currentMonth + '-' + currentYear;
        const DataFromServer = await getGraphData(data);
        if(DataFromServer.Status)
        {
          const totalData = 
          {
            expenseLineGraphData : DataFromServer.expenseLineGraphData,
            incomeBarGraphData : DataFromServer.incomeBarGraphData,
            lastThirtyDayExpensesData : DataFromServer.lastThirtyDayExpensesData,
            pieChartData: DataFromServer.pieChartData,
            lastSixtyDayPieChartData:DataFromServer.lastSixtyDayPieChartData,
            IncomePieChartData : DataFromServer.IncomePieChartData,
          }
          setGraphData(totalData);
        }
      };
      fetchGraphData()
    }
  },[dataStatus,selectedDate,activeToggleUpdate,isAuthenticated]);

  useEffect(()=>
  {
    if(isAuthenticated)
    {
      const totalTransaction = ()=>
      {
        const total = [ ...incomeList, ...expensesList ];
        console.log(total);
        const toDateTime = (item) => 
        {
          const dateText = Array.isArray(item.date) ? item.date.join("") : item.date; 
          // "16 Mar 2026" + "01:31:39 pm"
          return new Date(`${dateText} ${item.time}`);
        };

        // Newest first
        const sortedByLatestTime = total.sort((a, b) => toDateTime(b) - toDateTime(a));
        // total.sort((a, b) => {
        //   // Convert date to comparable value (assume date is a string or array)
        //   // If date is an array (e.g., [day, ' ', month, ' ', year]), join to string
        //   const dateA = Array.isArray(a.date) ? new Date(a.date.join('')) : new Date(a.date);
        //   const dateB = Array.isArray(b.date) ? new Date(b.date.join('')) : new Date(b.date);
        //   return dateB - dateA;
        // });
        setTotalList(sortedByLatestTime);
      };
      totalTransaction();
    }
  },[incomeList,expensesList,isAuthenticated]);
  
    const userLogout = ()=>
    {
      setIsAuthenticated(false);
      setExpensesList([]);
      setIncomeList([]);
      setData(
      {
        Income : [],
        Expenses : [],
        Balance : [],
      });
      setGraphData(
      {
        expenseLineGraphData : [],
        incomeBarGraphData : [],
        lastThirtyDayExpensesData : [],
        pieChartData: [],
        lastSixtyDayPieChartData : [],
        IncomePieChartData : [],
      });
      setSelectedDate(
      {
        month: new Date().getMonth(), // 0-11
        year: new Date().getFullYear()
      });
      setTotalList([]);
      Logout();
    }

  return (
    <AppStore.Provider
        value=
        {
            {
              user,
              setUser,
              setUserStatus,
              userStatus,
              isAuthenticated,
              setIsAuthenticated,
              currentPage,
              setCurrentPage,
              expensesList,
              setExpensesList,
              incomeList,
              setIncomeList,
              data,
              setData,
              expenseListStatus,
              setExpensesListStatus,
              incomeListStatus,
              setincomeListStatus,
              dataStatus,
              setDataStatus,
              months,years,
              selectedDate,
              setSelectedDate,
              totalList,
              activeToggleUpdate,
              setActiveToggleUpdate,
              graphData,
              userLogout,
            }
        }
    >
      {children}
    </AppStore.Provider>
  );
};
