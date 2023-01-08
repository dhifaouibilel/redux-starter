// // using only Redux
// import { createStore, applyMiddleware } from "redux";
// import { devToolsEnhancer } from "@redux-devtools/extension";

// // using Redux ToolKit
import { configureStore } from "@reduxjs/toolkit";

import reducer from "./reducer";
import logger from './middleware/logger';
// import func from './middleware/func'
import toast from './middleware/toast'
import api from './middleware/api'

 
export default function (){
    
    return configureStore({ 
        reducer,
        // middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), logger({destination: "console"}), toast],
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat( toast, api) // logger({destination: "console"})
        // middleware: [
        //     logger({destination: 'console'}), 
        //     func
        // ]
     }); 
    // this allows to talk automatically with the redux devTools and allows us to dispatch Asynchronous Actions 
};


// Using only Redux

// Creating the Store:
// const store = createStore(reducer, devToolsEnhancer({ trace: true }), applyMiddleware(logger)) 
// this applyMiddleware is what we call a store enhancer, It's a function that allows us to enhance our store
// for getting a store enhancer, that will allowed the store to talk to redux devTools
// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );