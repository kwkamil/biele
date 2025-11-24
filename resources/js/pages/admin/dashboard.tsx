import AdminLayout from '@/layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Palette, Building2, Image, CheckCircle, MessageSquare, Clock, CheckCheck, Users } from 'lucide-react';

interface DashboardStats {
    totalArtists: number;
    totalGalleries: number;
    totalArtworks: number;
    totalInquiries: number;
    totalUsers: number;
    pendingInquiries: number;
    verifiedInquiries: number;
    approvedArtworks: number;
}

interface DashboardProps {
    stats: DashboardStats;
}

export default function Dashboard({ stats }: DashboardProps) {
    const statCards = [
        { name: 'Total Artists', value: stats.totalArtists, icon: Palette, color: 'bg-blue-500' },
        { name: 'Total Galleries', value: stats.totalGalleries, icon: Building2, color: 'bg-purple-500' },
        { name: 'Total Artworks', value: stats.totalArtworks, icon: Image, color: 'bg-emerald-500' },
        { name: 'Approved Artworks', value: stats.approvedArtworks, icon: CheckCircle, color: 'bg-green-500' },
        { name: 'Total Inquiries', value: stats.totalInquiries, icon: MessageSquare, color: 'bg-orange-500' },
        { name: 'Pending Inquiries', value: stats.pendingInquiries, icon: Clock, color: 'bg-yellow-500' },
        { name: 'Verified Inquiries', value: stats.verifiedInquiries, icon: CheckCheck, color: 'bg-teal-500' },
        { name: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-indigo-500' },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Overview of your art gallery platform
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.name}
                                className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {stat.name}
                                            </p>
                                            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                                                {stat.value.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Quick Actions */}
                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
                        <div className="mt-4 space-y-2">
                            <a
                                href="/admin/artists"
                                className="block rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Manage Artists
                                </span>
                            </a>
                            <a
                                href="/admin/galleries"
                                className="block rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Manage Galleries
                                </span>
                            </a>
                            <a
                                href="/admin/artworks"
                                className="block rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Manage Artworks
                                </span>
                            </a>
                            <a
                                href="/admin/inquiries"
                                className="block rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    View Inquiries
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Recent Activity Placeholder */}
                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Status</h2>
                        <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                    Connected
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Mail Service</span>
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                    Active
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Queue</span>
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                    Running
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
