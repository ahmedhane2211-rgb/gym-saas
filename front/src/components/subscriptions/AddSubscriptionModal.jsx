/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { createSubscription } from "../../redux/slices/SubscriptionSlice";
import { useForm } from "react-hook-form";
import Input from "../ui/Input";

const AddSubscriptionModal = ({ isOpen, onClose, t,user }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
// console.log(user);
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose, isOpen]);

  const handleAdd = (data) => {
    const dataObj = {
      ...data,
      gym_id: user?.gymId,
    }
    console.log("Creating subscription:", dataObj);
    dispatch(createSubscription(dataObj));
    reset();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t?.("actions.addPlan") || "Add Plan"}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-card-border bg-card shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] dark:border-dark-card-border dark:bg-dark-card dark:shadow-[0_20px_60px_-40px_rgba(0,0,0,0.85)]">
        <div className="flex items-start justify-between gap-4 border-b border-card-border p-6 dark:border-dark-card-border">
          <div>
            <h2 className="text-xl font-bold text-text dark:text-dark-text">
              {t("actions.addPlan") || "Add Subscription Plan"}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-card text-text-secondary hover:bg-bg hover:text-text dark:border-dark-card-border dark:bg-dark-card dark:hover:bg-dark-bg dark:hover:text-dark-text"
            aria-label={t?.("actions.close") || "Close"}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(handleAdd)} className="space-y-5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label={"plan_name"}
                register={register}
                name={"name"}
                errors={errors}
                required
                t={t}
              />
            </div>

            <Input
              label={"plan_price"}
              register={register}
              type="number"
              name={"price"}
              errors={errors}
              required={{ required: true, min: 0 }}
              t={t}
            />
            <Input
              label={"plan_duration"}
              register={register}
              type="number"
              name={"duration"}
              required
              errors={errors}
              t={t}
            />
            <Input
              label={"description"}
              register={register}
              name={"description"}
              required
              errors={errors}
              t={t}
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("isActive")}
              className="h-5 w-5"
            />
            <span>{t?.("plan_active") || "Active plan"}</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border px-5 py-2"
            >
              {t?.("cancel") || "Cancel"}
            </button>

            <button
              type="submit"
              className="rounded-full bg-emerald-500 px-5 py-2 text-white"
            >
              {t?.("add") || "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
