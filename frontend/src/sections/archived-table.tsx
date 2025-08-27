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
import { Input } from '@/components/ui/input';
import { Product } from '@/types/product';
import { ROLE, STATUS } from '@/types/common';

type Props = Readonly<{
  phoneNumber: string;
  userRole: null | string;
}>;

export function ArchivedTable({ phoneNumber, userRole }: Props) {
  const [userData, setUserData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPhoneNumber, setSearchPhoneNumber] = useState<string>('');
  const [searchTrackingCode, setSearchTrackingCode] = useState<string>('');

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

  const searchArchivedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchPhoneNumber) params.append('phoneNumber', searchPhoneNumber);
      if (searchTrackingCode) params.append('trackingCode', searchTrackingCode);
      if (userRole) params.append('userRole', userRole);

      const url = `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/products/archived/search?${params.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setUserData([]);
          setLoading(false);
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUserData(Array.isArray(data) ? data : data ? [data] : []);
    } catch (error) {
      console.error('Error searching data:', error);
      setError(`Failed to search data: ${error}`);
      setUserData([]);
    } finally {
      setLoading(false);
    }
  }, [searchPhoneNumber, searchTrackingCode, userRole]);

  const handleSearch = () => {
    if (searchPhoneNumber || searchTrackingCode) {
      searchArchivedProducts();
    } else {
      fetchData();
    }
  };

  const handleClearSearch = () => {
    setSearchPhoneNumber('');
    setSearchTrackingCode('');
    fetchData();
  };

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
      {/* Search Section */}
      <div className='mb-6 space-y-4'>
        <h3 className='text-lg font-semibold text-gray-900'>Хайлт</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Утасны дугаар
            </label>
            <Input
              type='text'
              placeholder='Утасны дугаар оруулна уу'
              value={searchPhoneNumber}
              onChange={(e) => setSearchPhoneNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className='w-full'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Трак код
            </label>
            <Input
              type='text'
              placeholder='Трак код оруулна уу'
              value={searchTrackingCode}
              onChange={(e) => setSearchTrackingCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className='w-full'
            />
          </div>
          <div className='flex items-end space-x-2'>
            <Button onClick={handleSearch} className='flex-1'>
              Хайх
            </Button>
            <Button onClick={handleClearSearch} variant='outline'>
              Цэвэрлэх
            </Button>
          </div>
        </div>
      </div>

      <Table aria-label='User products table' className='mt-6'>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead className='w-[100px]'>Трак код</TableHead>
            <TableHead>Төлөв</TableHead>
            <TableHead>Утасны дугаар</TableHead>
            <TableHead>Дүн</TableHead>
            {userRole === ROLE.ADMIN && (
              <TableHead className='text-right'>Үйлдэл</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData && userData.length > 0 ? (
            userData.map((data: Product, index) => (
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
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={userRole === ROLE.ADMIN ? 6 : 5}
                className='text-center py-8'
              >
                {loading ? (
                  <div className='text-gray-500'>Хайлт хийж байна...</div>
                ) : (
                  <div className='text-gray-500'>
                    {searchPhoneNumber || searchTrackingCode
                      ? 'Хайлтын үр дүн олдсонгүй'
                      : 'Архивласан бараа байхгүй байна'}
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
