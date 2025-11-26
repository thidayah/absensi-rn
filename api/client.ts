import axios from 'axios';

const BASE_URL = 'http://192.168.101.28' // your Localhost / IP LAN
export const API = axios.create({
  baseURL: `${BASE_URL}/absensi/api`,
  timeout: 5000,
});
