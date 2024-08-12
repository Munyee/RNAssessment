import React, {useEffect, useState} from 'react';
import {Keyboard, StyleSheet} from 'react-native';
import GetLocation from 'react-native-get-location';
import MapView, {Marker} from 'react-native-maps';
import {useAppDispatch, useAppSelector} from '../hooks';
import {setOpenSearch} from '../slices/location.reducer';
import AutoCompleteSearch from './AutoCompleteSearch';

export default function MapBase(props: any) {
  const dispatch = useAppDispatch();
  const styles = useStyles();
  const locationDetail = useAppSelector(state => state.location.locationDetail);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    }).then(location => {
      setLocation(location);
    });
  }, []);

  return (
    <React.Fragment>
      <AutoCompleteSearch />
      <MapView
        style={styles.mapView}
        onPanDrag={() => {
          dispatch(setOpenSearch(false));
          Keyboard.dismiss();
        }}
        region={{
          latitude:
            locationDetail?.geometry.location.lat ??
            location?.latitude ??
            37.78825,
          longitude:
            locationDetail?.geometry.location.lng ??
            location?.longitude ??
            -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.042,
        }}
        provider="google">
        {locationDetail && (
          <Marker
            coordinate={{
              latitude: locationDetail.geometry.location.lat,
              longitude: locationDetail.geometry.location.lng,
            }}
          />
        )}
      </MapView>
    </React.Fragment>
  );
}

const useStyles = () =>
  StyleSheet.create({
    mapView: {width: '100%', height: '100%'},
  });
