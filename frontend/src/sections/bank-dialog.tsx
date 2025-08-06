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
import Image from 'next/image';

export function BankDialog() {
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
