import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import RoomsPage from './pages/RoomsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanelPage from './pages/AdminPanelPage';
import ServicesManagementPage from './pages/ServicesManagementPage';
import RoomsManagementPage from './pages/RoomsManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import BookingManagementPage from './pages/BookingManagementPage';
import FeedbackManagementPage from './pages/FeedbackManagementPage';
import AdminStatistics from './pages/AdminStatistics';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RoomDetailPage from './pages/RoomDetailPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import ServicesSelectionPage from './pages/ServicesSelectionPage';
import SupportPage from './pages/SupportPage';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/rooms/:id" element={<RoomDetailPage />} />
                <Route path="/support" element={<SupportPage />} />

                <Route path="/booking/:roomId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
                <Route path="/services-selection" element={<ProtectedRoute><ServicesSelectionPage /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                <Route path="/admin" element={<ProtectedRoute requiredRole="ROLE_ADMIN"><AdminPanelPage /></ProtectedRoute>} />
                <Route path="/admin/services" element={<ProtectedRoute requiredRole="ROLE_ADMIN"><ServicesManagementPage /></ProtectedRoute>} />
                <Route path="/admin/rooms" element={<ProtectedRoute requiredRole="ROLE_ADMIN"><RoomsManagementPage /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute requiredRole="ROLE_ADMIN"><UserManagementPage /></ProtectedRoute>} />
                <Route path="/admin/bookings" element={<ProtectedRoute requiredRole="ROLE_ADMIN"><BookingManagementPage /></ProtectedRoute>} />
                <Route path="/admin/feedback" element={<ProtectedRoute requiredRole="ROLE_ADMIN"><FeedbackManagementPage /></ProtectedRoute>} />
                <Route path="/admin/statistics" element={<ProtectedRoute requiredRole="ROLE_ADMIN"><AdminStatistics /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;