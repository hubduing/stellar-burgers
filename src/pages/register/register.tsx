import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  registerUser,
  selectError,
  selectIsUserLoading
} from '../../slices/userSlice';
import { setCookie } from '../../utils/cookie';
import { Navigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsUserLoading);
  const error = useSelector(selectError);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name: userName, email, password }))
      .unwrap()
      .then((action) => {
        localStorage.setItem('refreshToken', action.refreshToken);
        setCookie('accessToken', action.accessToken);
        <Navigate to='/' />;
      })
      .catch(() => {
        localStorage.setItem('refreshToken', '');
        setCookie('accessToken', '');
      });
  };

  return isLoading ? (
    <Preloader />
  ) : (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
