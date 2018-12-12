# Reach Workshop Notes

# Modern React Features and Patterns

## Imperative to Declarative

### Why do we like React?

1. Declarative
2. Composable
3. "Just JavaScript"

#### Declarative

##### Car Example

Want to keep car at 71 degrees, but you have to control fan and temperature without getting to use degrees. Without React we describe all the DOM nodes, classes, etc but don't get to talk about the UI structure as a user uses it.

##### React

React is Declarative - we describe the UI as a function of state. Non-declarative (imperative) code tends to describe the UI as a function of time

Declarative is an abstraction. Somewhere there is an imperative implementation.

`setState` is the one imperative construct in React

##### Composable

Allows us to create abstractions and compose it into another component. This can be used for code re-use using props to pass down state from the parent to the children

State and Props are used to create shared interfaces

##### Excercise Notes

- Remember children is an array i.e. `<Component>Someting {myLocalVar} Else</Component>` will be `["Something", myLocalVar, "Else"]`
- Render may be called multiple times, so don't do side effects in there.
- It is perfectly reasonable to have components that return null and only use lifecycle methods to do side effects

## HOC and Render Props

Higher Order Components (HOC) and Render Props are useful for code reuse

### HOCs

function that takes as an arugument a Component definition (i.e. not a rendered component) and returns a new component definition which renders the passed in component with some props calculated

### Render Props

Render prop pattern uses a render prop defined as a function which takes in some data and returns a the UI

### Comparing the Two

#### Cons for HOCs
- have implicit dependencies 
  - i.e. `withAddress` HOC needs props from `withGeo` HOC and would be used like `withGeo(withAddress(Component))`
- can have prop name clashes when composed
- Snowballing complexity*
- Configuration is static 
  - i.e. can't be changed in a declarative way
- Cannot conditionally use the side effects of the HOC. 
  - Ice cream cone analogy: 
    - HOC is like dipping an ice cream cone. You can't un-dip the cone.
    - Render Props are like a bowl of icecream with separate toppings. You can put a different topping or no toppings on each bite.

#### Cons for Render Props
- Components can get big and ugly
  - Can be cleaned up by creating a HOC with the Render Prop component if neccessary
- Data is not available in lifecycle methods, only in the render method
  - Must use another component or some sort of callback
- Cannot be a pure component
  - If children are used for the render prop/function the component will re-render every time
  - If a prop is used render props may not always re-render when you want it to

## React Hooks (Not Yet Available Officially)
[Video](https://www.youtube.com/watch?v=dpw9EHDh2bM)

- Generally a replacement for HOCs and Render Props
- Solves the "false hierarchy" that often happens with Render Props
- Adds `useState` and `useEffect` to React API
- `useState` returns `[value, setState]`
- Before hooks, we used lifecycle methods to do side effects. This meant that we have to handle when to do our side effects based on what react does. Hooks allow us to tell react how to manage our side effects.
- `useEffect` takes a function to call and an array of dependencies. When one of the dependencies changes, the function is called. The function returns another function to destroy any previous state. If there are no dependencies, the function gets called on every render.
  - In the future, babel could handle the dependencies and we can ignore checking if we need to run the function
  - Currently there are a lot of poorly implemented `componentDidUpdate` that don't check the diffs. Hooks makes that more obvious.
- Hooks allow us to use one effect for some type of side effect and handle all the react lifecycle in one place rather than each lifecycle method handling multiple side effects
- Hooks also add `useRef`, `useMemo`, `useContext` and some others


## Clone Elements

- React has a `cloneElement` function that allows a component to pass some props to its children
- This allows us to compose components more like HTML with parent elements implicitly passing props based on some state
- Allows you to build very granular components which you can then wrap into another higher level component to make simple use cases easy by also allows you to have easily have control over the individual components if you need it
- Forces you to keep the heirarchy of the components the same because you have rely on the children being the type of component you expect



## Context

- Solves similar problems as how we used Clone Elements, but doesn't have the tradeoff of requiring the heierarchy the same
- Use `React.createContext` to create a `Consumer` and a `Provider` component
- `Provider` takes a `value` prop that will be consumed by any `Consumer` components rendered anywhere under the `Provider` in the tree
- `Consumer` takes a child render prop which will get the value from the nearest `Provider` above it in the tree
- Rather than using a `Consumer` you can also use `static contextType` property on class based components
  - Gives a cleaner syntax than the render prop
  - Also allows you to access context value within lifecycle methods
  - Downside is you can only use one context in your component
- Hooks include a `useContext` method that works similar to the `static contextType` for functional components. This will probably be the best way to use context when hooks becomes an official part of React


## Portals

Allow us to render dom nodes for our component in a different place in the DOM tree than in the React tree

Very good for any content that you want to overlay other content

Events bubble through the React tree, regardless of the DOM tree

Also work through windows with `window.open`

focus and screen reader virtual cursor are not trapped in the portal. Need to add `aria-hidden=true` to all elements. This is much easier with portals because you only have to loop through root nodes rather than traversing up a tree

# Accessibility

## WAI ARIA

[WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/)

Accessibility design still has some choices to be made. I.e. if you should put headings on a non-document page such as the reach homepage. Above link has guidelines for best practices for common web widgets

## Accesibility Gotchas

- Can end up with weird events firing when keeping the react state and focus states synced. May have to use `event.preventDefault()` or `event.stopPropagation()`
- Must have a `tabIndex` property on a non-interactive element to be able to focus it. `tabIndex="0"` puts it in tab order `tabIndex="-1"` allows programatic focus
- We often forget to handle accessibility when using tools that do it well. I.e. click a button, that opens a modal with a form, the user submits the form which triggers events which removes the original button. The dev needs to make sure the focus goes to the correct element, since it can't go back to the button.

# Future React

Few changes in React over past 5ish years
- Mixins removed
- Context
- propTypes changes

React rendering is currently sync.

JS is single threaded, so if react is rendering other things such as typing doesn't work

Debouncing helps, but you still have one big render somewhere

New Concurrent rendering renders using `requestIdleTimeout` so it renders in little chunks while still allowing the user to interact with other things.

Will be able to continue to use deprecated lifecycle methods in the future, just not with concurrent rendering. Will mark components as concurrent safe or not

`componentWillMount`, `componentWillUpdate`, `componentWillReceiveProps` are not compatible because we might need to throw away state between `componentWill*` and `componentDid*` if something changed due to it rendering in chunks.

## GetSnapshotBeforeUpdate (GSBU)

Similar to `componentWillUpdate`

`getSnapshotBeforeUpdate` returns some value based on the previous render. The returned value gets passed as a third argument to `componentDidUpdate`

There isn't an equivalent with react hooks yet.

Possible things that might be coming would look something like 
```
useSnapshot(() => {
  // closure where we can set some values based on component before the update
  myVar = window.something.someProperty === someOtherThing // example, could use a ref or something else to get some component state
  return () => {
    // this function gets called after the update, but is still in the closure so has access to the old values
    if (myVar) {
      doSomething()
    } else {
      doAnotherThing()
    }
  }
})
```
__or__
```
// ... code in the component
myVar = true
useSnapshot(() => {
  // this gets called before the update
  if (someCondition) {
    myVar = false
  }
}, () => {
  // this get called after the update
  if (myVar) {
    doSomething()
  } else {
    doSomethingElse()
  }
})
// ... more code in the component
```

## GetDerivedStateFromProps (GDSFP)
[You Probably Don't Need Derived State – React Blog](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

static lifecycle method

`static getDerivedStateFromProps(props, state)` and returns what the new state updates should be

called on every render 

This is used to get around uses of deprecated `componentWillUpdate` that were doing side effects that they shouldn't have been such as
```
class MyComponent extends React.Component {

  state ={
    loading: true;
  }

  componentDidMount() {
    this.fetch(this.props.url);
  }
  
  componentWillUpdate(nextProps) {
    if (nextProps.url !== this.props.url) {
      // Note that this setting the state to the intial state, then doing the same thing as componentDidMount
      this.setState({
        loading: true,
      })
      this.fetch(nextProps.url)
    }
  }

  async fetch(url) {
    // do stuff
  }
  
  render() {
    // stuff
  }
}
```

Probably don't need this because you can either:
- move everything into `componentDidUpdate`
  - Will cause an extra re-render. This probably doesn't matter for most use cases
- If your side effect causes your component to reset it's state, just use a key on the component and change the key. Then move the state



## Suspense

Probably won't be available until mid 2019

Allows us to suspend rendering for either some amout of time or until all data is ready. This gets rid of tons of spinners flashing on fast networks or hanging on slow networks.

2 parts: `Suspense` component and `createResource` function

`createResource(myFunc)` where `myFunc` is a function that 

Should move reads to where they are used. Results are memoized, so they will only fetch when needed.

Can use `React.lazy()` with `Suspense` today to do dynamic code splitting

# Other Notes
 - Don't over-optimize if not needed
   - Think about how to optimize Leaf Components first as those are usually the heaviest on performance

__Hide Focus box for mouse users__
```
:focus:not(:focus-visible) {
  outline: none;
}
```

## Look Up Later
- State Charts
- React.memo
