// src/utils/comparisonAnalysis.js
export const comparisonAnalysis = {
  // Compare two allocation datasets
  compare: (currentData, previousData, requestParams) => {
    const current = Array.isArray(currentData) ? currentData : []
    const previous = Array.isArray(previousData) ? previousData : []

    // Create maps for efficient comparison
    const currentMap = new Map(current.map(item => [item.AllocNo, item]))
    const previousMap = new Map(previous.map(item => [item.AllocNo, item]))

    // Find changes
    const added = current.filter(item => !previousMap.has(item.AllocNo))
    const removed = previous.filter(item => !currentMap.has(item.AllocNo))
    const modified = []
    const unchanged = []

    // Check for modifications in existing allocations
    current.forEach(currentItem => {
      const previousItem = previousMap.get(currentItem.AllocNo)
      if (previousItem) {
        const changes = findFieldChanges(currentItem, previousItem)
        if (changes.length > 0) {
          modified.push({
            current: currentItem,
            previous: previousItem,
            changes
          })
        } else {
          unchanged.push(currentItem)
        }
      }
    })

    const summary = {
      totalCurrent: current.length,
      totalPrevious: previous.length,
      netChange: current.length - previous.length,
      added: added.length,
      removed: removed.length,
      modified: modified.length,
      unchanged: unchanged.length
    }

    const employeeChanges = analyzeEmployeeChanges(current, previous)
    const activityChanges = analyzeActivityChanges(current, previous)

    return {
      summary,
      details: {
        added,
        removed,
        modified,
        unchanged
      },
      employeeChanges,
      activityChanges,
      requestParams,
      timestamp: Date.now()
    }
  },

  // Generate comparison report
  generateReport: (comparison) => {
    const { summary, details, employeeChanges, activityChanges } = comparison

    return {
      executive_summary: {
        net_change: summary.netChange,
        change_percentage: summary.totalPrevious > 0 
          ? Math.round(((summary.netChange) / summary.totalPrevious) * 100 * 100) / 100
          : 0,
        total_changes: summary.added + summary.removed + summary.modified
      },
      allocation_changes: {
        new_allocations: details.added.map(item => ({
          allocation_no: item.AllocNo,
          employee: item.EmpName,
          employee_no: item.EmpNo,
          start_date: item.AllocStartDate,
          end_date: item.AllocEndDate,
          percentage: item.Percent,
          activity: item.ActivityDesc
        })),
        removed_allocations: details.removed.map(item => ({
          allocation_no: item.AllocNo,
          employee: item.EmpName,
          employee_no: item.EmpNo,
          start_date: item.AllocStartDate,
          end_date: item.AllocEndDate,
          percentage: item.Percent,
          activity: item.ActivityDesc,
          reason: 'Allocation expired or removed'
        })),
        modified_allocations: details.modified.map(item => ({
          allocation_no: item.current.AllocNo,
          employee: item.current.EmpName,
          changes: item.changes
        }))
      },
      employee_impact: {
        new_employees: employeeChanges.added,
        removed_employees: employeeChanges.removed,
        employees_with_changes: employeeChanges.modified
      },
      activity_impact: activityChanges
    }
  }
}

// Find changes between two allocation objects
function findFieldChanges(current, previous) {
  const changes = []
  const fieldsToCheck = [
    'AllocStartDate', 'AllocEndDate', 'Percent', 'ActivityDesc', 
    'ActivityNo', 'Country', 'StateCity', 'ReportingManagerEmpNo'
  ]

  fieldsToCheck.forEach(field => {
    if (current[field] !== previous[field]) {
      changes.push({
        field,
        from: previous[field],
        to: current[field]
      })
    }
  })

  return changes
}

// Analyze employee-level changes
function analyzeEmployeeChanges(current, previous) {
  const currentEmployees = new Set(current.map(item => item.EmpNo))
  const previousEmployees = new Set(previous.map(item => item.EmpNo))

  const added = [...currentEmployees].filter(emp => !previousEmployees.has(emp))
    .map(empNo => {
      const emp = current.find(item => item.EmpNo === empNo)
      return {
        empNo,
        empName: emp?.EmpName,
        allocations: current.filter(item => item.EmpNo === empNo).length
      }
    })

  const removed = [...previousEmployees].filter(emp => !currentEmployees.has(emp))
    .map(empNo => {
      const emp = previous.find(item => item.EmpNo === empNo)
      return {
        empNo,
        empName: emp?.EmpName,
        allocations: previous.filter(item => item.EmpNo === empNo).length
      }
    })

  const modified = [...currentEmployees].filter(emp => previousEmployees.has(emp))
    .map(empNo => {
      const currentAllocations = current.filter(item => item.EmpNo === empNo)
      const previousAllocations = previous.filter(item => item.EmpNo === empNo)
      
      if (currentAllocations.length !== previousAllocations.length) {
        const emp = current.find(item => item.EmpNo === empNo)
        return {
          empNo,
          empName: emp?.EmpName,
          allocationsBefore: previousAllocations.length,
          allocationsAfter: currentAllocations.length,
          change: currentAllocations.length - previousAllocations.length
        }
      }
      return null
    })
    .filter(Boolean)

  return { added, removed, modified }
}

// Analyze activity-level changes
function analyzeActivityChanges(current, previous) {
  const currentActivities = groupByActivity(current)
  const previousActivities = groupByActivity(previous)

  const changes = []
  const allActivities = new Set([...Object.keys(currentActivities), ...Object.keys(previousActivities)])

  allActivities.forEach(activity => {
    const currentCount = currentActivities[activity]?.count || 0
    const previousCount = previousActivities[activity]?.count || 0
    
    if (currentCount !== previousCount) {
      changes.push({
        activity,
        before: previousCount,
        after: currentCount,
        change: currentCount - previousCount
      })
    }
  })

  return changes
}

// Group allocations by activity
function groupByActivity(data) {
  return data.reduce((acc, item) => {
    const activity = item.ActivityDesc || 'Unknown'
    if (!acc[activity]) {
      acc[activity] = { count: 0, allocations: [] }
    }
    acc[activity].count++
    acc[activity].allocations.push(item)
    return acc
  }, {})
}