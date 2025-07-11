import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import AddEvent from '../pages/AddEvent';
import Recommendations from '../pages/Recommendations';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-event" element={<AddEvent />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;