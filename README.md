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

```tsx
import * as React from 'react'
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

## License

MIT © [MrWolfZ](https://github.com/MrWolfZ)
