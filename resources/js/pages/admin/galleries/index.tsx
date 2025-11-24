import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Gallery {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_approved: boolean;
    status: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    artworks_count: number;
    created_at: string;
}

interface PaginatedGalleries {
    data: Gallery[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface IndexProps {
    galleries: PaginatedGalleries;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ galleries, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/galleries', { search, status }, { preserveState: true });
    };

    const handleDelete = (gallery: Gallery) => {
        if (confirm(`Are you sure you want to delete "${gallery.name}"?`)) {
            router.delete(`/admin/galleries/${gallery.id}`);
        }
    };

    const handleApprove = (gallery: Gallery) => {
        router.post(`/admin/galleries/${gallery.id}/approve`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Galleries - Admin" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Galleries</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Manage galleries and their approval status
                        </p>
                    </div>
                    <Link
                        href="/admin/galleries/create"
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                        Add Gallery
                    </Link>
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search galleries..."
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">All Status</option>
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                            </select>
                            <button
                                type="submit"
                                className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                            >
                                Search
                            </button>
                            {(filters.search || filters.status) && (
                                <Link
                                    href="/admin/galleries"
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
                                        Gallery
                                    </th>
                                    <th className="px-4 pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Owner
                                    </th>
                                    <th className="px-4 pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Artworks
                                    </th>
                                    <th className="px-4 pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Gallery Status
                                    </th>
                                    <th className="px-4 pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Approval
                                    </th>
                                    <th className="px-4 pb-3 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {galleries.data.map((gallery) => (
                                    <tr
                                        key={gallery.id}
                                        onClick={() => router.visit(`/admin/galleries/${gallery.id}/edit`)}
                                        className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 last:border-0 dark:border-gray-700 dark:hover:bg-gray-700/50"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {gallery.name}
                                            </div>
                                            {gallery.description && (
                                                <div className="mt-1 max-w-md truncate text-sm text-gray-600 dark:text-gray-400">
                                                    {gallery.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {gallery.user.name}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {gallery.user.email}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {gallery.artworks_count}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    gallery.status === 'active'
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                                }`}
                                            >
                                                {gallery.status === 'active' ? 'Active' : 'Paused'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    gallery.is_approved
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                }`}
                                            >
                                                {gallery.is_approved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {!gallery.is_approved && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleApprove(gallery);
                                                        }}
                                                        className="rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/admin/galleries/${gallery.id}/edit`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(gallery);
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

                    {galleries.data.length === 0 && (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            No galleries found
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
