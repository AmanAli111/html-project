// const Income = require('../model/income')
// import { Types } from 'mongoose';
import { check, validationResult } from "express-validator";
import Expense from "../model/expenses.js";
import Income from "../model/income.js";
import { getDynamicIconName } from "../utils/DynamicIcons.js";
import expenses from "../model/expenses.js";

export const getIncomeList = async (req,res,next)=>
{
    const userId = req.session.userId;
    console.log(userId);
    
    const data = req.params.month;
    const splitedData = data.split('-');

    const n = Number(splitedData[0]);
    const year = Number(splitedData[1]);

    const monthStart = new Date(year, n, 1, 0, 0, 0); 
    const monthEnd = new Date(year, n + 1, 0, 23, 59, 59);

    const dataList = await Income.find({userId:userId})
    const filteredDataList = dataList.filter((data) => {
        if (data.frequency === 'oneTime') {
            return data.date >= monthStart && data.date <= monthEnd;
        }
        else 
        {
            return data.date <= monthEnd;
        }
    });
    let incomeObj = [];

    filteredDataList.map((data)=>
    {
        const formatedDate = data.date.toString().split(' ');
        const inactiveAtDate = data.inactiveAt.toString().split(' ');
        const finalinactiveAtDate = [inactiveAtDate[2],' ',inactiveAtDate[1],' ',inactiveAtDate[3]];
        const finalDate = [formatedDate[2],' ',formatedDate[1],' ',formatedDate[3]];

        incomeObj =
        [
            ...incomeObj,
            {
                id: data._id.toString(),
                sourceName: data.sourceName,
                amount: data.amount,
                frequency: data.frequency,
                company: data.company,
                date: finalDate,
                time: data.time,
                transactionType:data.transactionType,
                active:data.active,
                icon: data.icon,
                color: data.color,
                inactivatedAt: finalinactiveAtDate,
            }
        ];
    });
    return res.status(200).json(incomeObj);
};

export const postAddNewIncome = 
[
    //Source Name validation
    check('sourceName')
    .notEmpty()
    .withMessage("Source Name is required")
    .trim()
    .isLength({min:2})
    .withMessage('Source Name must be 2 character long')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Source Name can only contain letters'),

    //Frequency validation
    check('frequency')
    .notEmpty()
    .withMessage('Plese select a valid frequency'),

    //Amount validation
    check('amount')
    .notEmpty()
    .isNumeric()
    .custom((value,{req})=>
    {
        if(value < 0)
        {
            throw new Error('Amount must be greater than 0');
        }
        return true;
    }),

    //company validation
    check('company')
    .notEmpty()
    .withMessage("Company Name is required")
    .trim()
    .isLength({min:2})
    .withMessage('Company Name must be 2 character long')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Company Name can only contain letters'),

    async (req,res,next)=>
    {
        const userId = req.session.userId;
        const {sourceName,frequency,amount,company} = req.body;
        console.log(sourceName,frequency,amount,company);
        
        const errorMsg =
        {
            sourceName: [],
            frequency:[],
            amount:[],
            company:[], 
        };

        const Error = validationResult(req);
        
        if(!Error.isEmpty())
        {
            console.log(Error.errors);
            Error.errors.map(error=>
            {
                const path = error.path;
                if (errorMsg[path]) 
                {
                    errorMsg[path].push(error.msg);
                }
            });
            
            return res.status(422).json(
            {
                errorMsg,
            });
        }

        const iconData = getDynamicIconName(sourceName);

            const income = new Income({
                userId,
                amount,
                sourceName,
                frequency,
                company,
                icon: iconData.icon,
                color: (iconData.bg ? iconData.bg.toString() : "none") + " " + (iconData.color ? iconData.color.toString() : "none"),
            });
            await income.save();

            // Get the most recent entry
            const recentEntry = await Income.findOne().sort({ createdAt: -1 });
            if (!recentEntry) {
                return res.status(500).json({ successMsg: "Income added, but could not retrieve entry." });
            }
            const formatedDate = recentEntry.date.toString().split(' ');
            const finalDate = [formatedDate[2], ' ', formatedDate[1], ' ', formatedDate[3]];

            const addedIncomeSource = {
                id: recentEntry._id.toString(),
                sourceName: recentEntry.sourceName,
                amount: recentEntry.amount,
                frequency: recentEntry.frequency,
                company: recentEntry.company,
                date: finalDate,
                time: recentEntry.time,
                transactionType: recentEntry.transactionType,
                active: recentEntry.active,
                icon: recentEntry.icon,
                color: recentEntry.color,
            };
            return res.status(200).json({
                successMsg: "Income added successfully",
                addedIncomeSource,
            });
    }
]

export const getExpensesList = async (req,res,next)=>
{
    const userId = req.session.userId;
    const data = req.params.month;
    const splitedData = data.split('-');

    const n = Number(splitedData[0]);
    const year = Number(splitedData[1]);

    const monthStart = new Date(year, n, 1, 23, 59, 59); 
    const monthEnd = new Date(year, n + 1, 0, 23, 59, 59);
    
    const dataList = await Expense.find({userId:userId})
    const filteredDataList = dataList.filter((data)=>
    {
        return data.date >= monthStart && data.date <= monthEnd;
    })
    let expenseObj = [];

    filteredDataList.map((data)=>
    {
        const formatedDate = data.date.toString().split(' ');
        const finalDate = [formatedDate[2],' ',formatedDate[1],' ',formatedDate[3]];
        
        expenseObj =
        [
            ...expenseObj,
            {
                id: data._id.toString(),
                description: data.description,
                amount: data.amount,
                category: data.category,
                date: finalDate,
                time: data.time,
                transactionType:data.transactionType,
                icon: data.icon,
                color: data.color,
            }
        ];
    });
    
    
    return res.status(200).json(expenseObj);
};

export const postAddNewExpenses = 
[
    //Source Name validation
    check('description')
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isLength({min:2})
    .withMessage('Description must be 2 character long')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Description can only contain letters'),

    //Frequency validation
    check('category')
    .notEmpty()
    .withMessage('Please select a valid category')
    .trim()
    .isLength({min:2})
    .withMessage('Category must be 2 character long')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Category can only contain letters'),

    //Amount validation
    check('amount')
    .notEmpty()
    .isNumeric()
    .custom((value,{req})=>
    {
        if(value < 0)
        {
            throw new Error('Amount must be greater than 0');
        }
        return true;
    }),

    //company validation
    check('date')
    .notEmpty()
    .withMessage("Date is required")
    .isDate()
    .withMessage('Enter a valid date'),
    
    async(req,res,next)=>
    {
        const userId = req.session.userId;
        const {description,category,amount,date} = req.body;
        console.log(description,category,amount,date.split('T')[0]);

        const errorMsg =
        {
            description: [],
            category:[],
            amount:[],
            date:[], 
        };

        const Error = validationResult(req);
        
        if(!Error.isEmpty())
        {
            console.log(Error.errors);
            Error.errors.map(error=>
            {
                const path = error.path;
                if (errorMsg[path]) 
                {
                    errorMsg[path].push(error.msg);
                }
            });
            
            return res.status(422).json(
            {
                errorMsg,
            });
        }
        const iconData = getDynamicIconName(description);

        const expense = new Expense(
        {
            userId,
            amount,
            description,
            category,
            date,
            icon: iconData.icon || "defaultIcon",
            color: (iconData.bg ? iconData.bg.toString() : "none") + " " + (iconData.color ? iconData.color.toString() : "none"),
        });
        await expense.save();

        // // Get the most recent entry
        // const recentEntry = await Expense.findOne().sort({ createdAt: -1 });
        
        // const formatedDate = recentEntry.date.toString().split(' ');
        // const finalDate = [formatedDate[2], ' ', formatedDate[1], ' ', formatedDate[3]];

        // const addedExpense = {
        //     id: recentEntry._id.toString(),
        //     description: recentEntry.description,
        //     amount: recentEntry.amount,
        //     category: recentEntry.category,
        //     date: finalDate,
        //     time: recentEntry.time,
        //     transactionType: recentEntry.transactionType,
        //     icon: recentEntry.icon,
        //     color: recentEntry.color,
        // };
        return res.status(200).json({
            successMsg: "Expense added successfully",
        });
    }
]

export const updateActiveStatus = async (req,res,next)=>
{
    const userId = req.session.userId;
    const id = req.params.id;
    console.log("this is the id " ,id);
    // const _id = new ObjectId(id)
    // const incomeDoc = await Income.findById(id);
    // if (!incomeDoc)
    // {
    //     return res.status(404).json({ Status: false, message: "Income not found" });
    // }

    const updated = await Income.findByIdAndUpdate(id, 
    {
        active: false,
        inactiveAt: new Date() // Store the EXACT moment it stopped
    });

    console.log(updated);
    
    if (updated) 
    {
        res.status(200).json({ Status: true });
    }
    
}

export const deleteIcomeSource = async (req,res,next)=>
{
    const id = req.params.id;
    console.log("this is the id " ,id);
    const incomeDoc = await Income.findByIdAndDelete(id);    
    console.log(incomeDoc);
    
    if (!incomeDoc)
    {
        return res.status(404).json({ Status: false, message: "Income Source not deleted " });
    }
    else
    {
        res.status(200).json({ Status: true });
    }
};

export const editIcomeSource =
[
    //Source Name validation
    check('sourceName')
    .notEmpty()
    .withMessage("Source Name is required")
    .trim()
    .isLength({min:2})
    .withMessage('Source Name must be 2 character long')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Source Name can only contain letters'),

    //Frequency validation
    check('frequency')
    .notEmpty()
    .withMessage('Plese select a valid frequency'),

    //Amount validation
    check('amount')
    .notEmpty()
    .isNumeric()
    .custom((value,{req})=>
    {
        if(value < 0)
        {
            throw new Error('Amount must be greater than 0');
        }
        return true;
    }),

    //company validation
    check('company')
    .notEmpty()
    .withMessage("Company Name is required")
    .trim()
    .isLength({min:2})
    .withMessage('Company Name must be 2 character long')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Company Name can only contain letters'),

    async (req,res,next)=>
    {
        const id = req.params.id;
        const {sourceName,frequency,amount,company} = req.body;
        console.log(sourceName,frequency,amount,company);
        
        const errorMsg =
        {
            sourceName: [],
            frequency:[],
            amount:[],
            company:[], 
        };

        const Error = validationResult(req);
        
        if(!Error.isEmpty())
        {
            console.log(Error.errors);
            Error.errors.map(error=>
            {
                const path = error.path;
                if (errorMsg[path]) 
                {
                    errorMsg[path].push(error.msg);
                }
            });
            
            return res.status(422).json(
            {
                errorMsg,
            });
        }

        const iconData = getDynamicIconName(sourceName);
        await Income.updateOne(
        { _id: id }, 
        {
            amount:amount,
            sourceName:sourceName,
            frequency:frequency,
            company:company,
            icon: iconData.icon,
            color: (iconData.bg ? iconData.bg.toString() : "none") + " " + (iconData.color ? iconData.color.toString() : "none"),
        });
        const dataList = await Income.find();
        console.log(dataList);

        let finalIncomeList = [];

        dataList.map((data)=>
        {
            const formatedDate = data.date.toString().split(' ');
            const finalDate = [formatedDate[2],' ',formatedDate[1],' ',formatedDate[3]];

            finalIncomeList =
            [
                ...finalIncomeList,
                {
                    id: data._id.toString(),
                    sourceName: data.sourceName,
                    amount: data.amount,
                    frequency: data.frequency,
                    company: data.company,
                    date: finalDate,
                    time: data.time,
                    transactionType:data.transactionType,
                    active:data.active,
                    icon: data.icon,
                    color: data.color,
                }
            ];
        });

        
        return res.status(200).json({
            successMsg: "Income edited successfully",
            finalIncomeList,
        });
    }
]

export const deleteExpensesItem = async (req,res,next)=>
{
    const id = req.params.id;
    console.log("this is the id " ,id);
    const expenseDoc = await Expense.findByIdAndDelete(id);
    
    if (!expenseDoc)
    {
        return res.status(404).json({ Status: false, message: "Expense Source not deleted " });
    }
    else
    {
        res.status(200).json({ Status: true });
    }
};

const calculateIncomeForPeriod = (incomeEntries, monthStart, monthEnd) => {
  console.log(monthStart, monthEnd);

  return incomeEntries.reduce((acc, income) => {
    // Determine when this income stops being relevant

    const incomeStart = new Date(income.date);

    const incomeEnd = income.active
      ? new Date(8640000000000000)
      : new Date(income.inactiveAt);

    // Rule 4 & 1: If the income ended before this month started, or starts after this month ends, skip it.

    if (incomeEnd < monthStart || incomeStart > monthEnd) return acc;

    // Calculate the overlap window (The portion of the income's life that falls within the viewed month)

    const windowStart = incomeStart > monthStart ? incomeStart : monthStart;

    const windowEnd = incomeEnd < monthEnd ? incomeEnd : monthEnd;

    switch (income.frequency) {
      case "oneTime":
        // Rule 3: Only add if the original date is within the viewed month

        if (incomeStart >= monthStart && incomeStart <= monthEnd) {
          return acc + income.amount;
        }

        return acc;

      case "monthly":
        // Rule 1: Add once if it was active at any point during this month

        // (Monthly income usually hits on the same day each month, e.g., the 1st)

        return acc + income.amount;

      case "weekly":
        // Rule 2: Count how many 7-day intervals fall within the window

        // We calculate how many "paydays" happened between windowStart and windowEnd

        const msInWeek = 7 * 24 * 60 * 60 * 1000;

        // Find the first payday >= windowStart

        let firstPayday = new Date(incomeStart);

        while (firstPayday < windowStart) {
          firstPayday.setTime(firstPayday.getTime() + msInWeek);
        }

        // Count paydays until we pass windowEnd

        let paydaysInMonth = 0;

        while (firstPayday <= windowEnd) {
          paydaysInMonth++;

          firstPayday.setTime(firstPayday.getTime() + msInWeek);
        }

        return acc + paydaysInMonth * income.amount;

      default:
        return acc;
    }
  }, 0);
};

export const totalData = async (req,res,next)=>
{
    const userId = req.session.userId;

    // 1. Convert param to Number (e.g., "0" for Jan)
    const data = req.params.month;
    const splitedData = data.split('-');

    const n = Number(splitedData[0]);
    const year = Number(splitedData[1]);

    // 2. The "JavaScript Magic" way to get month boundaries
    // Setting the day to '0' on the NEXT month gives the last day of the current month
    const monthStart = new Date(Date.UTC(year, n, 1, 0, 0, 0, 0));
    const monthEnd = new Date(Date.UTC(year, n + 1, 0, 23, 59, 59, 999));
    const currentDate = new Date();

    // Get total days in this specific month for your average calculation
    const noOfdays = monthEnd.getDate();
    
    const expenseEntries = await Expense.find({ userId:userId, date: { $gte: monthStart, $lte: monthEnd } }); 
    const totalIncomeEnteries = await Income.find({userId:userId});

    const totalIncome = calculateIncomeForPeriod(totalIncomeEnteries,monthStart,monthEnd);

    const totalExpenses = expenseEntries.reduce((acc, doc) => acc + doc.amount, 0);
    const totalBalance = totalIncome - totalExpenses;

    res.status(200).json({ 
        Status: true, 
        totalIncome,
        totalExpenses,
        totalBalance,
        expensesPerDay: totalExpenses / noOfdays,
    });
};

const everyMonthGraphData = (array,noOfdays,year,month)=>
{
    array.sort((a, b) => 
    {
        const dateA = Array.isArray(a.date) ? new Date(a.date.join('')) : new Date(a.date);
        const dateB = Array.isArray(b.date) ? new Date(b.date.join('')) : new Date(b.date);

        return dateA - dateB;
    });

    let arrayGraphData = [];
    const currentMonth = new Date().getMonth();
    let currentDate = 0;
    if(month === currentMonth && array.length > 0)
    {
        // Get the day of the month from the last expense entry
        currentDate = new Date(array[array.length - 1].date).getDate();
    }
    else
    {
        currentDate = noOfdays;
    }
    
    for (let day = 1; day <= currentDate; day++) 
    {
        // Get the start and end of the current day
        const dayStart = new Date(year, month, day, 0, 0, 0);
        const dayEnd = new Date(year, month, day, 23, 59, 59);

        // Filter expenses for this day
        const dayWiseData = array.filter(data => 
        {
            const dataDate = new Date(data.date);
            return dataDate >= dayStart && dataDate <= dayEnd;
        });

        // Sum the amounts for this day
        const dayWiseDataAmount = dayWiseData.reduce((sum, expense) => { 
            if (expense.active || expense.active === undefined) {
                return sum + expense.amount;
            } else {
                return sum;
            }
        }, 0);

        arrayGraphData.push({
            day: day.toString(),
            amount: dayWiseDataAmount,
        });
    };
    return arrayGraphData;
}
const everyMonthIncomeGraphData = (array, noOfdays, year, month) => {
    let arrayGraphData = [];

    // Iterate through every day of the specific month being requested
    for (let day = 1; day <= noOfdays; day++) {
        // Create precise boundaries for the current day being processed
        const currentDayStart = new Date(year, month, day, 0, 0, 0, 0);
        const currentDayEnd = new Date(year, month, day, 23, 59, 59, 999);

        const dayTotal = array.reduce((sum, income) => {
            const incomeStart = new Date(income.date);
            
            // Rule 2: Use inactiveAt for the cutoff. If active, it lives "forever"
            const incomeEnd = income.active 
                ? new Date(8640000000000000) 
                : new Date(income.inactiveAt);

            // LIFESPAN CHECK: 
            // Only proceed if this specific day falls within the income's active life
            if (currentDayEnd < incomeStart || currentDayStart > incomeEnd) {
                return sum;
            }

            switch (income.frequency) {
                case 'oneTime':
                    // Rule: Only shows on the exact day, month, and year it was created
                    if (incomeStart.getDate() === day && 
                        incomeStart.getMonth() === month && 
                        incomeStart.getFullYear() === year) {
                        return sum + income.amount;
                    }
                    break;

                case 'monthly':
                    // Rule 1: Show on the same day every month (e.g., the 5th)
                    // We check if the day-of-month matches
                    if (incomeStart.getDate() === day) {
                        return sum + income.amount;
                    }
                    break;

                case 'weekly':
                    // Rule 1: Show every 7 days from the start date
                    // We calculate the difference in days between the income start and current day
                    const diffInTime = currentDayStart.getTime() - incomeStart.getTime();
                    const diffInDays = Math.round(diffInTime / (1000 * 60 * 60 * 24));
                    
                    // If the difference is a multiple of 7, it's a payday
                    if (diffInDays >= 0 && diffInDays % 7 === 0) {
                        return sum + income.amount;
                    }
                    break;
            }
            return sum;
        }, 0);

        arrayGraphData.push({
            day: day.toString(),
            amount: dayTotal,
        });
    }

    return arrayGraphData;
};
const lastThirtyDayGraphData = async (req,collection)=>
{
    const userId = req.session.userId;
    const currentDate = new Date();
    const lastThirtyDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const lastThirtyDayList = await collection.find(
    {
        userId:userId,
        date: { $gte: lastThirtyDate, $lte: currentDate }
    });

    lastThirtyDayList.sort((a, b) => 
    {
        const dateA = Array.isArray(a.date) ? new Date(a.date.join('')) : new Date(a.date);
        const dateB = Array.isArray(b.date) ? new Date(b.date.join('')) : new Date(b.date);

        return dateA - dateB;
    });
    
    let arrayGraphData = [];
    
    // let currentDate = 30;
    // if(month === currentMonth && array.length > 0)
    // {
    //     // Get the day of the month from the last expense entry
    //     currentDate = new Date(array[array.length - 1].date).getDate();
    // }
    // else
    // {
    //     currentDate = noOfdays;
    // }
    
    for (let day = 1; day <= 30; day++) 
    {
        // Get the start and end of the current day
        const dayStart = new Date(lastThirtyDate.getTime() + day * 24 * 60 * 60 * 1000);
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000 - 1);

        // Filter expenses for this day
        const dayWiseData = lastThirtyDayList.filter(data => 
        {
            const dataDate = new Date(data.date);
            return dataDate >= dayStart && dataDate <= dayEnd;
        });

        // Sum the amounts for this day
        const dayWiseDataAmount = dayWiseData.reduce((sum, expense) => { 
            if (expense.active || expense.active === undefined) {
                return sum + expense.amount;
            } else {
                return sum;
            }
        }, 0);

        arrayGraphData.push({
            day: day.toString(),
            amount: dayWiseDataAmount,
        });
    };
    return arrayGraphData;
}
const userExpensesPieChartData = async (expenseEnteries)=>
{
    let newPieChartData = [];
    const colorSet = ['#003BFF','#3363FF','#668AFF','#99B1FF','#CCD8FF','#E5EBFF','#EDECF8','#DADAF1','#B6B4E4','#918FD6','#6C69C9','#4844BB']
    const pieChartData = 
    [
        { name: 'Food', value: 0, color: '#032096' },
        { name: 'Shopping', value: 0, color: '#B6B4E4' },
        { name: 'Transport', value: 0, color: '#918FD6' },
        { name: 'Housing', value: 0, color: '#6C69C9' },
        { name: 'Bills', value: 0, color: '#4844BB' },
        { name: 'Health', value: 0, color: '#393696' },
        { name: 'Entertainment', value: 0, color: '#CED6FD' },
        { name: 'Education', value: 0, color: '#9CACFC' },
        { name: 'Travel', value: 0, color: '#6B83FA' },
        { name: 'Fitness', value: 0, color: '#3959F9' },
        { name: 'Gifts', value: 0, color: '#0830F7' },
        { name: 'Lifestyle', value: 0, color: '#0626C6' },
    ];

    expenseEnteries.forEach(expense => 
    {
        const category = pieChartData.find(data => data.name === expense.category);
        if (category) 
        {
            category.value += expense.amount; // or += 1 if you want count
        }
    });

    newPieChartData = pieChartData.filter((data)=>(data.value !== 0));
    newPieChartData.sort((a, b) => b.value - a.value);
    newPieChartData.map((data,i=0)=>
    {
        data.color = colorSet[i];
        i++;
    })
    return newPieChartData;
}

const userIncomePieChartData = async (incomeEnteries)=>
{
    const colorSet = ['#092A11','#135323','#1C7D34','#26A646','#2FD057','#59D979','#82E39A','#ACECBC','#D5F6DD','#EAFAEE'];

    const incomePieChartData = [];

    incomeEnteries.map((income,i=0)=>
    {
        const temp = 
        {
            name: `${income.sourceName}`, 
            value: income.amount, 
            color: colorSet[i%10],
        }
        incomePieChartData.push(temp);
        i++;
    });
    return incomePieChartData;
};

export const userGraphData = async (req,res,next)=>
{
    const userId = req.session.userId;
    const data = req.params.month;
    const splitedData = data.split('-');

    const n = Number(splitedData[0]);
    const year = Number(splitedData[1]);

    const monthStart = new Date(year, n, 1, 0, 0, 0); 
    const monthEnd = new Date(year, n + 1, 0, 23, 59, 59);

    const noOfdays = monthEnd.getDate();

    const [incomeEntries, expenseEntries] = await Promise.all([
        Income.find({userId:userId}),
        Expense.find({userId:userId, date: { $gte: monthStart, $lte: monthEnd } })
    ]);

    const expenseLineGraphData = everyMonthGraphData(expenseEntries,noOfdays,year,n);
    const incomeBarGraphData = everyMonthIncomeGraphData(incomeEntries,noOfdays,year,n);
    const lastThirtyDayExpensesData = await lastThirtyDayGraphData(req,Expense);
    const pieChartData = await userExpensesPieChartData(expenseEntries);
    const IncomePieChartData = await userIncomePieChartData(incomeEntries);

    
    res.status(200).json(
    { 
        Status: true, 
        expenseLineGraphData,
        incomeBarGraphData,
        lastThirtyDayExpensesData,
        pieChartData,
        IncomePieChartData,
    });
}

