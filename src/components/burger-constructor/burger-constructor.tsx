import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  orderBurger,
  selectBurgerConstructor,
  selectIsLoading,
  selectOrderModal,
  setOrderModal
} from '../../slices/burgerSlice';
import { selectUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(selectBurgerConstructor);
  const orderModalData = useSelector(selectOrderModal);
  const user = useSelector(selectUser);
  const orderRequest = useSelector(selectIsLoading);
  let price = 0;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
    } else {
      const orderData = [
        constructorItems.bun._id!,
        ...constructorItems.ingredients.map((item) => item._id)
      ];
      dispatch(orderBurger(orderData));
    }
  };

  const closeOrderModal = () => {
    dispatch(setOrderModal(null));
  };
  price = useMemo(
    () =>
      (constructorItems.bun?.price ?? 0) * 2 +
      constructorItems.ingredients.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
