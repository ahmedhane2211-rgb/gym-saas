import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { updateGym } from "../../redux/slices/GymSlice";
import Input from "../ui/Input";

const EditGymModal = ({ isOpen, onClose, t, gym }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.gyms);
  const [logoPreview, setLogoPreview] = useState(null);

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

  useEffect(() => {
    if (isOpen && gym) {
      setValue("name", gym.name || "");
      setValue("phone", gym.phone || "");
      setValue("description", gym.description || "");
      setValue("isActive", String(gym.isActive || false));
      if (gym.logo) {
        setLogoPreview(gym.logo);
      }
    }
  }, [isOpen, gym, setValue]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (data) => {
    if (!gym?.id) return;

    const gymData = {
      id: gym.id,
      logo: logoPreview,
      phone: data.phone,
      name: data.name,
      isActive: data.isActive === "true" || data.isActive === true,
      description: data.description,
    };

    dispatch(updateGym(gymData)).then(() => {
      reset();
      setLogoPreview(null);
      handleClose();
    });
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
      aria-label={t?.("gyms.editTitle") || "Edit Gym"}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-card-border bg-card shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] dark:border-dark-card-border dark:bg-dark-card dark:shadow-[0_20px_60px_-40px_rgba(0,0,0,0.85)]">
        <div className="flex items-start justify-between gap-4 border-b border-card-border p-6 dark:border-dark-card-border">
          <div>
            <h2 className="text-xl font-bold text-text dark:text-dark-text">
              {t("gyms.editTitle") || "Edit Gym"}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-card text-text-secondary hover:bg-bg hover:text-text dark:border-dark-card-border dark:bg-dark-card dark:hover:bg-dark-bg dark:hover:text-dark-text"
            aria-label={t?.("cancel") || "Close"}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(handleEdit)} className="space-y-5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="gym_name"
                register={register}
                name="name"
                errors={errors}
                required
                t={t}
              />
            </div>

            <Input
              label="phone"
              register={register}
              type="tel"
              name="phone"
              errors={errors}
              required
              t={t}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t("logo")}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-900"
              />
              {logoPreview && (
                <div className="mt-3 flex items-center gap-4">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-16 w-16 rounded object-cover"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {t("preview")}
                  </span>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t("description")}
              </label>
              <textarea
                {...register("description", { required: true })}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-900"
                placeholder={`Enter description`}
                rows="3"
              />
              {errors.description && (
                <span className="text-red-500 text-sm mt-1 block">{t("required")}</span>
              )}
            </div>
          </div>

          <label className="flex items-center gap-3">
            <select
              {...register("isActive")}
              className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
            >
              <option value="true">{t("active")}</option>
              <option value="false">{t("inactive")}</option>
            </select>
            <span>{t("isActive")}</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border px-5 py-2 text-text dark:text-dark-text"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 px-5 py-2 text-white"
            >
              {loading ? t("updating") : t("update")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGymModal;
