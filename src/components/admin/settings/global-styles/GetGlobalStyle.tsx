import React from 'react'

import { fetchGlobalStyle } from '@/hooks/slices/setting/globalStyle/GlobalStyleThunk'
import { AppDispatch, RootState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'

const GetGlobalStyle = () => {

    const { globalStyle, isLoading, isError } = useSelector((state:RootState) => state.globalStyle)
    const dispatch = useDispatch<AppDispatch>()

    React.useEffect(() => {
           if(!isLoading){
            dispatch(fetchGlobalStyle())
           }
    }, [isLoading])
  return (
  null
  )
}

export default GetGlobalStyle