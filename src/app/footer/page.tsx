import React, { Suspense } from 'react'
import FooterContent from './FooterContent'

const page = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading footer...</div>}>
      <FooterContent />
    </Suspense>
  )
}

export default page