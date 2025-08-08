import React, {useId} from 'react';

interface FloatingInputProps {
    label: string;
    type: string;
    value?: string;
    tooltip?: string;
    onChange?: (value: string) => void;
    errorMessage?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({label, type, value, tooltip, onChange, errorMessage}) => {
    const id = useId();
    const isSpecialType = type === 'date' || type === 'number' || type === 'time';
    const shouldStayUp = isSpecialType || !!value;

    return (
        <div className="relative w-full group flex flex-col">
            <div className="relative">
                <input
                    id={id}
                    type={type}
                    value={value}
                    placeholder=" "
                    onChange={(e) => onChange?.(e.target.value)}
                    className={`peer p-3 rounded-xl bg-white w-full transition-colors border-2
                    ${errorMessage ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'}
                    focus:outline-none ${errorMessage ? 'focus:border-red-500' : 'focus:border-[#111c85]'}
                    `}
                />


                <label
                    htmlFor={id}
                    className={`absolute left-3 transition-all text-gray-500 cursor-text
                ${shouldStayUp
                        ? 'top-0 text-xs text-[#111c85]'
                        : 'top-3 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#111c85]'
                    }
            `}
                >
                    {label}
                </label>

                {tooltip && (
                    <span
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1
                           bg-gray-600 text-white text-xs rounded py-1 px-2
                           opacity-0 group-hover:opacity-100 transition-opacity
                           whitespace-pre-line text-center w-full"
                    >
                {tooltip}
            </span>
                )}
            </div>

            <div className="h-1">
                {errorMessage && (
                    <span className="text-red-500 text-xs ms-3">{errorMessage}</span>
                )}
            </div>
        </div>

    );
};

export default FloatingInput;