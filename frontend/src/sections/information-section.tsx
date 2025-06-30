'use client';

import { ROLE } from '@/types/common';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminTable } from './admin-table';
import { ArchivedTable } from './archived-table';
import { UserTable } from './user-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const InformationSection = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const role = storedUser ? JSON.parse(storedUser).role : null;
      const phoneNumber = storedUser
        ? JSON.parse(storedUser).phoneNumber
        : null;

      if (phoneNumber) {
        try {
          if (typeof phoneNumber === 'string' && /^\+?\d+$/.exec(phoneNumber)) {
            setPhoneNumber(phoneNumber);
          } else {
            setError('Invalid phone number format.');
          }
        } catch (err) {
          console.error('Error parsing localStorage data:', err);
          setError('Failed to load phone number.');
        }
      }

      if (role) {
        setUserRole(role);
      }
    } catch (err) {
      console.error('Error parsing localStorage data:', err);
      setError('Failed to load user data. Please try again.');
    }
  }, []);
  return (
    <section className='flex flex-col bg-slate-100 h-screen'>
      <div className='container mx-auto flex justify-between items-center p-4'>
        <div>
          <button className='font-bold text-[#aa8f68] text-2xl cursor-pointer'>
            Хурд карго
          </button>
        </div>
        <div>
          <button
            className='bg-black py-2 px-4 rounded-full text-white cursor-pointer'
            onClick={handleLogout}
          >
            Гарах
          </button>
        </div>
      </div>
      <div className='py-20 flex flex-col gap-10 items-center w-full pt-40 max-lg:px-5'>
        <h1 className='font-semibold text-2xl text-center text-black'>
          Таны бүтээгдэхүүний мэдээлэл
        </h1>
        <div className='max-w-[1300px] w-full flex flex-col gap-5'>
          {error && <p className='text-red-500'>{error}</p>}
          {userRole === ROLE.USER ? (
            <Tabs defaultValue='product'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='product'>Бүтээгдэхүүн</TabsTrigger>
                <TabsTrigger value='archive'>Архивласан</TabsTrigger>
              </TabsList>
              <TabsContent value='product'>
                <UserTable phoneNumber={phoneNumber} />
              </TabsContent>
              <TabsContent value='archive'>
                <ArchivedTable userRole={userRole} phoneNumber={phoneNumber} />
              </TabsContent>
            </Tabs>
          ) : (
            <Tabs defaultValue='product'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='product'>Бүтээгдэхүүн</TabsTrigger>
                <TabsTrigger value='archive'>Архивласан</TabsTrigger>
              </TabsList>
              <TabsContent value='product'>
                <AdminTable />
              </TabsContent>
              <TabsContent value='archive'>
                <ArchivedTable userRole={userRole} phoneNumber={phoneNumber} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </section>
  );
};
