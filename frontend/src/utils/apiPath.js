const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const validation_path = `${API_BASE_URL}/auth/validation`;
export const Login_path = `${API_BASE_URL}/auth/Login`;
export const Logout_path = `${API_BASE_URL}/auth/Logout`;
export const Signup_path = `${API_BASE_URL}/auth/Signup`;
export const Update_User_path = `${API_BASE_URL}/auth/updateUser`;

export const Post_Income_Path = `${API_BASE_URL}/user/addIncome`;
export const Post_Expenses_Path = `${API_BASE_URL}/user/addExpenses`;
export const Get_Expenses_list = `${API_BASE_URL}/user/getExpensesList/`;
export const Get_Income_list = `${API_BASE_URL}/user/getIncomeList/`;
export const Update_Status = `${API_BASE_URL}/user/updateStatus/`;
export const Delete_Inocme_Source = `${API_BASE_URL}/user/deleteIncomeSource/`;
export const Edit_Inocme_Source = `${API_BASE_URL}/user/editIncomeSource/`;
export const Delete_Expense_Item = `${API_BASE_URL}/user/deleteExpenseItem/`;
export const Total_Data = `${API_BASE_URL}/user/data/`;
export const Graph_Data = `${API_BASE_URL}/user/graphData/`;
