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

interface Gallery {
    id: number;
    name: string;
}

interface CreateProps {
    artists: Artist[];
    gallery: Gallery;
}

export default function Create({ artists, gallery }: CreateProps) {
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
    }>({
        title: '',
        artist_id: '',
        year: '',
        category: '',
        style: '',
        theme: '',
        price: '',
        medium: '',
        dimensions: '',
        description: '',
        image_url: null,
        additional_images: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/gallery/artworks', {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Create Artwork" />

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
                            <h1 className="text-3xl font-bold text-gray-900">Add New Artwork</h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Add a new artwork to {gallery.name}. It will be reviewed by an admin before becoming visible to the public.
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

                                <ImageUpload
                                    label="Main Image"
                                    name="image_url"
                                    onChange={(file) => setData('image_url', file)}
                                    error={errors.image_url}
                                />

                                <MultiImageUpload
                                    label="Additional Images"
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
                                        {processing ? 'Creating...' : 'Create Artwork'}
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
