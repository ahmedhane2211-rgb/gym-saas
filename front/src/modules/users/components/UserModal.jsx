import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Image as ImageIcon, Upload, Trash2, Shield } from "lucide-react";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import CheckBox from "../../shared/components/CheckBox";
import { LanguageContext } from "../../shared/context/LanguageContext";
import Select from "../../shared/components/Select";
import AppModal from "../../shared/components/AppModal";

const UserModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  title,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const { t } = useContext(LanguageContext);
  const [imagePreview, setImagePreview] = useState(null);

  const selectedImage = watch("photo");

  useEffect(() => {
    if (selectedImage && selectedImage.length > 0) {
      const file = selectedImage[0];
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [selectedImage]);

  useEffect(() => {
    if (initialData) {
      const formattedData = {
        ...initialData,
        date_of_birthday: initialData.date_of_birthday
          ? new Date(initialData.date_of_birthday).toISOString().split("T")[0]
          : "",
      };
      reset(formattedData);
      setImagePreview(initialData.photo || null);
    } else {
      reset({
        full_name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        role: "",
        is_active: true,
        gender: "",
        date_of_birthday: "",
        photo: null,
      });
      setImagePreview(null);
    }
  }, [initialData, reset, isOpen]);

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={t(title)} maxWidth="max-w-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase self-start">
            {t("photo") || "Profile Photo"}
          </label>
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-black transition-all group-hover:border-orange/50">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400 dark:text-gray-600">
                  <ImageIcon size={32} strokeWidth={1} />
                  <span className="text-[8px] font-black uppercase mt-2">
                    {t("no_image") || "No Image"}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <label className="cursor-pointer p-2 bg-orange rounded-lg text-black hover:bg-orange/90 transition-colors">
                  <Upload size={16} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    {...register("photo")}
                  />
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setValue("photo", null);
                    }}
                    className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="full_name"
            placeholder="e.g. Alex Sterling"
            name="full_name"
            register={register}
            errors={errors}
          />

          <div className="space-y-2">
            <Select
              label="gender"
              name="gender"
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
              options={[
                { value: "", label: t("select_gender") },
                { value: "male", label: t("male") },
                { value: "female", label: t("female") },
              ]}
            />
          </div>

          <Input
            label="date_of_birthday"
            type="date"
            name="date_of_birthday"
            register={register}
            errors={errors}
          />

          <Input
            label="phone"
            placeholder="+1 (555) 000-0000"
            name="phone"
            register={register}
            errors={errors}
          />

          <div className="md:col-span-2">
            <Input
              label="email"
              placeholder="alex.sterling@example.com"
              type="email"
              name="email"
              register={register}
              errors={errors}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="address"
              placeholder="123 Performance Way, Athlete City"
              name="address"
              register={register}
              errors={errors}
            />
          </div>

          {!initialData && (
            <div className="md:col-span-2">
              <Input
                label="password"
                type="password"
                placeholder=""
                name="password"
                register={register}
                errors={errors}
              />
            </div>
          )}
        </div>

        <div className="bg-blue/5 border border-blue/10 rounded-2xl p-6 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Shield size={120} className="text-blue" />
          </div>

          <div className="flex items-center gap-2 text-blue">
            <Shield size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Operational Setup
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <select
                label="role"
                name="role"
                {...register("role", {
                  required: t("role_required"),
                })}
                className="w-full min-h-14 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white transition-all focus:border-orange/50 focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option value="">{t("select_role")}</option>
                {[
                  { value: "member", label: t("member") },
                  { value: "coach", label: t("coach") },
                  { value: "employee", label: t("employee") },
                  { value: "admin", label: t("admin") },
                  { value: "reception", label: t("reception") },
                ].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {initialData && (
              <div className="pb-4">
                <CheckBox
                  label="Active"
                  name="is_active"
                  register={register}
                  errors={errors}
                />
              </div>
            )}
          </div>

          {(watch("role") === "reception" || watch("role") === "coach" || watch("role") === "employee") && (
            <Input
              label="basic_salary"
              type="number"
              placeholder="0"
              name="basic_salary"
              register={register}
              errors={errors}
            />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Button
            title={
              isLoading
                ? "Processing..."
                : initialData
                  ? t("update")
                  : t("add")
            }
            className="w-full bg-orange hover:bg-orange/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-[0_0_30px_rgba(255,95,31,0.2)]"
          />
          <Button
            onClick={onClose}
            title={t("cancel")}
            className="w-full text-gray-600 font-black text-[10px] tracking-[0.3em] uppercase hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2"
          />
        </div>
      </form>
    </AppModal>
  );
};

export default UserModal;
