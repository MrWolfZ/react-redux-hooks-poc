import { AnyAction, bindActionCreators, ActionCreatorsMapObject, ActionCreator } from 'redux';
import { useReduxDispatch } from './useReduxDispatch';
import { useMemo } from 'react';

/**
 * A hook to bind action creators to the redux store's dispatch function.
 * Supports passing a single action creator, an array/tuple of action
 * creators, or an object of actions creators.
 *
 * Usage:
 *
```jsx
import React, { useCallback } from 'react'
import { useReduxActions } from '@mrwolfz/react-redux-hooks-poc'

const deleteItem = ({ id }) => ({
  type: 'delete-item',
  itemIdToDelete: id,
})

export const ExampleComponent = ({ id, label }) => {
  // supports passing an object of action creators
  const { deleteItem: deleteItemViaObject } = useReduxActions({
    deleteItem: () => deleteItem(id),
  }, [id])

  // supports passing an array/tuple of action creators
  const [deleteItemViaArray] = useReduxActions([
    () => deleteItem(id),
  ], [id])

  // supports passing a single action creator
  const deleteItem = useReduxActions(() => deleteItem(id), [id])

  return (
    <div>
      <span>{label}</span>
      <button onClick={deleteItem}>Delete item</button>
    </div>
  )
}
```
 * 
 * Any arguments to the callback are passed through, i.e. in the example
 * above the `deleteItem` action has access to the event parameter of the
 * onClick event
 */
export function useReduxActions<T extends [ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>], A = AnyAction>(actions: T, deps?: ReadonlyArray<any>): T
export function useReduxActions<T extends [ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>], A = AnyAction>(actions: T, deps?: ReadonlyArray<any>): T
export function useReduxActions<T extends [ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>], A = AnyAction>(actions: T, deps?: ReadonlyArray<any>): T
export function useReduxActions<T extends [ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>], A = AnyAction>(actions: T, deps?: ReadonlyArray<any>): T
export function useReduxActions<T extends [ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>], A = AnyAction>(actions: T, deps?: ReadonlyArray<any>): T
export function useReduxActions<T extends [ActionCreator<A>, ActionCreator<A>, ActionCreator<A>, ActionCreator<A>], A = AnyAction>(actions: T, deps?: ReadonlyArray<any>): T
export function useReduxActions<T extends [ActionCreator<A>, ActionCreator<A>, ActionCreator<A>], A = AnyAction>(actions: T, deps?: ReadonlyArray<any>): T
export function useReduxActions<T extends [ActionCreator<A>, ActionCreator<A>], A = AnyAction>(actions: T, deps?: ReadonlyArray<any>): T
export function useReduxActions<T extends [ActionCreator<A>], A = AnyAction>(actions: T, deps?: ReadonlyArray<any>): T
export function useReduxActions<T extends ReadonlyArray<ActionCreator<A>>, A = AnyAction>(actions: T, deps?: ReadonlyArray<any>): T
export function useReduxActions<T extends ActionCreatorsMapObject<A>, A = AnyAction>(actions: T, deps?: ReadonlyArray<any>): T
export function useReduxActions<T extends ActionCreator<A>, A = ReturnType<T>>(actions: T, deps?: ReadonlyArray<any>): T
export function useReduxActions<T extends ActionCreatorsMapObject<A> | ActionCreator<A> | ReadonlyArray<ActionCreator<A>>, A = AnyAction>(actions: T, deps?: ReadonlyArray<any>): T {
  const dispatch = useReduxDispatch()
  return useMemo(
    () => {
      if (Array.isArray(actions)) {
        return actions.map(a => bindActionCreators(a as ActionCreator<A>, dispatch)) as any as T
      }

      return bindActionCreators<any, any>(actions, dispatch) as T
    },
    deps,
  )
}
