import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  imageUrl?: string | null;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base'
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const stringToColour = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', imageUrl }) => {
  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt={name} 
        className={`${sizeClasses[size]} rounded-full object-cover border border-[var(--border)]`}
      />
    );
  }

  const bgColour = stringToColour(name);
  
  return (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-medium`}
      style={{ backgroundColor: bgColour }}
    >
      {getInitials(name)}
    </div>
  );
};
