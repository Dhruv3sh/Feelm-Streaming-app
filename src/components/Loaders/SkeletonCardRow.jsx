import React from 'react';
import { Card, Skeleton } from '@heroui/react';

export default function SkeletonCardRow() {
  const skeletonItems = Array.from({ length: '8' });

  return (
    <div className=' m-3 mt-14 flex gap-3 overflow-hidden z-10 transition-all'>
      {skeletonItems.map((_, index) => (
        <Card key={index} style={{ flexShrink: 0 }}>
            <Skeleton isLoaded={false}>
                <div className='h-[9rem] min-w-[6rem] sm:min-h-[12rem] sm:min-w-[7rem] md:min-w-[9rem] md:min-h-[14rem] lg:min-w-[11rem] lg:min-h-[16rem]' alt='skeleton'></div>
            </Skeleton>
        </Card>
      ))}
    </div>
  );
}
