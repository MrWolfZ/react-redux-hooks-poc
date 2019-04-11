import { Store } from 'redux'

declare module 'react-redux' {
  interface SubscriptionConstructor {
    new(store: Store, parentSub?: Subscription): Subscription
  }

  interface Subscription {
    constructor: SubscriptionConstructor
    onStateChange?: () => void
    trySubscribe(): void
    tryUnsubscribe(): void
  }

  interface ReactReduxContextValue {
    subscription: Subscription
  }
}
