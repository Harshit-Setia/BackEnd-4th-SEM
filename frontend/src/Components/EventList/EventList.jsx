import React, { useEffect, useState } from 'react'
import EventCard from './EventCard'
function EventList() {
  // This component will be used to display the list of events
  const [eventData, setEventData] = useState([])
  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch('http://localhost:4040/api/events')
      const data = await response.json()
      setEventData(data)
    }
    fetchEvents()
  }, [])
  return (
    <>
    <main className='p-5'>
      
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {eventData.map(element => {
          return <EventCard event={element} key={element._id} />
        })}
      </div>
    </main>
    </>
  )
}

export default EventList