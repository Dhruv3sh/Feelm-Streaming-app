import { Card, Skeleton } from '@nextui-org/react';
import React from 'react'

const LoadingImg = () => {
    return (
        <Card className="w-[200px] space-y-5 " radius="sm">
            <Skeleton className="rounded-sm">
                <div className=" h-72 rounded-lg bg-default-300"></div>
            </Skeleton>
        </Card>
    );
}

export default LoadingImg
