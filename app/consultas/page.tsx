'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../../lib/supabase'
import { Calendar, Clock, FileText } from 'lucide-react'

interface Appointment {
  id: string
  doctor: string
  date: string
  notes: string
}

export default function Component() {
  const session = useSession()
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    if (session?.user?.id) {
      fetchAppointments()
    }
  }, [session])

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching appointments:', error)
    } else {
      setAppointments(data || [])
    }
  }

  return (
    <div className="flex-1 p-4">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <button className="bg-[#FF9999] text-white px-4 py-2 rounded-full mb-4 hover:bg-[#FF7777] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF9999]">
        New Appointment
      </button>
      <div className="bg-white rounded-lg shadow-lg p-4">
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments scheduled.</p>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="mb-4 p-4 border-b last:border-b-0">
              <h2 className="font-bold text-lg">{appointment.doctor}</h2>
              <div className="flex items-center text-gray-600 mt-2">
                <Calendar className="w-4 h-4 mr-2" />
                <p>{new Date(appointment.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center text-gray-600 mt-1">
                <Clock className="w-4 h-4 mr-2" />
                <p>{new Date(appointment.date).toLocaleTimeString()}</p>
              </div>
              {appointment.notes && (
                <div className="flex items-start text-gray-600 mt-2">
                  <FileText className="w-4 h-4 mr-2 mt-1" />
                  <p>{appointment.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}