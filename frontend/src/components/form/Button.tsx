
type ButtonProps = {
    type: 'submit' | 'button' | 'reset';
    onClick?: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    className?: string;
}

export default function Button({ type, onClick, variant = 'primary', children, disabled, className }: ButtonProps) {
    const baseClasses = 'px-4 py-2 cursor-pointer rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150';
    const primaryClasses = 'bg-primary text-white hover:bg-gray-800 focus:ring-primary active:bg-primary-dark';
    const secondaryClasses = 'bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-500 active:bg-gray-500';

    const disabledClasses = 'opacity-50 cursor-not-allowed';

    const variantClasses = variant === 'primary' ? primaryClasses : secondaryClasses;

    console.log(variantClasses);
    return (
        <button
            className={`${baseClasses} ${variantClasses} ${disabled ? disabledClasses : ''} ${className}`}
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
            type={type}
        >
            {children}
        </button>
    );
}