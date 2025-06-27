// src/utils/comparisonStorage.js
const COMPARISON_KEY = 'allocation_comparisons'
const MAX_STORED_COMPARISONS = 50 // Limit storage size

export const comparisonStorage = {
  // Store a new comparison result
  store: (requestParams, results) => {
    try {
      const stored = comparisonStorage.getAll()
      
      const comparisonData = {
        id: generateComparisonId(requestParams),
        timestamp: Date.now(),
        requestParams: {
          projectCode: requestParams.projectCode,
          allocStartDate: requestParams.allocStartDate,
          allocEndDate: requestParams.allocEndDate,
          username: requestParams.username
        },
        results: {
          success: results.success,
          filtered_count: results.filtered_count,
          original_count: results.original_count,
          data: results.data || [],
          status_code: results.status_code
        },
        summary: generateSummary(results.data || [])
      }

      // Add to beginning of array
      stored.unshift(comparisonData)
      
      // Keep only recent comparisons
      const trimmed = stored.slice(0, MAX_STORED_COMPARISONS)
      
      localStorage.setItem(COMPARISON_KEY, JSON.stringify(trimmed))
      return comparisonData
    } catch (error) {
      console.error('Error storing comparison data:', error)
      return null
    }
  },

  // Get all stored comparisons
  getAll: () => {
    try {
      const stored = localStorage.getItem(COMPARISON_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error retrieving comparison data:', error)
      return []
    }
  },

  // Find previous comparison for same project/date range
  findPrevious: (requestParams) => {
    const all = comparisonStorage.getAll()
    
    // Find most recent comparison with same project and date range
    return all.find(comparison => 
      comparison.requestParams.projectCode === requestParams.projectCode &&
      comparison.requestParams.allocStartDate === requestParams.allocStartDate &&
      comparison.requestParams.allocEndDate === requestParams.allocEndDate &&
      comparison.requestParams.username === requestParams.username
    )
  },

  // Get comparison history for a project
  getProjectHistory: (projectCode, username, limit = 10) => {
    const all = comparisonStorage.getAll()
    
    return all
      .filter(comparison => 
        comparison.requestParams.projectCode === projectCode &&
        comparison.requestParams.username === username
      )
      .slice(0, limit)
  },

  // Clear all stored comparisons
  clear: () => {
    localStorage.removeItem(COMPARISON_KEY)
  }
}

// Generate unique ID for comparison
function generateComparisonId(params) {
  const key = `${params.projectCode}_${params.allocStartDate}_${params.allocEndDate}_${params.username}`
  return btoa(key).replace(/[/+=]/g, '').substring(0, 16)
}

// Generate summary statistics
function generateSummary(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      totalAllocations: 0,
      uniqueEmployees: 0,
      totalPercentage: 0,
      countries: [],
      activities: []
    }
  }

  const uniqueEmployees = new Set(data.map(item => item.EmpNo)).size
  const totalPercentage = data.reduce((sum, item) => sum + (parseFloat(item.Percent) || 0), 0)
  const countries = [...new Set(data.map(item => item.Country).filter(Boolean))]
  const activities = [...new Set(data.map(item => item.ActivityDesc).filter(Boolean))]

  return {
    totalAllocations: data.length,
    uniqueEmployees,
    totalPercentage: Math.round(totalPercentage * 100) / 100,
    countries,
    activities
  }
}