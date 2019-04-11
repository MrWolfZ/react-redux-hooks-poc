import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useCallback } from 'react';
import { Store, createStore, Action, Reducer } from 'redux';
import { Provider } from 'react-redux';
import { render, fireEvent } from 'react-testing-library';
import { useRedux, useReduxState } from './index'

interface ExampleState {
  items: {
    [id: string]: {
      label: string
    }
  }
}

const initialExampleState: ExampleState = {
  items: {
    '1': {
      label: 'item 1',
    },
    '2': {
      label: 'item 2',
    },
  },
}

const exampleStateReducer: Reducer<ExampleState, Action> = (state = initialExampleState, action) => {
  if (action.type === 'delete-item') {
    const items = { ...state.items }
    delete items[(action as any).itemIdToDelete]

    return {
      ...state,
      items,
    }
  }

  return state
}

interface ItemProps {
  id: string
}

const Item = ({ id }: ItemProps) => {
  const [item, dispatch] = useRedux((state: ExampleState) => state.items[id])

  const deleteItem = useCallback(() => dispatch({ type: 'delete-item', itemIdToDelete: id }), [id])

  return (
    <div className='item'>
      <span className='label'>{item.label}</span>
      <button onClick={deleteItem}>Delete item</button>
    </div>
  )
}

const ItemList = () => {
  const itemIds = useReduxState((state: ExampleState) => Object.keys(state.items))
  return <>{itemIds.map(id => <Item key={id} id={id}></Item>)}</>
}

describe('hooks', () => {
  let store: Store<ExampleState>

  const App = () => (
    <Provider store={store}>
      <ItemList />
    </Provider>
  )

  beforeEach(() => {
    store = createStore(exampleStateReducer)
  })

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders all items', () => {
    const { container } = render(<App />);
    const items = container.querySelectorAll('.item')
    expect(items.length).toBe(2);
  });

  it('renders one item', () => {
    const { container } = render(<App />);
    const item = container.querySelector('.item')!.querySelector('.label')!
    expect(item.textContent).toBe('item 1');
  });

  it('handles dispatches', () => {
    const { container } = render(<App />);
    const button = container.querySelectorAll('.item')[1].querySelector('button')!

    fireEvent.click(button);

    const items = container.querySelectorAll('.item')
    expect(items.length).toBe(1);
  });

  it('works without a selector', () => {
    const Comp = () => {
      const state = useReduxState<ExampleState>()
      return <div className='test'>{Object.keys(state.items).length}</div>
    }

    const App = () => (
      <Provider store={store}>
        <Comp />
      </Provider>
    )


    const { container } = render(<App />);
    const comp = container.querySelector('.test')!
    expect(comp.textContent).toBe('2');
  });
})
