import {
  ArrowDownCircle,
  ArrowUpCircle,
  LayoutDashboard,
  LogOut,
  Wallet,
  Settings,
  Menu,
  X,
  Edit2,
  Save,
  Camera,
  Minus,
  Plus,
  UserRound,
  UserRoundIcon,
} from "lucide-react";
import NavItem from "./navItem";
import { useContext, useEffect, useRef, useState } from "react";
import AppStore from "../context/expense_tracker_store";
import { useNavigate } from "react-router-dom";
import { updateUserData } from "../utils/helper";

function Sidebar() {
  const initialError = {
    Fullname: [],
    Email: [],
  };

  const {
    currentPage,
    setCurrentPage,
    userLogout,
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    userStatus,
  } = useContext(AppStore);
  const navigate = useNavigate();

  // States for interactivity
  const normalizedProfilePic = String(user?.profilePic || "").replace(
    /\\/g,
    "/",
  );
  const profilePicPath = normalizedProfilePic.startsWith("/")
    ? normalizedProfilePic
    : `/${normalizedProfilePic}`;

  const [activeInput, setActiveInput] = useState([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [Fullname, setFullname] = useState("User");
  const [Email, setEmail] = useState("Email");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(initialError);
  const [removeImage,setRemoveImage] = useState(false);

  const fullNameRef = useRef();
  const emailRef = useRef();
  const fileInputRef = useRef();

  const handleOnNavItemClick = (label) => {
    setCurrentPage(label);
    setIsMobileOpen(false);
  };

  useEffect(() => {
    const collect = () => {
      setFullname(user?.fullName || "User");
      setEmail(user?.email || "Email");

      const hasProfilePic = Boolean(user?.profilePic);
      setPreview(
        hasProfilePic ? `http://localhost:25000${profilePicPath}` : null,
      );
      setImage(hasProfilePic);
    };
    collect();
  }, [isAuthenticated, user, profilePicPath, userStatus]);

  const handleProfileExpand = () => {
    if (!isEditing) {
      if (user?.profilePic) {
        setPreview(`http://localhost:25000${profilePicPath}`);
        setImage(true);
      } else {
        setPreview(null);
        setImage(false);
      }
      setIsEditing(true);
    }
  };

  const handleImageChange = async (e) => {
    const selectedFile = await e.target.files[0];
    if (!selectedFile) return;

    const pre = URL.createObjectURL(selectedFile);
    setPreview(pre);
    setImage(true);
    setFile(selectedFile);
    setRemoveImage(false);
  };

  const handleToRemoveImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    setImage(false);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setRemoveImage(true);
  };

  const handleLogout = () => 
  {
    userLogout();

    setActiveInput([]);
    setIsMobileOpen(false);
    setIsEditing(false);
    setPreview(null);
    setImage(null);
    setFullname('User');
    setEmail('Email');
    setError(initialError);
    setFile(null);

    navigate("/");
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const Fullname = fullNameRef.current.value;
    const Email = emailRef.current.value;
    console.log(Fullname, Email);

    const activeInp = [];

    if (!Fullname || Fullname.length < 2) {
      activeInp.push("Fullname");
      setActiveInput(activeInp);

      fullNameRef.current.focus();
      return;
    }
    if (!Email) {
      activeInp.push("email");
      setActiveInput(activeInp);

      emailRef.current.focus();
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("ProfilePic", file);
    }
    formData.append("Fullname", Fullname);
    formData.append("Email", Email);
    formData.append('removeImage',removeImage);

    setActiveInput([]);

    const response = await updateUserData(formData);
    if (response.Status) {
      setUser(response.user);
      setIsAuthenticated(response.loggedIn);
      setError(initialError);
      setIsEditing(false);
    } else {
      const responseError = response?.errorMsg || initialError;
      setError(responseError);
      if ((responseError?.Fullname || []).length !== 0) {
        activeInp.push("Fullname");
        setActiveInput(activeInp);
        fullNameRef.current.focus();
      } else if ((responseError?.Email || []).length !== 0) {
        activeInp.push("email");
        setActiveInput(activeInp);
        emailRef.current.focus();
      }
    }
  };

  const handleOnCancle = async () => {
    fullNameRef.current.value = user.fullName || "";
    emailRef.current.value = user.email || "";
    setIsEditing(false);
  };

  return (
    <>
      {/* MOBILE HAMBURGER BUTTON */}
      <div
        className={`lg:hidden w-full h-18 fixed top-0 bg-slate-50 z-10 ${isMobileOpen ? "hidden" : "flex justify-between"}`}
      >
        <div>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden relative top-4 left-4 z-40 p-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-600"
          >
            <Menu size={24} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Wallet size={20} />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">
            SpendWise
          </span>
        </div>
        <div></div>
      </div>

      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 h-screen bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out rounded-2xl
          lg:sticky lg:top-0 lg:translate-x-0 lg:flex lg:max-w-64
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-1 text-slate-400 hover:text-rose-500"
        >
          <X size={20} />
        </button>

        {/* Logo Section */}
        <div className="p-6 flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Wallet size={20} />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">
            SpendWise
          </span>
        </div>

        {/* --- EXPANDABLE PROFILE SECTION --- */}
        <div
          onClick={handleProfileExpand}
          className={`mx-4 mb-4 p-3 transition-all duration-300 cursor-pointer group
            ${
              isEditing
                ? "bg-white border-2 border-indigo-100 shadow-xl scale-[1.02]"
                : "bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-slate-100"
            } rounded-2xl`}
        >
          {!isEditing ? (
            /* COLLAPSED VIEW */
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-20 h-20 rounded-full border-2 border-slate-300 flex items-center justify-center overflow-hidden bg-white transition-colors">
                {image ? (
                  <img
                    src={preview}
                    alt={<UserRoundIcon/>}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center">
                    <Camera size={28} />
                    <span className="text-[10px] font-semibold mt-1 uppercase tracking-tighter">
                      Upload
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col max-w-35 overflow-hidden">
                <span className="text-2 font-black text-slate-900 truncate overflow-hidden">
                  {Fullname}
                </span>
                <span className="text-[10px] font-medium text-slate-400 truncate overflow-hidden">
                  {Email}
                </span>
              </div>
            </div>
          ) : (
            /* EXPANDED EDIT VIEW */
            <form className="space-y-4 py-2 ease-in-out">
              <div className="flex flex-col items-center gap-3">
                <div>
                  <div className="flex flex-col items-center">
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className="relative group cursor-pointer"
                    >
                      <div className="w-18 h-18 rounded-full border-2 border-slate-300 flex items-center justify-center overflow-hidden bg-white hover:border-indigo-500 transition-colors">
                        {image ? (
                          <img
                            src={preview}
                            alt="Profile Image"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-slate-400 group-hover:text-indigo-500 flex flex-col items-center">
                            <Camera size={28} />
                            <span className="text-[10px] font-semibold mt-1 uppercase tracking-tighter">
                              Upload
                            </span>
                          </div>
                        )}
                      </div>

                      {!image ? (
                        <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full border-2 border-white shadow-md">
                          <Plus
                            size={14}
                            strokeWidth={3}
                          />
                        </div>
                      ) : (
                        <div className="absolute bottom-0 right-0 bg-red-600 text-white p-1.5 rounded-full border-2 border-white shadow-md">
                          <Minus
                            size={14}
                            strokeWidth={3}
                            onClick={handleToRemoveImage}
                          />
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        name="ProfilePic"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  className={`w-full text-xs font-bold p-2 bg-slate-50 border border-slate-100 rounded-lg outline-none ${activeInput.includes("Fullname") ? `focus:ring-2 focus:ring-red-600/50` : `focus:ring-2 focus:ring-indigo-500/20`}`}
                  ref={fullNameRef}
                  defaultValue={user.fullName}
                  required
                />
                {(error?.Fullname || []).map((msg, idx) => (
                  <div key={idx}>
                    <p className="text-red-400 pl-1 text-xs">{msg}</p>
                  </div>
                ))}

                <input
                  type="email"
                  className={`w-full text-[10px] font-medium p-2 bg-slate-50 border border-slate-100 rounded-lg outline-none ${activeInput.includes("email") ? ` focus:ring-2 focus:ring-red-600/50` : `focus:ring-2  focus:ring-indigo-500/20`}`}
                  ref={emailRef}
                  defaultValue={user.email}
                  required
                />
                {(error?.Email || []).map((msg, idx) => (
                  <div key={idx}>
                    <p className="text-red-400 pl-1">{msg}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleOnCancle}
                  className="flex-1 py-2 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => handleOnSubmit(e)}
                  className="flex-1 py-2 text-[10px] font-bold bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-1"
                >
                  <Save size={12} /> Save
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            handleOnNavItemClick={handleOnNavItemClick}
            status={currentPage}
            color={"bg-indigo-50 text-indigo-600"}
          />
          <NavItem
            icon={<ArrowUpCircle size={20} />}
            label="Income"
            handleOnNavItemClick={handleOnNavItemClick}
            status={currentPage}
            color={"bg-emerald-50 text-emerald-600"}
          />
          <NavItem
            icon={<ArrowDownCircle size={20} />}
            label="Expenses"
            handleOnNavItemClick={handleOnNavItemClick}
            status={currentPage}
            color={"bg-rose-50 text-rose-600"}
          />
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-500 hover:text-rose-600 transition-colors px-4 py-3 w-full rounded-2xl hover:bg-rose-50 font-bold text-sm"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
