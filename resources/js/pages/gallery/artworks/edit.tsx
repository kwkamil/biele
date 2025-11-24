import Navbar from '@/components/Navbar';
import ImageUpload from '@/components/ImageUpload';
import MultiImageUpload from '@/components/MultiImageUpload';
import SelectWithCustom from '@/components/SelectWithCustom';
import { Head, Link, useForm } from '@inertiajs/react';
import { CATEGORIES, STYLES, THEMES, MEDIUMS, DIMENSIONS } from '@/utils/artworkOptions';

interface Artist {
    id: number;
    name: string;
}

interface Artwork {
    id: number;
    title: string;
    artist_id: number;
    year: number | null;
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
}

interface EditProps {
    artwork: Artwork;
    artists: Artist[];
}

export default function Edit({ artwork, artists }: EditProps) {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        artist_id: string;
        year: string;
        category: string;
        style: string;
        theme: string;
        price: string;
        medium: string;
        dimensions: string;
        description: string;
        image_url: File | null;
        additional_images: File[];
        _method: string;
    }>({
        title: artwork.title || '',
        artist_id: String(artwork.artist_id) || '',
        year: artwork.year ? String(artwork.year) : '',
        category: artwork.category || '',
        style: artwork.style || '',
        theme: artwork.theme || '',
        price: artwork.price_min ? String(artwork.price_min) : '',
        medium: artwork.medium || '',
        dimensions: artwork.dimensions || '',
        description: artwork.description || '',
        image_url: null,
        additional_images: [],
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/gallery/artworks/${artwork.id}`, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title={`Edit ${artwork.title}`} />

            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="mb-6">
                        <Link
                            href="/gallery/artworks"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Artworks
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Artwork</h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Update artwork details. Changes will require admin approval before becoming visible.
                            </p>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            required
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Artist *
                                        </label>
                                        <select
                                            value={data.artist_id}
                                            onChange={(e) => setData('artist_id', e.target.value)}
                                            required
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select an artist</option>
                                            {artists.map((artist) => (
                                                <option key={artist.id} value={artist.id}>
                                                    {artist.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.artist_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.artist_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Year
                                        </label>
                                        <input
                                            type="number"
                                            value={data.year}
                                            onChange={(e) => setData('year', e.target.value)}
                                            min="1000"
                                            max={new Date().getFullYear() + 1}
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.year && (
                                            <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Price
                                        </label>
                                        <input
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            min="0"
                                            step="0.01"
                                            placeholder="Leave empty if price on request"
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.price && (
                                            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                                        )}
                                    </div>

                                    <SelectWithCustom
                                        label="Medium"
                                        value={data.medium}
                                        onChange={(value) => setData('medium', value)}
                                        options={MEDIUMS}
                                        error={errors.medium}
                                    />

                                    <SelectWithCustom
                                        label="Dimensions"
                                        value={data.dimensions}
                                        onChange={(value) => setData('dimensions', value)}
                                        options={DIMENSIONS}
                                        error={errors.dimensions}
                                    />

                                    <SelectWithCustom
                                        label="Category"
                                        value={data.category}
                                        onChange={(value) => setData('category', value)}
                                        options={CATEGORIES}
                                        error={errors.category}
                                    />

                                    <SelectWithCustom
                                        label="Style"
                                        value={data.style}
                                        onChange={(value) => setData('style', value)}
                                        options={STYLES}
                                        error={errors.style}
                                    />

                                    <div className="md:col-span-2">
                                        <SelectWithCustom
                                            label="Theme"
                                            value={data.theme}
                                            onChange={(value) => setData('theme', value)}
                                            options={THEMES}
                                            error={errors.theme}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={6}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Show current main image */}
                                {artwork.featured_image && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Main Image
                                        </label>
                                        <img
                                            src={`/storage/${artwork.featured_image}`}
                                            alt={artwork.title}
                                            className="h-48 w-auto object-cover rounded"
                                        />
                                    </div>
                                )}

                                <ImageUpload
                                    label="Replace Main Image (optional)"
                                    name="image_url"
                                    onChange={(file) => setData('image_url', file)}
                                    error={errors.image_url}
                                />

                                {/* Show current additional images */}
                                {artwork.additional_images && artwork.additional_images.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Additional Images
                                        </label>
                                        <div className="flex gap-4 flex-wrap">
                                            {artwork.additional_images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={`/storage/${img}`}
                                                    alt={`${artwork.title} - ${idx + 1}`}
                                                    className="h-32 w-auto object-cover rounded"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <MultiImageUpload
                                    label="Replace Additional Images (optional)"
                                    name="additional_images"
                                    onChange={(files) => setData('additional_images', files)}
                                    error={errors.additional_images}
                                />

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Updating...' : 'Update Artwork'}
                                    </button>
                                    <Link
                                        href="/gallery/artworks"
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
