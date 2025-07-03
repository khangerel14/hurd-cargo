import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export const MiddleSection = () => {
  return (
    <div className='container py-20 px-5'>
      <h1 className='text-2xl font-normal text-center text-gray-600'>
        Захиалсан бараагаа хүлээн авах хамгийн зөв сонголт
      </h1>
      <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-20'>
          <Card className='bg-white p-7 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
            <div className='flex flex-row justify-start items-center gap-5'>
              <Image
                src='/images/profile.jpeg'
                alt='image'
                width={60}
                height={60}
                className='rounded-full mb-4'
              />
              <h2 className='text-xl font-semibold mb-3'>Э.Энхтуул</h2>
            </div>
            <p className='text-gray-500 mt-1'>
              Хурд карго үүсгэн байгуулагч Э.Энхтуул миний бие 11 жил тээвэр
              логистикийн салбарт ажилласан тээврийн салбарын туршлага дээрээ
              тулгуурлан БНХАУ ын Эрээн хотоос Улаанбаатар хот хоорондох
              тээврийн үйлчилгээг хурдан шуурхай нийлүүлэх харилцагч бүртэй
              найрсаг харилцаа, уян хатан үнийн бодлого зэргийг гол зорилгоо
              болгон ажиллаж байна.
            </p>
          </Card>
          <Card className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
            <div className='flex flex-row justify-start items-center gap-5'>
              <AlertTriangle width={60} height={60} enableBackground='yellow' />
              <h2 className='text-xl font-semibold mb-3'>Анхааруулга</h2>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-gray-500 mt-1'>
                🚛 Тээвэрлэлтийн явцад амархан гэмтэх, хэврэг, эвдрэлд өртөх
                өндөр эрсдэлтэй бараа, бүтээгдэхүүнийг бат бөх, найдвартай сав
                баглаа боодолгүйгээр захиалахгүй байхыг зөвлөж байна.
              </p>
              <p className='text-gray-500 mt-1'>
                🚛 Иймд тээвэрлэлтийн явцад гэмтэл, эвдрэл гарсан тохиолдолд
                карго компани хариуцлага хүлээхгүй болохыг анхаарна уу.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
