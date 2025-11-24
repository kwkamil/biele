import AdminLayout from '@/layouts/AdminLayout';
import ImageUpload from '@/components/ImageUpload';
import MultiImageUpload from '@/components/MultiImageUpload';
import { Head, useForm } from '@inertiajs/react';

interface Artist {
    id: number;
    name: string;
}

interface Gallery {
    id: number;
    name: string;
    user_id: number;
}

interface Artwork {
    id: number;
    title: string;
    artist_id: number;
    gallery_id: number;
    category: string | null;
    style: string | null;
    theme: string | null;
    price_min: number | null;
    price_max: number | null;
    medium: string | null;
    dimensions: string | null;
    description: string | null;
    featured_image: string | null;
    additional_images: string[] | null;
    is_approved: boolean;
}

interface EditProps {
    artwork: Artwork;
    artists: Artist[];
    galleries: Gallery[];
}

export default function Edit({ artwork, artists, galleries }: EditProps) {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        artist_id: string;
        gallery_id: string;
        category: string;
        style: string;
        theme: string;
        price_min: string;
        price_max: string;
        medium: string;
        dimensions: string;
        description: string;
        featured_image: File | null;
        additional_images: File[];
        is_approved: boolean;
        _method: string;
    }>({
        title: artwork.title || '',
        artist_id: artwork.artist_id.toString(),
        gallery_id: artwork.gallery_id.toString(),
        category: artwork.category || '',
        style: artwork.style || '',
        theme: artwork.theme || '',
        price_min: artwork.price_min?.toString() || '',
        price_max: artwork.price_max?.toString() || '',
        medium: artwork.medium || '',
        dimensions: artwork.dimensions || '',
        description: artwork.description || '',
        featured_image: null,
        additional_images: [],
        is_approved: artwork.is_approved || false,
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/artworks/${artwork.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${artwork.title} - Admin`} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Artwork</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Update artwork information
                    </p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Artist *
                                </label>
                                <select
                                    value={data.artist_id}
                                    onChange={(e) => setData('artist_id', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Select an artist</option>
                                    {artists.map((artist) => (
                                        <option key={artist.id} value={artist.id}>
                                            {artist.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.artist_id && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.artist_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Gallery *
                                </label>
                                <select
                                    value={data.gallery_id}
                                    onChange={(e) => setData('gallery_id', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Select a gallery</option>
                                    {galleries.map((gallery) => (
                                        <option key={gallery.id} value={gallery.id}>
                                            {gallery.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.gallery_id && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gallery_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Style
                                </label>
                                <input
                                    type="text"
                                    value={data.style}
                                    onChange={(e) => setData('style', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Theme
                                </label>
                                <input
                                    type="text"
                                    value={data.theme}
                                    onChange={(e) => setData('theme', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Price Min (zł)
                                </label>
                                <input
                                    type="number"
                                    value={data.price_min}
                                    onChange={(e) => setData('price_min', e.target.value)}
                                    min="0"
                                    step="0.01"
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Price Max (zł)
                                </label>
                                <input
                                    type="number"
                                    value={data.price_max}
                                    onChange={(e) => setData('price_max', e.target.value)}
                                    min="0"
                                    step="0.01"
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Medium
                                </label>
                                <input
                                    type="text"
                                    value={data.medium}
                                    onChange={(e) => setData('medium', e.target.value)}
                                    placeholder="e.g., Oil on canvas"
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Dimensions
                                </label>
                                <input
                                    type="text"
                                    value={data.dimensions}
                                    onChange={(e) => setData('dimensions', e.target.value)}
                                    placeholder="e.g., 100x80 cm"
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={6}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <ImageUpload
                            label="Featured Image"
                            name="featured_image"
                            value={artwork.featured_image}
                            onChange={(file) => setData('featured_image', file)}
                            error={errors.featured_image}
                        />

                        <MultiImageUpload
                            label="Additional Images"
                            name="additional_images"
                            values={artwork.additional_images || []}
                            onChange={(files) => setData('additional_images', files)}
                            error={errors.additional_images}
                        />

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_approved"
                                checked={data.is_approved}
                                onChange={(e) => setData('is_approved', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <label htmlFor="is_approved" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Approve artwork
                            </label>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Artwork'}
                            </button>
                            <a
                                href="/admin/artworks"
                                className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
