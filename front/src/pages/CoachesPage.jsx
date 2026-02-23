import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Delete, Edit, Eye } from "lucide-react";

import { Badge } from "../components/ui/Badge";
import { SectionHeader } from "../components/ui/SectionHeader";
import ShowModal from "../components/ui/ShowModal";
import AddCoachModal from "../components/coach/AddCoachModal";
import EditCoachModal from "../components/coach/EditCoachModal";
import { deleteCoach } from "../redux/slices/CoachSlice";
import Btn from "../components/ui/Btn";

const CoachesPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { coaches } = useSelector((state) => state.coaches);

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCoaches = useMemo(() => {
    if (statusFilter === "active") return coaches.filter((c) => c.isActive);
    if (statusFilter === "inactive") return coaches.filter((c) => !c.isActive);
    return coaches;
  }, [coaches, statusFilter]);

  const openEditModal = (coach) => {
    setSelectedCoach(coach);
    setEditModal(true);
  };

  const handleShowModal = (coach) => {
    setSelectedCoach(coach);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const message = t("coaches.confirmDelete") || t("confirmDelete");
    if (window.confirm(message)) dispatch(deleteCoach(id));
  };

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">{t("coaches.filters.all")}</option>
            <option value="active">{t("coaches.filters.active")}</option>
            <option value="inactive">{t("coaches.filters.inactive")}</option>
          </select>
        </div>

        <Btn
          onClick={() => setAddModal(true)}
          title={t("actions.newCoach")}
        />
      </div>

      <div className="card space-y-4">
        <SectionHeader title={t("tables.coaches")} description={t("coaches.description")} />
        <div className="overflow-auto rounded-2xl border border-slate-200/70 dark:border-slate-700/70">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 text-center">{t("coaches.table.name")}</th>
                <th className="px-4 py-3 text-center">{t("coaches.table.gymId")}</th>
                <th className="px-4 py-3 text-center">{t("coaches.table.specialty")}</th>
                <th className="px-4 py-3 text-center">{t("coaches.table.commissionRate")}</th>
                <th className="px-4 py-3 text-center">{t("coaches.table.status")}</th>
                <th className="px-4 py-3 text-center">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoaches.map((coach) => (
                <tr
                  key={coach.id}
                  className="cursor-pointer border-t border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 text-center py-3 font-semibold text-slate-900 dark:text-slate-100">
                    {coach?.user?.name || '-'}
                  </td>
                  <td className="px-4 text-center py-3 text-slate-600 dark:text-slate-400">{coach.gymId}</td>
                  <td className="px-4 text-center py-3 text-slate-600 dark:text-slate-400">{coach.specialty}</td>
                  <td className="px-4 text-center py-3 text-slate-600 dark:text-slate-400">
                    <Badge tone="emerald">{coach.commissionRate}%</Badge>
                  </td>
                  <td className="px-4 text-center py-3 text-slate-600 dark:text-slate-400">
                    {coach.isActive ? (
                      <Badge tone="emerald">{t("active")}</Badge>
                    ) : (
                      <Badge tone="rose">{t("inactive")}</Badge>
                    )}
                  </td>
                  <td className="px-4 flex gap-2 justify-center py-3 text-slate-600 dark:text-slate-400">
                    <span className="cursor-pointer hover:text-emerald-500" onClick={() => openEditModal(coach)}>
                      <Edit />
                    </span>
                    <span className="cursor-pointer hover:text-emerald-500" onClick={() => handleShowModal(coach)}>
                      <Eye />
                    </span>
                    <span className="cursor-pointer hover:text-emerald-500" onClick={() => handleDelete(coach.id)}>
                      <Delete />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddCoachModal isOpen={addModal} onClose={() => setAddModal(false)} t={t} />
      <EditCoachModal isOpen={editModal} onClose={() => setEditModal(false)} coach={selectedCoach} t={t} />

      {showModal && selectedCoach && (
        <ShowModal onClose={()=>setShowModal(false)} setShowModal={setShowModal} t={t} showModal={showModal} title={"show_details"}>
          <div className="grid grid-cols-2 gap-4">
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">
              {t("coaches.fields.userId")}: <span>{selectedCoach.userId}</span>
            </p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">
              {t("coaches.fields.gymId")}: <span>{selectedCoach.gymId}</span>
            </p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">
              {t("coaches.fields.specialty")}: <span>{selectedCoach.specialty}</span>
            </p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">
              {t("coaches.fields.commissionRate")}: <span>{selectedCoach.commissionRate}%</span>
            </p>
            <div className="col-span-2">
              <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">
                {t("coaches.fields.bio")}: <span>{selectedCoach.bio || "-"}</span>
              </p>
            </div>
          </div>
        </ShowModal>
      )}
    </div>
  );
};

export default CoachesPage;
