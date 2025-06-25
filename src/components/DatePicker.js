'use client'

import { useState, useRef, useEffect } from 'react'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

export default function DatePicker({ value, onChange, placeholder = "Select date" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const containerRef = useRef(null)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const monthsShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  useEffect(() => {
    if (value) {
      const date = parseDate(value)
      if (date) {
        setSelectedDate(date)
        setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
      }
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const parseDate = (dateString) => {
    if (!dateString) return null
    const parts = dateString.trim().split(' ')
    if (parts.length !== 3) return null
    
    const day = parseInt(parts[0])
    const monthIndex = monthsShort.indexOf(parts[1])
    const year = parseInt(parts[2])
    
    if (isNaN(day) || monthIndex === -1 || isNaN(year)) return null
    
    return new Date(year, monthIndex, day)
  }

  const formatDate = (date) => {
    if (!date) return ''
    const day = date.getDate().toString().padStart(2, '0')
    const month = monthsShort[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1)
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isToday: isToday(prevDate),
        isSelected: selectedDate && isSameDay(prevDate, selectedDate)
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isToday(date),
        isSelected: selectedDate && isSameDay(date, selectedDate)
      })
    }

    // Next month days
    const remainingCells = 42 - days.length
    for (let day = 1; day <= remainingCells; day++) {
      const nextDate = new Date(year, month + 1, day)
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isToday: isToday(nextDate),
        isSelected: selectedDate && isSameDay(nextDate, selectedDate)
      })
    }

    return days
  }

  const isToday = (date) => {
    const today = new Date()
    return isSameDay(date, today)
  }

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    const formattedDate = formatDate(date)
    onChange(formattedDate)
    setIsOpen(false)
  }

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(prev.getMonth() + direction)
      return newMonth
    })
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div style={{ position: 'relative' }} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="form-input"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{ color: value ? '#1f2937' : '#9ca3af' }}>
          {value || placeholder}
        </span>
        <CalendarIcon className="w-5 h-5" style={{ color: '#9ca3af' }} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 50,
              marginTop: '0.5rem',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              padding: '1.5rem'
            }}
          >
            {/* Calendar Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <button
                type="button"
                onClick={() => navigateMonth(-1)}
                style={{
                  padding: '0.5rem',
                  background: '#f8fafc',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f1f5f9'
                  e.target.style.borderColor = '#d1d5db'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f8fafc'
                  e.target.style.borderColor = '#e5e7eb'
                }}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              
              <h3 style={{
                fontWeight: 600,
                color: '#1f2937',
                fontSize: '1rem'
              }}>
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              
              <button
                type="button"
                onClick={() => navigateMonth(1)}
                style={{
                  padding: '0.5rem',
                  background: '#f8fafc',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f1f5f9'
                  e.target.style.borderColor = '#d1d5db'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f8fafc'
                  e.target.style.borderColor = '#e5e7eb'
                }}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Days Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
              marginBottom: '1.5rem'
            }}>
              {daysOfWeek.map(day => (
                <div key={day} style={{
                  padding: '0.75rem',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280'
                }}>
                  {day}
                </div>
              ))}
              
              {days.map((dayObj, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(dayObj.date)}
                  style={{
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    background: dayObj.isSelected 
                      ? '#8626c3'
                      : dayObj.isToday 
                        ? 'rgba(134, 38, 195, 0.1)'
                        : 'transparent',
                    color: dayObj.isSelected 
                      ? 'white'
                      : dayObj.isToday 
                        ? '#8626c3'
                        : dayObj.isCurrentMonth 
                          ? '#1f2937' 
                          : '#9ca3af',
                    fontWeight: dayObj.isToday || dayObj.isSelected ? 600 : 400,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!dayObj.isSelected) {
                      e.target.style.background = dayObj.isCurrentMonth ? '#f3f4f6' : '#f9fafb'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!dayObj.isSelected) {
                      e.target.style.background = dayObj.isToday 
                        ? 'rgba(134, 38, 195, 0.1)' 
                        : 'transparent'
                    }
                  }}
                >
                  {dayObj.date.getDate()}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                type="button"
                onClick={() => {
                  const today = new Date()
                  handleDateSelect(today)
                }}
                className="btn btn-outline btn-sm"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}