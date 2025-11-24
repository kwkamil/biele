import { useState } from 'react';

interface SelectWithCustomProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    error?: string;
    required?: boolean;
}

export default function SelectWithCustom({
    label,
    value,
    onChange,
    options,
    placeholder = '',
    error,
    required = false
}: SelectWithCustomProps) {
    const [isCustom, setIsCustom] = useState(!options.includes(value) && value !== '');

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        if (newValue === '__custom__') {
            setIsCustom(true);
            onChange('');
        } else {
            setIsCustom(false);
            onChange(newValue);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label} {required && '*'}
            </label>

            {!isCustom ? (
                <select
                    value={value}
                    onChange={handleSelectChange}
                    required={required}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{placeholder || `Wybierz ${label.toLowerCase()}`}</option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                    <option value="__custom__">--- Własna wartość ---</option>
                </select>
            ) : (
                <div className="mt-1 flex gap-2">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Wpisz własną wartość"
                        required={required}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setIsCustom(false);
                            onChange('');
                        }}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        Anuluj
                    </button>
                </div>
            )}

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
