'use client';
import React from 'react';
import Card from '../Component/card';


const Page = () => {
  return (
    <div className="w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/back.png')", backgroundSize: '100%' }}>
      <div className='w-full h-screen bg-cover main-background-layer  flex justify-center items-center'>
        <Card />
      </div>
    </div>
  );
};

export default Page;