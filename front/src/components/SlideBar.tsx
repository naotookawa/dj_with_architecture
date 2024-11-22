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
        {`Mic ${slideBar.id} `}
      </label>
      <input
        id={`slide-bar-${slideBar.id}`}
        type="range"
        min="1"
        max="1000"
        value={slideBar.value}
        onChange={handleChange}
        style={{
          appearance: 'none',
          borderRadius: '0px',
          outline: 'none',
          // cursor: 'none',
          height: '5px',
          width: '100%',
          background: `linear-gradient(to right, 
          #ff0000 0%, 
          #aa0000 ${(slideBar.value * 0.09)}%, 
          #770000 ${slideBar.value * 0.1}%, 
          #330000 ${10 + (slideBar.value)*0.09}%, 
          #000000 100%)`
        }}
        
      />
      {/* <span>{slideBar.value}</span> */}
      <style>
        {`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 1px;
            height: 1px;
            background: transparent;
            border: 0px solid #ff0000;
            border-radius: 0%;
            // cursor: none;
            box-shadow: 0 0 20px rgba(0, 100, 0, 0.5);
          }
          input[type="range"]::-moz-range-thumb {
            appearance: none;
            width: 5px;
            height: 5px;
            background: transparent;
            border: 0px solid #ff0000;
            border-radius: 0%;
            // cursor: none;
            box-shadow: 0 0 20px rgba(0, 100, 0, 0.5);
          }
        `}
      </style>
    </div>
  );
};