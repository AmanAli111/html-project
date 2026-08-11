const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController')

userRouter.get('/getIncomeList/:month',userController.getIncomeList);
userRouter.post('/addIncome',userController.postAddNewIncome);
userRouter.get('/getExpensesList/:month',userController.getExpensesList);
userRouter.post('/addExpenses',userController.postAddNewExpenses);
userRouter.post('/updateStatus/:id', userController.updateActiveStatus);
userRouter.post('/deleteIncomeSource/:id', userController.deleteIcomeSource);
userRouter.post('/editIncomeSource/:id', userController.editIcomeSource);
userRouter.post('/deleteExpenseItem/:id', userController.deleteExpensesItem);
userRouter.get('/data/:month', userController.totalData);
userRouter.get('/graphData/:month', userController.userGraphData);

exports.userRouter = userRouter;