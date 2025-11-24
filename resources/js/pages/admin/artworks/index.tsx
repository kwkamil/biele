import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Artwork {
    id: number;
    title: string;
    slug: string;
    is_approved: boolean;
    featured_image: string | null;
    artist: {
        id: number;
        name: string;
    };
    gallery: {
        id: number;
        name: string;
    };
    price_min: number | null;
    price_max: number | null;
    created_at: string;
}

interface PaginatedArtworks {
    data: Artwork[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface IndexProps {
    artworks: PaginatedArtworks;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ artworks, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/artworks', { search, status }, { preserveState: true });
    };

    const handleDelete = (artwork: Artwork) => {
        if (confirm(`Are you sure you want to delete "${artwork.title}"?`)) {
            router.delete(`/admin/artworks/${artwork.id}`);
        }
    };

    const handleApprove = (artwork: Artwork) => {
        router.post(`/admin/artworks/${artwork.id}/approve`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Artworks - Admin" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Artworks</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Manage artworks and their approval status
                        </p>
                    </div>
                    <Link
                        href="/admin/artworks/create"
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                        Add Artwork
                    </Link>
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search artworks..."
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
                                    href="/admin/artworks"
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
                                        Artwork
                                    </th>
                                    <th className="px-4 pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Artist
                                    </th>
                                    <th className="px-4 pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Gallery
                                    </th>
                                    <th className="px-4 pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Price Range
                                    </th>
                                    <th className="px-4 pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-4 pb-3 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {artworks.data.map((artwork) => (
                                    <tr
                                        key={artwork.id}
                                        onClick={() => router.visit(`/admin/artworks/${artwork.id}/edit`)}
                                        className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 last:border-0 dark:border-gray-700 dark:hover:bg-gray-700/50"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                {artwork.featured_image && (
                                                    <img
                                                        src={`/storage/${artwork.featured_image}`}
                                                        alt={artwork.title}
                                                        className="h-12 w-12 rounded object-cover"
                                                    />
                                                )}
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {artwork.title}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {artwork.artist.name}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {artwork.gallery.name}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {artwork.price_min && artwork.price_max
                                                ? `${artwork.price_min} - ${artwork.price_max} zł`
                                                : artwork.price_min
                                                ? `from ${artwork.price_min} zł`
                                                : artwork.price_max
                                                ? `up to ${artwork.price_max} zł`
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    artwork.is_approved
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                }`}
                                            >
                                                {artwork.is_approved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {!artwork.is_approved && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleApprove(artwork);
                                                        }}
                                                        className="rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/admin/artworks/${artwork.id}/edit`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(artwork);
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

                    {artworks.data.length === 0 && (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            No artworks found
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
