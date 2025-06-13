import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import {User,MessageSquare,Mail,Eye,EyeOff,Lock,Loader2} from "lucide-react"
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [showPassword,setShowPassword]=useState(false);
  const [formData,setFormData]=useState({
    fullName:"",
    email:"",
    password:""
  })
  const {signup,isSigningUp}=useAuthStore()
  const validateForm=()=>{
    if(!formData.fullName.trim()){
      return toast.error("Fullname's required!")
    }
    if(!formData.email.trim()){
      return toast.error("email's required!")
    }
    if(!/\S+@\S+\.\S+/.test(formData.email)){
      return toast.error("Enter correct email")
    }
    if(!formData.password.trim()){
      return toast.error("password's required!")
    }
    if(formData.password.length<6){
      return toast.error("Password is too short")
    }

    //else if it passes all these
    return true

  }
  const handleSubmit=(e)=>{
    e.preventDefault();

    const success=validateForm()
    if(success==true){
      signup(formData);
    }

  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
    {/* left side */}
    <div className="flex flex-col justify-center items-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8">
        {/*logo*/}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
            <p className="text-base-content/60">Get started with your free account</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="form-control">
    <label className="label">
      <span className="label-text font-medium">Full Name</span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <User className="size-5 text-base-content/40" />
      </div>
      <input
        type="text"
        className="input input-bordered w-full pl-10"
        placeholder="John Doe"
        value={formData.fullName}
        onChange={(e) =>
          setFormData({ ...formData, fullName: e.target.value })
        }
      />
    </div>
  </div>
  <div className="form-control">
  <label className="label">
    <span className="label-text font-medium">Email</span>
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Mail className="size-5 text-base-content/40" />
    </div>
    <input
      type="email"
      className="input input-bordered w-full pl-10"
      placeholder="you@example.com"
      value={formData.email}
      onChange={(e) =>
        setFormData({ ...formData, email: e.target.value })
      }
    />
  </div>
</div>

<div className="form-control mb-6">
  <label className="label">
    <span className="label-text font-medium">Password</span>
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Lock className="size-5 text-base-content/40" />
    </div>
    <input
      type={showPassword ? "text" : "password"}
      className="input input-bordered w-full pl-10"
      placeholder="••••••••"
      value={formData.password}
      onChange={(e) =>
        setFormData({ ...formData, password: e.target.value })
      }
    />
    <button
      type="button"
      className="absolute inset-y-0 right-0 pr-3 flex items-center"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? (
        <EyeOff className="size-5 text-base-content/40" />
      ) : (
        <Eye className="size-5 text-base-content/40" />
      )}
    </button>
  </div>
</div>
<button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
  {isSigningUp ? (
    <>
      <Loader2 className="size-5 animate-spin" />
      Loading...
    </>
  ) : (
    "Create Account"
  )}
</button>

        </form>
        <div className='text-center'>
          <p className='text-base-content/60'>Already have an account?{""}
          <Link to="/login" className="link link-primary text-blue-600">Sign in</Link>
          </p>
        </div>    
      </div>
    </div>

    {/* RIGHT SIDE DECOR */}
    <AuthImagePattern 
    title="Join our community"
    subtitle="Connect with friends and families like never before" />
    
  </div>

  )
}

export default SignUpPage
















































// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// axios.defaults.withCredentials = true;

// const SignUpPage =()=>{
//   const navigate =useNavigate();
//   const [formData, setFormData] = useState({
//     fullname:"",
//     email:"",
//     password:"",
//   });
//   const [error, setError]= useState("");

//   const handleChange=(e) => {
//     setFormData({...formData, [e.target.name]: e.target.value });
//  };

//   const handleSubmit=async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/signup",formData);
//       console.log("User created:", res.data);
//       navigate("/"); //to redirect to homepage or chat page
//     } catch (err){
//       setError(err.response?.data?.message || "Signup failed");
//     }
//   };

//   return (
//     <div className="signup-container">
//       <h2>Sign Up</h2>
//       <form onSubmit={handleSubmit} className="signup-form">
//         <input
//           type="text"
//           name="fullname"
//           placeholder="Full Name"
//           value={formData.fullname}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email Address"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password (min 6 chars)"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Sign Up</button>
//         {error && <p className="error">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default SignUpPage;
