'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

type Props = Readonly<{
  scrollToSection: (ref: React.RefObject<HTMLElement>) => void;
  call: React.RefObject<HTMLElement>;
  address: React.RefObject<HTMLElement>;
}>;

export const NavbarSection = ({ scrollToSection, call, address }: Props) => {
  const router = useRouter();
  return (
    <section
      className='bg-no-repeat bg-cover bg-center min-h-[600px]'
      style={{
        backgroundImage: "url('/images/red.avif')",
        mixBlendMode: 'multiply',
      }}
    >
      <div className='container mx-auto flex justify-between items-center p-4'>
        <div>
          <button className='font-bold text-[#aa8f68] text-2xl cursor-pointer'>
            Хурд карго
          </button>
        </div>
        <div className='flex flex-row gap-7 items-center'>
          <button
            className='cursor-pointer text-white max-sm:hidden'
            onClick={() => scrollToSection(address)}
          >
            Хаяг холбох
          </button>
          <button
            className='cursor-pointer text-white max-sm:hidden'
            onClick={() => scrollToSection(call)}
          >
            Холбоо барих
          </button>
          <button
            className='bg-white py-2 px-4 rounded-full text-black cursor-pointer'
            onClick={() => router.push('/sign-in')}
          >
            Нэвтрэх
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className='max-w-[900px] mx-auto h-[400px] flex items-center justify-center text-center px-4 text-[#aa8f68]'>
        <h2 className='font-bold tracking-normal text-2xl md:text-6xl leading-snug'>
          Хурд карго, Хурдан, Шуурхай,{' '}
          <span className='text-[#28857a] italic'>Найдвартай</span>
        </h2>
      </div>
    </section>
  );
};
