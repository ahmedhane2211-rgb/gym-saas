import React, { useContext, useState, cloneElement, useRef, useEffect } from 'react';
import {
  useGetMembersQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation
} from '../services/MemberSlice';
import { useAddAttendanceMutation } from '../../attendance/services/AttendanceSlice';
import { useAddSubscribeMutation, useUpdateSubscribeMutation } from '../services/SubscribeSlice';
import {
  Activity,
  Search,
  Filter,
  Plus,
  Dumbbell
} from 'lucide-react';
import toast from 'react-hot-toast';
import { LanguageContext } from '../../shared/context/LanguageContext';
import formattedDate from '../../shared/utils/formattedDate';
import MemberModal from '../components/MemberModal';
import MemberViewModal from '../components/MemberViewModal';
import CheckInModal from '../../attendance/components/CheckInModal';
import DataTable from '../../shared/components/DataTable';

const Member = () => {
  const { t } = useContext(LanguageContext);
  const searchInputRef = useRef(null);
  const { data: response, error, isLoading } = useGetMembersQuery();
  const members = Array.isArray(response) ? response : (response?.data || response?.members || []);
  const [addMember, { isLoading: isAdding }] = useAddMemberMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
  const [deleteMember] = useDeleteMemberMutation();
  const [addAttendance, { isLoading: isCheckingIn }] = useAddAttendanceMutation();
  const [addSubscribe, { isLoading: isSubscribing }] = useAddSubscribeMutation();
  const [updateSubscribe] = useUpdateSubscribeMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [checkingInMember, setCheckingInMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchInputRef.current) {
        searchInputRef.current.focus();
    }
  }, []);
  const handleOpenAdd = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleOpenView = (member) => {
    setViewingMember(member);
    setIsViewModalOpen(true);
  };

  const handleOpenCheckIn = (member) => {
    setCheckingInMember(member);
    setIsCheckInModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingMember(null);
  };

  const handleCloseCheckInModal = () => {
    setIsCheckInModalOpen(false);
    setCheckingInMember(null);
  };

  const handleSubmitMember = async (data) => {
    const { plansId, startDate, endDate, ...memberData } = data;
    try {
      if (editingMember) {
        await updateMember({ id: editingMember.id, ...memberData }).unwrap();
        
        // Handle Subscription Update/Add
        if (plansId) {
            if (editingMember.subscription) {
                await updateSubscribe({ 
                    id: editingMember.subscription.id,
                    plansId,
                    startDate,
                    endDate,
                    memberId: editingMember.id
                }).unwrap();
            } else {
                await addSubscribe({
                    memberId: editingMember.id,
                    plansId,
                    startDate,
                    endDate
                }).unwrap();
            }
        }
        toast.success(t('update_success') || 'Member and subscription updated');
      } else {
        const res = await addMember(memberData).unwrap();
        const memberId = res.data?.id;

        // Automatically enroll in subscription if a plan was selected
        if (plansId && memberId) {
            await addSubscribe({
                memberId,
                plansId,
                startDate,
                endDate
            }).unwrap();
            toast.success(t('member_subscribed_success') || 'Member added and subscribed!');
        } else {
            toast.success(t('add_success') || 'Member added successfully');
        }
      }
      handleCloseModal();
    } catch (err) {
      toast.error(err.data?.message || t('operation_failed') || 'Operation failed');
    }
  };

  const handleCheckInSubmit = async (data) => {
    try {
        await addAttendance({ id: checkingInMember.id, }).unwrap();
        toast.success(t('check_in_success') || 'Attendance recorded');
        handleCloseCheckInModal();
    } catch (err) {
        toast.error(err.data?.message || 'Check-in failed');
    }
  };
  const handleSearchKeyDown = async (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
        const search = searchTerm.trim().toLowerCase();
        const targetMember = members.find(m => {
            const idStr = `MB-${m.id?.toString().padStart(3, '0')}`.toLowerCase();
            const idPlain = m.id?.toString();
            return idStr === search || idPlain === search;
        });

        if (targetMember) {
            try {
                await addAttendance({ id: targetMember.id }).unwrap();
                toast.success(`${t('check_in_success') || 'Check-in successful'}: ${targetMember.user?.full_name}`, {
                    icon: '🚀',
                    duration: 4000
                });
                setSearchTerm('');
            } catch (err) {
                toast.error(err.data?.message || 'Check-in failed');
            }
        }
    }
  };

  const filteredMembers = (members || []).filter(m => {
    const search = searchTerm.toLowerCase();
    const idStr = `MB-${m?.id?.toString().padStart(3, '0')}`.toLowerCase();
    const idPlain = m?.id?.toString() || '';
    const name = (m?.user?.full_name || '').toLowerCase();
    return name.includes(search) || idStr.includes(search) || idPlain.includes(search);
  });

  const handleDelete = async (id) => {
    if (window.confirm(t('confirm_delete') || 'Are you sure you want to delete?')) {
      try {
        await deleteMember({ id }).unwrap();
        toast.success(t('delete_success') || 'Member deleted successfully');
      } catch (err) {
        toast.error(err.data?.message || t('delete_failed') || 'Delete failed');
      }
    }
  };

  const columns = [
    {
        header: 'member_details',
        render: (member) => (
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden bg-gray-100 dark:bg-gray-dark relative">
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member?.user?.full_name}`}
                        alt=""
                        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all font-main"
                    />
                </div>
                <div>
                    <p className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight italic">{member?.user?.full_name}</p>
                    <p className="text-gray-500 dark:text-gray-600 text-[10px] font-bold uppercase tracking-widest">ID: MB-{member?.id?.toString().padStart(3, '0')}</p>
                </div>
            </div>
        )
    },
    {
        header: 'status',
        render: (member) => (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border ${member?.user?.is_active
                ? 'bg-blue/10 border-blue/20 text-blue'
                : 'bg-gray-500/10 border-gray-500/20 text-gray-500'
                }`}>
                <div className={`w-1 h-1 rounded-full ${member?.user?.is_active ? 'bg-blue animate-pulse' : 'bg-gray-500'}`} />
                {member?.user?.is_active ? t('active') : t('inactive')}
            </span>
        )
    },
    {
        header: 'start_date',
        render: (member) => (
            <div className="space-y-1">
                {member?.subscription && (
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                         {formattedDate(member.subscription.start_date)}
                    </p>
                )}
            </div>
        )
    },
    {
        header: 'end_date',
        render: (member) => (
            <div className="space-y-1">
                {member?.subscription && (
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                         {formattedDate(member.subscription.end_date)}
                    </p>
                )}
            </div>
        )
    },
    {
        header: 'qr_code',
        key: 'qr_code'
    },
    {
        header: 'id_number',
        key: 'id_number'
    }
  ];

  const stats = [
    { label: t('total_members') || 'Total Members', value: members?.length || 0, icon: <Dumbbell className="text-orange" />, color: 'orange' },
    { label: t('active_members') || 'Active Members', value: members?.filter(m => m.user?.is_active).length || 0, icon: <Activity className="text-blue" />, color: 'blue' },
  ];

  if (error) {
    toast.error(t('fetch_error') || 'Failed to fetch members');
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest italic uppercase">{t('members')}</h1>
          <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed">
            {t('manage_members_desc')}
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

      {/* Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative group w-full md:w-96">
          <Search className="absolute inset-y-0 ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={t('search_members_placeholder') || 'Scan QR or search by name...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full bg-gray-50 dark:bg-gray-dark/30 border border-gray-200 dark:border-white/5 rounded-xl py-4 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all placeholder:text-gray-400 font-medium font-main"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-6 py-4 bg-gray-50 dark:bg-gray-dark/50 border border-gray-200 dark:border-white/5 rounded-xl text-gray-500 dark:text-gray-light font-black text-[12px] uppercase tracking-widest hover:text-orange dark:hover:text-white transition-all">
            <Filter size={16} />
            <span>{t('filters')}</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="btn-orange flex items-center gap-2 h-14 px-8 shadow-[0_0_30px_rgba(255,95,31,0.1)]"
          >
            <Plus size={18} />
            <span>{t('add_new')}</span>
          </button>
        </div>
      </div>

      {/* DataTable */}
      <DataTable 
          columns={columns}
          data={filteredMembers}
          isLoading={isLoading}
          onCheckIn={handleOpenCheckIn}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onView={handleOpenView}
      />

      {/* Member Modal */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitMember}
        initialData={editingMember}
        isLoading={isAdding || isUpdating || isSubscribing}
        title={editingMember ? 'update_member' : 'add_member'}
      />

       {/* Member View Modal */}
       <MemberViewModal 
            isOpen={isViewModalOpen}
            onClose={handleCloseViewModal}
            member={viewingMember}
       />

       {/* Check-In Modal */}
       <CheckInModal 
            isOpen={isCheckInModalOpen}
            onClose={handleCloseCheckInModal}
            member={checkingInMember}
            onSubmit={handleCheckInSubmit}
            isLoading={isCheckingIn}
       />
    </div>
  );
};

export default Member;