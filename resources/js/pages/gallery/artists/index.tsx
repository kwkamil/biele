import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/components/Navbar';

interface Artist {
    id: number;
    name: string;
    bio: string | null;
    nationality: string | null;
    birth_year: number | null;
    death_year: number | null;
    photo_url: string | null;
    artworks_count: number;
}

interface PaginatedArtists {
    data: Artist[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface ArtistsProps {
    artists: PaginatedArtists;
}

export default function Index({ artists }: ArtistsProps) {
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            router.delete(`/gallery/artists/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Manage Artists" />

            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Manage Artists</h1>
                            <p className="mt-2 text-gray-600">View and manage artist profiles</p>
                        </div>
                        <Link
                            href="/gallery/artists/create"
                            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 font-medium"
                        >
                            Add New Artist
                        </Link>
                    </div>

                    {artists.data.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Artists Yet</h2>
                                <p className="text-gray-600 mb-6">
                                    Start by adding your first artist profile.
                                </p>
                                <Link
                                    href="/gallery/artists/create"
                                    className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 font-medium"
                                >
                                    Add Your First Artist
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Artist
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Artworks
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {artists.data.map((artist) => (
                                            <tr key={artist.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        {artist.photo_url ? (
                                                            <img
                                                                src={`/storage/${artist.photo_url}`}
                                                                alt={artist.name}
                                                                className="h-12 w-12 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{artist.name}</div>
                                                            {artist.nationality && (
                                                                <div className="text-sm text-gray-500">{artist.nationality}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {artist.birth_year && (
                                                            <div>
                                                                {artist.birth_year}
                                                                {artist.death_year && ` - ${artist.death_year}`}
                                                            </div>
                                                        )}
                                                        {artist.bio && (
                                                            <div className="text-gray-500 truncate max-w-xs">
                                                                {artist.bio.substring(0, 60)}
                                                                {artist.bio.length > 60 && '...'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {artist.artworks_count} artwork{artist.artworks_count !== 1 ? 's' : ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={`/gallery/artists/${artist.id}/edit`}
                                                        className="text-purple-600 hover:text-purple-900 mr-4"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(artist.id, artist.name)}
                                                        className="text-red-600 hover:text-red-900"
                                                        disabled={artist.artworks_count > 0}
                                                        title={artist.artworks_count > 0 ? 'Cannot delete artist with artworks' : ''}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {artists.last_page > 1 && (
                                <div className="mt-6 flex justify-center gap-2">
                                    {Array.from({ length: artists.last_page }, (_, i) => i + 1).map((page) => (
                                        <Link
                                            key={page}
                                            href={`/gallery/artists?page=${page}`}
                                            className={`px-4 py-2 rounded-md ${
                                                page === artists.current_page
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
