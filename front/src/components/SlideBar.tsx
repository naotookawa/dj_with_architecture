import React from 'react';

interface SlideBarProps {
    slideBar: {
      id: number;
      title: string;
      value: number;
    };
    onChange?: (id: number, value: number) => void;
  }

export const SlideBar: React.FC<SlideBarProps> = ({ slideBar, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(slideBar.id, Number(event.target.value));
    }
  };

  return (
    <div>
      <label htmlFor={`slide-bar-${slideBar.id}`}>
        {`SlideBar ${slideBar.id}`}
      </label>
      <input
        id={`slide-bar-${slideBar.id}`}
        type="range"
        min="-80"
        max="0"
        value={slideBar.value}
        onChange={handleChange}
      />
      <span>{slideBar.value}</span>
    </div>
  );
};
