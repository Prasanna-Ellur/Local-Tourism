import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  Calendar,
  Home,
  Users,
  Sparkles,
  ShoppingBag,
  User,
  LogOut,
  Shield,
  Layers,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Badge } from '../components/common/Badge';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavLinks = () => {
    if (user?.role === 'ADMIN') {
      return [
        { name: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'User Management', path: '/admin/dashboard#users', icon: Users },
        { name: 'All Bookings', path: '/admin/dashboard#bookings', icon: Calendar },
        { name: 'Destinations', path: '/destinations', icon: Compass },
      ];
    }
    if (user?.role === 'SERVICE_PROVIDER') {
      return [
        { name: 'Provider Overview', path: '/provider/dashboard', icon: LayoutDashboard },
        { name: 'Reservations & Guests', path: '/provider/dashboard#bookings', icon: Calendar },
        { name: 'My Homestays', path: '/homestays', icon: Home },
        { name: 'Cultural Experiences', path: '/experiences', icon: Sparkles },
      ];
    }
    return [
      { name: 'Tourist Dashboard', path: '/tourist/dashboard', icon: LayoutDashboard },
      { name: 'My Bookings', path: '/bookings/my', icon: Calendar },
      { name: 'Explore Destinations', path: '/destinations', icon: Compass },
      { name: 'Browse Homestays', path: '/homestays', icon: Home },
    ];
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f7f4ee]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-stone-200/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center text-white">
                <Compass className="w-5 h-5 text-cream-100" />
              </div>
              <span className="font-serif font-bold text-lg text-forest">
                Explore<span className="text-earth-600">Local</span>
              </span>
            </Link>
          </div>

          {/* User profile brief */}
          <div className="p-4 mx-4 my-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-3">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-stone-900 truncate">{user?.name}</p>
              <Badge status={user?.role || 'TOURIST'} className="scale-75 origin-left -ml-1 mt-0.5" />
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1">
            {getNavLinks().map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-forest text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`
                  }
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-forest text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`
              }
            >
              <User size={16} />
              <span>Profile Settings</span>
            </NavLink>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-stone-100 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-50 transition"
          >
            <ChevronLeft size={16} />
            Back to Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
