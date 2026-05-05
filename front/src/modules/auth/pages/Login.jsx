import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import authBg from '../../../assets/auth-bg.png';
import { useForm } from 'react-hook-form';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { useLoginMutation } from '../services/AuthSlice';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
    const {register,handleSubmit,formState:{errors}} = useForm();
    const [login, { isLoading }] = useLoginMutation();
    const onSubmit = async (data) => {
        try {
            const res = await login(data).unwrap();
            toast.success(res.message);
            Cookies.set("token", res.token);
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.data.message);
        }
    }
    
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-dark font-main relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${authBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Subtle Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange/10 via-transparent to-blue/10 pointer-events-none" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-dark/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl">
        <div className="space-y-1 mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Systems Access</h1>
          <p className="text-gray-400 text-sm">Enter your credentials to access the lab dashboard.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">Work Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue transition-colors">
                <Mail size={18} />
              </div>
              <Input
                type="email"
                placeholder="Email"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-black placeholder:text-gray-700 focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/50 transition-all"
                name="email"
                register={register}
                errors={errors}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">Access Key</label>
              <button type="button" className="text-[10px] font-bold text-blue tracking-widest uppercase hover:text-blue/80 transition-colors">Lost Key?</button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-orange transition-colors">
                <Lock size={18} />
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-black placeholder:text-gray-700 focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/50 transition-all"
                placeholder={"Password"}
                name="password"
                register={register}
                errors={errors}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <Button
            title={isLoading ? "Loading..." : "Initialize Login"}
            className="w-full bg-orange hover:bg-orange/90 text-black font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,95,31,0.3)]"
          />

        </form>

        <div className="mt-8 text-center sm:hidden">
          <p className="text-gray-600 text-xs">
            New lab administrator? <Link to="/register" className="text-orange hover:underline">Request Credentials</Link>
          </p>
        </div>
      </div>
      
      {/* Desktop Footer Link */}
      <div className="hidden sm:block absolute bottom-12 text-center w-full">
        <p className="text-gray-600 text-xs tracking-wider uppercase">
          New lab administrator? <Link to="/register" className="text-orange hover:underline underline-offset-4 decoration-orange/30">Request Credentials</Link>
        </p>
      </div>

      {/* Decorative text corners */}
      <div className="absolute top-8 left-8 text-[10px] font-mono text-white/20 tracking-tighter uppercase whitespace-pre line-leading-tight">
        Terminal v1.02.4{'\n'}Secure Node: ACTIVE
      </div>
      <div className="absolute top-8 right-8 text-[10px] font-mono text-white/20 text-right tracking-tighter uppercase whitespace-pre">
        Latency: 12ms{'\n'}System: READY
      </div>
    </div>
  );
};

export default Login;