import React, { useState } from 'react'
import axios from '../config/axios.js'

const Createproject = () => {
  const [projectName, setProjectName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const response = await axios.post('/project/create', { name: projectName })
      setSuccess('Project created successfully!')
      setProjectName('')
      console.log(response);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project')
    }
  }

  return (
    <div className="h-screen w-full flex justify-center items-center bg-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 bg-zinc-300 rounded-md min-w-[350px]"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Create Project</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <input
          type="text"
          placeholder="Project Name"
          className="p-2 rounded border"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Create
        </button>
      </form>
    </div>
  )
}

export default Createproject