import { Skeleton } from '@nextui-org/skeleton'
import React from 'react'

const LoadingLine = () => {
    return (
        <div className="space-y-3">
            <Skeleton className="w-4/5 rounded-lg ml-4">
                <div className="h-3 w-96 rounded-lg bg-default-200"></div>
            </Skeleton>
        </div>
    )
}

export default LoadingLine
