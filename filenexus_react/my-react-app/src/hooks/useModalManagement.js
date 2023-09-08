import { useState } from 'react';

const useModalManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsShareModalOpen(false);
  };

  return {
    isModalOpen,
    isShareModalOpen,
    openModal,
    closeModal,
    handleShareClick,
    handleCloseModal,
  };
};

export default useModalManagement;
