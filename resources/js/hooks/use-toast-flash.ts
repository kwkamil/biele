import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface ToastMessage {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
}

interface PageProps {
    toast?: ToastMessage;
}

export function useToastFlash() {
    const { toast: toastMessage } = usePage<PageProps>().props;

    useEffect(() => {
        if (toastMessage) {
            const { type, message } = toastMessage;

            switch (type) {
                case 'success':
                    toast.success(message);
                    break;
                case 'error':
                    toast.error(message);
                    break;
                case 'info':
                    toast.info(message);
                    break;
                case 'warning':
                    toast.warning(message);
                    break;
                default:
                    toast(message);
            }
        }
    }, [toastMessage]);
}
