'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { PICKUP_TYPE, STATUS } from '@/types/common';

type Props = Readonly<{
  fetchData: () => void;
}>;
export function ProductDialog({ fetchData }: Props) {
  const [phone, setPhone] = useState('');
  const [trackingCode, setTrackingCode] = useState('');

  const handleCreateProduct = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        {
          name: 'product',
          status: STATUS.ARRIVED_IN_EREEN,
          pickupType: PICKUP_TYPE.PICKUP,
          trackingCode,
          phoneNumber: phone,
          userId: '6816e2ebc120881a2fa4ac8b',
        }
      );
      if (response.status === 201) {
        toast.success(response?.data?.message);
        fetchData();
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error?.response?.data.message;
        toast.error(message ?? 'Login failed. Please check your credentials.');
      } else {
        console.error('Unexpected error:', error);
        toast.error('Something went wrong.');
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Бүтээгдэхүүн нэмэх</Button>
      </DialogTrigger>
      <DialogContent className='max-w-[325px]'>
        <DialogHeader>
          <DialogTitle>Бүтээгдэхүүний мэдээлэл оруулна уу!</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-1'>
            <label htmlFor='phone'>Утасны дугаар</label>
            <input
              type='number'
              onChange={(e) => setPhone(e.target.value)}
              placeholder='Утасны дугаар'
              className='border p-2 rounded-sm'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor='trackingCode'>Трак код</label>
            <input
              type='text'
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder='Трак код'
              className='border p-2 rounded-sm'
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateProduct}>Хадгалах</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
