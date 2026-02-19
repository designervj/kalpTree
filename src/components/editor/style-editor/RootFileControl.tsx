import { RootState } from '@/store/store'
import React from 'react'
import { useSelector } from 'react-redux'



const RootFileControl = () => {

    const { currentWebsite } = useSelector((state: RootState) => state.websites)
    return (
        <pre className="text-xs leading-relaxed p-4 rounded-lg border bg-muted/20 overflow-x-auto whitespace-pre max-h-[920px]">
            <code className="whitespace-pre">{currentWebsite?.globalStyle}</code>
        </pre>
    )
}

export default RootFileControl