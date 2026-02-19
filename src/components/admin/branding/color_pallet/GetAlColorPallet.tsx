import { useFormField } from '@/components/ui/form copy'
import { getAllColorPallets } from '@/hooks/slices/branding/colorPalletSlice/ColorPalletThunk'
import { RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'

const GetAlColorPallet = () => {
const {colorPallets,isFetched} = useSelector((state: RootState) => state.colorPallet)
const dispatch = useDispatch<AppDispatch>()
useEffect(() => {
    if (!isFetched) {
        dispatch(getAllColorPallets())
    }
}, [isFetched])

  return (
null
  )
}

export default GetAlColorPallet