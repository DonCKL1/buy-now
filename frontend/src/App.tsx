import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { getConfig } from './services/api';

const StoreLayout: React.FC<{
  className: string;
  classYear: string;
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
}> = ({ className, classYear, isModalOpen, onOpenModal, onCloseModal }) => (
  <>
    <Header
      className={className}
      classYear={classYear}
      onOpenOrderModal={onOpenModal}
    />
    <Home
      isModalOpen={isModalOpen}
      onOpenModal={onOpenModal}
      onCloseModal={onCloseModal}
    />
  </>
);

const App: React.FC = () => {
  const [className, setClassName] = useState('CKL TECH');
  const [classYear, setClassYear] = useState('2026');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getConfig()
      .then((cfg) => {
        setClassName(cfg.tshirt.className);
        setClassYear(cfg.tshirt.classYear);
      })
      .catch(() => {
        // Fallback
      });
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <StoreLayout
              className={className}
              classYear={classYear}
              isModalOpen={isModalOpen}
              onOpenModal={handleOpenModal}
              onCloseModal={handleCloseModal}
            />
          }
        />
        <Route
          path="/payment/verify"
          element={
            <StoreLayout
              className={className}
              classYear={classYear}
              isModalOpen={isModalOpen}
              onOpenModal={handleOpenModal}
              onCloseModal={handleCloseModal}
            />
          }
        />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
