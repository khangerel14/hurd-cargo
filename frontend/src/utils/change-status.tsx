import { STATUS } from '@/types/common';

export const changeStatus = (status: string) => {
  switch (status) {
    case STATUS.ARRIVED_IN_EREEN:
      return 'Эрээн дэхь агуулахад ирсэн';
    case STATUS.SHIPPED_TO_ULAANBAATAR:
      return 'Улаанбаатар руу  ачигдсан';
    case STATUS.ARRIVED_IN_ULAANBAATAR:
      return 'Улаанбаатарт ирсэн';
    case STATUS.ACTION_OF_DEVIVERY:
      return 'Хүргэлтэнд гарсан';
    case STATUS.HANDED_OVER:
      return 'Хүлээлгэж өгсөн';
    default:
      return '';
  }
};

export const changeIsPaid = (isPaid: boolean) => {
  switch (isPaid) {
    case true:
      return 'Төлсөн';
    case false:
      return 'Төлөөгүй';
    default:
      return '';
  }
};
