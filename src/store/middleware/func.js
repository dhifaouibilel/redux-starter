// this middleware is already built for us. It's called thunk 
// if you're using Redux Toolkit you automatically get this middleware (getDefaultMiddleware from @reduxjs/toolkit)
// if you're not using Redux Toolkit you need to manually install redux-thunk 
const func = ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') action(dispatch, getState)
    else next(action);
}

export default func;

// with this simple middleware we can easily dispatch functions, and that allows us to make asynchronous API calls.