import { Upload, X } from 'lucide-react';
import { useState } from 'react';

interface ImageUploadProps {
    label: string;
    name: string;
    value?: string | null;
    onChange: (file: File | null) => void;
    error?: string;
    multiple?: boolean;
    className?: string;
}

export default function ImageUpload({
    label,
    name,
    value,
    onChange,
    error,
    multiple = false,
    className = '',
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(
        value ? `/storage/${value}` : null
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        onChange(null);
        setPreview(null);
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <div className="mt-1">
                {preview ? (
                    <div className="relative inline-block">
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-32 w-32 rounded-lg object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <label className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500">
                        <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Click to upload
                            </span>
                            <span className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                PNG, JPG up to 5MB
                            </span>
                        </div>
                        <input
                            type="file"
                            name={name}
                            accept="image/*"
                            multiple={multiple}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
