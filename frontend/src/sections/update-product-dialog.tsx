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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STATUS } from '@/types/common';
import { changeStatus } from '@/utils/change-status';
import { useState } from 'react';

type Props = Readonly<{
  phoneNumber: string;
  fetchData: (phoneNumber: string) => void;
  selectedProductIds: string[];
}>;
export function UpdateProductDialog({
  fetchData,
  selectedProductIds,
  phoneNumber,
}: Props) {
  const [statusName, setStatusName] = useState('');

  const handleCreateProduct = async () => {
    if (selectedProductIds.length === 0) {
      alert('No products selected');
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/update-status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productIds: selectedProductIds,
            status: statusName,
          }),
        }
      );
      if (response.status === 200) {
        fetchData(phoneNumber);
      }
    } catch (error) {
      console.error('Error updating statuses:', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Бүтээгдэхүүний төлөв солих</Button>
      </DialogTrigger>
      <DialogContent className='max-w-[325px]'>
        <DialogHeader>
          <DialogTitle>Бүтээгдэхүүний төлөв оруулна уу!</DialogTitle>
        </DialogHeader>
        <Select
          value={statusName}
          onValueChange={(value) => setStatusName(value)}
        >
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
        <DialogFooter>
          <Button onClick={handleCreateProduct}>Хадгалах</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
