import { useState } from "react";
import { Badge } from "../components/ui/Badge";
import { SectionHeader } from "../components/ui/SectionHeader";
import AddSubscriptionModal from "../components/subscriptions/AddSubscriptionModal";
import { useDispatch, useSelector } from "react-redux";
import { Trash } from "lucide-react";
import { deleteSubscription } from "../redux/slices/SubscriptionSlice";
import Btn from "../components/ui/Btn";
import AddSubscriberModal from "../components/subscriptions/AddSubscriberModal";

const SubscriptionsPage = ({t,pageTitle}) =>{ 
  const dispatch = useDispatch();
  const [openAdd, setOpenAdd] = useState(false);
  const [openSubscriber, setOpenSubscriber] = useState(false);
  const { subscriptions } = useSelector((state) => state.subscriptions);
  const handleDelete = (id)=>{
    if(window.confirm(t("confirmDelete"))){
      dispatch(deleteSubscription(id));
    }
  }
  return (
    <div className="space-y-6">
      <SectionHeader
        title={pageTitle("subscriptions")}
        description={t("subscriptions.description")}
        action={<div><Btn onClick={()=>setOpenAdd(true)} title={t("actions.addPlan")} /> <Btn onClick={()=>setOpenSubscriber(true)} title={t("actions.addSubscriber")}/> </div>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {subscriptions.map((plan) => (
          <div key={plan.id ?? plan.titleKey} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {plan.titleKey ? t(plan.titleKey) : (plan.name ?? plan.title)}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {plan.price}$
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Trash className="cursor-pointer text-red-500 hover:text-red-600" size={20} onClick={() => handleDelete(plan.id)} />
                <Badge tone="emerald">
                  {plan.durationKey ? t(plan.durationKey) : plan.durationDays ? `${plan.durationDays} days` : plan.duration}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddSubscriptionModal isOpen={openAdd} onClose={() => setOpenAdd(false)} t={t} />
      <AddSubscriberModal isOpen={openSubscriber} onClose={() => setOpenSubscriber(false)} t={t} />
    </div>
  )};
export default SubscriptionsPage;
