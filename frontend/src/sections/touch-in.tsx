import Image from 'next/image';

export const TouchIn = () => {
  return (
    <div className='flex flex-row justify-between container py-10 items-start px-5 max-md:flex-col gap-10'>
      <div className='flex flex-col gap-2'>
        <h1>Хурд карго</h1>
        <p className='max-w-72'>
          Манай хаяг: БЗД Улаанхуаран Баганат өргөө хотхоны 451 байр
        </p>
      </div>
      <div className='flex flex-row w-full max-w-[400px] justify-between gap-10 max-sm:flex-col items-start'>
        <div className='flex flex-col gap-2'>
          <p>Холбогдох утас:</p>
          <p>☎️ 9888-6644</p>
          <p>☎️ 9908-7662</p>
        </div>
        <div className='flex flex-row gap-2 items-center'>
          <a
            href='https://www.facebook.com/khurdcargo'
            className='flex items-center gap-2'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              src={'/images/facebook.png'}
              alt='speed cargoo'
              width={25}
              height={24}
            />
            <span className='text-sm'>Facebook</span>
          </a>
        </div>
      </div>
    </div>
  );
};
