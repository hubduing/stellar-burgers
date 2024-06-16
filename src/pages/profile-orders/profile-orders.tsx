import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrders,
  selectIsLoading,
  selectOrders
} from '../../slices/burgerSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(selectOrders);
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch();
  const ordersLoaded = useRef(false);

  useEffect(() => {
    if (!isLoading && !ordersLoaded.current) {
      dispatch(fetchOrders());
      ordersLoaded.current = true;
    }
  }, [isLoading, dispatch]);

  return isLoading ? <Preloader /> : <ProfileOrdersUI orders={orders} />;
};
