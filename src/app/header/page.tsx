import React, { Suspense } from 'react'
import HeaderContent from './HeaderContent'

const page = () => {
  return (
   <Suspense fallback={<div className="p-4">Loading footer...</div>}>
      <HeaderContent />
    </Suspense>
  )
}

export default page