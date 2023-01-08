import { createSlice } from "@reduxjs/toolkit";

let lastId = 0;
const projectSlice = createSlice({
    name: "projects",
    initialState: [],
    reducers: {
        projectAdded: (projects, action) =>{
            projects.push({
                id: ++lastId,
                name: action.payload.name,
            })
        },
        projectRemoved: (projects, action) => {
            // const index = projects.findIndex(project => project.id === action.payload.id);
            // projects = projects.splice(index,1);
            return projects.filter(project => project.id !== action.payload.id)
        }
    }

})

export const { projectAdded, projectRemoved } = projectSlice.actions;
export default projectSlice.reducer; 

