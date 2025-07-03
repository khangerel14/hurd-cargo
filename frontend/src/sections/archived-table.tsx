'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { changeStatus } from '@/utils/change-status';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Product } from '@/types/product';
import { PICKUP_TYPE, ROLE, STATUS } from '@/types/common';

type Props = Readonly<{
  phoneNumber: string;
  userRole: null | string;
}>;

export function ArchivedTable({ phoneNumber, userRole }: Props) {
  const [userData, setUserData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        userRole === ROLE.USER
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/status?phoneNumber=${phoneNumber}&status=${STATUS.HANDED_OVER}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/products/status/admin?status=${STATUS.HANDED_OVER}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUserData(Array.isArray(data) ? data : data ? [data] : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Failed to load data: ${error}`);
      setUserData([]);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, userRole]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async ({ id }: { id: string }) => {
    try {
      const product = userData?.find((item) => item._id === id);
      if (!product) return;

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
        throw new Error('Failed to update pickup type');
      }

      fetchData();
    } catch (error) {
      console.error('Error updating pickup type:', error);
      setError('Failed to update pickup type.');
    }
  };
  if (loading) {
    return (
      <div className='flex justify-center text-white'>Ачаалалж байна...</div>
    );
  }

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }
  return (
    <Card className='w-full max-w-[1300px] p-6 bg-white shadow-md'>
      <Table aria-label='User products table' className='mt-6'>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead className='w-[100px]'>Трак код</TableHead>
            <TableHead>Төлөв</TableHead>
            <TableHead>Хүлээж авах</TableHead>
            <TableHead>Утасны дугаар</TableHead>
            <TableHead>Дүн</TableHead>
            {userRole === ROLE.ADMIN && (
              <TableHead className='text-right'>Үйлдэл</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData?.map((data: Product, index) => (
            <TableRow key={data._id}>
              {data.trackingCode ? (
                <>
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
                  {userRole === ROLE.ADMIN && (
                    <TableCell className='flex items-center justify-end gap-2'>
                      <Button
                        color='error'
                        variant='outline'
                        onClick={() => handleDelete({ id: data._id })}
                      >
                        Устгах
                      </Button>
                    </TableCell>
                  )}
                </>
              ) : (
                <TableCell colSpan={6} className='text-center'>
                  No tracking code available
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
