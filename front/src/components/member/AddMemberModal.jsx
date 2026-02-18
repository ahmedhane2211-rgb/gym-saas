/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMember } from '../../redux/slices/MemberSlice';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';

const AddMemberModal = ({ isOpen, onClose, onSubmit, t }) => {
  
  const {register,handleSubmit,formState:{errors},reset} = useForm()
  const dispatch = useDispatch();
  const [photoPreview, setPhotoPreview] = useState(null);
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };
  // const { subscriptions } = useSelector((state) => state.subscriptions);

  const handleAdd = (data) => {
    console.log(data)
    const formData = new FormData()
    formData.append('fullName',data.fullName)
    formData.append('phone',data.phone)
    formData.append('email',data.email)
    formData.append('barcode',data.barcode)
    formData.append('photoUrl',data.photoUrl)
    formData.append('idNumber',data.idNumber)
    formData.append('dateOfBirth',data.dateOfBirth)
    formData.append('gender',data.gender)
    formData.append('isActive',data.isActive)
    formData.append('subscriptionId',data.subscriptionId)
    // formData.append('role',data.role)
    // Convert FormData to plain object
    const memberObj = {};
    for (let [key, value] of formData.entries()) {
      memberObj[key] = value;
    }
    dispatch(addMember(memberObj));
    reset();
    setPhotoPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t?.('permissions.actions.addMember') || 'Add New Member'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(handleAdd)} className="space-y-4">
          {/* Photo Upload */}
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl text-slate-400">
                  👤
                </div>
              )}
            </div>
            <label className="cursor-pointer rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500">
              {t("upload_photo") || 'Upload Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Full Name */}
          <Input type="text" t={t} name="fullName" label='fullName' register={register} required errors={errors}/>
          {/* Email */}
          <Input type="email" t={t} name="email" label='email' register={register} required errors={errors}/>
          {/* Phone */}
          <Input type="tel" t={t} name="phone" label='phone' register={register} required errors={errors}/>
          
          {/* ID Number */}
          <Input type="number" t={t} name="idNumber" label='idNumber' register={register} required errors={errors}/>

          {/* Barcode */}
          <Input t={t} name="barcode" label='barCode' register={register} required errors={errors}/>

          {/* Date of Birth */}
          <Input type="date" t={t} name="dateOfBirth" label='dateOfBirth' register={register} required errors={errors}/>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t?.('gender') || 'Gender'}
            </label>
            <select
              {...register('gender',{required:true})}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-900"
            >
              <option value="male">{t?.('male') || 'Male'}</option>
              <option value="female">{t?.('female') || 'Female'}</option>
            </select>
          </div>
          {/* Subscriptions */}
          {/* <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('pages.subscriptions.title') || 'Subscriptions'}
            </label>
            <select
              {...register('subscriptionId')}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-900"
            >
              {subscriptions.map((subscription) => (
                <option key={subscription.id} value={subscription.id}>
                  { t(subscription?.name)}
                </option>
              ))}
            </select>
          </div> */}

          {/* Role */}
          {/* <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t?.('role') || 'Role'}
            </label>
            <select
              {...register('role',{required:true})}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-900"
            >
              <option value="member">{t?.('member') || 'Member'}</option>
              <option value="admin">{t?.('admin') || 'Admin'}</option>
              <option value="coach">{t?.('coach') || 'Coach'}</option>
              <option value="staff">{t?.('staff') || 'Staff'}</option>
            </select>
          </div> */}

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('isActive')}
              id="isActive"
              className="h-5 w-5 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800"
            />
            <label htmlFor="isActive" className="ml-3 cursor-pointer select-none text-sm font-medium text-slate-700 dark:text-slate-300">
              {t?.('isActive') || 'Active Member'}
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {t('cancel') || 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {t('add') || 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;