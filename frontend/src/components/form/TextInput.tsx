import React from 'react';

interface TextInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    error = "",
    disabled = false,
}) => {
    return (
        <div className="mb-4 w-full">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full box-border mt-1 block px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default TextInput;
