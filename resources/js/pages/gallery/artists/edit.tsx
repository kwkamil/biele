import Navbar from '@/components/Navbar';
import ImageUpload from '@/components/ImageUpload';
import { Head, Link, useForm } from '@inertiajs/react';

interface Artist {
    id: number;
    name: string;
    bio: string | null;
    nationality: string | null;
    birth_year: number | null;
    death_year: number | null;
    photo_url: string | null;
}

interface EditProps {
    artist: Artist;
}

export default function Edit({ artist }: EditProps) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        bio: string;
        nationality: string;
        birth_year: string;
        death_year: string;
        photo_url: File | null;
        _method: string;
    }>({
        name: artist.name || '',
        bio: artist.bio || '',
        nationality: artist.nationality || '',
        birth_year: artist.birth_year ? String(artist.birth_year) : '',
        death_year: artist.death_year ? String(artist.death_year) : '',
        photo_url: null,
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/gallery/artists/${artist.id}`, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title={`Edit ${artist.name}`} />

            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="mb-6">
                        <Link
                            href="/gallery/artists"
                            className="text-purple-600 hover:text-purple-800 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Artists
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Artist</h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Update artist profile
                            </p>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nationality
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nationality}
                                            onChange={(e) => setData('nationality', e.target.value)}
                                            placeholder="e.g., Polish"
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        {errors.nationality && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Birth Year
                                        </label>
                                        <input
                                            type="number"
                                            value={data.birth_year}
                                            onChange={(e) => setData('birth_year', e.target.value)}
                                            min="1000"
                                            max={new Date().getFullYear()}
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        {errors.birth_year && (
                                            <p className="mt-1 text-sm text-red-600">{errors.birth_year}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Death Year (if applicable)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.death_year}
                                            onChange={(e) => setData('death_year', e.target.value)}
                                            min="1000"
                                            max={new Date().getFullYear()}
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        {errors.death_year && (
                                            <p className="mt-1 text-sm text-red-600">{errors.death_year}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Biography
                                    </label>
                                    <textarea
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        rows={6}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    {errors.bio && (
                                        <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                                    )}
                                </div>

                                {artist.photo_url && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Photo
                                        </label>
                                        <img
                                            src={`/storage/${artist.photo_url}`}
                                            alt={artist.name}
                                            className="h-32 w-32 rounded-full object-cover"
                                        />
                                    </div>
                                )}

                                <ImageUpload
                                    label="Replace Photo (optional)"
                                    name="photo_url"
                                    onChange={(file) => setData('photo_url', file)}
                                    error={errors.photo_url}
                                />

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Updating...' : 'Update Artist'}
                                    </button>
                                    <Link
                                        href="/gallery/artists"
                                        className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
