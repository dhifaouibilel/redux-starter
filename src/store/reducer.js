 import { combineReducers } from 'redux';
import entitiesReducer from './entities'

 // call it and give it an object, this object we specified the slices of our store
 export default combineReducers({
    entities: entitiesReducer,
 })