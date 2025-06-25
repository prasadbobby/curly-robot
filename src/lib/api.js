const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async healthCheck() {
    return this.request('/api/health')
  }

  async getProjectAllocations(requestData) {
    return this.request('/api/allocations', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })
  }
}

export const apiService = new ApiService()
export default ApiService