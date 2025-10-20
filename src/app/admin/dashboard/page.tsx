import EnhancedAdminDashboard from '@/components/EnhancedAdminDashboard';

export const metadata = {
  title: 'Admin Dashboard - Godatin Hotel',
  description: 'Admin dashboard for managing hotel bookings and operations.',
};

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <EnhancedAdminDashboard />
    </div>
  );
}
