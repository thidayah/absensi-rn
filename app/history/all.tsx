import { API } from "@/api/client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from "react";
import { ActivityIndicator, Button, FlatList, Text, TextInput, View } from "react-native";

export default function HistoryAllPage() {
  const [date, setDate] = useState("");
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      let user = JSON.parse(await AsyncStorage.getItem('user') || '{}');
      const headers = {
        headers: {
          'Authorization': user?.token
        }
      };
      const res = await API.get(`/attendance/history_all?date=${date}`, headers);
      console.log({res});      
      if (res.data.status) {
        setData(res.data.data);
      } else {
        setError(res.data.message || "Gagal memuat data");
      } 
    } catch (err) {
      setError("Terjadi kesalahan koneksi ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15 }}>
        Riwayat Semua Karyawan (Admin)
      </Text>

      {/* Input tanggal */}
      <Text style={{ fontSize: 14 }}>Filter Tanggal (YYYY-MM-DD)</Text>
      <TextInput
        placeholder="2025-11-26"
        value={date}
        onChangeText={setDate}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 8,
          marginTop: 5,
          marginBottom: 10,
        }}
      />

      <Button title="Cari Riwayat" onPress={fetchHistory} />

      {loading && (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {error ? (
        <Text style={{ marginTop: 15, color: "red" }}>{error}</Text>
      ) : null}

      <FlatList
        style={{ marginTop: 20 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              backgroundColor: "#f2f2f2",
              marginBottom: 12,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {item.name} (ID: {item.employee_id})
            </Text>

            <Text>Tanggal: {item.date}</Text>
            <Text>Check In: {item.check_in_time ?? "-"}</Text>
            <Text>Lat: {item.check_in_lat ?? "-"}</Text>
            <Text>Lng: {item.check_in_lng ?? "-"}</Text>

            <Text style={{ marginTop: 5 }}>
              Check Out: {item.check_out_time ?? "-"}
            </Text>
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
