import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface IndexProps {
    users: PaginatedUsers;
    filters: {
        search?: string;
        role?: string;
    };
}

export default function Index({ users, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', { search, role }, { preserveState: true });
    };

    const handleDelete = (user: User) => {
        if (confirm(`Are you sure you want to delete "${user.name}"?`)) {
            router.delete(`/admin/users/${user.id}`);
        }
    };

    const getRoleBadge = (role: string) => {
        const badges = {
            admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
            gallery: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            client: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        };
        return badges[role as keyof typeof badges] || badges.client;
    };

    return (
        <AdminLayout>
            <Head title="Users - Admin" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Manage user accounts and roles
                        </p>
                    </div>
                    <Link
                        href="/admin/users/create"
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                        Add User
                    </Link>
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search users..."
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="gallery">Gallery</option>
                                <option value="client">Client</option>
                            </select>
                            <button
                                type="submit"
                                className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                            >
                                Search
                            </button>
                            {(filters.search || filters.role) && (
                                <Link
                                    href="/admin/users"
                                    className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Clear
                                </Link>
                            )}
                        </div>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-4 pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Name
                                    </th>
                                    <th className="px-4 pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Email
                                    </th>
                                    <th className="px-4 pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Role
                                    </th>
                                    <th className="px-4 pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Created
                                    </th>
                                    <th className="px-4 pb-3 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        onClick={() => router.visit(`/admin/users/${user.id}/edit`)}
                                        className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 last:border-0 dark:border-gray-700 dark:hover:bg-gray-700/50"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {user.name}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleBadge(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(user);
                                                    }}
                                                    className="rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.data.length === 0 && (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            No users found
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
