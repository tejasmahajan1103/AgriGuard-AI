import { getInitials } from '../../utils/formatters';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeStyles: Record<string, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export default function Avatar({ name, src, size = 'md' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeStyles[size]} rounded-full object-cover ring-2 ring-white shadow`}
      />
    );
  }

  return (
    <div
      className={`${sizeStyles[size]} rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center font-bold text-white ring-2 ring-white shadow`}
    >
      {getInitials(name)}
    </div>
  );
}
