import configureStore from './store/configureStore';

// import * as actions from './store/bugs';

// Reducing Coupling:
// import { bugAdded, bugRemoved, bugResolved, getUnresolvedBugs, bugAssignedToUser, getBugsByMember } from './store/bugs'
// import { projectAdded, projectRemoved } from './store/projects';

import { memberAdded, memberRemoved, getBugsOfMember } from './store/teamMembers'
import * as actions from './store/api'
// import myCustomStore from './customStore';
import { loadBugs, addBug, resolveBug, assignBugToUser, getUnresolvedBugs, getBugsByMember} from './store/bugs';


const store = configureStore(); 

// Subscribe to the store
//// this is basically something we do in the UI layer, so whenever the state of the store changes we want to refresh the UI
const unsubscribe = store.subscribe(() => {
  // this function gets called every time the state of the store gets changed
  console.log("Store changed!", store.getState());
});
// Dispatching Actions  
// store.dispatch({
//     // type: "bugAdded", 
//     type: actions.BUG_ADDED,
//     payload: {
//         description: "Bug1",
//     }
// })

// store.dispatch(memberAdded({name: "Member 1"}));
// store.dispatch(memberAdded({name: "Member 2"}));

// store.dispatch(projectAdded({name: "Project 1"}))
// store.dispatch(projectAdded({name: "Project 2"}));
// store.dispatch(projectAdded({name: "Project 3"}));

// store.dispatch(projectRemoved({id: 2}));

// store.dispatch(bugAdded({description: "the first bug is here!"}));
// store.dispatch(bugAdded({description: "the second bug is here!"}));
// store.dispatch(bugAdded({description: "the therd bug also need to debug!"}));
// store.dispatch(bugAssignedToUser({bugId: 1, memberId: 2}));
// store.dispatch(bugAssignedToUser({bugId: 2, memberId: 2}));
// store.dispatch(bugAssignedToUser({bugId: 3, memberId: 1}));
// store.dispatch(bugResolved({ id: 2 })); 

// store.dispatch((dispatch, getState) =>{
//   // Call an API
//   // when the promise is resolved => dispatch()
//   dispatch({type: "bugsReceived", bugs: [1, 2, 3]})
//   console.log(getState());
//   // getState is useful in situations where we want to do some decision making  
//   // For eg, before making an API call, we look at the store if the data that we have is already there, then there is no need to refresh it from the server 
// })

// store.dispatch({
//   type: "error",
//   payload: {
//     message: "An error occurred."
//   }
// })
 
store.dispatch(loadBugs())  

// setTimeout(()=> store.dispatch(loadBugs()), 2000)
// setTimeout(()=> store.dispatch(resolveBug(1)), 2000)
setTimeout(()=> store.dispatch(assignBugToUser(4, 3)), 2000)

// store.dispatch(addBug({description: 'a'}))

unsubscribe();  
// store.dispatch(bugRemoved({ id: 2 }));

// get unresolved Bugs
// const unresolvedBugs = store.getState().entities.bugs.filter(bug => !bug.resolved); 

const unresolvedBugs = getUnresolvedBugs(store.getState());
// const unresolvedBugs2 = getUnresolvedBugs(store.getState());
// console.log(unresolvedBugs === unresolvedBugs2);

const bugsOfMember2 = getBugsByMember(1)(store.getState())
// console.log(bugsOfMember2);

// the subscribe method returns a function for unsubscribing from the store 
// this is important because it is possible that the user navigates away from the current page and in the new page we're not going to have that UI component so we don't have to subscription to the store because this subscription can create memory leaks, so if the current UI component is not going to be visible we should unsubscribe from the store
// unsubscribe();
 
// store.dispatch({
//     // type: "bugRemoved", 
//     type: actions.BUG_REMOVED,
//     payload: {
//         id: 1,
//     }
// })

// store.dispatch(bugRemoved(1));
// console.log(store.getState());
// console.log(store);

// Action Types:
// one problem in this implementation is that we have hard-coded this string "bugAdded" in two places one is here where we are dispatching an action the other  is in a reducer where we're handling this action, what if tomorrow we decide to rename this from "bugAdded" to "bugCreated" then there are multiple places in our application that we have to update and if we don't do so we're going to create a bug .. so the solution is inside the actionTypes file

// Action Creators:
// the other problem we have in this implementation is how we dispatch an action, we have to type the entire structure of this object, what if there are multiple places where we want to dispatch the same action then we have to repeat all this structure in multiple places, and to improve this we can create a function that would create this action object for us, we call it action creator




// myCustomStore.subscribe(()=> console.log(`store changed`, myCustomStore.getState()))
// myCustomStore.dispatch(actions.bugAdded("this is a bug inside my custom store"))
// myCustomStore.dispatch(actions.bugAdded("this is an other bug"))
// myCustomStore.dispatch(actions.bugRemoved(2))
// myCustomStore.dispatch(actions.bugResolved(1))

// console.log(myCustomStore.getState()); 

 