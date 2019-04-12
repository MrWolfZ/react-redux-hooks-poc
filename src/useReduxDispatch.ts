import { useContext } from 'react';
import { Dispatch } from 'redux';
import { ReactReduxContext } from 'react-redux';

/**
 * A hook to access the redux dispatch function from a component.
 *
 * Usage:
 *
```jsx
import React, { useCallback } from 'react'
import { useReduxDispatch } from '@mrwolfz/react-redux-hooks-poc'

export const ExampleComponent = ({ id, label }) => {
  const dispatch = useReduxDispatch()
  const deleteItem = useCallback(() => dispatch({ type: 'delete-item', id }), [id])
  return (
    <div>
      <span>{label}</span>
      <button onClick={deleteItem}>Delete item</button>
    </div>
  )
}
```
 */
export function useReduxDispatch(): Dispatch {
  const { store } = useContext(ReactReduxContext)
  return store.dispatch
}
