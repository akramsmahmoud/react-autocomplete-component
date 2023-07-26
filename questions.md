1. What is the difference between Component and PureComponent? Give
   an example where it might break my app.

   - `PureComponent` it's a function that return the same value for the same prop and we can call it stateless component, `PureComponent` has built-in shouldComponentUpdate that control the change of the prop automatically to prevent unnecessary re-render

2. Context + ShouldComponentUpdate might be dangerous. Why is that?

   - I think might be dangerous if the context state get updated and ShouldComponentUpdate not recognize this change and we risk to have not updated data in the UI, it's not recommended to use ShouldComponentUpdate so much and let react do that for us

3. Describe 3 ways to pass information from a component to its PARENT.

   - 1. Global store using global store management like redux or zustand

     2. callback function as I did in the autocomplete component which accept onChange prop as a function and passing the value of the selected item
        3.context API if the parent and child component are wrapped by the context provider

4. Give 2 ways to prevent components from re-rendering.

   - 1. using the useMemo react hook, to rerender component only when data get updated
     2. May be also `PureComponent` could be a solution

5. What is a fragment and why do we need it? Give an example where it might
   break my app.

   - we use it to wrap multiple items in case we don't need to create extra new node and we will have better performance because we will have shorter dom tree so less memory

     Note: I think react present fragment because all react components are objects thanks to JSX, and in JS we can't have object without `{}` that wrap our object to define it as an object

6. Give 3 examples of the HOC pattern.

   - HOC is stands for High Order Component same as 'Hof' in JS, it's a component that accept another component as a prop, HOC was popular we had more classes component, and was a good pattern to make somekind of control before we render our component, examples:
     `withAuth` => this Hoc control first the Authentication before render our component
     `withTranslation` => that we use with i18next library for i18n, that pass some library functions as a prop to translate our labels

     I don't have in mind third example now

7. What's the difference in handling exceptions in promises, callbacks
   and async...await?

   - for promises we use `catch`
     and for `async` ... `await` we can wrap them inside `try{...}catch{}`
     and for callback we can make some custom control and return the error and can also use `throw new Error()`

8. How many arguments does setState take and why is it async.

   - 2 arguments, first one is an object/default_value for new state or also may take a function to have state based on the prev state, the second argument is just a callback run after setState
     `setState` is async because if it was sync in case of expensive operation that would make the browser unresponsive, even if making it async will be harder manage for developers but grantee better performance, and we can manage the problem of the async setState using the second argument

9. List the steps needed to migrate a Class to Function Component.

   - 1. transform 'class' to function

   2. remove render function and make the component return just the JSX
   3. replace the state object with the useState hook
   4. remove the constructor
   5. replace any functions that get launched during the life cycle of the component with their equivalent in useEffect hook

10. List a few ways styles can be used with components.

    - 1. css modules
      2. css in js ex: styled-components and emotion-css
         3.inline styles using the attribute style

11. How to render an HTML string coming from the server.

    - we can use the `dangerouslySetInnerHTML` attribute, and it's not recommended to use it so much only when necessary
