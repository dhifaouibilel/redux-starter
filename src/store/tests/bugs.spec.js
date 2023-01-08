import { loadBugs, addBug, resolveBug, assignBugToUser, getUnresolvedBugs } from '../bugs'  // , bugAdded 
// import { apiCallBegan } from '../api'
import configureStore from '../configureStore'
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios'

// this is test is not really a unit test its an integration test because is talk to an external resources a webservice 
describe('bugsSlice', ()=>{
    let fakeAxios;
    let store;

    beforeEach(()=>{
        fakeAxios = new MockAdapter(axios);
        store = configureStore();
    })

    //helper functions
    const bugsSlice = () => store.getState().entities.bugs;
    const createState = () => ({
        entities: {
            bugs: {
                list: []
            }
        }
    })

    describe('loading bugs', ()=>{
        describe("if the bugs exists in the cache", ()=>{
            it("they should not be fetched from the server again", async()=>{
                fakeAxios.onGet('/bugs').reply(200, [{id: 1}])

                await store.dispatch(loadBugs())
                await store.dispatch(loadBugs())

                expect(fakeAxios.history.get.length).toBe(1)

            })
        });
        describe("if the bugs don't exists in the cache", ()=>{
            it("they should be fetched from the server and put in the store", async()=>{
                fakeAxios.onGet('/bugs').reply(200, [{id: 1}])

                await store.dispatch(loadBugs())

                expect(bugsSlice().list).toHaveLength(1)
                // expect(fakeAxios.handlers.get[0][4]).toStrictEqual(bugsSlice().list)

            })
            describe("loading indicator", ()=>{
                it("should be true while fetching the bugs", ()=>{
                    fakeAxios.onGet('/bugs').reply(()=>{
                        expect(bugsSlice().loading).toBe(true)
                        return [200, [{id: 1}]]
                    })

                    store.dispatch(loadBugs())
                })

                it("should be false after bugs are fetched", async()=>{
                    fakeAxios.onGet('/bugs').reply(200, [{id: 1}])

                    await store.dispatch(loadBugs())

                    expect(bugsSlice().loading).toBe(false)
                })

                it("should be false if the server fails", async()=>{
                    fakeAxios.onGet('/bugs').reply(500)

                    await store.dispatch(loadBugs())

                    expect(bugsSlice().loading).toBe(false)
                })
            })
        });

        
    })

    

    it("should add the bug to the store if it's saved to the server", async ()=>{

        //Arrange
        const bug = {description: 'a'} 
        const savedBug = { ...bug, id:1 }
        fakeAxios.onPost('/bugs').reply(200, savedBug)

        //Act
        const result = await store.dispatch(addBug(bug));
        // console.log(store.getState());

        //Assert
        // expect(store.getState().entities.bugs.list).toHaveLength(1)
        expect(bugsSlice().list).toContainEqual(savedBug)
    })

    it("should not add the bug to the store if it's not saved to the server", async ()=>{
        const bug = {description: 'a'} 
        fakeAxios.onPost('/bugs').reply(500);

        await store.dispatch(addBug(bug));

        expect(bugsSlice().list).toHaveLength(0)
    })


    it("should mark the bug as resolved if it's saved to the server", async ()=>{
        //Arrange
        fakeAxios.onPatch('/bugs/1').reply(200, { id: 1, resolved: true })
        fakeAxios.onPost('/bugs').reply(200, { id: 1 })

        //Act
        await store.dispatch(addBug({ }));
        await store.dispatch(resolveBug(1));
        // console.log(store.getState());

        expect(bugsSlice().list[0].resolved).toBeTruthy()
    })

    it("should not mark the bug as resolved it's not saved to the server", async ()=>{

        fakeAxios.onPatch('/bugs/1').reply(500);
        fakeAxios.onPost('/bugs').reply(200, { id: 1 })

        await store.dispatch(addBug({ }));
        await store.dispatch(resolveBug(1));

        expect(bugsSlice().list[0].resolved).toBeFalsy()
    })

    it("should assign the bug to user if it's saved to the server", async ()=>{
        //Arrange
        fakeAxios.onPatch('/bugs/1').reply(200, { id: 1, "userId": 2 })
        fakeAxios.onPost('/bugs').reply(200, { id: 1 })

        //Act
        await store.dispatch(addBug({ }));
        await store.dispatch(assignBugToUser(1, 2));
        // console.log(store.getState());

        expect(bugsSlice().list[0].userId).toBe(2)
    })

    it("should not assign user to the bug if it's not saved to the server", async ()=>{

        fakeAxios.onPatch('/bugs/1').reply(500);
        fakeAxios.onPost('/bugs').reply(200, { id: 1 })

        await store.dispatch(addBug({ }));
        await store.dispatch(assignBugToUser(1, 2));

        expect(bugsSlice().list[0].userId).toBeUndefined()
    })

    describe('selectors', ()=>{
        it("getUnresolvedBugs", async ()=>{

            const state =createState();
            state.entities.bugs.list = [{id: 1, resolved: true}, {id:2}, {id:3}]
    
            //Act
            const result = getUnresolvedBugs(state)
    
            //Assert
            expect(result).toHaveLength(2)
        })
    })
    
    
})

// Example of solitary Test
// describe('bugsSlice', ()=>{
//     describe('action creators', ()=>{
//         it('addBug', ()=>{
//             const bug = {description: 'a'}
//             const result = addBug(bug);
//             const expected = {
//                 type: apiCallBegan.type,
//                 payload: {
//                     url: '/bugs',
//                     method: 'post',
//                     data: bug, 
//                     onSuccess: bugAdded.type
//                 }
//             }
//             expect(result).toEqual(expected)
//         })
//     })
// })
