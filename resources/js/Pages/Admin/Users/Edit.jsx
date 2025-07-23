import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/users"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit User: {user.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Edit User: ${user.name}`} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                {/* Role Field */}
                                <div>
                                    <InputLabel htmlFor="role" value="Role" />
                                    <select
                                        id="role"
                                        name="role"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <InputError message={errors.role} className="mt-2" />
                                </div>

                                {/* User Info */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">User Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">User ID:</span>
                                            <span className="ml-2 font-mono">{user.id}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Joined:</span>
                                            <span className="ml-2">{new Date(user.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Email Verified:</span>
                                            <span className="ml-2">
                                                {user.email_verified_at ? (
                                                    <span className="text-green-600">✓ Yes</span>
                                                ) : (
                                                    <span className="text-red-600">✗ No</span>
                                                )}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Last Updated:</span>
                                            <span className="ml-2">{new Date(user.updated_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Password Section */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Change Password (Optional)
                                    </h3>
                                    <div className="space-y-4">
                                        {/* New Password Field */}
                                        <div>
                                            <InputLabel htmlFor="password" value="New Password" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                            />
                                            <InputError message={errors.password} className="mt-2" />
                                            <p className="mt-1 text-sm text-gray-500">
                                                Leave blank to keep current password
                                            </p>
                                        </div>

                                        {/* Password Confirmation Field */}
                                        <div>
                                            <InputLabel htmlFor="password_confirmation" value="Confirm New Password" />
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                            />
                                            <InputError message={errors.password_confirmation} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex items-center justify-between pt-6 border-t">
                                    <div className="flex gap-4">
                                        <Link href="/admin/users">
                                            <SecondaryButton type="button">
                                                Cancel
                                            </SecondaryButton>
                                        </Link>
                                        
                                        <PrimaryButton disabled={processing}>
                                            {processing ? 'Updating...' : 'Update User'}
                                        </PrimaryButton>
                                    </div>

                                    <Link
                                        href={`/admin/users/${user.id}`}
                                        className="text-blue-600 hover:text-blue-900 text-sm"
                                    >
                                        View User Details
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Warning Card */}
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-yellow-800 mb-2">
                            ⚠️ Important Notes
                        </h3>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Changing the role will affect user permissions immediately</li>
                            <li>• Admin users have full access to the admin panel</li>
                            <li>• Password changes will require the user to log in again</li>
                            <li>• Email changes may require re-verification</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
