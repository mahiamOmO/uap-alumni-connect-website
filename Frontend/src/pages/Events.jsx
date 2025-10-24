import React, { useState } from 'react'

const Events = () => {
  const [filterType, setFilterType] = useState('')

  const events = [
    {
      id: 1,
      title: "AI/ML Workshop",
      date: "2025-12-15",
      time: "10:00 AM - 4:00 PM",
      location: "UAP Campus, Room 101",
      type: "Workshop",
      description: "Join us for an intensive workshop on Machine Learning fundamentals. Learn about neural networks, deep learning, and practical applications.",
      speaker: "Dr. Sarah Ahmed",
      capacity: 50,
      registered: 32,
      image: "/api/placeholder/400/200"
    },
    {
      id: 2,
      title: "Alumni Networking Meetup",
      date: "2025-12-20",
      time: "6:00 PM - 9:00 PM",
      location: "Grand Hotel, Dhaka",
      type: "Networking",
      description: "Annual alumni networking event. Connect with fellow graduates, share experiences, and build professional relationships.",
      speaker: "Various Alumni",
      capacity: 200,
      registered: 156,
      image: "/api/placeholder/400/200"
    },
    {
      id: 3,
      title: "Career Development Seminar",
      date: "2025-12-25",
      time: "2:00 PM - 5:00 PM",
      location: "Online (Zoom)",
      type: "Seminar",
      description: "Learn about career advancement strategies, interview preparation, and professional development from industry experts.",
      speaker: "Ab.Karim (Google)",
      capacity: 100,
      registered: 78,
      image: "/api/placeholder/400/200"
    }
  ]

  const filteredEvents = events.filter(event => 
    !filterType || event.type === filterType
  )

  const uniqueTypes = [...new Set(events.map(event => event.type))]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Upcoming Events</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our community events, workshops, and networking sessions. Stay connected and continue learning together.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Events</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              <i className="fas fa-plus mr-2"></i>
              Create Event
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredEvents.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <i className="fas fa-calendar-alt text-white text-6xl"></i>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-gray-600">{event.speaker}</p>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                    {event.type}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-gray-600">
                    <i className="fas fa-calendar mr-2"></i>
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <i className="fas fa-clock mr-2"></i>
                    {event.time}
                  </p>
                  <p className="text-gray-600">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {event.location}
                  </p>
                </div>

                <p className="text-gray-600 mb-4">{event.description}</p>

                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">
                    {event.registered}/{event.capacity} registered
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Events
