import React, { useRef, useState } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Plus,
  Minus,
} from "lucide-react";
import { SigningUp } from "../../utils/helper";
import { useNavigate } from "react-router-dom";

const SignUp = () => 
{
  
  const initialError = {
    Fullname: [],
    Email: [],
    Password: [],
    ConfirmPassword: [],
  };
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(initialError);
  const [activeInput, setActiveInput] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const fileInputRef = useRef(null);
  const fullNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  //   Handle Image Preview
  const handleImageChange = async (e) => {
    const selectedFile = await e.target.files[0];
    setFile(selectedFile);
    console.log(selectedFile);

    if (selectedFile) {
      setImage(selectedFile);

      const preview = URL.createObjectURL(selectedFile);
      setPreview(preview);
      console.log(preview);
    }
  };

  const handleToRemoveImage = () => {
    setFile(null);
    setImage(null);

    console.log(file);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const Fullname = fullNameRef.current.value;
    const Email = emailRef.current.value;
    const Password = passwordRef.current.value;
    const ConfirmPassword = confirmPasswordRef.current.value;
    const activeInp = [];
    let errinput = {};

    if (!Fullname || Fullname.length < 2) {
      activeInp.push("Fullname");
      setActiveInput(activeInp);

      errinput = {
        ...errinput,
        Fullname: ["Enter your full name"],
      };
      fullNameRef.current.focus();
      return setError(errinput);
    }
    if (!Email) {
      activeInp.push("email");
      setActiveInput(activeInp);

      errinput = {
        ...errinput,
        Email: ["Enter your Email"],
      };
      emailRef.current.focus();
      return setError(errinput);
    }
    if (!Password) {
      activeInp.push("password");
      setActiveInput(activeInp);

      errinput = {
        ...errinput,
        Password: ["Enter a vald Password"],
      };
      passwordRef.current.focus();
      return setError(errinput);
    }
    if (Password != ConfirmPassword) {
      activeInp.push("confirmPassword");
      setActiveInput(activeInp);

      errinput = {
        ...errinput,
        ConfirmPassword: ["ConfirmPassword does not match"],
      };
      confirmPasswordRef.current.focus();
      return setError(errinput);
    }

    const formData = new FormData();
    formData.append("ProfilePic", file);
    formData.append("Fullname", Fullname);
    formData.append("Email", Email);
    formData.append("Password", Password);
    formData.append("ConfirmPassword", ConfirmPassword);

    // Send FormData directly to SigningUp
    const response = await SigningUp(formData);
    console.log(response);
    if (response.errorMsg) {
      setError(response.errorMsg);

      if(!response.errorMsg.Fullname.length ==0)
      {
        activeInp.push("Fullname");
        setActiveInput(activeInp);
        fullNameRef.current.focus();
      }
      else if(!response.errorMsg.Email.length ==0)
      {
        activeInp.push("email");
        setActiveInput(activeInp);
        emailRef.current.focus();
      }
      else if(!response.errorMsg.Password.length ==0)
      {
        activeInp.push("password");
        setActiveInput(activeInp);
        passwordRef.current.focus();
      }
      else if(!response.errorMsg.ConfirmPassword.length ==0)
      {
        activeInp.push("confirmPassword");
        setActiveInput(activeInp);
        confirmPasswordRef.current.focus();
      }
    } 
    else if (response.successMsg) 
    {
      console.log(response.successMsg);
      setError(initialError);
      setActiveInput([]);
      fullNameRef.current.value = "";
      emailRef.current.value = "";
      passwordRef.current.value = "";
      confirmPasswordRef.current.value = "";
      handleToRemoveImage();
      navigate("/Login");
    }
  };

  const categoryData = [
    { name: "Food", value: 400, color: "#818cf8" },
    { name: "Rent", value: 800, color: "#6366f1" },
    { name: "Travel", value: 300, color: "#4f46e5" },
    { name: "Health", value: 500, color: "#4338ca" },
    { name: "Ent.", value: 200, color: "#3730a3" },
  ];

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans">
      {/* LEFT SIDE: Visual Brand Experience */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-indigo-500 rounded-full opacity-40 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white mb-8">
            <div className="bg-white p-2 rounded-lg shadow-lg">
              <ShieldCheck
                className="text-indigo-600"
                size={24}
              />
            </div>
            <span className="text-2xl font-bold tracking-tight">SpendWise</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Start your journey to <br /> financial clarity today.
          </h1>
          <p className="text-indigo-100 text-lg max-w-md">
            Set budgets, categorize expenses, and watch your net worth grow.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
          <div className="h-56 w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={categoryData}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#c7d2fe", fontSize: 12 }}
                  dy={10}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.1)" }}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      fillOpacity={0.9}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="relative z-10 text-indigo-200 text-sm flex gap-4">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={14} /> Bank-level Security
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={14} /> No Credit Card Required
          </span>
        </div>
      </div>

      {/* RIGHT SIDE: Sign-Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">
              Create account
            </h2>
            <p className="text-slate-500 mt-2">
              Join us and start managing your money better.
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={(e) => handleOnSubmit(e)}
            encType="multipart/form-data"
          >
            {/* PROFILE IMAGE UPLOAD */}
            <div className="flex flex-col items-center mb-6">
              <div
                onClick={(e) => fileInputRef.current.click(e)}
                className="relative group cursor-pointer"
              >
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-white hover:border-indigo-500 transition-colors">
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
                {/* Plus Icon Overlay */}
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
              <p className="text-xs text-slate-400 mt-2">
                Add a profile picture{" "}
              </p>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  ref={fullNameRef}
                  type="text"
                  autoComplete="name"
                  className={
                    "w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 shadow-sm transition-all " +
                    (activeInput.includes("Fullname")
                      ? "focus:ring-red-500"
                      : "focus:ring-indigo-500")
                  }
                  name="Fullname"
                  placeholder="John Doe"
                />
              </div>
                {(error.Fullname || []).map((msg, idx) => (
                  <div key={idx}>
                    <p className="text-red-400 pl-1">{msg}</p>
                  </div>
                ))}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  ref={emailRef}
                  type="email"
                  autoComplete="email"
                  name="email"
                  className={
                    "w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 shadow-sm transition-all " +
                    (activeInput.includes("email")
                      ? "focus:ring-red-500"
                      : "focus:ring-indigo-500")
                  }
                  placeholder="....@gmail.com"
                />
              </div>
              <div>
                {(error.Email || []).map((msg, idx) => (
                  <div key={idx}>
                    <p className="text-red-400 pl-1">{msg}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  ref={passwordRef}
                  autoComplete="new-password"
                  className={
                    "w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 shadow-sm transition-all " +
                    (activeInput.includes("password")
                      ? "focus:ring-red-500"
                      : "focus:ring-indigo-500")
                  }
                  name="password"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
                {(error.Password || []).map((msg, idx) => (
                  <div key={idx}>
                    <p className="text-red-400 pl-1">{msg}</p>
                  </div>
                ))}
              
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  ref={confirmPasswordRef}
                  autoComplete="new-password"
                  className={
                    "w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 shadow-sm transition-all " +
                    (activeInput.includes("confirmPassword")
                      ? "focus:ring-red-500"
                      : "focus:ring-indigo-500")
                  }
                  name="confirmPassword"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              <div>
                {(error.ConfirmPassword || []).map((msg, idx) => (
                  <div key={idx}>
                    <p className="text-red-400 pl-1">{msg}</p>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
              Create Account
            </button>
          </form>

          <p className="text-center text-slate-600 mt-8">
            Already have an account?{" "}
            <a
              href="/Login"
              className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
