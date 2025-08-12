'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Copy } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function BankDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} амжилттай хуулсан!`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Clipboard error:', err);
      toast.error('Хуулахад алдаа гарлаа!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Дансны мэдээлэл</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Дансны мэдээлэл</DialogTitle>
          <DialogDescription>
            Та доорх дансны мэдээллийг ашиглан төлбөрөө төлнө үү.
          </DialogDescription>
          <div className='flex items-center justify-between gap-4'>
            <p>IBAN: 48000500</p>
            <button
              className='cursor-pointer'
              onClick={() => handleCopy('48000500', 'IBAN')}
              aria-label='Copy IBAN'
            >
              <Copy />
            </button>
          </div>
          <div className='flex items-center justify-between gap-4'>
            <p>Данс: 5304390986</p>
            <button
              className='cursor-pointer'
              onClick={() => handleCopy('5304390986', 'Данс')}
              aria-label='Copy account number'
            >
              <Copy />
            </button>
          </div>
        </DialogHeader>
        <ToastContainer />
        <Image src='/images/bank.jpeg' alt='bank' width={500} height={500} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Хаах</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
