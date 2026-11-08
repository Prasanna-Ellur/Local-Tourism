import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Compass,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  Sparkles,
  Trash2,
  Loader2,
  RefreshCw,
  Search,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { User, Booking } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { formatCurrency, formatDate } from '../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'BOOKINGS'>('OVERVIEW');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, bookingsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getUsers({ role: userRoleFilter || undefined, limit: 30 }),
        adminService.getAllBookings({ status: bookingStatusFilter || undefined, limit: 30 }),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (bookingsRes.success) setBookings(bookingsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [userRoleFilter, bookingStatusFilter]);

  const handleApproveProvider = async (userId: string, approved: boolean) => {
    try {
      const res = await adminService.approveProvider(userId, approved);
      if (res.success) {
        await fetchAdminData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update provider status');
    }
  };

  if (loading && !stats) {
    return <LoadingSpinner message="Securing admin telemetry..." fullPage />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-stone-900 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Shield size={16} />
            <span>Administrator Control Hub</span>
          </div>
          <h1 className="text-3xl font-bold font-serif mt-1">Platform Operations & Analytics</h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Oversee regional host verification, tourist reservations, and platform financial health.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition self-start md:self-auto"
        >
          <RefreshCw size={14} />
          Sync Live Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-stone-200/80 w-fit">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'OVERVIEW' ? 'bg-forest text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'USERS' ? 'bg-forest text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Users & Provider Verification
        </button>
        <button
          onClick={() => setActiveTab('BOOKINGS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'BOOKINGS' ? 'bg-forest text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          All Reservations
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'OVERVIEW' && stats && (
        <div className="space-y-8">
          {/* Main Stat Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Users</span>
              <p className="text-3xl font-bold font-serif text-stone-900">{stats.counts.users}</p>
              <p className="text-[11px] text-stone-500">
                {stats.counts.tourists} Tourists • {stats.counts.providers} Providers
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending Provider Approvals</span>
              <p className="text-3xl font-bold font-serif text-amber-700">{stats.counts.pendingProviders}</p>
              <p className="text-[11px] text-stone-500">Requires background verification</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Total Bookings</span>
              <p className="text-3xl font-bold font-serif text-emerald-700">{stats.counts.bookings}</p>
              <p className="text-[11px] text-stone-500">{stats.counts.confirmedBookings} Confirmed & Paid</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forest">Platform GMV</span>
              <p className="text-3xl font-bold font-serif text-forest">{formatCurrency(stats.revenue.totalRevenue)}</p>
              <p className="text-[11px] text-stone-500">Platform Fees (5%): {formatCurrency(stats.revenue.platformFee)}</p>
            </div>
          </div>

          {/* Regional Listings Inventory */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900">Regional Listing Inventory</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-2xl font-bold text-forest">{stats.counts.destinations}</span>
                <p className="text-xs text-stone-500 mt-1">Destinations</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-2xl font-bold text-forest">{stats.counts.homestays}</span>
                <p className="text-xs text-stone-500 mt-1">Homestays</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-2xl font-bold text-forest">{stats.counts.guides}</span>
                <p className="text-xs text-stone-500 mt-1">Tour Guides</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-2xl font-bold text-forest">{stats.counts.experiences}</span>
                <p className="text-xs text-stone-500 mt-1">Cultural Activities</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-2xl font-bold text-forest">{stats.counts.businesses}</span>
                <p className="text-xs text-stone-500 mt-1">Local Shops</p>
              </div>
            </div>
          </div>

          {/* Recent Registrations & Recent Bookings preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900">Recent User Registrations</h3>
              <div className="space-y-3">
                {stats.recentUsers?.map((u: any) => (
                  <div key={u.id} className="flex items-center justify-between text-xs p-2.5 bg-stone-50 rounded-xl">
                    <div>
                      <p className="font-bold text-stone-800">{u.name}</p>
                      <p className="text-stone-400 text-[11px]">{u.email}</p>
                    </div>
                    <Badge status={u.role} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900">Recent Platform Bookings</h3>
              <div className="space-y-3">
                {stats.recentBookings?.map((b: any) => (
                  <div key={b.id} className="flex items-center justify-between text-xs p-2.5 bg-stone-50 rounded-xl">
                    <div>
                      <p className="font-bold text-stone-800">{b.bookingReference}</p>
                      <p className="text-stone-400 text-[11px]">{b.user?.name} • {formatCurrency(b.totalPrice)}</p>
                    </div>
                    <Badge status={b.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USERS MANAGEMENT TAB */}
      {activeTab === 'USERS' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold font-serif text-stone-900">Registered Accounts</h2>
            <div className="flex items-center gap-2">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-stone-200 rounded-xl bg-stone-50 font-semibold"
              >
                <option value="">All Roles</option>
                <option value="TOURIST">Tourists</option>
                <option value="SERVICE_PROVIDER">Service Providers</option>
                <option value="ADMIN">Administrators</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 uppercase text-[10px] font-bold tracking-wider text-stone-400 border-b border-stone-100">
                <tr>
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Verification</th>
                  <th className="py-3 px-6">Listings</th>
                  <th className="py-3 px-6 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/70">
                    <td className="py-4 px-6">
                      <p className="font-bold text-stone-900">{u.name}</p>
                      <p className="text-stone-400 text-[11px]">{u.email} • {u.phone || 'No phone'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <Badge status={u.role} />
                    </td>
                    <td className="py-4 px-6">
                      {u.role === 'SERVICE_PROVIDER' ? (
                        u.isApproved ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={14} /> Approved
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold flex items-center gap-1">
                            Pending Review
                          </span>
                        )
                      ) : (
                        <span className="text-stone-400">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {u.role === 'SERVICE_PROVIDER' ? (
                        <span>
                          {(u as any)._count?.homestays || 0} homestays • {(u as any)._count?.tourGuides || 0} guides
                        </span>
                      ) : (
                        <span>{(u as any)._count?.bookings || 0} trips</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {u.role === 'SERVICE_PROVIDER' && (
                        <button
                          onClick={() => handleApproveProvider(u.id, !u.isApproved)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
                            u.isApproved
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {u.isApproved ? 'Revoke Approval' : 'Approve Provider'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ALL BOOKINGS TAB */}
      {activeTab === 'BOOKINGS' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold font-serif text-stone-900">All Reservations on Platform</h2>
            <div className="flex items-center gap-2">
              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-stone-200 rounded-xl bg-stone-50 font-semibold"
              >
                <option value="">All Statuses</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PENDING">PENDING</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 uppercase text-[10px] font-bold tracking-wider text-stone-400 border-b border-stone-100">
                <tr>
                  <th className="py-3 px-6">Reference</th>
                  <th className="py-3 px-6">Tourist</th>
                  <th className="py-3 px-6">Service</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50/70">
                    <td className="py-4 px-6 font-mono font-bold text-forest">
                      {b.bookingReference}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-stone-900">{b.contactName}</p>
                      <p className="text-[11px] text-stone-400">{b.contactEmail}</p>
                    </td>
                    <td className="py-4 px-6">
                      {b.homestay?.name || b.tourGuide?.name || b.culturalExperience?.title}
                    </td>
                    <td className="py-4 px-6 font-bold text-stone-900">
                      {formatCurrency(b.totalPrice)}
                    </td>
                    <td className="py-4 px-6">
                      <Badge status={b.status} />
                    </td>
                    <td className="py-4 px-6">
                      <Badge status={b.paymentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
