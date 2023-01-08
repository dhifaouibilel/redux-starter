import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect"

let memberId = 0;
export const teamMembersSlice = createSlice({
    name: "teamMembers",
    initialState: [],
    reducers: {
        memberAdded: (state, action) => {
            state.push({id: ++memberId, name: action.payload.name});
        },
        memberRemoved: (state, action) =>{
            return state.filter(member => member.id !== action.payload.id)
        }
    }
})

export const {memberAdded, memberRemoved} = teamMembersSlice.actions;

export default teamMembersSlice.reducer;


export const getBugsOfMember = idMember => createSelector(
    state => state.entities.teamMembers,
    state => state.entities.bugs,
    (teamMembers, bugs) => teamMembers.filter(member => member.id === idMember).map(member => bugs.filter(bug => bug.id===member.bugId))
) 
