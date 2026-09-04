import React from "react";
import EmployeeViewModal from "../../hr/components/EmployeeViewModal";

const CoachViewModal = ({ isOpen, onClose, coach }) => {
  return (
    <EmployeeViewModal
      isOpen={isOpen}
      onClose={onClose}
      employee={coach}
    />
  );
};

export default CoachViewModal;
