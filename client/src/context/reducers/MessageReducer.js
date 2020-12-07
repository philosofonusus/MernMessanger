const mutations = {
   SET_STATE: (state, payload) => {
      console.log("SET_STATE", payload)
      Object.keys(payload).forEach(k => state[k] = payload[k])
      return state
   },
   RESET_STATE: (state, initialState) => {
      let newState = { ...state }
      Object.keys(initialState).forEach(key => { newState[key] = initialState[key] })
      console.log("RESET_STATE", newState)
      return newState
   }
}
export const MessageReducer = (state, action) => {
   if (action && state) {
      let { type, payload } = action
      let mutation = mutations[type]
      let newState = mutation ? mutation(state, payload) : state
      return { ...state, ...newState }
   }
}