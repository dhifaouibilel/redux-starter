// export const logger = (store, next, action) =>{
// export const logger = ({ getState, dispatch }) => next => action =>{
const logger = param => store => next => action => {
    console.log('Logging', param);
    // console.log('store:', store); 
    // console.log('next:', next);
    // console.log('action:', action);
    return next(action) // if we don't call next this action is not going to be processed further 
}

export default logger;

// this store it's not the store, its an object that looks like the store  

// next is a reference to the next Middleware function, now if this is the only middleware function we have, next is going to be the reducer that is going to handle this action

// currying 
// 1 functions with N params => a bunch of functions, each with a single parameter

