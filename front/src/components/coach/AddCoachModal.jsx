/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { addCoach } from "../../redux/slices/CoachSlice";
import { useForm } from "react-hook-form";
import Input from "../ui/Input";


const AddCoachModal = ({ isOpen, onClose, t }) => {
  const dispatch = useDispatch();
  const {members} = useSelector((state) => state.members);
  const {register,reset,formState:{errors},handleSubmit} = useForm();

  const handleAdd = (data) => {
    dispatch(
      addCoach(data),
    );
    onClose?.();
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t("actions.newCoach")}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            aria-label={t("cancel")}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(handleAdd)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t("coaches.fields.userId")} *
            </label>
            <select {...register("userId")} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-900">
              <option value="">اختر عضوًا</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.fullName}
                </option>
              ))}
            </select>
              
          </div>

          <div>
            <Input
            t={t}
            label={"coaches.fields.gymId"}
              type="text"
              register={register}
              name="gymId"
              required
            />
          </div>

          <div>
            <Input
            label={"coaches.fields.specialty"}
            t={t}
              type="text"
              register={register}
              name="specialty"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t("coaches.fields.bio")}
            </label>
            <textarea
              {...register("bio")}
              rows={4}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-900"
              placeholder={t("coaches.placeholders.bio")}
            />
          </div>

          <div>
            <Input
              label={"coaches.fields.commissionRate"}
            t={t}
              type="number"
              register={register}
              name="commissionRate"
              min={0}
              step="0.01"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register("isActive")}
              id="coachIsActiveEdit"
              className="h-5 w-5 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800"
            />
            <label
              htmlFor="coachIsActive"
              className="ml-3 cursor-pointer select-none text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {t("isActive")}
            </label>
          </div>

          <div className="flex gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {t("add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoachModal;
