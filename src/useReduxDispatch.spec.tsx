import * as React from 'react';
import { Dispatch } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from 'react-testing-library';
import { useReduxDispatch } from './index'

const store = createStore((c: number) => c + 1)

describe(useReduxDispatch.name, () => {
  it('returns the same reference when called twice in a component', () => {
    let dispatch1: Dispatch<any> = undefined!
    let dispatch2: Dispatch<any> = undefined!

    const Comp = () => {
      dispatch1 = useReduxDispatch()
      dispatch2 = useReduxDispatch()
      return <div>test</div>
    }

    const App = () => (
      <Provider store={store}>
        <Comp />
      </Provider>
    )

    render(<App />)

    expect(dispatch1).toBe(dispatch2)
  });

  it('returns the same reference when called in two renders', () => {
    let dispatch1: Dispatch<any> = undefined!
    let dispatch2: Dispatch<any> = undefined!

    const Comp = () => {
      if (!dispatch1) {
        dispatch1 = useReduxDispatch()
      } else {
        dispatch2 = useReduxDispatch()
      }
      return <div>test</div>
    }

    const App = () => (
      <Provider store={store}>
        <Comp />
      </Provider>
    )

    render(<App />)
    render(<App />)

    expect(dispatch1).toBe(dispatch2)
  });
})
