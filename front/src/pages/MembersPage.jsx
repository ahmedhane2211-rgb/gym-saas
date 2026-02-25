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
import Btn from "../components/ui/Btn";
import { formatDate } from "../utils/formatDate";
import { getAllUsers } from "../redux/slices/UserSlice";

const MembersPage = () => {
  const {t} = useTranslation();
  const [addModal,setAddModal] = useState(false);
  const [editModal,setEditModal] = useState(false);
  const [showModal,setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  // const [members, setMembers] = useState(membersList);
  const {members} = useSelector((state) => state.members);
  const { users } = useSelector((state) => state.users);
  const { subscriptions } = useSelector((state) => state.subscriptions);
  console.log(members)
  const [filteredMembers, setFilteredMembers] = useState([]);
  const dispatch = useDispatch() 
  const membersList = useMemo(()=>{
    return users.filter((user) => user.role === "member")
  },[users])


  useEffect(()=>{
    dispatch(getAllUsers());
  },[])

  useEffect(() => {
  dispatch(getAllMembers());
}, [dispatch]); 

  useEffect(() => {
    setFilteredMembers(members);
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
    setFilteredMembers(memberList.filter((member) => member.isactive === true));
  } else if (filterValue === "expired") {
    setFilteredMembers(memberList.filter((member) => member.isactive === false));
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
        <Btn
          onClick={() => setAddModal(true)}
          title={t("actions.newMember")}
        />
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
                  <td className="px-4 text-center py-3 font-semibold text-slate-900 dark:text-slate-100">{member.fullname || "name"}</td>
                  <td className="px-4 text-center py-3 text-slate-600 dark:text-slate-400">{t(member.email)}</td>
                  <td className="px-4 text-center py-3">
                    <Badge tone={member.statusKey === "members.status.expired" ? "rose" : "emerald"}>{t(member.phone)}</Badge>
                  </td>
                  <td className="px-4 text-center py-3 text-slate-600 dark:text-slate-400">
                    {member.isactive ? (
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
        subscriptions={subscriptions}
        isOpen={addModal} 
        onClose={() => setAddModal(false)}
        t={t}
      />
      <EditMemberModal 
        members={membersList}
        subscriptions={subscriptions}
        isOpen={editModal} 
        onClose={() => setEditModal(false)}
        member={selectedMember}
        t={t}
      />

      {showModal && (
        <ShowModal onClose={()=>setShowModal(false)} setShowModal={setShowModal} t={t} showModal={showModal} title={"show_details"}>
          <div className="grid grid-cols-2 gap-4">
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("fullName")}: <span>{selectedMember.fullname || selectedMember.name}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("email")}: <span>{selectedMember.email}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("phone")}: <span>{selectedMember.phone}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("gender")}: <span>{t(selectedMember.gender)}</span></p>
            {/* <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("role")}: <span>{selectedMember.role}</span></p> */}
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("dateOfBirth")}: <span>{formatDate(selectedMember?.dateofbirth)}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("isActive")}: <span>{selectedMember.isactive ? t("active") : t("inactive")}</span></p>
          </div>
        </ShowModal>
      )}

    </div>
  )};
export default MembersPage;