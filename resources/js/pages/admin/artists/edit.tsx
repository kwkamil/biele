import AdminLayout from '@/layouts/AdminLayout';
import ImageUpload from '@/components/ImageUpload';
import { Head, useForm } from '@inertiajs/react';

interface Artist {
    id: number;
    name: string;
    slug: string;
    photo: string | null;
    biography: string | null;
}

interface EditProps {
    artist: Artist;
}

export default function Edit({ artist }: EditProps) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        biography: string;
        photo: File | null;
        _method: string;
    }>({
        name: artist.name || '',
        biography: artist.biography || '',
        photo: null,
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/artists/${artist.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${artist.name} - Admin`} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Artist</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Update artist information
                    </p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Name *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                            )}
                        </div>

                        <ImageUpload
                            label="Photo"
                            name="photo"
                            value={artist.photo}
                            onChange={(file) => setData('photo', file)}
                            error={errors.photo}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Biography
                            </label>
                            <textarea
                                value={data.biography}
                                onChange={(e) => setData('biography', e.target.value)}
                                rows={6}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                            {errors.biography && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.biography}</p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Artist'}
                            </button>
                            <a
                                href="/admin/artists"
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
