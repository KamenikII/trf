import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AdminDashboardLayout } from "../components/admin/AdminDashboardLayout";
import { AdminDashboardMain } from "../components/admin/AdminDashboardMain";
import { AdminUsersPage } from "../components/admin/AdminUsersPage";
import { AdminInternshipsPage } from "../components/admin/AdminInternshipsPage";
import { AdminCompaniesPage } from "../components/admin/AdminCompaniesPage";
import { AdminReportsPage } from "../components/admin/AdminReportsPage";
import { AdminSettingsPage } from "../components/admin/AdminSettingsPage";



export const AdminPage = () => {
    const { currentUser } = useAuth();

    if (currentUser?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return (
        <AdminDashboardLayout>
            <Routes>
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardMain />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="internships" element={<AdminInternshipsPage />} />
                <Route path="companies" element={<AdminCompaniesPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
            </Routes>
        </AdminDashboardLayout>
    );
};
