import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { selectOrders } from '../../slices/burgerSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector(selectOrders);
  const total = orders.filter((order) => order.status === 'done');
  const totalToday = orders.filter(
    (orderDate) =>
      orderDate.updatedAt.slice(0, 10) === new Date().toJSON().slice(0, 10)
  );

  const feed = { total: total.length, totalToday: totalToday.length };
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');
  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
