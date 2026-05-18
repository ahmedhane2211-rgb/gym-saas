import {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} from '../userSlice';
import {
  Users as UsersIcon,
  Activity,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import UserModal from '../components/UserModal';
import UserViewModal from '../components/UserViewModal';
import DataTable from '../../shared/components/DataTable';
import { cloneElement, useContext, useState } from 'react';
import formattedDate from '../../shared/utils/formattedDate';
import { LanguageContext } from '../../shared/context/LanguageContext';
import SearchFilter from '../../shared/components/SearchFilter';
import useFilter from '../../shared/hooks/useFilter';


const Users = () => {
  const { t } = useContext(LanguageContext)
  const { data: response, error, isLoading } = useGetUsersQuery();
  const users = Array.isArray(response) ? response : (response?.data || response?.users || []);
  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useFilter(users, searchTerm, ['full_name', 'email', 'role']);


  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleOpenView = (user) => {
    setViewingUser(user);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingUser(null);
  };

  const handleSubmitUser = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'photo') {
        if (data[key] && data[key].length > 0) {
          formData.append('photo', data[key][0]);
        }
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    try {
      if (editingUser) {
        await updateUser({ id: editingUser.id, body: formData }).unwrap();
        toast.success('User updated successfully');
      } else {
        await addUser(formData).unwrap();
        toast.success('User added successfully');
      }
      handleCloseModal();
    } catch (err) {
      toast.error(err.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error(err.data?.message || 'Delete failed');
      }
    }
  };

  const columns = [
    {
      header: 'member_details',
      render: (user) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden bg-gray-100 dark:bg-gray-dark relative">
            <img
              src={user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`}
              alt=""
              className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all font-main"
            />
          </div>
          <div>
            <p className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight italic">{user.full_name}</p>
          </div>
        </div>
      )
    },
    {
      header: 'status',
      render: (user) => (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border ${user.is_active
          ? 'bg-blue/10 border-blue/20 text-blue'
          : 'bg-gray-500/10 border-gray-500/20 text-gray-500'
          }`}>
          <div className={`w-1 h-1 rounded-full ${user.is_active ? 'bg-blue animate-pulse' : 'bg-gray-500'}`} />
          {user.is_active ? t('active') : t('inactive')}
        </span>
      )
    },
    {
      header: 'role',
      render: (user) => (
        <span className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest">
          {t(user.role)}
        </span>
      )
    },
    {
      header: 'created_at',
      render: (user) => (
        <p className="text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-widest">{formattedDate(user.created_at)}</p>
      )
    }
  ];

  const stats = [
    { label: t('total_users'), value: users?.length || 0, icon: <UsersIcon className="text-orange" />, color: 'orange' },
    { label: t('active_today'), value: users?.filter(user => user.is_active).length || 0, icon: <Activity className="text-blue" />, color: 'blue' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest italic uppercase">{t('users')}</h1>
          <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed">
            {t('manage_users')}
          </p>
        </div>

        <div className="flex gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-6 min-w-[200px] flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ltr:translate-x-2 ltr:-translate-y-2 rtl:-translate-x-2 rtl:-translate-y-2">
                {cloneElement(stat.icon, { size: 64 })}
              </div>
              <p className="text-gray-600 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <p className={`text-4xl font-black ${stat.color === 'orange' ? 'text-orange' : 'text-blue'}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchFilter onSearch={setSearchTerm} placeholder={t('search_users') || 'Search users...'} />

        <div className="flex items-center gap-3 w-full md:w-auto">

          <button
            onClick={handleOpenAdd}
            className="btn-orange flex items-center gap-2 h-14 px-8 shadow-[0_0_30px_rgba(255,95,31,0.1)]"
          >
            <Plus size={18} />
            <span>{t('add_new')}</span>
          </button>
        </div>
      </div>

      {/* Table Component */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onView={handleOpenView}
        title={t('users')}
      />

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitUser}
        initialData={editingUser}
        isLoading={isAdding || isUpdating}
        title={editingUser ? 'update_user' : 'add_user'}
      />

      {/* User View Modal */}
      <UserViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        user={viewingUser}
      />
    </div>
  );
};

export default Users;