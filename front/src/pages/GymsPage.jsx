import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash, Edit } from "lucide-react";
import { SectionHeader } from "../components/ui/SectionHeader";
import { getGyms, deleteGym } from "../redux/slices/GymSlice";
import AddGymModal from "../components/gym/AddGymModal";
import EditGymModal from "../components/gym/EditGymModal";
import Btn from "../components/ui/Btn";
import { Badge } from "../components/ui/Badge";

const GymsPage = ({ t, pageTitle }) => {
  const dispatch = useDispatch();
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedGym, setSelectedGym] = useState(null);
  const { gyms, loading } = useSelector((state) => state.gyms);

  useEffect(() => {
    dispatch(getGyms());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm(t("confirmDelete"))) {
      dispatch(deleteGym(id));
    }
  };

  const handleEdit = (gym) => {
    setSelectedGym(gym);
    setEditModal(true);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={pageTitle("gyms")}
        description={t("gyms.description")}
        action={
          <Btn
            onClick={() => setAddModal(true)}
            title={t("actions.addGym")}
          />
        }
      />

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("gym_name")}
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("phone")}
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("logo")}
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("description")}
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("isActive")}
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("action")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                    {t("loading")}...
                  </td>
                </tr>
              ) : Array.isArray(gyms) && gyms.length > 0 ? (
                gyms.map((gym) => (
                  <tr
                    key={gym.id}
                    className="hover:bg-slate-50 text-center dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {gym.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {gym.phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {gym.logo ? (
                        <img
                          src={gym.logo}
                          alt={gym.name}
                          className="h-8 w-8 rounded object-cover"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {gym.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge tone={gym.isActive ? "emerald" : "slate"}>
                        {gym.isActive ? t("active") : t("inactive")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(gym)}
                          className="p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(gym.id)}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    {t("noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddGymModal isOpen={addModal} onClose={() => setAddModal(false)} t={t} />
      <EditGymModal
        isOpen={editModal}
        onClose={() => {
          setEditModal(false);
          setSelectedGym(null);
        }}
        t={t}
        gym={selectedGym}
      />
    </div>
  );
};

export default GymsPage;
