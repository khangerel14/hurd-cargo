'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { changeStatus } from '@/utils/change-status';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { EditDialog } from './edit-dialog';
import { Card } from '@/components/ui/card';
import dayjs from 'dayjs';
import { Product } from '@/types/product';
import { PICKUP_TYPE, STATUS } from '@/types/common';
import { UpdateProductDialog } from './update-product-dialog';

const translations = {
  loading: 'Ачаалалж байна...',
  totalItems: 'Нийт бараа',
  totalAmount: 'Нийт дүн',
  invalidPhone: 'Утасны дугаар оруулна уу.',
};

export function SearchTable() {
  const router = useRouter();
  const [userData, setUserData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleSearch = async ({ phoneNumber }: { phoneNumber?: string }) => {
    if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
      setUserData([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${API_URL}/api/products/user/home?phoneNumber=${phoneNumber}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setUserData(
        data.filter((item: Product) => item.status !== STATUS.HANDED_OVER) ?? []
      );
      setSelectedProductIds([]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Failed to load data: ${error}`);
      setUserData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async ({ id }: { id: string }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      handleSearch({ phoneNumber });
      setSelectedProductIds((prev) => prev.filter((pid) => pid !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product.');
    }
  };

  const confirmDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      handleDelete({ id });
    }
  };

  const handleCheckboxChange = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length === userData.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(userData.map((data) => data._id));
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center text-white'>
        {translations.loading}
      </div>
    );
  }

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  const sum = userData.reduce((total, item) => total + (item.price || 0), 0);
  const sumNumber = userData.filter(
    (item) => typeof item.price === 'number' && item.price > 0
  ).length;

  return (
    <section className='flex flex-col bg-slate-100 h-screen items-center'>
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
      <Card className='w-full max-w-[1300px] p-6 bg-white shadow-md mt-40'>
        <div className='w-full flex sm:flex-row flex-col justify-between items-center gap-5'>
          <div className='flex items-center gap-4'>
            <Button onClick={() => router.push('/information')}>Буцах</Button>
            <p>
              {translations.totalItems}: {sumNumber}
            </p>
            <p>
              {translations.totalAmount}: {sum} ₮
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button onClick={() => handleSearch({ phoneNumber })}>Хайх</Button>
            <input
              id='phoneNumber'
              type='text'
              onChange={(e) => setPhoneNumber(e.target.value)}
              className='border border-gray-300 rounded-md p-2 max-w-sm'
            />
          </div>
        </div>
        <Table aria-label='User products table'>
          <TableHeader>
            <TableRow>
              <TableHead>
                <input
                  type='checkbox'
                  checked={
                    selectedProductIds.length === userData.length &&
                    userData.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>№</TableHead>
              <TableHead className='w-[100px]'>Трак код</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead>Хүлээж авах</TableHead>
              <TableHead>Утасны дугаар</TableHead>
              <TableHead>Дүн</TableHead>
              <TableHead>Огноо</TableHead>
              <TableHead className='text-right'>Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userData.map((data, index) => (
              <TableRow key={data._id}>
                {data.trackingCode ? (
                  <>
                    <TableCell>
                      <input
                        type='checkbox'
                        checked={selectedProductIds.includes(data._id)}
                        onChange={() => handleCheckboxChange(data._id)}
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className='font-medium'>
                      {data.trackingCode}
                    </TableCell>
                    <TableCell>
                      <Badge variant='secondary'>
                        {changeStatus(data.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {data.pickupType === PICKUP_TYPE.PICKUP
                        ? 'Очиж авах'
                        : 'Хүргүүлж авах'}
                    </TableCell>
                    <TableCell>{data.phoneNumber}</TableCell>
                    <TableCell>
                      {data.price ? `${data.price} ₮` : 'Дүн оруулаагүй байна'}
                    </TableCell>
                    <TableCell>
                      {dayjs(data.updatedAt).format('DD-MM-YYYY')}
                    </TableCell>
                    <TableCell className='flex items-center justify-end gap-2'>
                      <Button
                        variant='destructive'
                        onClick={() => confirmDelete(data._id)}
                      >
                        Устгах
                      </Button>
                      <EditDialog
                        row={data}
                        handleSearch={(phoneNumber: string) =>
                          handleSearch({ phoneNumber })
                        }
                        phoneNumber={phoneNumber}
                      />
                    </TableCell>
                  </>
                ) : (
                  <TableCell colSpan={8} className='text-center'>
                    No tracking code available
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='flex justify-end mt-2'>
          <UpdateProductDialog
            fetchData={(phoneNumber: string) => handleSearch({ phoneNumber })}
            phoneNumber={phoneNumber}
            selectedProductIds={selectedProductIds}
          />
        </div>
      </Card>
    </section>
  );
}
