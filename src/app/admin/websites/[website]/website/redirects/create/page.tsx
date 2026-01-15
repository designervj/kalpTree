import { ArrowRight } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div>

         {/* ADD REDIRECT FORM */}
      <div className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Create New Redirect
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="/from-url"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex items-center justify-center text-gray-400">
            <ArrowRight />
          </div>

          <input
            type="text"
            placeholder="/to-url"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>301 Permanent</option>
            <option>302 Temporary</option>
          </select>
        </div>

        <div className="mt-4 text-right">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Save Redirect
          </button>
        </div>
      </div>
      
    </div>
  )
}

export default page