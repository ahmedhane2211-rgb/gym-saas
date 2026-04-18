/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../ui/Input";
import { useDispatch } from "react-redux";
import { updateMember } from "../../redux/slices/MemberSlice";
import { formatDate } from "../../utils/formatDate";
import Select from "../ui/Select";

const EditMemberModal = ({ isOpen, onClose, member, t,members }) => {
  // console.log(member)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  // 👇 لما المودال يفتح أو العضو يتغير نعمل reset
  useEffect(() => {
  if (member && isOpen) {
    reset({
      userid: member.userid || "", // تأكد من الحروف الصغيرة/الكبيرة حسب الـ DB
      idNumber: member.idnumber || "",
      barcode: member.barcode || "",
      subscriptionid: member.subscription_id || "",
    });
  }
}, [member, isOpen, reset]);


  const membersObj = (members || []).map(member => ({
    id: member.id,
    name: member.fullname,
  }));

  const submitHandler = (data) => {
  // لاحظ أننا نمرر الكائن بالشكل الذي يتوقعه الـ Thunk الجديد
  dispatch(updateMember({ 
    id: member.id, 
    data: {
      userId: data.userid, // تأكد من مطابقة الاسم مع الـ Select (userid)
      idNumber: data.idNumber,
      barcode: data.barcode,
      subscriptionId: data.subscriptionid || member.subscription_id // أضف الاشتراك
    }
  }));
  onClose();
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t("editMember")}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          {/* User */}
          <Select t={t} name="userid" label='member' register={register} required errors={errors} options={membersObj}/>

          {/* Subscriptions */}
          {/* <Select t={t} name="subscriptionid" label='subscription' register={register} required errors={errors} options={subscriptionObj}/> */}

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

export default EditMemberModal;
