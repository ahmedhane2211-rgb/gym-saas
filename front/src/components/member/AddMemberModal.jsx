/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import { addMember } from '../../redux/slices/MemberSlice';
import Select from '../ui/Select';
import { data } from 'autoprefixer';

const AddMemberModal = ({ isOpen, onClose, onSubmit, t,members,subscriptions }) => {
  
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
  const membersObj = members.map(member => ({
    id: member.id,
    name: member.fullname,
  }));
  const subscriptionObj = subscriptions.map(subscription => ({
    id: subscription.id,
    name: subscription.name,
  }));
  const handleAdd = (data) => {
    console.log(data)
    // const formData = new FormData()
    // formData.append('fullName',data.fullName)
    // formData.append('phone',data.phone)
    // formData.append('email',data.email)
    // formData.append('barcode',data.barcode)
    // formData.append('photoUrl',data.photoUrl)
    // formData.append('idNumber',data.idNumber)
    // formData.append('dateOfBirth',data.dateOfBirth)
    // formData.append('gender',data.gender)
    // formData.append('isActive',data.isActive)
    // formData.append('subscriptionId',data.subscriptionId)
    // formData.append('role',data.role)
    // Convert FormData to plain object
  const memberObj = {
    idNumber: data.idNumber,
    subscriptionId: data.subscriptionid,
    userId: data.userid,
    barcode: data.barcode,
  };

  dispatch(addMember(memberObj));
  reset();
  setPhotoPreview(null);
  onClose();
;
    // for (let [key, value] of formData.entries()) {
    //   memberObj[key] = value;
    // }
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
          
          {/* User */}
          <Select t={t} name="userid" label='member' register={register} required errors={errors} options={membersObj}/>

          {/* Subscriptions */}
          <Select t={t} name="subscriptionid" label='subscription' register={register} required errors={errors} options={subscriptionObj}/>

          {/* ID Number */}
          <Input type="number" t={t} name="idNumber" label='idNumber' register={register} required errors={errors}/>

          {/* Barcode */}
          <Input t={t} name="barcode" label='barCode' register={register} required errors={errors}/>

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