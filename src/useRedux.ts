import { Dispatch } from 'redux';
import { useReduxState } from './useReduxState';
import { useReduxDispatch } from './useReduxDispatch';

/**
 * A hook to access the redux state and dispatch function from a component.
 *
 * Usage:
 *
```jsx
import React, { useCallback } from 'react'
import { useRedux } from '@mrwolfz/react-redux-hooks-poc'

export const ExampleComponent = ({ id }) => {
  const [item, dispatch] = useRedux(state => state.items[id])

  const deleteItem = useCallback(() => dispatch({ type: 'delete-item', id }), [id])

  return (
    <div>
      <span>{item.label}</span>
      <button onClick={deleteItem}>Delete item</button>
    </div>
  )
}
```
 */
export function useRedux<TState, TSlice = TState>(selector?: (state: TState) => TSlice): [TSlice, Dispatch] {
  const selectedState = useReduxState(selector)
  const dispatch = useReduxDispatch()
  return [selectedState, dispatch]
}
