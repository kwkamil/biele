import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface ActionLog {
    id: number;
    user_id: number | null;
    user: User | null;
    action: string;
    subject_type: string | null;
    subject_id: number | null;
    details: Record<string, any> | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
}

interface PaginatedLogs {
    data: ActionLog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface IndexProps {
    logs: PaginatedLogs;
    filters: {
        search?: string;
        action?: string;
        user_id?: string;
        date_from?: string;
        date_to?: string;
    };
    actions: string[];
}

export default function Index({ logs, filters, actions }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [action, setAction] = useState(filters.action || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/action-logs',
            { search, action, date_from: dateFrom, date_to: dateTo },
            { preserveState: true }
        );
    };

    const handleClearFilters = () => {
        setSearch('');
        setAction('');
        setDateFrom('');
        setDateTo('');
        router.get('/admin/action-logs');
    };

    const getActionBadge = (actionName: string) => {
        const actionTypes: Record<string, string> = {
            user_login: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            user_logout: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
            user_registered: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            user_created: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            user_updated: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            user_deleted: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
            email_verified: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            password_reset: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
            login_failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
            inquiry_created: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
            inquiry_verified: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            inquiry_status_updated: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            inquiry_deleted: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
            inquiry_notification_sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            artwork_created: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            artwork_updated: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            artwork_deleted: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        };
        return actionTypes[actionName] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    };

    const formatActionName = (actionName: string) => {
        return actionName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <AdminLayout>
            <Head title="Action Logs - Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Action Logs</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        View all system activity and user actions
                    </p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search logs..."
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                            <select
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">All Actions</option>
                                {actions.map((act) => (
                                    <option key={act} value={act}>
                                        {formatActionName(act)}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                placeholder="From date"
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                placeholder="To date"
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button
                                type="submit"
                                className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                            >
                                Search
                            </button>
                            {(filters.search || filters.action || filters.date_from || filters.date_to) && (
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                        Action
                                    </th>
                                    <th className="pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                        User
                                    </th>
                                    <th className="pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                        Details
                                    </th>
                                    <th className="pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                        IP Address
                                    </th>
                                    <th className="pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {logs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                            No logs found
                                        </td>
                                    </tr>
                                ) : (
                                    logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="py-4">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getActionBadge(log.action)}`}
                                                >
                                                    {formatActionName(log.action)}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                {log.user ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {log.user.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {log.user.email}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        Guest
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4">
                                                {log.details && Object.keys(log.details).length > 0 ? (
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                                        {Object.entries(log.details).slice(0, 2).map(([key, value]) => (
                                                            <div key={key} className="mb-1">
                                                                <span className="font-medium">
                                                                    {key.replace(/_/g, ' ')}:
                                                                </span>{' '}
                                                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                            </div>
                                                        ))}
                                                        {Object.keys(log.details).length > 2 && (
                                                            <div className="text-gray-500">
                                                                +{Object.keys(log.details).length - 2} more
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="py-4">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {log.ip_address || '-'}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {logs.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {(logs.current_page - 1) * logs.per_page + 1} to{' '}
                                {Math.min(logs.current_page * logs.per_page, logs.total)} of {logs.total} results
                            </div>
                            <div className="flex gap-2">
                                {logs.current_page > 1 && (
                                    <Link
                                        href={`/admin/action-logs?page=${logs.current_page - 1}`}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {logs.current_page < logs.last_page && (
                                    <Link
                                        href={`/admin/action-logs?page=${logs.current_page + 1}`}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
