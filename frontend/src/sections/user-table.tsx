'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCallback, useEffect, useState } from 'react';
import { changeIsPaid, changeStatus } from '@/utils/change-status';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import dayjs from 'dayjs';

import { Product } from '@/types/product';
import { STATUS } from '@/types/common';
import { UserStatusDialog } from './user-status-dialog';
import { BankDialog } from './bank-dialog';

type Props = Readonly<{
  phoneNumber: string;
}>;

const translations = {
  loading: 'Ачаалалж байна...',
  totalItems: 'Нийт бараа',
  totalAmount: 'Нийлбэр дүн',
  invalidPhone: 'Утасны дугаар оруулна уу.',
};

export function UserTable({ phoneNumber }: Props) {
  const [userData, setUserData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>();

  const fetchData = useCallback(async () => {
    if (!phoneNumber) {
      setUserData([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/products/user?phoneNumber=${encodeURIComponent(phoneNumber)}${
          status ? `&status=${status}` : ''
        }`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setUserData(Array.isArray(data) ? data : data ? [data] : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Failed to load data: ${error}`);
      setUserData([]);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, status]);

  // const handlePickUp = async ({ phone }: { phone: string }) => {
  //   try {
  //     const url = `${process.env.NEXT_PUBLIC_API_URL}/api/products/put-products`;
  //     const response = await fetch(url, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         phoneNumber: phone,
  //         pickupType:
  //           userData?.[0]?.pickupType === 'pickup'
  //             ? PICKUP_TYPE.DELIVERY
  //             : PICKUP_TYPE.PICKUP,
  //       }),
  //     });

  //     const data = await response.json();

  //     toast(data.message);
  //     fetchData();
  //   } catch (error) {
  //     console.error('Error updating pickup type:', error);
  //     setError('Failed to update pickup type');
  //   }
  // };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <div className='flex justify-center'>Ачаалалж байна...</div>;
  }

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  if (!userData || userData.length === 0) {
    return <div>Таны бүртгэлтэй бараа байхгүй байна</div>;
  }

  const sum = userData
    .filter((item) => item.status !== STATUS.HANDED_OVER)
    .reduce((total, item) => total + (item.price ?? 0), 0);

  const sumNumber = userData?.filter(
    (item) => item.status !== STATUS.HANDED_OVER && item.price > 0
  ).length;

  return (
    <Card className='w-full max-w-[1300px] p-6 bg-white shadow-md'>
      <div className='flex justify-between items-center mb-4'>
        <UserStatusDialog setStatus={setStatus} status={status} />
        <BankDialog />
      </div>
      <div className='flex justify-between flex-col sm:flex-row my-5 gap-5'>
        <div className='flex items-center gap-5'>
          <p>
            {translations.totalItems}: {sumNumber}
          </p>
          <p>
            {translations.totalAmount}: {sum} ₮
          </p>
        </div>
      </div>
      <Table aria-label='User products table'>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead className='w-[100px]'>Трак код</TableHead>
            <TableHead>Төлөв</TableHead>
            <TableHead>Утасны дугаар</TableHead>
            <TableHead>Дүн</TableHead>
            <TableHead>Төлбөр</TableHead>
            <TableHead className='text-right'>Огноо</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData
            .filter((item: Product) => item.status !== STATUS.HANDED_OVER)
            .map((data: Product, index) => (
              <TableRow key={index}>
                {data.trackingCode ? (
                  <>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className='font-medium'>
                      {data.trackingCode}
                    </TableCell>
                    <TableCell>
                      <Badge>{changeStatus(data.status)}</Badge>
                    </TableCell>
                    <TableCell>{data.phoneNumber}</TableCell>
                    <TableCell>
                      {data.price ? `${data.price} ₮` : 'Дүн оруулаагүй байна'}
                    </TableCell>
                    <TableCell>{changeIsPaid(data.isPaid)}</TableCell>
                    <TableCell className='text-right'>
                      {dayjs(data.updatedAt).format('DD-MM-YYYY')}
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
    </Card>
  );
}
