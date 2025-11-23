import { useState, useEffect } from 'react';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';

export const usePermissions = () => {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [microphonePermission, setMicrophonePermission] = useState<boolean | null>(null);
  const [libraryPermission, setLibraryPermission] = useState<boolean | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      // Camera
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.granted);

      // Microphone
      const micStatus = await Camera.requestMicrophonePermissionsAsync();
      setMicrophonePermission(micStatus.granted);

      // Photo Library
      const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setLibraryPermission(libraryStatus.granted);

      // Location
      const locationStatus = await Permissions.askAsync(Permissions.LOCATION);
      setLocationPermission(locationStatus.granted);
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  return {
    cameraPermission,
    microphonePermission,
    libraryPermission,
    locationPermission,
    requestPermissions,
  };
};