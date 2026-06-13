import React, { useState } from 'react';

export const Avatar = ({ src, alt, name, className }) => {
  const [error, setError] = useState(false);

  const initial = (name || alt || 'A').charAt(0).toUpperCase();

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-primary/20 text-primary font-bold overflow-hidden ${className}`}>
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};
