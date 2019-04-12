import { AnyAction } from 'redux';
import { useReduxDispatch } from './useReduxDispatch';
import { useMemo } from 'react';

export type Parameters<T> = T extends (...args: infer T) => any ? T : never;
export type ActionsMap = { [key: string]: (...args: any[]) => AnyAction }
export type BoundActionsMap<T> = { [key in keyof T]: (...args: Parameters<T[key]>) => void }

/**
 * A hook to bind action creators to the redux store's dispatch function.
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
  const actions = useReduxActions({
    deleteItem: () => deleteItem(id),
  }, [id])

  return (
    <div>
      <span>{label}</span>
      <button onClick={actions.deleteItem}>Delete item</button>
    </div>
  )
}
```
 * 
 * Any arguments to the callback are passed through, i.e. in the example
 * above the `deleteItem` action has access to the event parameter of the
 * onClick event
 */
export function useReduxActions<T extends ActionsMap>(actions: T, deps?: ReadonlyArray<any>): BoundActionsMap<T> {
  const dispatch = useReduxDispatch()
  return useMemo(
    () => Object.keys(actions).reduce((acc, key) => {
      acc[key] = (...args: any[]) => dispatch(actions[key](...args))
      return acc
    }, {} as BoundActionsMap<T>),
    deps,
  )
}
