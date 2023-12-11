import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { useReduxActions, useReduxState } from '@mrwolfz/react-redux-hooks-poc'
// Initial state
const initialExampleState = {
  items: {
    '1': {
      label: 'item 1',
    },
    '2': {
      label: 'item 2',
    },
  },
}

const exampleStateReducer = (state = initialExampleState, action) => {
  if (action.type === 'delete-item') {
    const items = { ...state.items }
    delete items[action.itemIdToDelete]

    return {
      ...state,
      items,
    }
  }

  return state
}

const Item = ({ id }) => {
  const item = useReduxState(state => state.items[id])
  const { deleteItem } = useReduxActions({
    deleteItem: () => ({ type: 'delete-item', itemIdToDelete: id })
  }, [id])

  return (
    <div className='item'>
      <span className='label'>{item.label}</span>
      <button onClick={deleteItem}>Delete item</button>
    </div>
  )
}

const ItemList = () => {
  const itemIds = useReduxState(state => Object.keys(state.items))
  return <>{itemIds.map(id => <Item key={id} id={id}></Item>)}</>
}

const store = createStore(exampleStateReducer)

export const App = () => {
  return (
    <Provider store={store}>
      <ItemList />
    </Provider>
  )
}

export default App
