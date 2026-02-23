import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getAllUsers } from '../redux/slices/UserSlice';
import { useTranslation } from 'react-i18next';
import { Edit, Eye,Delete, Trash2 } from 'lucide-react';
import AddUserModal from '../components/user/AddUserModal';
import EditUserModal from '../components/user/EditUserModal';
import ShowModal from '../components/ui/ShowModal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import Btn from '../components/ui/Btn';

const UsersPage = () => {
  const { t } = useTranslation();
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  
  const { users } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const filteredUsers = filterRole === 'all' ? users : users.filter((user) => user.role === filterRole);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditModal(true);
  };

  useEffect(()=>{
    dispatch(getAllUsers());
  },[])

  

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(t('confirmDelete') || 'Are you sure?')) {
      dispatch(deleteUser(id));
    }
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      admin: 'emerald',
      manager: 'blue',
      staff: 'slate',
    };
    return roleMap[role] || 'slate';
  };

  return (
    <div className="space-y-6">
      {/* Filter and Add Button */}
      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <option value="all">{t('all') || 'All'}</option>
            <option value="admin">{t('admin') || 'Admin'}</option>
            <option value="manager">{t('manager') || 'Manager'}</option>
            <option value="staff">{t('staff') || 'Staff'}</option>
            <option value="coach">{t('coach') || 'Coach'}</option>
            <option value="member">{t('member') || 'member'}</option>
          </select>
        </div>
        <Btn
          onClick={() => setAddModal(true)}
          title={t('user.addUser') || 'Add New User'}
        />
      </div>

      {/* Users Table */}
      <div className="card space-y-4">
        <SectionHeader 
          title={t('pages.users.title') || 'Users'} 
          description={t('pages.users.intro') || 'Manage system users and their roles'}
        />
        
        <div className="overflow-auto rounded-2xl border border-slate-200/70 dark:border-slate-700/70">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 text-center">{t('name') || 'Name'}</th>
                <th className="px-4 py-3 text-center">{t('email') || 'Email'}</th>
                <th className="px-4 py-3 text-center">{t('phone') || 'Phone'}</th>
                <th className="px-4 py-3 text-center">{t('role') || 'Role'}</th>
                <th className="px-4 py-3 text-center">{t('members.table.status') || 'Status'}</th>
                <th className="px-4 py-3 text-center">{t('action') || 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {user.photoUrl ? (
                          <img
                            src={user.photoUrl}
                            alt={user.fullName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-sm">
                            👤
                          </div>
                        )}
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {user.fullname}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                      {user.phone}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge tone={getRoleBadge(user.role)}>
                        {t(`${user.role}`) || user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge tone={user.isactive ? 'emerald' : 'rose'}>
                        {user.isactive ? t('active') || 'Active' : t('inactive') || 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 flex gap-2 justify-center py-3 text-slate-600 dark:text-slate-400">
                    <span className="cursor-pointer hover:text-emerald-500 w-6" onClick={() => openEditModal(user)}><Edit /></span>
                    <span className="cursor-pointer hover:text-emerald-500 w-6" onClick={() => handleShowModal(user)}><Eye /></span>
                    <span className="cursor-pointer hover:text-emerald-500 w-6" onClick={() => handleDelete(user?.id)}><Delete /></span>
                  </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    {t('noData') || 'No users found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal isOpen={addModal} onClose={() => setAddModal(false)} t={t} />
      <EditUserModal isOpen={editModal} onClose={() => setEditModal(false)} user={selectedUser} t={t} />
      {showModal && selectedUser && (
        <ShowModal isOpen={showModal} title={'pages.users.title'} onClose={() => setShowModal(false)} data={selectedUser} t={t} >
          <div className="grid grid-cols-2 gap-4">
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">
              {t("fullName")}: <span>{selectedUser.fullname}</span>
            </p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">
              {t("gym_name")}: <span>{selectedUser.gymid}</span>
            </p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">
              {t("role")}: <span>{selectedUser.role}</span>
            </p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">
              {t("isActive")}: <span>{selectedUser.isactive ? t("active") || "Active" : t("inactive") || "Inactive"}</span>
            </p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">
              {t("email")}: <span>{selectedUser.email}</span>
            </p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">
              {t("branch_name")}: <span>{selectedUser.branchid}</span>
            </p>
            <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">
              {t("created_at")}: <span>{selectedUser.createdat}</span>
            </p>
              <p className="mt-2 text-sm p-4 bg-emerald-dark rounded-xl text-black dark:text-card">
                {t("phone")}: <span>{selectedUser.phone || "-"}</span>
              </p>
          </div>
        </ShowModal>)}
    </div>
  );
};

export default UsersPage;