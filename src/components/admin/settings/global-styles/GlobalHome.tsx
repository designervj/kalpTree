import React from 'react'
import GetGlobalStyle from './GetGlobalStyle'
import ShowStyle from './showStyle/ShowStyle'
import GetAlColorPallet from '../../branding/color_pallet/GetAlColorPallet'

const GlobalHome = () => {
  return (
 <>
 <GetGlobalStyle/>
 <GetAlColorPallet/>
 <ShowStyle/>
 </>
  )
}

export default GlobalHome