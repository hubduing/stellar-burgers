import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../slices/burgerSlice';
import { useParams } from 'react-router';

export const IngredientDetails: FC = () => {
  const ingredientDatas = useSelector(selectIngredients);
  const { id } = useParams();
  const ingredientData = ingredientDatas.find((el) => el._id == id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
