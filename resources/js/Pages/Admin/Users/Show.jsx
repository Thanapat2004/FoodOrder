import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    ArrowLeftIcon, 
    PencilIcon, 
    TrashIcon, 
    ArrowPathIcon,
    UserIcon,
    EnvelopeIcon,
    ShieldCheckIcon,
    CalendarIcon,
    ShoppingBagIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function Show({ user }) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
            setProcessing(true);
            router.delete(`/admin/users/${user.id}`, {
                onFinish: () => setProcessing(false),
            });
        }
    };

    const handleToggleRole = () => {
        const newRole = user.role === 'admin' ? 'customer' : 'admin';
        if (confirm(`Change ${user.name}'s role to ${newRole}?`)) {
            setProcessing(true);
            router.patch(`/admin/users/${user.id}/toggle-role`, {}, {
                onFinish: () => setProcessing(false),
            });
        }
    };

    const getRoleBadgeClass = (userRole) => {
        switch (userRole) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'customer':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Calculate total spent and orders count
    const totalOrders = user.orders ? user.orders.length : 0;
    const totalSpent = user.orders ? user.orders.reduce((sum, order) => {
        return sum + (order.order_items ? order.order_items.reduce((itemSum, item) => {
            return itemSum + (item.price * item.quantity);
        }, 0) : 0);
    }, 0) : 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/users"
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            User Details: {user.name}
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Edit
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`User: ${user.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* User Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="text-center">
                                        <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full flex items-center justify-center mb-4">
                                            <UserIcon className="w-12 h-12 text-gray-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                            {user.name}
                                        </h3>
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div className="flex items-center">
                                            <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                                {user.email_verified_at ? (
                                                    <div className="text-xs text-green-600">✓ Verified</div>
                                                ) : (
                                                    <div className="text-xs text-red-600">✗ Not verified</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <ShieldCheckIcon className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <div className="text-sm text-gray-900">ID: {user.id}</div>
                                                <div className="text-xs text-gray-500">User identifier</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <div className="text-sm text-gray-900">{new Date(user.created_at).toLocaleDateString()}</div>
                                                <div className="text-xs text-gray-500">Member since</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t flex gap-2">
                                        <button
                                            onClick={handleToggleRole}
                                            disabled={processing}
                                            className="flex-1 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded text-sm inline-flex items-center justify-center"
                                            title={`Change role to ${user.role === 'admin' ? 'customer' : 'admin'}`}
                                        >
                                            <ArrowPathIcon className="w-4 h-4 mr-2" />
                                            Toggle Role
                                        </button>
                                        
                                        <button
                                            onClick={handleDelete}
                                            disabled={processing}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm inline-flex items-center"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Statistics and Orders */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <ShoppingBagIcon className="w-8 h-8 text-blue-500 mr-3" />
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
                                                <div className="text-sm text-gray-500">Total Orders</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <CurrencyDollarIcon className="w-8 h-8 text-green-500 mr-3" />
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</div>
                                                <div className="text-sm text-gray-500">Total Spent</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Recent Orders ({user.orders ? user.orders.length : 0})
                                    </h3>
                                    
                                    {user.orders && user.orders.length > 0 ? (
                                        <div className="space-y-4">
                                            {user.orders.map((order) => (
                                                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <div className="font-semibold text-gray-900">
                                                                Order #{order.id}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {new Date(order.created_at).toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-semibold text-gray-900">
                                                                ${order.order_items ? order.order_items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2) : '0.00'}
                                                            </div>
                                                            <div className={`text-xs px-2 py-1 rounded-full ${
                                                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                                                                order.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {order.status}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {order.order_items && order.order_items.length > 0 && (
                                                        <div className="space-y-2">
                                                            <div className="text-sm font-medium text-gray-700 mb-1">Items:</div>
                                                            {order.order_items.map((item, index) => (
                                                                <div key={index} className="text-sm text-gray-600 flex justify-between">
                                                                    <span>{item.food ? item.food.name : 'Unknown Item'} × {item.quantity}</span>
                                                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <ShoppingBagIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <div className="text-gray-500">No orders yet</div>
                                            <div className="text-sm text-gray-400">This user hasn't placed any orders</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
