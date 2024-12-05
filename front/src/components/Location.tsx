import React, {useEffect} from 'react';

interface LocationProps {
    location: {
      latitude: number;
      longitude: number;
    };
    setLocation: React.Dispatch<React.SetStateAction<{ latitude: number; longitude: number }>>;
  }

export const Location:React.FC<LocationProps> = ({location, setLocation}) => {
    // const [location, setLocation] = useState({
    //   latitude: 0,
    //   longitude: 0,
    // });

    const getCurrentLocation = () => {
        if (navigator.geolocation){ 
            // console.log("Geolocation is supported by this browser.");
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // console.log("position received");
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error Code: " + error.code);
                    console.error("Error Message: " + error.message);
                }
            );
        }
        else {
            console.log("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    return (<>
        <button onClick={getCurrentLocation}>Location</button>
        {!(location.latitude === 0 && location.longitude === 0) ? (
            <div>
                <div>latitude: {location.latitude.toFixed(3)}</div>
                <div>longitude: {location.longitude.toFixed(3)}</div>
            </div>): null}
      </>
    )
  };

