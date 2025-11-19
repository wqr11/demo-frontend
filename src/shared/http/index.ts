import axios from 'axios'
import { API_URL } from '../config'

export const $httpHost = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
