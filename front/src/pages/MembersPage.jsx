/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable no-unused-vars */
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { membersList } from "../assets/assets";
import { Badge } from "../components/ui/Badge";
import { SectionHeader } from "../components/ui/SectionHeader";
import AddMemberModal from "../components/member/AddMemberModal";
import EditMemberModal from "../components/member/EditMemberModal";
import { useTranslation } from "react-i18next";
import { Delete, DeleteIcon, Edit, Eye } from "lucide-react";
import ShowModal from "../components/ui/ShowModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteMember, getAllMembers } from "../redux/slices/MemberSlice";
import AddSubscriberModal from "../components/plans/AddSubscriberModal";
import Btn from "../components/ui/Btn";
import { formatDate } from "../utils/formatDate";
import { getAllUsers } from "../redux/slices/UserSlice";
import { getPlans } from "../redux/slices/PlanSlice";

const MembersPage = () => {
  const {t} = useTranslation();
  const [addModal,setAddModal] = useState(false);
  const [editModal,setEditModal] = useState(false);
  const [showModal,setShowModal] = useState(false);
  const [openSubscriber, setOpenSubscriber] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  // const [members, setMembers] = useState(membersList);
  const {members} = useSelector((state) => state.members);
  const { users } = useSelector((state) => state.users);
  const { plans } = useSelector((state) => state.plans);
  // console.log(members)
  const [filteredMembers, setFilteredMembers] = useState([]);
  const dispatch = useDispatch() 
  const membersList = useMemo(()=>{
    return users.filter((user) => user.role === "member")
  },[users])


  useEffect(()=>{
    dispatch(getAllUsers());
    dispatch(getAllMembers());
    dispatch(getPlans())
  },[dispatch])


  useEffect(() => {
    setFilteredMembers(Array.isArray(members) ? members : []);
  }, [members])
  const openEditModal = (member) => {
    setSelectedMember(member);
    setEditModal(true);
  };
  const handleShowModal = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  }
  
  const handleDelete = (id)=>{
    if(window.confirm(t("members.confirmDelete"))){
      dispatch(deleteMember(id));
    }
  }
  const filterData = useCallback((filterValue) => {
  const memberList = Array.isArray(members) ? members : [];
  if (filterValue === "all") {
    setFilteredMembers(memberList);
  } else if (filterValue === "active") {
    setFilteredMembers(memberList.filter((member) => member?.user?.isactive === true));
  } else if (filterValue === "expired") {
    setFilteredMembers(memberList.filter((member) => member?.user?.isactive === false));
  }
}, [members]);
  

  return(
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <select onChange={(e) => filterData(e.target.value)}>
            <option value={"all"}>{t("members.filters.all")}</option>
            <option value={"active"}>{t("members.filters.active")}</option>
            <option value={"expired"}>{t("members.filters.expired")}</option>
          </select>
          
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn
            onClick={() => setAddModal(true)}
            title={t("actions.newMember")}
          />
        </div>
      </div>

      <div className="card space-y-4">
        <SectionHeader title={t("tables.members")} description={t("members.description")} />
        <div className="overflow-auto rounded-2xl border border-slate-200/70 dark:border-slate-700/70">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 text-center">{t("members.table.member_name")}</th>
                <th className="px-4 py-3 text-center">{t("email")}</th>
                <th className="px-4 py-3 text-center">{t("phone")}</th>
                <th className="px-4 py-3 text-center">{t("isActive")}</th>
                <th className="px-4 py-3 text-center">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers?.map((member) => (
                <tr 
                  key={member.id || member.name} 
                  className="cursor-pointer border-t border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 text-center py-3 font-semibold text-slate-900 dark:text-slate-100">{member?.user?.full_name || "name"}</td>
                  <td className="px-4 text-center py-3 text-slate-600 dark:text-slate-400">{t(member?.user?.email)}</td>
                  <td className="px-4 text-center py-3">
                    <Badge tone={member.statusKey === "members.status.expired" ? "rose" : "emerald"}>{t(member?.user?.phone)}</Badge>
                  </td>
                  <td className="px-4 text-center py-3 text-slate-600 dark:text-slate-400">
                    {member?.user?.is_active ? (
                      <Badge tone="emerald">{t("active")}</Badge>
                    ) : (
                      <Badge tone="rose">{t("inactive")}</Badge>
                    )}
                  </td>
                  <td className="px-4 flex gap-2 justify-center py-3 text-slate-600 dark:text-slate-400">
                    <span className="cursor-pointer hover:text-emerald-500 w-6" onClick={() => openEditModal(member)}><Edit /></span>
                    <span className="cursor-pointer hover:text-emerald-500 w-6" onClick={() => handleShowModal(member)}><Eye /></span>
                    <span className="cursor-pointer hover:text-emerald-500 w-6" onClick={() => handleDelete(member?.id)}><Delete /></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddMemberModal 
        members={membersList}
        plans={plans}
        isOpen={addModal} 
        onClose={() => setAddModal(false)}
        t={t}
      />
      <EditMemberModal 
        members={membersList}
        plans={plans}
        isOpen={editModal} 
        onClose={() => setEditModal(false)}
        member={selectedMember}
        t={t}
      />

      {showModal && (
        <ShowModal onClose={()=>setShowModal(false)} setShowModal={setShowModal} t={t} showModal={showModal} title={"show_details"}>
          <div className="grid grid-cols-2 gap-4">
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("fullName")}: <span>{selectedMember?.user?.full_name || "--"}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("email")}: <span>{selectedMember?.user?.email || "--"}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("phone")}: <span>{selectedMember?.user?.phone || "--"}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("gender")}: <span>{t(selectedMember?.user?.gender || "--")}</span></p>
            {/* <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("role")}: <span>{selectedMember.role}</span></p> */}
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("dateOfBirth")}: <span>{formatDate(selectedMember?.user?.date_of_birthday || "--")}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("isActive")}: <span>{selectedMember?.user?.is_active ? t("active") : t("inactive")}</span></p>
          </div>
        </ShowModal>
      )}

      <AddSubscriberModal 
        isOpen={openSubscriber} 
        onClose={() => setOpenSubscriber(false)} 
        t={t} 
        members={members} 
        plans={plans} 
      />
    </div>
  )};
export default MembersPage;