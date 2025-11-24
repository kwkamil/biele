import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/components/Navbar';

interface Artwork {
    id: number;
    title: string;
    artist: {
        id: number;
        name: string;
    };
    price: number | null;
    is_approved: boolean;
    image_url: string | null;
    year: number | null;
    medium: string | null;
    created_at: string;
}

interface PaginatedArtworks {
    data: Artwork[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface ArtworksProps {
    artworks: PaginatedArtworks;
}

export default function Index({ artworks }: ArtworksProps) {
    const handleDelete = (id: number, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            router.delete(`/gallery/artworks/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Manage Artworks" />

            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Manage Artworks</h1>
                            <p className="mt-2 text-gray-600">View and manage your gallery's artwork collection</p>
                        </div>
                        <Link
                            href="/gallery/artworks/create"
                            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
                        >
                            Add New Artwork
                        </Link>
                    </div>

                    {artworks.data.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Artworks Yet</h2>
                                <p className="text-gray-600 mb-6">
                                    Start building your collection by adding your first artwork.
                                </p>
                                <Link
                                    href="/gallery/artworks/create"
                                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
                                >
                                    Add Your First Artwork
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
                                                Artwork
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Artist
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {artworks.data.map((artwork) => (
                                            <tr key={artwork.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        {artwork.image_url ? (
                                                            <img
                                                                src={`/storage/${artwork.image_url}`}
                                                                alt={artwork.title}
                                                                className="h-16 w-16 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{artwork.title}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{artwork.artist.name}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {artwork.year && <div>{artwork.year}</div>}
                                                        {artwork.medium && <div className="text-gray-500">{artwork.medium}</div>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {artwork.price ? `$${artwork.price.toLocaleString()}` : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        artwork.is_approved
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {artwork.is_approved ? 'Approved' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={`/gallery/artworks/${artwork.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(artwork.id, artwork.title)}
                                                        className="text-red-600 hover:text-red-900"
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
                            {artworks.last_page > 1 && (
                                <div className="mt-6 flex justify-center gap-2">
                                    {Array.from({ length: artworks.last_page }, (_, i) => i + 1).map((page) => (
                                        <Link
                                            key={page}
                                            href={`/gallery/artworks?page=${page}`}
                                            className={`px-4 py-2 rounded-md ${
                                                page === artworks.current_page
                                                    ? 'bg-blue-600 text-white'
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
