import {
  toJS,
  action,
  autorun,
  computed,
  observable,
  runInAction,
  makeObservable,
  makeAutoObservable,
} from 'mobx';

export const transformers = {
  toJS,
  batch: runInAction,
  action,
  autorun,
  computed,
  observable,
  classToObservable: makeAutoObservable,
  classToObservableManual: makeObservable,
};
