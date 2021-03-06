# react-redux-hooks-poc

> A proof of concept for using react hooks to integrate with redux

[![NPM](https://img.shields.io/npm/v/@mrwolfz/react-redux-hooks-poc.svg)](https://www.npmjs.com/package/@mrwolfz/react-redux-hooks-poc)

## Disclaimer

This package is a proof of concept and neither stable nor properly tested. DO NOT USE this in production.

## Install

```bash
npm install --save @mrwolfz/react-redux-hooks-poc
```

## Usage

`useRedux` provides a state slice and the dispatch function.

```tsx
import React from 'react'
import { useRedux } from '@mrwolfz/react-redux-hooks-poc'

export const ExampleComponent = ({ id }) => {
  const [item, dispatch] = useRedux(state => state.items[id])

  const deleteItem = useMemo(() => dispatch({ type: 'delete-item', id }), [id])

  return (
    <div>
      <span>{item.label}</span>
      <button onClick={deleteItem}>Delete item</button>
    </div>
  )
}
```

Alternatively `useReduxState` and `useReduxDispatch` can be used separately.

```tsx
import React from 'react'
import { useReduxState, useReduxDispatch } from '@mrwolfz/react-redux-hooks-poc'

export const ExampleComponent = ({ id }) => {
  const item = useReduxState(state => state.items[id])
  const dispatch = useReduxDispatch()

  const deleteItem = useMemo(() => dispatch({ type: 'delete-item', id }), [id])

  return (
    <div>
      <span>{item.label}</span>
      <button onClick={deleteItem}>Delete item</button>
    </div>
  )
}
```

`useReduxActions` allows creating functions that dispatch actions.

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

## License

MIT © [MrWolfZ](https://github.com/MrWolfZ)
