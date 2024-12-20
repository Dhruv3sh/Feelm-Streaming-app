import { Card, Skeleton } from '@nextui-org/react';
import React from 'react'

const LoadingImg = () => {
    return (
        <Card className="min-w-[150px] max-w-[180px] space-y-5 " radius="sm">
            <Skeleton className="rounded-sm">
                <div className="min-h-[250px] max-md:min-w-[150px] max-md:min-h-[220px] max-sm:max-w-[130px] max-sm:min-w-[100px] max-sm:min-h-[150px] rounded-lg bg-default-300"></div>
            </Skeleton>
        </Card>
    );
}

export default LoadingImg
