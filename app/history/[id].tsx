import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { API } from "@/api/client";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EmployeeHistory() {
  const { id } = useLocalSearchParams(); // employee_id dari URL
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any>([]);
  const [error, setError] = useState("");
  const [userLogin, setUserLogin] = useState<any>({})

  useEffect(() => {
    async function getSession() {
      let userStorage = JSON.parse(await AsyncStorage.getItem('user') || '{}');
      setUserLogin(userStorage);
    }
    getSession();
    fetchHistory();
  }, [id])

  const fetchHistory = async () => {
    try {
      let user = JSON.parse(await AsyncStorage.getItem('user') || '{}');
      const headers = {
        headers: {
          'Authorization': user?.token
        }
      };
      const res = await API.get(`/attendance/history_user?employee_id=${id}`, headers);
      console.log({res});      
      if (res.data.status) {
        setHistory(res.data.data);
      } else {
        setError("Gagal memuat data");
      } 
    } catch (err) {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  if (loading) {
    return (
      <View style={{ padding: 40 }}>
        <ActivityIndicator size="large" color={'green'} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        {/* Riwayat Karyawan #{id} */}
        Riwayat Karyawan #{userLogin.name}
      </Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              backgroundColor: "#f2f2f2",
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Tanggal: {item.date}</Text>
            <Text>Check In: {item.check_in_time ?? "-"}</Text>
            <Text>Latitude: {item.check_in_lat ?? "-"}</Text>
            <Text>Longitude: {item.check_in_lng ?? "-"}</Text>
            <Text>Check Out: {item.check_out_time ?? "-"}</Text>
            <Text>Out Lat: {item.check_out_lat ?? "-"}</Text>
            <Text>Out Lng: {item.check_out_lng ?? "-"}</Text>

            <Text style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
              Dibuat: {item.created_at}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
