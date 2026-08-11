const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema(
    {
        userId:
        {
            type:String,
            required:true,
        },
        amount:
        {
            type:Number,
            required:true,
        },
        description:
        {
            type:String,
            required:true,
        },
        category:
        {
            type:String,
            required:true,
        },
        date:
        {
            type:Date,
            required:true
        },
        time: 
        {
            type: String,
            default: () => new Date().toLocaleTimeString([], 
            {
                hour: '2-digit', 
                minute: '2-digit',
                second: "2-digit"
            })
        },
        transactionType:
        {
            type:String,
            default:"Expense"
        },
        icon:
        {
            type:String,
            default:'none',
        },
        color:
        {
            type:String,
            default:'none',
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Expense',expenseSchema);