// ...existing code...
import React, { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import JoinDirectoryModal from '../components/JoinDirectoryModal'

const AlumniDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBatch, setFilterBatch] = useState('')
  const [filterCompany, setFilterCompany] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alumni, setAlumni] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAlumni()
  }, [])

  const fetchAlumni = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('alumni_directory')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) throw error

      const transformedData = (data || []).map(alumnus => {
        const rawSkills = alumnus.skills
        let skills = []
        if (Array.isArray(rawSkills)) skills = rawSkills
        else if (typeof rawSkills === 'string' && rawSkills.trim()) {
          // try splitting comma-separated string
          skills = rawSkills.split(',').map(s => s.trim()).filter(Boolean)
        }

        return {
          id: alumnus.id,
          name: alumnus.full_name || 'Unnamed',
          batch: alumnus.graduation_year ? String(alumnus.graduation_year) : '',
          company: alumnus.company || 'N/A',
          position: alumnus.current_position || 'N/A',
          location: alumnus.location || 'Bangladesh',
          linkedin: alumnus.linkedin_profile || '',
          github: alumnus.github_profile || '',
          skills,
          yearsOfExperience: alumnus.years_of_experience || ''
        }
      })

      setAlumni(transformedData)
    } catch (err) {
      console.error('Error fetching alumni:', err)
      setError('Failed to load alumni data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    fetchAlumni()
  }

  const filteredAlumni = alumni.filter(alumnus => {
    const q = searchTerm.trim().toLowerCase()
    const nameMatch = alumnus.name.toLowerCase().includes(q)
    const positionMatch = alumnus.position.toLowerCase().includes(q)
    const skillsMatch = (alumnus.skills || []).some(s => s.toLowerCase().includes(q))
    const matchesSearch = !q || nameMatch || positionMatch || skillsMatch
    const matchesBatch = !filterBatch || alumnus.batch === filterBatch
    const matchesCompany = !filterCompany || alumnus.company.toLowerCase().includes(filterCompany.toLowerCase())
    return matchesSearch && matchesBatch && matchesCompany
  })

  const uniqueBatches = [...new Set(alumni.map(a => a.batch).filter(Boolean))].sort((a, b) => b.localeCompare(a))
  const uniqueCompanies = [...new Set(alumni.map(a => a.company).filter(Boolean))].sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading alumni directory...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-circle text-6xl text-red-500 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAlumni}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const initials = (name) => {
    if (!name) return ''
    return name
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Alumni Directory</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Connect with fellow UAP CSE alumni. Search by name, skills, company, or batch to find the perfect networking opportunity.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center ml-8"
            >
              <i className="fas fa-plus mr-2"></i>
              Join Directory
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, position, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
              <select
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Batches</option>
                {uniqueBatches.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Companies</option>
                {uniqueCompanies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAlumni.length} of {alumni.length} alumni
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map(alumnus => (
            <div key={alumnus.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {initials(alumnus.name)}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-800">{alumnus.name}</h3>
                  <p className="text-gray-600">{alumnus.position}</p>
                  <p className="text-sm text-gray-500">{alumnus.company}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <i className="fas fa-graduation-cap mr-2"></i>
                  {alumnus.batch ? `Batch ${alumnus.batch}` : 'Batch N/A'}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  {alumnus.location}
                </p>
                {alumnus.yearsOfExperience && (
                  <p className="text-sm text-gray-600 mb-2">
                    <i className="fas fa-briefcase mr-2"></i>
                    {alumnus.yearsOfExperience} years experience
                  </p>
                )}
              </div>

              {alumnus.skills && alumnus.skills.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {alumnus.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                {alumnus.linkedin && (
                  <a
                    href={alumnus.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition-colors"
                  >
                    <i className="fab fa-linkedin mr-2"></i>
                    LinkedIn
                  </a>
                )}
                {alumnus.github && (
                  <a
                    href={alumnus.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg text-center hover:bg-gray-900 transition-colors"
                  >
                    <i className="fab fa-github mr-2"></i>
                    GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAlumni.length === 0 && !loading && (
          <div className="text-center py-12">
            <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No alumni found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <JoinDirectoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  )
}

export default AlumniDirectory
// ...existing code...