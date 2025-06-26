const CREDENTIALS_KEY = 'app_credentials'
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

export const credentialsManager = {
  // Store credentials in session storage
  store: (credentials) => {
    const data = {
      username: credentials.username,
      password: credentials.password,
      timestamp: Date.now()
    }
    sessionStorage.setItem(CREDENTIALS_KEY, JSON.stringify(data))
  },

  // Get credentials from session storage
  get: () => {
    try {
      const stored = sessionStorage.getItem(CREDENTIALS_KEY)
      if (!stored) return null

      const data = JSON.parse(stored)
      const now = Date.now()
      
      // Check if session has expired
      if (now - data.timestamp > SESSION_TIMEOUT) {
        credentialsManager.clear()
        return null
      }

      return {
        username: data.username,
        password: data.password
      }
    } catch (error) {
      console.error('Error retrieving credentials:', error)
      return null
    }
  },

  // Clear credentials
  clear: () => {
    sessionStorage.removeItem(CREDENTIALS_KEY)
  },

  // Check if credentials exist and are valid
  isValid: () => {
    return credentialsManager.get() !== null
  },

  // Update timestamp to extend session
  extend: () => {
    const credentials = credentialsManager.get()
    if (credentials) {
      credentialsManager.store(credentials)
    }
  }
}