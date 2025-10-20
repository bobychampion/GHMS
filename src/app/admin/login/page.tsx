import AdminLogin from '@/components/AdminLogin';

export const metadata = {
  title: 'Admin Login - Godatin Hotel',
  description: 'Admin login for Godatin Hotel management system.',
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">G</span>
          </div>
          <h2 className="text-3xl font-bold text-navy-900 font-serif">Godatin Hotel</h2>
          <p className="text-gray-600 mt-2">Admin Dashboard</p>
        </div>
        <AdminLogin />
      </div>
    </div>
  );
}

