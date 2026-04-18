import { useEffect, useState } from "react";
import { Badge } from "../components/ui/Badge";
import { SectionHeader } from "../components/ui/SectionHeader";
import AddPlanModal from "../components/plans/AddPlanModal";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Trash } from "lucide-react";
import Btn from "../components/ui/Btn";
import { deletePlan, getPlan, getPlans } from "../redux/slices/PlanSlice";
import EditPlanModal from "../components/plans/EditPlanModal";

const plansPage = ({ t, pageTitle }) => {
  const dispatch = useDispatch();
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { plans, planSelected } = useSelector((state) => state.plans);
  const { users } = useSelector((state) => state.users);
  const { onlineUser } = useSelector((state) => state.auth);


  useEffect(() => {
    if (onlineUser?.gymId) {
      dispatch(getPlans({ gym_id: onlineUser.gymId }));
    } else {
      dispatch(getPlans());
    }
  }, [dispatch, onlineUser])

  const handleDelete = (id) => {
    if (window.confirm(t("confirmDelete"))) {
      dispatch(deletePlan(id));
    }
  }
  const handleEdit = (plan) => {
    dispatch(getPlan(plan.id));
    setOpenEdit(true);
  }
  return (
    <div className="space-y-6">
      <SectionHeader
        title={pageTitle("subscriptions")}
        description={t("subscriptions.description")}
        action={<div><Btn onClick={() => setOpenAdd(true)} title={t("actions.addPlan")} /> </div>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.isArray(plans) && plans.map((plan, i) => (
          <div key={plan.id || i} className={`card ${!plan.is_active && "opacity-50 cursor-not-allowed"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {plan?.name}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {plan?.price}$
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Trash className="cursor-pointer text-red-500 hover:text-red-600" size={20} onClick={() => handleDelete(plan.id)} />
                <Edit className="cursor-pointer text-blue-500 hover:text-blue-600" size={20} onClick={() => handleEdit(plan)} />
                <Badge tone="emerald">
                  {plan?.duration} days
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddPlanModal isOpen={openAdd} onClose={() => setOpenAdd(false)} t={t} user={onlineUser} />
      <EditPlanModal isOpen={openEdit} onClose={() => setOpenEdit(false)} t={t} plan={planSelected} />
    </div>
  )
};
export default plansPage;
