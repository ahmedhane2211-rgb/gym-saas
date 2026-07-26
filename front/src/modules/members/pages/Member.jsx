import React, { useContext, useState, cloneElement, useRef } from "react";
import {
  useGetMembersQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} from "../services/MemberSlice";
import { useAddAttendanceMutation } from "../../attendance/services/AttendanceSlice";
import {
  useAddSubscribeMutation,
  useUpdateSubscribeMutation,
} from "../services/SubscribeSlice";
import { useAddPauseMutation } from "../../freeze/services/PauseSlice";
import PauseSubscriptionModal from "../../freeze/components/PauseSubscriptionModal";
import RenewSubscriptionModal from "../components/RenewSubscriptionModal";
import { Activity, Plus, Dumbbell } from "lucide-react";
import toast from "react-hot-toast";
import { LanguageContext } from "../../shared/context/LanguageContext";
import formattedDate from "../../shared/utils/formattedDate";
import MemberModal from "../components/MemberModal";
import MemberViewModal from "../components/MemberViewModal";
import CheckInModal from "../../attendance/components/CheckInModal";
import DataTable from "../../shared/components/DataTable";
import SearchFilter from "../../shared/components/SearchFilter";
import useFilter from "../../shared/hooks/useFilter";
import Button from "../../shared/components/Button";
import StatsCard from "../../shared/components/StatsCard";

import { useNavigate } from "react-router-dom";
import SectionTitle from "../../shared/components/SectionTitle";

const Member = () => {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const searchInputRef = useRef(null);

  React.useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const { data: response, isLoading } = useGetMembersQuery();
  const members = Array.isArray(response)
    ? response
    : response?.data || response?.members || [];
  const [addMember, { isLoading: isAdding }] = useAddMemberMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
  const [deleteMember] = useDeleteMemberMutation();
  const [addAttendance, { isLoading: isCheckingIn }] =
    useAddAttendanceMutation();
  const [addSubscribe, { isLoading: isSubscribing }] =
    useAddSubscribeMutation();
  const [updateSubscribe] = useUpdateSubscribeMutation();
  const [addPause, { isLoading: isPausing }] = useAddPauseMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);

  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [checkingInMember, setCheckingInMember] = useState(null);
  const [pausingMember, setPausingMember] = useState(null);
  const [renewingMember, setRenewingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleOpenPause = (member) => {
    setPausingMember(member);
    setIsPauseModalOpen(true);
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

  const handleClosePauseModal = () => {
    setIsPauseModalOpen(false);
    setPausingMember(null);
  };

  const handleOpenRenew = (member) => {
    setRenewingMember(member);
    setIsRenewModalOpen(true);
  };

  const handleCloseRenewModal = () => {
    setIsRenewModalOpen(false);
    setRenewingMember(null);
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
              memberId: editingMember.id,
            }).unwrap();
          } else {
            await addSubscribe({
              memberId: editingMember.id,
              plansId,
              startDate,
              endDate,
            }).unwrap();
          }
        }
        toast.success(t("update_success") || "Member and subscription updated");
      } else {
        const res = await addMember(memberData).unwrap();
        const memberId = res.data?.id;

        // Automatically enroll in subscription if a plan was selected
        if (plansId && memberId) {
          await addSubscribe({
            memberId,
            plansId,
            startDate,
            endDate,
          }).unwrap();
          toast.success(
            t("member_subscribed_success") || "Member added and subscribed!",
          );
        } else {
          toast.success(t("add_success") || "Member added successfully");
        }
      }
      handleCloseModal();
    } catch (err) {
      toast.error(
        err.data?.message || t("operation_failed") || "Operation failed",
      );
    }
  };

  const handleCheckInSubmit = async (data) => {
    try {
      await addAttendance({ id: checkingInMember.id }).unwrap();
      toast.success(t("check_in_success") || "Attendance recorded");
      handleCloseCheckInModal();
    } catch (err) {
      toast.error(err.data?.message || "Check-in failed");
    }
  };

  const handlePauseSubmit = async (data) => {
    try {
      await addPause(data).unwrap();
      toast.success(t("freeze_success") || "Subscription frozen successfully");
      handleClosePauseModal();
    } catch (err) {
      toast.error(
        err.data?.message || t("operation_failed") || "Operation failed",
      );
    }
  };

  const handleRenewSubmit = async (data) => {
    try {
      const { plansId, startDate, endDate } = data;
      await addSubscribe({
        memberId: renewingMember.id,
        plansId,
        startDate,
        endDate,
      }).unwrap();
      toast.success(t("renew_success") || "Subscription renewed successfully");
      handleCloseRenewModal();
    } catch (err) {
      toast.error(
        err.data?.message || t("operation_failed") || "Operation failed",
      );
    }
  };
  const handleSearchKeyDown = async (e) => {
    const val = e.target.value;
    if (e.key === "Enter" && val.trim()) {
      const search = val.trim().toLowerCase();
      const targetMember = members.find((m) => {
        const idStr = `MB-${m.id?.toString().padStart(3, "0")}`.toLowerCase();
        const idPlain = m.id?.toString();
        const qrCode = m.qr_code?.toString().toLowerCase();
        const idNumber = m.id_number?.toString().toLowerCase();
        return (
          idStr === search ||
          idPlain === search ||
          qrCode === search ||
          idNumber === search
        );
      });

      if (targetMember) {
        try {
          await addAttendance({ id: targetMember.id }).unwrap();
          toast.success(
            `${t("check_in_success") || "Check-in successful"}: ${targetMember.user?.full_name}`,
            {
              icon: "🚀",
              duration: 4000,
            },
          );

          // Clear the search input after successful check-in
          if (searchInputRef.current) {
            searchInputRef.current.clear();
          }
        } catch (err) {
          toast.error(err.data?.message || "Check-in failed");
        }
      } else {
        // Optionally clear if not found to allow re-scan
        if (searchInputRef.current) {
          searchInputRef.current.clear();
        }
      }
    }
  };

  const filteredMembers = useFilter(members, searchTerm, [
    "user.full_name",
    "qr_code",
  ]);

  const handleDelete = async (id) => {
    if (
      window.confirm(t("confirm_delete") || "Are you sure you want to delete?")
    ) {
      try {
        await deleteMember({ id }).unwrap();
        toast.success(t("delete_success") || "Member deleted successfully");
      } catch (err) {
        toast.error(err.data?.message || t("delete_failed") || "Delete failed");
      }
    }
  };

  const columns = [
    {
      header: "member_details",
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
            <p
              onClick={() => navigate(`/members/profile/${member.id}`)}
              className="text-gray-900 dark:text-white font-black hover:text-orange cursor-pointer transition-colors"
            >
              {member?.user?.full_name}
            </p>
            <p className="text-gray-500 dark:text-gray-600 font-bold">
              ID: MB-{member?.id?.toString().padStart(3, "0")}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "status",
      render: (member) => (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black border ${
            member?.subscription?.status === "active"
              ? "bg-blue/10 border-blue/20 text-blue"
              : member?.subscription?.status === "freezed"
                ? "bg-orange/10 border-orange/20 text-orange"
                : "bg-gray-500/10 border-gray-500/20 text-gray-500"
          }`}
        >
          <div
            className={`w-1 h-1 rounded-full ${member?.subscription?.status === "freezed" ? "bg-orange animate-pulse" : member?.subscription?.status === "active" ? "bg-blue animate-pulse" : "bg-gray-500"}`}
          />
          {member?.subscription?.status === "freezed"
            ? t("frozen")
            : member?.subscription?.status === "active"
              ? t("active")
              : t("inactive")}
        </span>
      ),
    },
    {
      header: "start_date",
      render: (member) => (
        <div className="space-y-1">
          {member?.subscription && (
            <p className="">
              {formattedDate(member.subscription.start_date)}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "end_date",
      render: (member) => (
        <div className="space-y-1">
          {member?.subscription && (
            <p className="">
              {formattedDate(member.subscription.end_date)}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "qr_code",
      key: "qr_code",
    },
    {
      header: "id_number",
      key: "id_number",
    },
  ];

  const stats = [
    {
      label: t("total_members") || "Total Members",
      value: members?.length || 0,
      icon: <Dumbbell className="text-orange" />,
      color: "orange",
    },
    {
      label: t("active_members") || "Active Members",
      value:
        members?.filter((m) => m.subscription?.status === "active").length || 0,
      icon: <Activity className="text-blue" />,
      color: "blue",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <SectionTitle title={t("members")} description={t("manage_members_desc")} t={t}/>

        <div className="flex gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-6 min-w-[200px] flex flex-col justify-between h-32 relative overflow-hidden group"
            >
              <StatsCard stat={stat} />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchFilter
          ref={searchInputRef}
          onSearch={setSearchTerm}
          onKeyDown={handleSearchKeyDown}
          placeholder={
            t("search_members_placeholder") || "Scan QR or search by name..."
          }
          autoFocus
        />

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            onClick={handleOpenAdd}
            className="btn-orange h-14 px-8 shadow-[0_0_30px_rgba(255,95,31,0.1)] !w-auto"
            title={t("add_new")}
            icon={<Plus size={18} />}
          />
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
        onFreeze={handleOpenPause}
        onRenew={handleOpenRenew}
        title={t("members")}
      />

      {/* Member Modal */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitMember}
        initialData={editingMember}
        isLoading={isAdding || isUpdating || isSubscribing}
        title={editingMember ? "update_member" : "add_member"}
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

      {/* Pause Subscription Modal */}
      <PauseSubscriptionModal
        isOpen={isPauseModalOpen}
        onClose={handleClosePauseModal}
        member={pausingMember}
        onSubmit={handlePauseSubmit}
        isLoading={isPausing}
      />

      {/* Renew Subscription Modal */}
      <RenewSubscriptionModal
        isOpen={isRenewModalOpen}
        onClose={handleCloseRenewModal}
        member={renewingMember}
        onSubmit={handleRenewSubmit}
        isLoading={isSubscribing}
      />
    </div>
  );
};

export default Member;
