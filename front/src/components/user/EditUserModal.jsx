/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/UserSlice';
import Input from '../ui/Input';
import { formatDate } from '../../utils/formatDate';
import Select from '../ui/Select';

const EditUserModal = ({ isOpen, onClose, user, t, branches }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      password: '',
      dateofbirth: '',
      address: '',
      gender: '',
      branch_id: '',
      role: '',
      is_active: true,
    }
  });

  const dispatch = useDispatch();
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
  if (user && isOpen) {
    reset({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '', // يفضل ترك كلمة السر فارغة عند التعديل إلا لو أراد تغييرها
      date_of_birthday: formatDate(user.date_of_birthday) || "",
      address: user.address || '',
      gender: user.gender || '',
      role: user.role || '',
      is_active: user.is_active ?? true,
    });
    setPhotoPreview(user.photo || null); // تأكد من حالة الحروف photourl أو photoUrl
  }
}, [user, isOpen, reset]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const submitHandler = (data) => {
  const formData = new FormData();

  // تأكد أن الأسماء (Keys) هي نفسها التي يستقبلها الـ Backend
  formData.append('full_name', data.full_name);
  formData.append('email', data.email);
  formData.append('phone', data.phone);
  formData.append('role', data.role);
  formData.append('is_active', data.is_active); // سترسل كـ "true" أو "false" نصية
  formData.append('address', data.address || "");
  formData.append('gender', data.gender || "");
  formData.append('date_of_birthday', data.date_of_birthday || "");
  
  if (data.password) {
    formData.append('password', data.password);
  }

  // هنا المربط: الـ input في الـ JSX اسمه 'photoUrl' 
  // فـ data.photoUrl ستكون هي الـ FileList
  if (data.photoUrl && data.photoUrl[0]) {
    formData.append('photoUrl', data.photoUrl[0]); // نرسل الملف الفعلي
  } else {
    // إذا لم يتم اختيار صورة جديدة، نرسل الرابط القديم كـ String
    formData.append('photoUrl', user.photourl || ""); 
  }

  // إرسال كـ Object يحتوي على id و data ليتوافق مع الـ Thunk
  dispatch(updateUser({ id: user.id, data: formData }));
  onClose();
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t('editUser') || 'Edit User'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
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
              {t('upload_photo') || 'Upload Photo'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register('photo', {
                  onChange: (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPhotoPreview(URL.createObjectURL(file));
                    }
                  }
                })}
              />
            </label>
          </div>

          {/* Full Name */}
          <Input
            type="text"
            t={t}
            name="full_name"
            label='fullName'
            register={register}
            required
            errors={errors}
          />

          {/* Email */}
          <Input
            type="email"
            t={t}
            name="email"
            label='email'
            register={register}
            required
            errors={errors}
          />

          {/* Password */}
          <Input
            type="text"
            t={t}
            name="password"
            label='password'
            register={register}
            errors={errors}
          />

          {/* Date of Birth */}
          <Input
            type="date"
            t={t}
            name="date_of_birthday"
            label='dateOfBirth'
            register={register}
            errors={errors}
          />

          {/* Phone */}
          <Input
            type="tel"
            t={t}
            name="phone"
            label='phone'
            register={register}
            required
            errors={errors}
          />

          {/* Address */}
          <Input
            type="address"
            t={t}
            name="address"
            label='address'
            register={register}
            errors={errors}
          />

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('gender') || 'Gender'}
            </label>
            <select
              {...register('gender')}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">-- {t('selectGender') || 'Select Gender'} --</option>
              <option value="male">{t('male') || 'Male'}</option>
              <option value="female">{t('female') || 'Female'}</option>
            </select>
            {errors.gender && <span className="text-red-500 text-sm">{t('required')}</span>}
          </div>


          {/* Gym Branch */}
          <Select 
            t={t} register={register} options={branches} label='gym_branch' name="branchId" required={true}/>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('role') || 'Role'}
            </label>
            <select
              {...register('role', { required: true })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">-- {t('selectRole') || 'Select Role'} --</option>
              <option value="admin">{t('admin') || 'Admin'}</option>
              <option value="manager">{t('manager') || 'Manager'}</option>
              <option value="staff">{t('staff') || 'Staff'}</option>
              <option value="coach">{t('coach') || 'Coach'}</option>
              <option value="member">{t('member') || 'Member'}</option>
            </select>
            {errors.role && <span className="text-red-500 text-sm">{t('required')}</span>}
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800"
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t('isActive') || 'Active'}
            </label>
          </div>

          {/* Submit & Cancel */}
          <div className="flex gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            >
              {t('cancel') || 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {t('update') || 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
