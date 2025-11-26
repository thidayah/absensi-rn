import { API } from "@/api/client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { router } from "expo-router";
import { Button, Text, View } from 'react-native';

export default function Dashboard() {
  const doCheckin = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return alert('Izin lokasi wajib');
    let loc = await Location.getCurrentPositionAsync({});
    let user = JSON.parse(await AsyncStorage.getItem('user') || '{}');

    const headers = {
      headers: {
        'Authorization': user?.token
      }
    };

    const payload = {
      employee_id: user.id,
      time: new Date().toISOString(),
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
    };

    const res = await API.post('/attendance/checkin', payload, headers);
    alert(res.data.message);
  };



  const doLogout = async () => {
    router.replace('/login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>Dashboard Absensi</Text>
      <Button title="Check In" onPress={doCheckin} />
      <Button title="Logout" onPress={doLogout} />
    </View>
  );
}
