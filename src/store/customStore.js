// private properties:
import reducer from "./reducer";

function createStore(reducer){
    let state;
    let listeners = [];

    function subscribe(listener){
        listeners.push(listener);
    }

    function dispatch(action){
        // Call the reducer to get the new state
        state = reducer(state, action);

        // notify the subscribers
        listeners.forEach(listener => {
            listener();
        });
        
    }

    function getState() {
        return state;
    }

    return {
        subscribe,
        dispatch,
        getState, // if the function get part of an object we say it's a method of that object
    }
};

export default createStore(reducer);
