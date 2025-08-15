import axios from 'axios'
import { API_URL } from './domainLinks'

const socketId = window.Echo && window.Echo.socketId()

export default function api() {
  let api = axios.create({
    baseURL: API_URL,
    timeout: 90000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Socket-ID': typeof socketId !== 'undefined' ? socketId : null,
      'X-Requested-With': 'XMLHttpRequest',
    },
  })

  return api
}
