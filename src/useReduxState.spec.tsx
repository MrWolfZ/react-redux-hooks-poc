import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useCallback, useState, useContext } from 'react';
import { Store, createStore, Action, Reducer } from 'redux';
import { Provider, ReactReduxContext, Subscription } from 'react-redux';
import { act, render, fireEvent } from 'react-testing-library';
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

// TODO: take these tests apart and only test this particular hook
describe(useReduxState.name, () => {
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

  // this test is based on an issue the library had at one point where
  // we did not update the latest known store state inside the layout
  // effect but only inside the subscription callback, which could lead
  // to missed state updates as this test showed
  it('does not cache stale state inside subscription callback', () => {
    type Actions = { type: 'inc0' } | { type: 'inc2' }

    const initialState = [0, 1, 2]
    const reducer: Reducer<number[], Actions> = (state = initialState, action) => {
      if (action.type === 'inc0') {
        const copy = state.slice(0)
        copy[0] += 1
        return copy
      }

      if (action.type === 'inc2') {
        const copy = state.slice(0)
        copy[2] += 1
        return copy
      }

      return state
    }

    const store = createStore(reducer)

    let renderedNumbers: number[] = []
    const Comp = ({ idx }: { idx: number }) => {
      const n = useReduxState((state: number[]) => state[idx])
      renderedNumbers.push(n)
      return <div>{n}</div>
    }

    const Parent = () => {
      const [idx, setIdx] = useState(1)
      return (
        <>
          <Comp idx={idx} />
          <button id='bUse0' onClick={() => setIdx(0)} />
        </>
      )
    }

    const App = () => (
      <Provider store={store}>
        <Parent />
      </Provider>
    )

    const { container } = render(<App />);
    const button = container.querySelector('#bUse0')!

    // get the subscription callback to memoize the latest selected state
    store.dispatch({ type: 'inc2' })

    // cause a props update of Comp
    fireEvent.click(button)

    // cause an update to the store which will return the same value as during the first invocation
    store.dispatch({ type: 'inc0' })

    expect(renderedNumbers).toEqual([1, 0, 1]);
  });

  it('subscribes to the store synchronously', () => {
    let rootSubscription: Subscription

    const Parent = () => {
      const { subscription } = useContext(ReactReduxContext)
      rootSubscription = subscription
      const count = useReduxState<number>()
      return count > 0 ? <Child /> : null
    }

    const Child = () => {
      const count = useReduxState<number>()
      return <div>{count}</div>
    }

    const store = createStore((state: number = -1) => state + 1)

    const App = () => (
      <Provider store={store}>
        <Parent />
      </Provider>
    )

    render(<App />)

    const spy = jest.spyOn(rootSubscription!, 'trySubscribe')

    expect(spy).toHaveBeenCalledTimes(0)
    store.dispatch({ type: '' })
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('ignores transient errors in selector (e.g. due to stale props)', () => {
    const Parent = () => {
      const count = useReduxState<number>()
      return <Child parentCount={count} />
    }

    const Child = ({ parentCount }: { parentCount: number }) => {
      const result = useReduxState<number>(count => {
        if (count !== parentCount) {
          throw new Error()
        }

        return count + parentCount;
      })

      return <div>{result}</div>
    }

    const store = createStore((count: number = -1) => count + 1)

    const App = () => (
      <Provider store={store}>
        <Parent />
      </Provider>
    )

    render(<App />)

    expect(() => store.dispatch({ type: '' })).not.toThrowError()
  })
})
