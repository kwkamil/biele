import { Head, Link } from '@inertiajs/react';
import Navbar from '@/components/Navbar';

interface Inquiry {
    id: number;
    name: string;
    email: string;
    company: string | null;
    artwork_ids: number[];
    status: string;
    created_at: string;
}

interface PaginatedInquiries {
    data: Inquiry[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface InquiriesProps {
    inquiries: PaginatedInquiries;
}

export default function Index({ inquiries }: InquiriesProps) {
    return (
        <>
            <Head title="Inquiries" />

            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
                        <p className="mt-2 text-gray-600">View customer inquiries about your artworks</p>
                    </div>

                    {inquiries.data.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Inquiries Yet</h2>
                                <p className="text-gray-600">
                                    You haven't received any inquiries for your artworks yet.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Artworks
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {inquiries.data.map((inquiry) => (
                                            <tr key={inquiry.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                                                    {inquiry.company && (
                                                        <div className="text-sm text-gray-500">{inquiry.company}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{inquiry.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {inquiry.artwork_ids.length} artwork{inquiry.artwork_ids.length !== 1 ? 's' : ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(inquiry.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={`/gallery/inquiries/${inquiry.id}`}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {inquiries.last_page > 1 && (
                                <div className="mt-6 flex justify-center gap-2">
                                    {Array.from({ length: inquiries.last_page }, (_, i) => i + 1).map((page) => (
                                        <Link
                                            key={page}
                                            href={`/gallery/inquiries?page=${page}`}
                                            className={`px-4 py-2 rounded-md ${
                                                page === inquiries.current_page
                                                    ? 'bg-green-600 text-white'
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
