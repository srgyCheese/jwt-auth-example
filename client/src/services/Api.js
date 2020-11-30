import {derived, writable} from 'svelte/store'

const refreshToken = async () => {
   const res = await fetch(`/api/auth/refresh`)

   const {token} = await res.json()

   return token
}

const _isAuthorized = writable(!!localStorage.getItem('token'))

const saveToken = token => {
   localStorage.setItem('token', token)
   _isAuthorized.set(true)
}

const clearToken = () => {
   localStorage.removeItem('token')
   _isAuthorized.set(false)
}

export const logout = () => {
   clearToken()
}

export const isAuthorized = derived(_isAuthorized, $_isAuthorized => $_isAuthorized)

export const apiRequest = async (uri, params = {}) => {
   params.headers = params.headers || {}

   if (params.body) {
      params.headers['Content-Type'] = 'application/json'
   }

   const res = await fetch(`/api${uri}`, params)

   if (!res.ok) {
      throw new Error()
   }

   return await res.json()
}

export const signIn = async (login, password) => {
   const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({login, password})
   })

   const {token} = data

   saveToken(token)

   return data.message
}

export const signUp = async (login, password) => {
   const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({login, password})
   })

   return data.message
}

export const authRequest = async (uri, params = {}) => {
   params.headers = params.headers || {}

   const token = localStorage.getItem('token')

   if (!token) {
      throw new Error('Not authorized')
   }

   params.headers.authorization = `Bearer ${token}`

   try {
      return await apiRequest(uri, params)
   } catch (e) {
      const token = await refreshToken()

      saveToken(token)

      params.headers.authorization = `Bearer ${token}`

      return await apiRequest(uri, params)
   }
}