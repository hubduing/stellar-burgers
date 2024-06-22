import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginUser,
  selectError,
  selectIsUserLoading,
  selectUser
} from '../../slices/userSlice';
import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';
import { useForm } from 'src/hooks/useForm';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loginError = useSelector(selectError);
  const isLoading = useSelector(selectIsUserLoading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return isLoading ? (
    <Preloader />
  ) : user ? (
    <Navigate replace to='/' />
  ) : (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
