/* eslint-disable no-new */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import GoogleMapReact from 'google-map-react';

import './Map.css';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const Map = (props) => {
  const { center, zoom } = props;
  return (
    <>
      <div style={{ height: '50vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyAjI1YU3sBBg4_h8JhEUXHUWx6U4TQvYdQ' }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <AnyReactComponent
            lat={center.lat}
            lng={center.lng}
            text="x"
          />
        </GoogleMapReact>
      </div>
    </>
  );
};

export default Map;
