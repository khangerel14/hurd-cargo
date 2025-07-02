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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icon } from '@iconify/react/dist/iconify.js';
import { changeStatus } from '@/utils/change-status';
import { useState } from 'react';
import { Product } from '@/types/product';
import { STATUS } from '@/types/common';
import { Switch } from '@/components/ui/switch';

type Props = Readonly<{
  row: Product;
  fetchData?: () => void;
  handleSearch?: (phoneNumber: string) => void;
  phoneNumber?: string;
}>;

interface FormData {
  trackingCode: string;
  phoneNumber: string;
  status: string;
  price: number;
  isPaid: boolean;
}

export function EditDialog({
  row,
  fetchData,
  handleSearch,
  phoneNumber,
}: Props) {
  const [formData, setFormData] = useState<FormData>({
    trackingCode: row.trackingCode ?? '',
    phoneNumber: row.phoneNumber ?? '',
    status: row.status ?? '',
    price: row.price ?? 0,
    isPaid: row.isPaid ?? false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.trackingCode.trim()) {
      setError('Tracking code is required.');
      return false;
    }
    const phoneRegex = /^\+?\d{8,15}$/;
    if (!phoneRegex.exec(formData.phoneNumber)) {
      setError('Please enter a valid phone number.');
      return false;
    }
    if (
      !formData.status.trim() ||
      !Object.values(STATUS).includes(formData.status)
    ) {
      setError('Please select a valid status.');
      return false;
    }
    if (formData.price < 0) {
      setError('Price cannot be negative.');
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    setError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${row._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message ?? 'Failed to update product.');
      }

      fetchData?.();
      handleSearch?.(phoneNumber ?? '');
      setOpen(false);
    } catch (error) {
      console.error('Error updating product:', error);
      setError((error as Error).message || 'Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' aria-label='Edit product'>
          <Icon icon='ant-design:edit-outlined' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Мэдээлэл засах</DialogTitle>
        </DialogHeader>
        {error && <div className='text-red-500 text-sm mb-4'>{error}</div>}
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='trackingCode' className='font-medium'>
              Трак код
            </label>
            <Input
              id='trackingCode'
              name='trackingCode'
              value={formData.trackingCode}
              onChange={handleInputChange}
              placeholder='Трак код оруулна уу'
              className='border-gray-300'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='phoneNumber' className='font-medium'>
              Утасны дугаар
            </label>
            <Input
              id='phoneNumber'
              name='phoneNumber'
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder='Утасны дугаар оруулна уу'
              className='border-gray-300'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='status' className='font-medium'>
              Төлөв
            </label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger id='status' className='border-gray-300'>
                <SelectValue placeholder='Төлөв сонгоно уу' />
              </SelectTrigger>
              <SelectContent>
                {Object.values(STATUS).map((status) => (
                  <SelectItem key={status} value={status}>
                    {changeStatus(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='price' className='font-medium'>
              Үнийн дүн
            </label>
            <Input
              id='price'
              name='price'
              type='number'
              value={formData.price}
              onChange={handleInputChange}
              placeholder='Үнийн дүн оруулна уу'
              className='border-gray-300'
              min='0'
            />
          </div>
          <div className='flex items-center gap-2'>
            <Switch
              checked={formData.isPaid}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isPaid: checked }))
              }
            />
            <label htmlFor='isPaid' className='ml-2 text-sm text-gray-700'>
              Төлбөр төлөгдсөн эсэх
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? (
              <span className='flex items-center gap-2'>
                <svg
                  className='animate-spin h-5 w-5'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z'
                  />
                </svg>
                Хадгалаж байна...
              </span>
            ) : (
              'Хадгалах'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
