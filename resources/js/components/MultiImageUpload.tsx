import { Upload, X } from 'lucide-react';
import { useState } from 'react';

interface MultiImageUploadProps {
    label: string;
    name: string;
    values?: string[];
    onChange: (files: File[]) => void;
    error?: string;
    className?: string;
}

export default function MultiImageUpload({
    label,
    name,
    values = [],
    onChange,
    error,
    className = '',
}: MultiImageUploadProps) {
    const [previews, setPreviews] = useState<string[]>(
        values.map((v) => `/storage/${v}`)
    );
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length > 0) {
            const updatedFiles = [...files, ...newFiles];
            setFiles(updatedFiles);
            onChange(updatedFiles);

            newFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews((prev) => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleRemove = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        setPreviews(updatedPreviews);
        onChange(updatedFiles);
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <div className="mt-1">
                <div className="flex flex-wrap gap-4">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative inline-block">
                            <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="h-32 w-32 rounded-lg object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    <label className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500">
                        <div className="flex flex-col items-center">
                            <Upload className="h-6 w-6 text-gray-400" />
                            <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Add more
                            </span>
                        </div>
                        <input
                            type="file"
                            name={name}
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>
            {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
