import { API } from "@/api/client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginNow = async () => {
    const res = await API.post('/auth', { email, password });
    console.log(res);    
    if (res.data.status) {
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      router.replace('/dashboard');
    } else {
      alert(res.data.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ marginBottom: 4 }}>Email</Text>
      <TextInput style={{ marginBottom: 20, marginTop: 10, borderWidth: .5, padding: 8, borderRadius: 2, backgroundColor: 'white' }} onChangeText={setEmail} />

      <Text style={{ marginBottom: 4 }}>Password</Text>
      <TextInput style={{ marginBottom: 20, marginTop: 10, borderWidth: .5, padding: 8, borderRadius: 2, backgroundColor: 'white' }} secureTextEntry onChangeText={setPassword} />

      <TouchableOpacity onPress={loginNow}>
        <View style={{ backgroundColor: 'green', padding: 12, borderRadius: 4, alignItems: 'center' }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
