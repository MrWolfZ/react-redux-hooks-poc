import * as React from 'react';
import { createStore, Reducer } from 'redux';
import { Provider } from 'react-redux';
import { render, fireEvent } from 'react-testing-library';
import { useReduxState } from './index'
import { useReduxActions } from './useReduxActions';

describe(useReduxActions.name, () => {
  it('handles dispatches', () => {
    type Actions = { type: 'inc1' } | { type: 'inc2' }

    const reducer: Reducer<number, Actions> = (state = 0, action) => {
      if (action.type === 'inc1') {
        return state + 1
      }

      if (action.type === 'inc2') {
        return state + 2
      }

      return state
    }

    const store = createStore(reducer)

    let renderedNumbers: number[] = []
    const Comp = () => {
      const n = useReduxState<number>()
      const actions = useReduxActions({
        inc1: () => ({ type: 'inc1' }),
        inc2: () => ({ type: 'inc2' }),
      })
      renderedNumbers.push(n)
      return (
        <>
          <div>{n}</div>
          <button id='bInc1' onClick={actions.inc1} />
          <button id='bInc2' onClick={actions.inc2} />
        </>
      )
    }

    const App = () => (
      <Provider store={store}>
        <Comp />
      </Provider>
    )

    const { container } = render(<App />);
    const bInc1 = container.querySelector('#bInc1')!
    const bInc2 = container.querySelector('#bInc2')!

    fireEvent.click(bInc1)
    fireEvent.click(bInc2)

    expect(renderedNumbers).toEqual([0, 1, 3]);
  });

  it('passes through arguments', () => {
    type Actions = { type: 'adjust'; amount: number; isAdd: boolean }

    const reducer: Reducer<number, Actions> = (state = 0, action) => {
      if (action.type === 'adjust') {
        return action.isAdd ? state + action.amount : state - action.amount
      }

      return state
    }

    const store = createStore(reducer)

    let renderedNumbers: number[] = []
    const Comp = () => {
      const n = useReduxState<number>()
      const actions = useReduxActions({
        adjust: (amount: number, isAdd: boolean = true) => ({ type: 'adjust', amount, isAdd }),
      })
      renderedNumbers.push(n)
      return (
        <>
          <div>{n}</div>
          <button id='bInc1' onClick={() => actions.adjust(1)} />
          <button id='bInc2' onClick={() => actions.adjust(2)} />
          <button id='bDec1' onClick={() => actions.adjust(1, false)} />
        </>
      )
    }

    const App = () => (
      <Provider store={store}>
        <Comp />
      </Provider>
    )

    const { container } = render(<App />);
    const bInc1 = container.querySelector('#bInc1')!
    const bInc2 = container.querySelector('#bInc2')!
    const bDec1 = container.querySelector('#bDec1')!

    fireEvent.click(bInc1)
    fireEvent.click(bInc2)
    fireEvent.click(bDec1)

    expect(renderedNumbers).toEqual([0, 1, 3, 2]);
  });

  // TODO: test for deps
})
