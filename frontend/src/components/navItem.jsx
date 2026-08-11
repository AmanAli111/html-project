import { Link } from "react-router-dom";

const NavItem = ({ icon, label,handleOnNavItemClick, status,color}) => 
{
    return(
        <Link to={`/Home/${label}`} className={'lg:w-full  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ' + (status===label ? `${color}` : ' text-slate-500 hover:bg-slate-50 hover:text-slate-900')}
        onClick={()=>handleOnNavItemClick(label)}>
            {icon} <span>{label}</span>
        </Link>
    );
};

export default NavItem;