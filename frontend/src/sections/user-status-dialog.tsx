import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { changeStatus } from '@/utils/change-status';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { STATUS } from '@/types/common';

type Props = Readonly<{
  status?: string | null;
  setStatus: (status: string) => void;
}>;

export function UserStatusDialog({ setStatus, status }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-fit'>
          {status ? changeStatus(status) : 'Төлөв сонгоно уу'}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogTitle>Төлөв сонгох</DialogTitle>
        <DialogClose asChild key={status}>
          <Button value={status ?? ''} onClick={() => setStatus('')}>
            Бүгд
          </Button>
        </DialogClose>
        {Object.values(STATUS).map((status) => (
          <DialogClose asChild key={status}>
            <Button
              value={status}
              onClick={() => {
                setStatus(status);
              }}
            >
              {changeStatus(status)}
            </Button>
          </DialogClose>
        ))}
      </DialogContent>
    </Dialog>
  );
}
