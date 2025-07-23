import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '@fontsource/noto-sans-thai';
import {
  UserIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { 
  UserIcon as UserIconSolid, 
  ShieldExclamationIcon,
  CheckBadgeIcon 
} from '@heroicons/react/24/solid';

// Custom Hook for debounced search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Loading Component
const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
);

// User Avatar Component
const UserAvatar = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg`}>
      <UserIconSolid className={`${iconSizes[size]} text-white`} />
    </div>
  );
};

// Role Badge Component
const RoleBadge = ({ role }) => {
  const getRoleConfig = (userRole) => {
    switch (userRole) {
      case 'admin':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-pink-500',
          text: 'text-white',
          icon: ShieldExclamationIcon,
          label: 'Admin'
        };
      case 'customer':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
          text: 'text-white',
          icon: UserIconSolid,
          label: 'Customer'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
          text: 'text-white',
          icon: UserIconSolid,
          label: 'Unknown'
        };
    }
  };

  const config = getRoleConfig(role);
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} shadow-sm`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

// Search Component
const SearchBar = ({ searchTerm, onSearchChange, roleFilter, onRoleChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Users
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="lg:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Role
          </label>
          <select
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// User Card Component (for mobile view)
const UserCard = ({ user, onEdit, onDelete, onToggleRole, processing }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <UserAvatar user={user} size="md" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">ID: {user.id}</p>
          </div>
        </div>
        <RoleBadge role={user.role} />
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <EnvelopeIcon className="h-4 w-4 mr-2" />
          <span>{user.email}</span>
          {user.email_verified_at && (
            <CheckBadgeIcon className="h-4 w-4 ml-2 text-green-500" />
          )}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CalendarDaysIcon className="h-4 w-4 mr-2" />
          <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <Link
          href={`/admin/users/${user.id}`}
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
        >
          View Details
        </Link>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onToggleRole(user)}
            disabled={processing}
            className="p-2 text-gray-400 hover:text-amber-600 transition-colors duration-200"
          >
            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(user)}
            disabled={processing}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main UserManagement Component
export default function UserManagement() {
  const { users, filters } = usePage().props;
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [roleFilter, setRoleFilter] = useState(filters?.role || '');
  const [processing, setProcessing] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    if (debouncedSearchTerm !== (filters?.search || '') || roleFilter !== (filters?.role || '')) {
      router.get('/admin/users', 
        { 
          search: debouncedSearchTerm, 
          role: roleFilter 
        }, 
        {
          preserveState: true,
          preserveScroll: true,
        }
      );
    }
  }, [debouncedSearchTerm, roleFilter]);

  const handleEdit = (user) => {
    router.visit(`/admin/users/${user.id}/edit`);
  };

  const handleDelete = (user) => {
    if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      setProcessing(true);
      router.delete(`/admin/users/${user.id}`, {
        onFinish: () => setProcessing(false),
      });
    }
  };

  const handleToggleRole = (user) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    if (confirm(`Change ${user.name}'s role to ${newRole}?`)) {
      setProcessing(true);
      router.patch(`/admin/users/${user.id}/toggle-role`, {}, {
        onFinish: () => setProcessing(false),
      });
    }
  };

  return (
<AuthenticatedLayout>
      <Head title="User Management - Admin Panel" />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">จัดการผู้ใช้งาน</h1>
              <p className="text-indigo-100">
                จัดการผู้ใช้งาน บทบาท และสิทธิ์ในระบบ
              </p>
            </div>
            <Link
              href="/admin/users/create"
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200"
            >
              <UserPlusIcon className="w-5 h-5 mr-2" />
              เพิ่มผู้ใช้ใหม่
            </Link>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search Bar */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roleFilter={roleFilter}
            onRoleChange={setRoleFilter}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Users</p>
                  <p className="text-3xl font-bold">{users?.total || 0}</p>
                </div>
                <UserIcon className="h-12 w-12 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Admin Users</p>
                  <p className="text-3xl font-bold">
                    {users?.data?.filter(user => user.role === 'admin').length || 0}
                  </p>
                </div>
                <ShieldCheckIcon className="h-12 w-12 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Active Users</p>
                  <p className="text-3xl font-bold">
                    {users?.data?.filter(user => user.email_verified_at).length || 0}
                  </p>
                </div>
                <CheckBadgeIcon className="h-12 w-12 text-green-200" />
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Users ({users?.data?.length || 0})
            </h3>
            <div className="flex rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Bars3Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="grid grid-cols-2 gap-1">
                  <div className="h-2 w-2 bg-current rounded-full"></div>
                  <div className="h-2 w-2 bg-current rounded-full"></div>
                  <div className="h-2 w-2 bg-current rounded-full"></div>
                  <div className="h-2 w-2 bg-current rounded-full"></div>
                </div>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {processing && (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner />
            </div>
          )}

          {/* Users Display */}
          {users?.data?.length > 0 ? (
            <>
              {viewMode === 'table' ? (
                // Table View
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.data.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <UserAvatar user={user} size="md" />
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    {user.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    ID: {user.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-900">
                                <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                                {user.email}
                                {user.email_verified_at && (
                                  <CheckBadgeIcon className="h-4 w-4 ml-2 text-green-500" />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <RoleBadge role={user.role} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <CalendarDaysIcon className="h-4 w-4 mr-2" />
                                {new Date(user.created_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center space-x-3">
                                <Link
                                  href={`/admin/users/${user.id}`}
                                  className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                                >
                                  <EyeIcon className="h-5 w-5" />
                                </Link>
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                                >
                                  <PencilSquareIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleToggleRole(user)}
                                  disabled={processing}
                                  className="text-gray-400 hover:text-amber-600 transition-colors duration-200"
                                  title={`Change role to ${user.role === 'admin' ? 'customer' : 'admin'}`}
                                >
                                  <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(user)}
                                  disabled={processing}
                                  className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.data.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleRole={handleToggleRole}
                      processing={processing}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {users.links && users.links.length > 3 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{users.from}</span> to{' '}
                      <span className="font-medium">{users.to}</span> of{' '}
                      <span className="font-medium">{users.total}</span> results
                    </div>
                    <nav className="flex items-center space-x-1">
                      {users.links.map((link, index) => (
                        <Link
                          key={index}
                          href={link.url || '#'}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            link.active
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      ))}
                    </nav>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Empty State
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16">
              <div className="text-center">
                <UserIcon className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {searchTerm || roleFilter 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Get started by creating a new user.'
                  }
                </p>
                <div className="mt-6">
                  <Link
                    href="/admin/users/create"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <UserPlusIcon className="w-5 h-5 mr-2" />
                    Add First User
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-10">
      </div>
</AuthenticatedLayout>
  );
}
