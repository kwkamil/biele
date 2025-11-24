import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Inquiry {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    company: string | null;
    status: string;
    email_verified_at: string | null;
    created_at: string;
}

interface PaginatedInquiries {
    data: Inquiry[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface IndexProps {
    inquiries: PaginatedInquiries;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ inquiries, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/inquiries', { search, status }, { preserveState: true });
    };

    const handleDelete = (inquiry: Inquiry) => {
        if (confirm(`Are you sure you want to delete this inquiry from ${inquiry.first_name} ${inquiry.last_name}?`)) {
            router.delete(`/admin/inquiries/${inquiry.id}`);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            pending_verification: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            verified: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            contacted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        };
        return badges[status as keyof typeof badges] || badges.pending_verification;
    };

    return (
        <AdminLayout>
            <Head title="Inquiries - Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inquiries</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        View and manage customer inquiries
                    </p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search inquiries..."
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">All Status</option>
                                <option value="pending_verification">Pending Verification</option>
                                <option value="verified">Verified</option>
                                <option value="contacted">Contacted</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                                type="submit"
                                className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                            >
                                Search
                            </button>
                            {(filters.search || filters.status) && (
                                <Link
                                    href="/admin/inquiries"
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
                                        Customer
                                    </th>
                                    <th className="px-4 pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Company
                                    </th>
                                    <th className="px-4 pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Status
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
                                {inquiries.data.map((inquiry) => (
                                    <tr
                                        key={inquiry.id}
                                        onClick={() => router.visit(`/admin/inquiries/${inquiry.id}`)}
                                        className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 last:border-0 dark:border-gray-700 dark:hover:bg-gray-700/50"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {inquiry.first_name} {inquiry.last_name}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {inquiry.email}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {inquiry.company || '-'}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(inquiry.status)}`}>
                                                {inquiry.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(inquiry.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/inquiries/${inquiry.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/admin/inquiries/${inquiry.id}/edit`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(inquiry);
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

                    {inquiries.data.length === 0 && (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            No inquiries found
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
