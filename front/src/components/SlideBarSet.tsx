// import React from 'react';
import { SlideBar } from './SlideBar';

interface SlideBarData {
    id: number;
    title: string;
    value: number;
}

interface SlideBarSetProps {
    slideBars: SlideBarData[];
    onSliderChange?: (id: number, value: number) => void;
  }

export const SlideBarSet:React.FC<SlideBarSetProps> = ({slideBars, onSliderChange}) => {
    return (
        <>
        <div style={{fontSize:'16px'}}>
            {slideBars.map((slideBar) => (
              <SlideBar 
              slideBar = {slideBar} 
              key = {slideBar.id}
              onChange = {onSliderChange} />
            ))}
        </div>
        </>
    )
  };
