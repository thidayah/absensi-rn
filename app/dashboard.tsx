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

  const doCheckout = async () => {
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

    const res = await API.post('/attendance/checkout', payload, headers);
    alert(res.data.message);
  };

  const doHistory = async () => {
    let user = JSON.parse(await AsyncStorage.getItem('user') || '{}');
    router.push(`/history/${user.id}`);
  };

  const doHistoryAll = async () => {
    // let user = JSON.parse(await AsyncStorage.getItem('user') || '{}');
    router.push(`/history/all`);
  };

  const doLogout = async () => {
    await AsyncStorage.removeItem('user');
    router.replace('/login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>Dashboard Absensi</Text>
      <Button title="Check In" onPress={doCheckin} />
      <Button title="Check Out" onPress={doCheckout} />
      <Button title="History" onPress={doHistory} />
      <Button title="History All" onPress={doHistoryAll} />
      <Button title="Logout" onPress={doLogout} />
    </View>
  );
}
