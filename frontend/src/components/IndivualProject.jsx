import React from 'react'

const Project = ({project }) => {
  return (
    <div className="bg-zinc-200 rounded-md shadow p-4 flex flex-col gap-4 min-w-[300px]">
      <div className="font-bold text-xl border-b pb-2">name: {project.Projectname}</div>
     
      <div className='flex justify-between'>
        <h1 className='text-1xl font-bold'>user:{project.users.length}</h1>
        
      </div>
    </div>
  )
}

export default Project
