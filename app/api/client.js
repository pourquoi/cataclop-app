import axios from "axios";
import { decode, encode } from 'base-64'
import settings from '@/settings'

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

export const client = axios.create({
    baseURL: settings.api_endpoint,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const interceptors = {}