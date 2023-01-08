// // Using Redux Toolkit
import { createAction, createReducer, createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect';
import { apiCallBegan } from './api'
import moment from 'moment'

// // Action Types:
// const BUG_ADDED = 'bugAdded';
// const BUG_REMOVED = 'bugRemoved';
// const BUG_RESOLVED = 'bugResolved';

// Action Creators:

// export const bugAdded = createAction("bugAdded");
// export const bugAdded = (description) => ({
//     type: BUG_ADDED,
//         payload: {
//             description,
//         }
// });

// export const bugRemoved = createAction("bugRemoved");
// export function bugRemoved(id) {
//     return {
//         type: BUG_REMOVED,
//         payload: {
//             id,
//         }
//     }
// }


// export const bugResolved = createAction("bugResolved");
// export const bugResolved = (id) => ({
//     type: BUG_RESOLVED,
//     payload: {
//         id,
//     }
// })

// this makes the code a lot cleaner and if you want to dispatch the same action from multiple places we simply have to call these functions we don't have to worry about the structure of this action object, if tomorrow we want to change the structure of this action there is a single place we have to update 
// this is why we use action creator 


// Reducer:

// import {produce} from 'immer'
// [] the store is a simple Array of Bugs 
// this reducer is a pure function 
let lastId = 0;

// // Using Create Slice:
const bugSlice = createSlice({
    name: 'bugs',
    // initialState: [],
    initialState: {
        list: [],
        loading: false, //use it to call a loading indicator(loader) on the UI or spinner icon 
        lastFetch: null
    },
    reducers: {
        // actions => actions handler
        bugsRequested: (bugs, action) =>{
            bugs.loading = true;
        },

        bugsReceived:  (bugs, action) =>{
            bugs.list = action.payload;
            bugs.loading = false;
            bugs.lastFetch = Date.now();
        },       

        bugsRequestFailed: (bugs, action) =>{
            bugs.loading = false;
        },
        bugAssignedToUser: (bugs, action) =>{
            const { id: bugId, userId } = action.payload;
            const index = bugs.list.findIndex(bug => bug.id === bugId);
            bugs.list[index].userId = userId; 
        },

        // command - event
        // addBug - bugAdded (in DDD or CQRS you heard of the terms command and event)
        bugAdded: (bugs, action) =>{
            bugs.list.push(action.payload)
            // bugs.list.push({
            //     id: ++lastId,
            //     description: action.payload.description,
            //     resolved: false,
            //     memberId: action.payload.memberId
            // })
        },

        // resolveBug (command) - bugResolved(event)
        bugResolved: (bugs, action) => {
            const index = bugs.list.findIndex(bug => bug.id === action.payload.id );
            bugs.list[index].resolved = true;
        },

        bugRemoved: (bugs, action) => {
            return bugs.list.filter(bug => bug.id !== action.payload.id)

        }
    }
})
// console.log(bugSlice);

// ! export  👇 ❌ => Reducing coupling principle but exported for tesT
const { bugsReceived, bugsRequested, bugsRequestFailed, bugAdded, bugResolved, bugRemoved, bugAssignedToUser } = bugSlice.actions;
export default bugSlice.reducer;

// * Action Creator
const url = "/bugs";

export const loadBugs = () => (dispatch, getState) =>{
    // implementing caching only in bugsSlice, but if you want to implement caching in multiple Slices, you don't want to repeat all this logic .. also we have the number(that specify haw long your chache should be valid) you should avoid in real app, you should  store these values in a configuration file 
    const {lastFetch} = getState().entities.bugs;
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes')
    if (diffInMinutes < 10) return;

    return dispatch(
        apiCallBegan({
            url,
            // method: "get", //by default get is used
            onStart: bugsRequested.type,
            onSuccess: bugsReceived.type,
            onError: bugsRequestFailed.type,
            // onError: actions.apiCallFailed.type
        })
    )
}

export const addBug = bug => apiCallBegan({
    url,
    method: "post",
    data: bug,
    onSuccess: bugAdded.type,
})

export const resolveBug = id => apiCallBegan({
    url: url + '/' + id,
    method: "patch",
    data: { resolved: true },
    onSuccess: bugResolved.type, 
})

export const assignBugToUser = (id, userId) => apiCallBegan({
    url: url + '/' + id,
    method: "patch",
    data: { userId },
    onSuccess: bugAssignedToUser.type,
})
 
// Selector 
// each time we call this function we get a different result, because react if the state changes, our components get rerendered.
// export const getUnresolvedBugs = state => {
//     return state.entities.bugs.filter(bug =>!bug.resolved);
// }

// Memorization 
// bugs => get unresloved bugs from the cache
// with this selector if the list of bugs is not changed, the logic is not to be executed again
// this selector will return the result from the cache
export const getUnresolvedBugs = createSelector(
    state => state.entities.bugs,
    bugs => bugs.list.filter(bug => !bug.resolved)
)

export const getBugsByMember = memberId => createSelector(
    state => state.entities.bugs,
    bugs => bugs.list.filter(bug => bug.memberId === memberId)
)

// // Using createReducer from Redux ToolKit
// export default createReducer([], {
//     // key: value
//     // actions: functions (event => event handler)
//     [bugAdded.type]: (bugs, action) => {
//         bugs.push({
//                     id: ++lastId,
//                     description: action.payload.description,
//                     resolved: false,
//                 })
//     },
//     [bugResolved.type]: (bugs, action) => {
//         const index = bugs.findIndex(bug => bug.id === action.payload.id );
//         bugs[index].resolved = true;
//     },
//     [bugRemoved.type]: (bugs, action) => {
//         return bugs.filter(bug => bug.id !== action.payload.id)
//     }

// })



// inside Ducks Pattern always the reducer has be a default export in this module
// export default function reducer (state=[], action) {
//     switch (action.type) {
//         case bugAdded.type:
//         // case BUG_ADDED:
//             console.log(action);
//             return [
//                 ...state,
//                 {
//                     id: ++lastId,
//                     description: action.payload.description,
//                     resolved: false,
//                 }
//             ];
//         case bugRemoved.type:
//         // case BUG_REMOVED:
//             return state.filter(bug => bug.id !== action.payload.id)
//         case bugResolved.type:
//         // case BUG_RESOLVED:
//             const bug_resolved = state.find(bug => bug.id === action.payload.id)
//             // return [
//             //     ...state.slice(0, bug_resolved.id-1),
//             //     {
//             //        ...bug_resolved,
//             //         resolved: true,
//             //     },
//             //     ...state.slice(bug_resolved.id)
//             // ]
            
//             return state.map(bug => bug.id === action.payload.id? ({...bug, resolved : true}) : bug)

//             // // Using Immer: 
//             // return produce(state, newState => {newState.map(bug => bug.id === action.payload.id? bug.resolved = true : bug.resolved) 
//             // })
//         default:
//             return state;
//     }
    
// }