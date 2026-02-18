/* eslint-disable no-unused-vars */
import { useState } from "react";
import { membersList } from "../assets/assets";
import { Badge } from "../components/ui/Badge";
import { SectionHeader } from "../components/ui/SectionHeader";
import AddMemberModal from "../components/member/AddMemberModal";
import EditMemberModal from "../components/member/EditMemberModal";
import { useTranslation } from "react-i18next";
import { Delete, DeleteIcon, Edit, Eye } from "lucide-react";
import ShowModal from "../components/ui/ShowModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteMember } from "../redux/slices/MemberSlice";
import Btn from "../components/ui/Btn";

const MembersPage = () => {
  const {t} = useTranslation();
  const [addModal,setAddModal] = useState(false);
  const [editModal,setEditModal] = useState(false);
  const [showModal,setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  // const [members, setMembers] = useState(membersList);
  const {members} = useSelector((state) => state.members);
  const [filteredMembers, setFilteredMembers] = useState(members);
  const dispatch = useDispatch() 
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
  const filterData = (filterValue) => {
    if(filterValue === "all"){
      setFilteredMembers(members);
    } else if(filterValue === "active"){
      console.log(filterValue)
      setFilteredMembers(members.filter((member)=>member.isActive === true))
    } else {
      setFilteredMembers(members.filter((member)=>member.isActive === false))
    }
  }

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
              {filteredMembers.map((member) => (
                <tr 
                  key={member.id || member.name} 
                  className="cursor-pointer border-t border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 text-center py-3 font-semibold text-slate-900 dark:text-slate-100">{member.fullName || member.name}</td>
                  <td className="px-4 text-center py-3 text-slate-600 dark:text-slate-400">{t(member.email)}</td>
                  <td className="px-4 text-center py-3">
                    <Badge tone={member.statusKey === "members.status.expired" ? "rose" : "emerald"}>{t(member.phone)}</Badge>
                  </td>
                  <td className="px-4 text-center py-3 text-slate-600 dark:text-slate-400">
                    {member.isActive ? (
                      <Badge tone="emerald">{t("active")}</Badge>
                    ) : (
                      <Badge tone="rose">{t("inactive")}</Badge>
                    )}
                  </td>
                  <td className="px-4 flex gap-2 justify-center py-3 text-slate-600 dark:text-slate-400">
                    <span className="cursor-pointer hover:text-emerald-500" onClick={() => openEditModal(member)}><Edit /></span>
                    <span className="cursor-pointer hover:text-emerald-500" onClick={() => handleShowModal(member)}><Eye /></span>
                    <span className="cursor-pointer hover:text-emerald-500" onClick={() => handleDelete(member.id)}><Delete /></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddMemberModal 
        isOpen={addModal} 
        onClose={() => setAddModal(false)}
        t={t}
      />
      <EditMemberModal 
        isOpen={editModal} 
        onClose={() => setEditModal(false)}
        member={selectedMember}
        t={t}
      />

      {showModal && (
        <ShowModal setShowModal={setShowModal} t={t} showModal={showModal} title={"show_details"}>
          <div className="grid grid-cols-2 gap-4">
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("fullName")}: <span>{selectedMember.fullName || selectedMember.name}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("email")}: <span>{selectedMember.email}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("phone")}: <span>{selectedMember.phone}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("gender")}: <span>{t(selectedMember.gender)}</span></p>
            {/* <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("role")}: <span>{selectedMember.role}</span></p> */}
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("dateOfBirth")}: <span>{selectedMember.dateOfBirth}</span></p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">{t("isActive")}: <span>{selectedMember.isActive ? t("active") : t("inactive")}</span></p>
          </div>
        </ShowModal>
      )}

    </div>
  )};
export default MembersPage;