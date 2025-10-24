import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AlumniDirectory from './pages/AlumniDirectory'
import JobOpportunities from './pages/JobOpportunities'
import Events from './pages/Events'
import Community from './pages/Community'
import Mentorship from './pages/Mentorship'
import Resources from './pages/Resources'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login - No Navbar/Footer */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard - No Navbar/Footer, Protected */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          
          {/* All other routes - WITH Navbar/Footer, Protected */}
          <Route path="/*" element={
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/alumni-directory" element={<PrivateRoute><AlumniDirectory /></PrivateRoute>} />
                <Route path="/job-opportunities" element={<PrivateRoute><JobOpportunities /></PrivateRoute>} />
                <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
                <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
                <Route path="/mentorship" element={<PrivateRoute><Mentorship /></PrivateRoute>} />
                <Route path="/resources" element={<PrivateRoute><Resources /></PrivateRoute>} />
              </Routes>
              <Footer />
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App