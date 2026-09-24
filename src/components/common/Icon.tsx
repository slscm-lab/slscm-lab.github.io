import React from 'react';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  filled?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  size?: number | string;
  className?: string;
}

/**
 * Universal Google Material Symbols Rounded Icon Component.
 * Supports Tailwind height/width sizing, color inheritance, optical size, and filled states.
 */
export const Icon: React.FC<IconProps> = ({
  name,
  filled = false,
  weight = 400,
  size,
  className = '',
  style,
  ...props
}) => {
  const fontVariation = `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`;

  return (
    <span
      className={`material-symbols-rounded select-none ${className}`}
      style={{
        fontVariationSettings: fontVariation,
        ...(size ? { fontSize: typeof size === 'number' ? `${size}px` : size } : {}),
        ...style,
      }}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
};

export default Icon;
