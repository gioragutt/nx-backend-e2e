import {
  ClassProvider,
  ExistingProvider,
  FactoryProvider,
  Type,
  ValueProvider,
} from '@nestjs/common';

export type BoundProvider<T> =
  | Type<T>
  | Omit<ClassProvider<T>, 'provide'>
  | Omit<ValueProvider<T>, 'provide'>
  | Omit<FactoryProvider<T>, 'provide'>
  | Omit<ExistingProvider<T>, 'provide'>;
