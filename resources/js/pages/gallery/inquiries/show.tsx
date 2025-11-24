import { Head, Link } from '@inertiajs/react';
import Navbar from '@/components/Navbar';

interface Artwork {
    id: number;
    title: string;
    artist: {
        id: number;
        name: string;
    };
    gallery: {
        id: number;
        name: string;
    };
    price: number | null;
    image_url: string | null;
    year: number | null;
}

interface Inquiry {
    id: number;
    name: string;
    email: string;
    company: string | null;
    artwork_ids: number[];
    status: string;
    created_at: string;
    verified_at: string | null;
}

interface ShowProps {
    inquiry: Inquiry;
    artworks: Artwork[];
}

export default function Show({ inquiry, artworks }: ShowProps) {
    return (
        <>
            <Head title={`Inquiry from ${inquiry.name}`} />

            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="mb-6">
                        <Link
                            href="/gallery/inquiries"
                            className="text-green-600 hover:text-green-800 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Inquiries
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                                    <p className="text-lg text-gray-900">{inquiry.name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                    <a
                                        href={`mailto:${inquiry.email}`}
                                        className="text-lg text-blue-600 hover:text-blue-800"
                                    >
                                        {inquiry.email}
                                    </a>
                                </div>

                                {inquiry.company && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Company</label>
                                        <p className="text-lg text-gray-900">{inquiry.company}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        Verified
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Submitted At</label>
                                    <p className="text-gray-900">{new Date(inquiry.created_at).toLocaleString()}</p>
                                </div>

                                {inquiry.verified_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Verified At</label>
                                        <p className="text-gray-900">{new Date(inquiry.verified_at).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-600 mb-4">
                                    Contact this customer to discuss their interest in the artworks listed.
                                </p>
                                <a
                                    href={`mailto:${inquiry.email}?subject=Re: Inquiry about artwork`}
                                    className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
                                >
                                    Send Email
                                </a>
                            </div>
                        </div>

                        {/* Artworks */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Interested Artworks ({artworks.length})
                            </h2>

                            <div className="space-y-4">
                                {artworks.map((artwork) => (
                                    <div key={artwork.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        {artwork.image_url ? (
                                            <img
                                                src={`/storage/${artwork.image_url}`}
                                                alt={artwork.title}
                                                className="h-24 w-24 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="h-24 w-24 bg-gray-200 rounded flex items-center justify-center">
                                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{artwork.title}</h3>
                                            <p className="text-sm text-gray-600">by {artwork.artist.name}</p>
                                            {artwork.year && (
                                                <p className="text-sm text-gray-500">{artwork.year}</p>
                                            )}
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                {artwork.price ? `$${artwork.price.toLocaleString()}` : 'Price on request'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">{artwork.gallery.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
