import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { selectBurgerConstructor } from '../../slices/burgerSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const burgerConstructor = useSelector(selectBurgerConstructor);

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};
    ingredients.forEach((ingredient: TIngredient) => {
      // Проверяем, что _id не undefined перед использованием в качестве ключа
      if (ingredient._id && !counters[ingredient._id])
        counters[ingredient._id] = 0;
      if (ingredient._id) counters[ingredient._id]++;
    });
    if (bun && bun._id) counters[bun._id] = 2; // Аналогичная проверка для bun._id
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
