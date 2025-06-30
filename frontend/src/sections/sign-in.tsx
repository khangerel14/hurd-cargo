'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { cn } from '@/lib/utils';

type CardProps = React.ComponentProps<typeof Card>;

export const SignIn = ({ className, ...props }: CardProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/auth`,
        {
          phoneNumber,
          role: 'user',
        }
      );

      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', JSON.stringify(response.data.token));
        toast.success(response.data?.message ?? 'Login successful!');
        router.push('/information');
      } else {
        toast.error(response?.data?.message ?? 'Login failed!');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data.message;
        toast.error(message ?? 'Login failed. Please check your credentials.');
      } else {
        console.error('Unexpected error:', error);
        toast.error('Something went wrong.');
      }
    }
  };

  return (
    <section className='flex flex-row'>
      <div
        className='bg-cover h-screen w-[60%]'
        style={{
          backgroundImage: "url('/images/poster.jpg')",
        }}
      />
      <div className='flex flex-col items-center justify-center gap-3 px-3 mx-auto'>
        <ToastContainer
          position='top-right'
          className={'z-50'}
          autoClose={3000}
        />
        <Card className={cn('max-w-[480px] w-full', className)} {...props}>
          <CardHeader>
            <CardTitle>Та нэвтэрнэ үү!</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <div className='flex flex-col gap-2'>
              <h1>Утасны дугаар</h1>
              <input
                type='number'
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder='Утасны дугаар'
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                className='border border-gray-300 rounded-md p-2 w-full'
              />
              <p className='text-sm text-gray-500 mt-2'>
                Санамж: Та өөрийн утасны дугаараа оруулснаар шууд нэвтрэх
                боломжтой!
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className='w-full' onClick={handleLogin}>
              <Check /> Нэвтрэх
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};
