/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { addCoach } from '../../redux/slices/CoachSlice';

const AddCoachModal = ({ isOpen, onClose, t, coachUsers }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const dispatch = useDispatch();

  const usersObj = coachUsers.map(user => ({
    id: user.id,
    name: user.full_name,
  }));

  const handleAdd = (data) => {
    const coachObj = {
      userId: data.userId,
      speciality: data.speciality,
      salary: Number(data.salary),
    };

    dispatch(addCoach(coachObj));
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t?.('coaches.actions.addCoach') || 'Add New Coach'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(handleAdd)} className="space-y-4">
          <Select t={t} name="userId" label='coach' register={register} required errors={errors} options={usersObj}/>
          <Input t={t} name="speciality" label='speciality' register={register} required errors={errors}/>
          <Input 
            t={t} 
            name="salary" 
            label='salary' 
            register={register} 
            required 
            type='number'
            errors={errors}
          />
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
              {t('add') || 'Add Coach'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoachModal;
