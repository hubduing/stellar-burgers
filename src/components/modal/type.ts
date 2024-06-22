import { ReactNode } from 'react';

export type TitleResolver = string | (() => string);

export interface TModalProps {
  title: TitleResolver;
  onClose: () => void;
  children?: React.ReactNode;
}
