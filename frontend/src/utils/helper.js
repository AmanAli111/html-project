import { Delete_Expense_Item, Delete_Inocme_Source, Edit_Inocme_Source, Get_Expenses_list, Get_Income_list, Graph_Data, Login_path, Logout_path, Post_Expenses_Path, Post_Income_Path, Signup_path, Total_Data, Update_Status, Update_User_path, validation_path } from "./apiPath";

export const authCheck = async()=>
{
    const data = await fetch(validation_path,
    {
        method:'GET',
        credentials: 'include',
    });

    return data.json();
};

export const loggininIn = async(email,password,rememberMe)=>
{
    console.log(email,password,rememberMe);
    const credentials = 
    {
        email,
        password,
        rememberMe
    }
    const data = await fetch(Login_path,
    {
        method: "POST",
        headers: 
        {
            "Content-Type":"application/json",
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });
    return data.json();
}

export const Logout = async ()=>
{
    const data = await fetch(Logout_path,
    {
        method:'POST',
        credentials: 'include',
    });
    return data.json();
}
export const SigningUp = async(formData)=>
{
    console.log(formData);
    const data = await fetch(Signup_path, {
        method: "POST",
        body: formData,
        credentials: 'include',
    });
    return data.json();
};

export const updateUserData = async (formData)=>
{
    const data = await fetch(Update_User_path , 
        {
            method:"POST",
            body:formData,
            credentials: 'include',
        }
    )
    return data.json();
}

export const getIncomeList = async (monthData)=>
{
    const data = await fetch(Get_Income_list + monthData,
        {
            credentials: 'include'
        }
    );
    return data.json();
}

export const AddNewIncomeSource = async(formData)=>
{
    const data = await fetch(Post_Income_Path , 
        {
            method:"POST",
            body:formData,
            credentials: 'include',
        }
    )
    return data.json();
};

export const getExpensesList = async (monthData)=>
{
    const data = await fetch(Get_Expenses_list + monthData,{credentials: 'include',});
    return data.json();
}

export const AddNewExpense = async(formData)=>
{
    const data = await fetch(Post_Expenses_Path , 
        {
            method:"POST",
            body:formData,
            credentials: 'include',
        }
    )
    return data.json();
};
export const UpdateToggle = async(id)=>
{
    const data = await fetch(Update_Status + id , 
        {
            method:"POST",
            credentials: 'include',
        }
    )
    return data.json();
};

export const deleteInocmeSource = async(id)=>
{
    const data = await fetch(Delete_Inocme_Source + id , 
        {
            method:"POST",
            credentials: 'include',
        }
    )
    return data.json();
};

export const editInocmeSource = async(id, formData) => {
    const data = await fetch(Edit_Inocme_Source + id, {
        method: "POST",
        body: formData,
        credentials: 'include',
    });
    return data.json();
};

export const deleteExpense = async(id)=>
{
    const data = await fetch(Delete_Expense_Item + id , 
        {
            method:"POST",
            credentials: 'include',
        }
    )
    return data.json();
};


export const getTotalData = async(monthData)=>
{

    const data = await fetch(Total_Data + monthData, 
        {
            method:"GET",
            credentials: 'include',
        }
    )
    return data.json();
};

export const getGraphData = async(monthData)=>
{

    const data = await fetch(Graph_Data + monthData, 
        {
            method:"GET",
            credentials: 'include',
        }
    )
    return data.json();
};