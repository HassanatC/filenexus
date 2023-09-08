import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {createRoot} from 'react-dom/client';
import HomePageContent from './HomePageContent.jsx';
import RegisterPage from './Login/RegisterPage.jsx';
import LoginPage from './Login/LoginPage.jsx';
import Nav from './Nav.jsx';
import AboutPage from './AboutPage.jsx';
import DashboardPage from './Dashboard/DashboardPage.jsx';
import {UserProvider} from './UserContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import FolderPage from './Dashboard/FolderPage.jsx';
import SettingsPage from './Dashboard/SettingsPage.jsx';
import ActivationPage from './Login/ActivationPage.jsx';
import ChangePassword from './Login/ChangePassword.jsx';
import ForgotPassword from './Login/ForgotPassword.jsx';
import FolderContents from './Folders/FolderContents.jsx';


const rootElement = document.getElementById('root');


createRoot(rootElement).render(
  <UserProvider>
    <Router>
      <React.StrictMode>
        <Nav />
        <Routes>
          <Route path="/" element={<HomePageContent />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/folders" element={<ProtectedRoute><FolderPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/folders/:folderId" element={<ProtectedRoute><FolderContents /></ProtectedRoute>} />

          <Route path="/activate/:uidb64/:token" element={<ActivationPage />} />
          <Route path="/change-password/confirm/:uidb64/:token" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

        </Routes>
      </React.StrictMode>
    </Router>
  </UserProvider>
);