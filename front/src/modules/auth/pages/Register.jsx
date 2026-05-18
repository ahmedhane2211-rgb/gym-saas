import React, { useContext, useState } from 'react';
import { Mail, Lock, User, Calendar, Phone, MapPin, Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import athleteImg from '../../../assets/auth-athlete.png';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import { useForm } from 'react-hook-form';
import { useRegisterMutation } from '../services/AuthSlice';
import toast from 'react-hot-toast';
import Select from '../../shared/components/Select';
import { LanguageContext } from '../../shared/context/LanguageContext';

const Register = () => {
    const [role, setRole] = useState('athlete');
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors },watch,setValue } = useForm();
    const navigate = useNavigate();
    const [registerUser, { data, isLoading, error }] = useRegisterMutation();
    const {t} = useContext(LanguageContext)
    const onSubmit = async (data) => {
        try {
            const res = await registerUser(data).unwrap();
            console.log(res);
            toast.success(res.message);
            navigate('/login');
        } catch (err) {
            console.log(err);
            toast.error(err.data.message);
        }
    };
    return (
        <div className="h-screen w-full flex flex-col md:flex-row bg-dark font-main overflow-x-hidden">

            {/* Left Column - Branding (Desktop only) */}
            <div className="hidden md:flex md:w-[40%] flex-col justify-between p-12 bg-black relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange/20 via-transparent to-transparent opacity-50" />

                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-12">
                        <div className="w-1.5 h-6 bg-orange rounded-full" />
                        <span className="text-white font-bold tracking-[0.3em] text-sm uppercase">KINETIC</span>
                    </div>

                    <div className="space-y-0 leading-[0.9]">
                        <h2 className="text-5xl font-black text-white tracking-tighter">PRECISION</h2>
                        <h2 className="text-5xl font-black text-blue italic tracking-tighter">PERFORMANCE</h2>
                    </div>

                    <p className="mt-8 text-gray-500 max-w-xs text-sm font-medium leading-relaxed">
                        Enter the lab. Register your credentials to begin your high-performance tracking journey.
                    </p>
                </div>

                {/* Athlete Image Container */}
                <div className="relative flex-grow flex items-end justify-center mb-12">
                    <div className="relative group">
                        {/* Glossy Card behind image */}
                        <div className="absolute -inset-4 bg-gradient-to-b from-white/5 to-white/0 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                        <div className="relative w-72 h-80 bg-gray-dark border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src={athleteImg}
                                alt="Athlete"
                                className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700"
                            />
                            <div className="absolute bottom-6 left-6 space-y-0.5">
                                <span className="text-orange font-black text-3xl block leading-none">001</span>
                                <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">System Identity Module</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col space-y-1">
                    <p className="text-gray-700 text-[10px] font-bold tracking-[0.2em] uppercase">
                        Kinetic Precision © 2024 / Performance Management Lab
                    </p>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full md:w-[60%] p-6 md:p-16 flex flex-col justify-center">
                <div className="max-w-xl mx-auto w-full">
                    {/* Header */}
                    <div className="mb-10 flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-blue text-[10px] font-black tracking-[0.2em] uppercase block">New Account</span>
                            <h1 className="text-4xl font-bold text-white tracking-tight">Registration</h1>
                        </div>

                        <div className="text-right">
                            <p className="text-gray-500 text-xs">Already have an account?</p>
                            <Link to="/login" className="text-gray-300 text-xs font-bold hover:text-white transition-colors">Sign In</Link>
                        </div>
                    </div>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(onSubmit)}>

                        {/* Full Name */}
                        <div className="md:col-span-2 space-y-2">
                            <Input label={t('full_name')} type="text" placeholder="ERIK JOHANSSON" register={register} name="fullname" errors={errors} />
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <Select 
                            label="gender"
                            name="gender"
                            watch={watch}
                            setValue={setValue}
                            placeholder="gender"
                            options={[
                                { value: 'male', label: t('male') },
                                { value: 'female', label: t('female') }
                            ]}
                            register={register}
                            errors={errors}
                            />
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <Input label={t('date_of_birthday')} type="date" placeholder="Date of Birth" register={register} name="dob" errors={errors} />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Input label={t('phone')} type="tel" placeholder="+1 (000) 000-0000" register={register} name="phone" errors={errors} />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Input label={t('email')} type="email" placeholder="ERIK@LAB.COM" register={register} name="email" errors={errors} />
                        </div>

                        {/* Physical Address */}
                        <div className="md:col-span-2 space-y-2">
                            <Input label={t('address')} type="text" placeholder="STREET, CITY, ZIP" register={register} name="address" errors={errors} />
                        </div>

                        {/* Password */}
                        <div className="md:col-span-2 space-y-2">
                            <Input label={t('password')} type={showPassword ? 'text' : 'password'} placeholder="password" register={register} name="password" errors={errors} />


                        </div>
                        <Button title={t('register')} className="w-full bg-orange hover:bg-orange/90 text-black font-black py-5 rounded-lg tracking-[0.2em] uppercase text-sm shadow-[0_0_30px_rgba(255,95,31,0.2)] transition-all active:scale-[0.99]" />
                    </form>
                </div>
            </div>

            {/* Mobile-only corner info */}
            <div className="md:hidden absolute bottom-4 right-4 bg-gray-dark px-2 py-1 rounded border border-white/5">
                <span className="text-[8px] font-mono text-orange tracking-widest uppercase">System Ready</span>
            </div>
        </div>
    );
};

export default Register;
