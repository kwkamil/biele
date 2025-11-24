import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Artwork {
    id: number;
    title: string;
    slug: string;
    featured_image: string | null;
}

interface InquiryLog {
    id: number;
    action: string;
    details: Record<string, any> | null;
    created_at: string;
}

interface Inquiry {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    company: string | null;
    message: string;
    status: string;
    email_verified_at: string | null;
    created_at: string;
    logs: InquiryLog[];
}

interface EditProps {
    inquiry: Inquiry;
    artworks: Artwork[];
}

export default function Edit({ inquiry, artworks }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        status: inquiry.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/inquiries/${inquiry.id}`);
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            pending_verification: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            verified: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            contacted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        };
        return badges[status as keyof typeof badges] || badges.pending_verification;
    };

    return (
        <AdminLayout>
            <Head title={`Edit Inquiry from ${inquiry.first_name} ${inquiry.last_name} - Admin`} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Edit Inquiry Status
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Update the status of this inquiry
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Customer Information
                            </h2>
                            <div className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            First Name
                                        </label>
                                        <p className="mt-1 text-base text-gray-900 dark:text-white">
                                            {inquiry.first_name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Last Name
                                        </label>
                                        <p className="mt-1 text-base text-gray-900 dark:text-white">
                                            {inquiry.last_name}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Email
                                    </label>
                                    <p className="mt-1 text-base text-gray-900 dark:text-white">
                                        <a href={`mailto:${inquiry.email}`} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                                            {inquiry.email}
                                        </a>
                                    </p>
                                </div>

                                {inquiry.phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Phone
                                        </label>
                                        <p className="mt-1 text-base text-gray-900 dark:text-white">
                                            <a href={`tel:${inquiry.phone}`} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                                                {inquiry.phone}
                                            </a>
                                        </p>
                                    </div>
                                )}

                                {inquiry.company && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Company
                                        </label>
                                        <p className="mt-1 text-base text-gray-900 dark:text-white">
                                            {inquiry.company}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Message
                            </h2>
                            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                {inquiry.message}
                            </p>
                        </div>

                        {artworks.length > 0 && (
                            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Artworks of Interest
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {artworks.map((artwork) => (
                                        <Link
                                            key={artwork.id}
                                            href={`/admin/artworks/${artwork.id}/edit`}
                                            className="group overflow-hidden rounded-lg border border-gray-200 transition-colors hover:border-emerald-500 dark:border-gray-700 dark:hover:border-emerald-500"
                                        >
                                            {artwork.featured_image && (
                                                <img
                                                    src={`/storage/${artwork.featured_image}`}
                                                    alt={artwork.title}
                                                    className="h-32 w-full object-cover"
                                                />
                                            )}
                                            <div className="p-3">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                                    {artwork.title}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {inquiry.logs && inquiry.logs.length > 0 && (
                            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Activity Log
                                </h2>
                                <div className="space-y-3">
                                    {inquiry.logs.map((log) => (
                                        <div key={log.id} className="flex items-start gap-3 border-l-2 border-emerald-300 pl-4 dark:border-emerald-600">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                                                        {log.action.replace('_', ' ')}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                {log.details && (
                                                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                        {Object.entries(log.details).map(([key, value]) => (
                                                            <div key={key}>
                                                                <span className="font-medium">{key.replace('_', ' ')}:</span> {String(value)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Update Status
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Status *
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="pending_verification">Pending Verification</option>
                                        <option value="verified">Verified</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Updating...' : 'Update Status'}
                                    </button>
                                    <Link
                                        href={`/admin/inquiries/${inquiry.id}`}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Details
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Email Verified
                                    </label>
                                    <p className="mt-1 text-base text-gray-900 dark:text-white">
                                        {inquiry.email_verified_at ? (
                                            <span className="text-green-600 dark:text-green-400">Yes</span>
                                        ) : (
                                            <span className="text-red-600 dark:text-red-400">No</span>
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Submitted
                                    </label>
                                    <p className="mt-1 text-base text-gray-900 dark:text-white">
                                        {new Date(inquiry.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
