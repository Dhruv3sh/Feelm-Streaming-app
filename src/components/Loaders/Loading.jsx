import { Skeleton } from "@heroui/skeleton";
import React from 'react'

const Loading = () => {
    return (
        <div className="w-full space-y-5 relative">
            <Skeleton className="rounded-sm">
                <div className="h-[650px] max-md:h-[400px] rounded-lg bg-default-300"></div>
            </Skeleton>
        </div>
    );
}

export default Loading
