import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Artist {
    id: number;
    name: string;
    slug: string;
    photo: string | null;
    biography: string | null;
    artworks_count: number;
    created_at: string;
}

interface PaginatedArtists {
    data: Artist[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface IndexProps {
    artists: PaginatedArtists;
    filters: {
        search?: string;
    };
}

export default function Index({ artists, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/artists', { search }, { preserveState: true });
    };

    const handleDelete = (artist: Artist) => {
        if (confirm(`Are you sure you want to delete "${artist.name}"?`)) {
            router.delete(`/admin/artists/${artist.id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Artists - Admin" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Artists</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Manage artists and their profiles
                        </p>
                    </div>
                    <Link
                        href="/admin/artists/create"
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                        Add Artist
                    </Link>
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search artists..."
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                            <button
                                type="submit"
                                className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                            >
                                Search
                            </button>
                            {filters.search && (
                                <Link
                                    href="/admin/artists"
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
                                        Artworks
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
                                {artists.data.map((artist) => (
                                    <tr
                                        key={artist.id}
                                        onClick={() => router.visit(`/admin/artists/${artist.id}/edit`)}
                                        className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 last:border-0 dark:border-gray-700 dark:hover:bg-gray-700/50"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                {artist.photo && (
                                                    <img
                                                        src={`/storage/${artist.photo}`}
                                                        alt={artist.name}
                                                        className="h-12 w-12 rounded-full object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {artist.name}
                                                    </div>
                                                    {artist.biography && (
                                                        <div className="mt-1 max-w-md truncate text-sm text-gray-600 dark:text-gray-400">
                                                            {artist.biography}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {artist.artworks_count}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(artist.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/artists/${artist.id}/edit`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(artist);
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

                    {artists.data.length === 0 && (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            No artists found
                        </div>
                    )}

                    {artists.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {artists.data.length} of {artists.total} results
                            </div>
                            <div className="flex gap-2">
                                {Array.from({ length: artists.last_page }, (_, i) => i + 1).map((page) => (
                                    <Link
                                        key={page}
                                        href={`/admin/artists?page=${page}`}
                                        className={`rounded px-3 py-1 text-sm font-medium ${
                                            page === artists.current_page
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {page}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
