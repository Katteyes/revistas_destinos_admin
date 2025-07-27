import React, { useId } from 'react';

interface FloatingSelectProps {
    label: string;
    options: { id: number; name: string }[];
    value: string;
    onChange?: (selectedId: string) => void;
}

const FloatingSelect: React.FC<FloatingSelectProps> = ({ label, options, value, onChange }) => {
    const id = useId();

    return (
        <div className="relative w-full">
            <select
                id={id}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="
                    peer
                    p-3 rounded-xl
                    border-2 bg-white w-full
                    border-gray-300 hover:border-gray-400
                    focus:outline-none focus:border-[#111c85]
                    transition-colors
                    uppercase
                "
            >
                {options.map(option => (
                    <option key={option.id} value={option.id.toString()}>
                        {option.name.toUpperCase()}
                    </option>
                ))}
            </select>

            <label
                htmlFor={id}
                className="absolute left-3 transition-all cursor-text top-0 text-xs text-gray-500 peer-focus:text-[#111c85]"
            >
                {label}
            </label>
        </div>
    );
};

export default FloatingSelect;