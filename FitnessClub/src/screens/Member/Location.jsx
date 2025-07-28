import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Location= () => {
  const initialRegion = {
    latitude: 28.6139,       // New Delhi latitude
    longitude: 77.2090,      // New Delhi longitude
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        provider="google"
      >
        <Marker
          coordinate={{
            latitude: 28.6139,
            longitude: 77.2090,
          }}
          title="New Delhi"
          description="This is the capital of India"
        />
      </MapView>
      </View>
  );
};

export default Location;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
