import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "../components/ui/Badge";
import { SectionHeader } from "../components/ui/SectionHeader";
import AddCoachModal from "../components/coach/AddCoachModal";
import EditCoachModal from "../components/coach/EditCoachModal";
import { useTranslation } from "react-i18next";
import { Delete, Edit, Eye } from "lucide-react";
import ShowModal from "../components/ui/ShowModal";
import { useDispatch, useSelector } from "react-redux";
import { getCoaches, deleteCoach } from "../redux/slices/CoachSlice";
import Btn from "../components/ui/Btn";
import { getAllUsers } from "../redux/slices/UserSlice";

const CoachesPage = () => {
  const { t } = useTranslation();
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const { coaches, loading } = useSelector((state) => state.coaches);
  const { users } = useSelector((state) => state.users);
  
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const dispatch = useDispatch();

  const coachUsers = useMemo(() => {
    return users.filter((user) => user.role === "coach");
  }, [users]);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getCoaches());
  }, [dispatch]);

  useEffect(() => {
    setFilteredCoaches(Array.isArray(coaches) ? coaches : []);
  }, [coaches]);

  const openEditModal = (coach) => {
    setSelectedCoach(coach);
    setEditModal(true);
  };

  const handleShowModal = (coach) => {
    setSelectedCoach(coach);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(t("coaches.confirmDelete") || "Are you sure you want to delete this coach?")) {
      dispatch(deleteCoach(id));
    }
  };

  const filterData = useCallback((filterValue) => {
    const list = Array.isArray(coaches) ? coaches : [];
    if (filterValue === "all") {
      setFilteredCoaches(list);
    } else if (filterValue === "active") {
      setFilteredCoaches(list.filter((c) => c?.user?.isactive === true));
    } else if (filterValue === "expired") {
      setFilteredCoaches(list.filter((c) => c?.user?.isactive === false));
    }
  }, [coaches]);

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <select onChange={(e) => filterData(e.target.value)} className="rounded-lg border border-slate-300 p-2 dark:bg-slate-800 dark:border-slate-700">
            <option value="all">{t("coaches.filters.all") || t("members.filters.all") || "All Coaches"}</option>
            <option value="active">{t("coaches.filters.active") || t("members.filters.active") || "Active"}</option>
            <option value="expired">{t("coaches.filters.inactive") || t("members.filters.expired") || "Inactive"}</option>
          </select>
        </div>
        <Btn
          onClick={() => setAddModal(true)}
          title={t("actions.newCoach") || t("permissions.actions.addCoach") || "New Coach"}
        />
      </div>

      <div className="card space-y-4">
        <SectionHeader title={t("tables.coaches") || "Coaches"} description={t("coaches.description") || "View and manage gym coaches"} />
        <div className="overflow-auto rounded-2xl border border-slate-200/70 dark:border-slate-700/70">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 text-center">{t("coaches.table.coach_name") || "Coach Name"}</th>
                <th className="px-4 py-3 text-center">{t("speciality") || "Specialization"}</th>
                <th className="px-4 py-3 text-center">{t("email") || "Email"}</th>
                <th className="px-4 py-3 text-center">{t("phone") || "Phone"}</th>
                <th className="px-4 py-3 text-center">{t("isActive") || "Is Active"}</th>
                <th className="px-4 py-3 text-center">{t("action") || "Action"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoaches?.map((coach) => (
                <tr key={coach.id} className="border-t border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 text-center py-3 font-semibold text-slate-900 dark:text-slate-100">{coach?.user?.full_name || "Coach"}</td>
                  <td className="px-4 text-center py-3 text-slate-600 dark:text-slate-400">{coach?.speciality}</td>
                  <td className="px-4 text-center py-3 text-slate-600 dark:text-slate-400">{coach?.user?.email}</td>
                  <td className="px-4 text-center py-3 text-slate-600 dark:text-slate-400">{coach?.user?.phone}</td>
                  <td className="px-4 text-center py-3 text-slate-600 dark:text-slate-400">
                    {coach?.user?.is_active ? (
                      <Badge tone="emerald">{t("active") || "Active"}</Badge>
                    ) : (
                      <Badge tone="rose">{t("inactive") || "Inactive"}</Badge>
                    )}
                  </td>
                  <td className="px-4 flex gap-2 justify-center py-3 text-slate-600 dark:text-slate-400">
                    <span className="cursor-pointer hover:text-emerald-500 w-6" onClick={() => openEditModal(coach)}><Edit /></span>
                    <span className="cursor-pointer hover:text-emerald-500 w-6" onClick={() => handleShowModal(coach)}><Eye /></span>
                    <span className="cursor-pointer hover:text-red-500 w-6" onClick={() => handleDelete(coach.id)}><Delete /></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddCoachModal 
        coachUsers={coachUsers}
        isOpen={addModal} 
        onClose={() => setAddModal(false)}
        t={t}
      />
      <EditCoachModal 
        coachUsers={coachUsers}
        isOpen={editModal} 
        onClose={() => setEditModal(false)}
        coach={selectedCoach}
        t={t}
      />

      {showModal && (
        <ShowModal onClose={() => setShowModal(false)} setShowModal={setShowModal} t={t} showModal={showModal} title={"show_details"}>
          <div className="grid grid-cols-2 gap-4">
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("fullName") || "Full Name"}: <span>{selectedCoach?.user?.full_name}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("specialty") || "Speciality"}: <span>{selectedCoach?.speciality}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("salary") || "Salary"}: <span>{selectedCoach?.salary}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("email") || "Email"}: <span>{selectedCoach?.user?.email}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("phone") || "Phone"}: <span>{selectedCoach?.user?.phone}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("isActive") || "Is Active"}: <span>{selectedCoach?.user?.is_active ? t("active") : t("inactive")}</span></p>
          </div>
        </ShowModal>
      )}
    </div>
  );
};

export default CoachesPage;
