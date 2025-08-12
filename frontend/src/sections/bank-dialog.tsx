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
import ClipboardJS from 'clipboard';
import { Copy } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export function BankDialog() {
  useEffect(() => {
    const clipboard = new ClipboardJS('.copy-btn');

    clipboard.on('success', (e) => {
      const copiedText = e.text.includes('48000500') ? 'IBAN' : 'Данс';
      toast.success(`${copiedText} амжилттай хуулсан!`, {
        position: 'top-right',
        autoClose: 3000,
      });
    });

    clipboard.on('error', () => {
      toast.error('Хуулахад алдаа гарлаа!', {
        position: 'top-right',
        autoClose: 3000,
      });
    });

    return () => {
      clipboard.destroy();
    };
  }, []);
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant='outline'>Дансны мэдээлэл</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Дансны мэдээлэл</DialogTitle>
            <DialogDescription>
              Та доорх дансны мэдээллийг ашиглан төлбөрөө төлнө үү.
            </DialogDescription>
            <div className='flex items-center just-between gap-4'>
              <p>IBAN: 48000500</p>
              <button
                className='copy-btn cursor-pointer'
                data-clipboard-text='48000500'
                aria-label='Copy phone number'
              >
                <Copy />
              </button>
            </div>
            <div className='flex items-center just-between gap-4'>
              <p>Данс: 5304390986</p>
              <button
                className='copy-btn cursor-pointer'
                data-clipboard-text='5304390986'
                aria-label='Copy phone number'
              >
                <Copy />
              </button>
            </div>
          </DialogHeader>
          <Image src='/images/bank.jpeg' alt='bank' />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Хаах</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
