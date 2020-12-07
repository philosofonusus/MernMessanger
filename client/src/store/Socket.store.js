
const initialState = {
   socket: null,
   clientId: null
}

const mutations = {
   SET_STATE: (state, payloads) => {
      Object.keys(payloads).forEach(key => state[key] = payloads[key])
      return state
   }
}

export const SocketRedicer = (state = { ...initialState }, action) => {

   if (Array.isArray(action)) {
      let [type, payload] = action
      console.log(type, payload)
      let mutation = mutations[type]
      let newState = mutation ? mutation(state, payload) : state
      return { ...state, ...newState }
   } else {
      return state
   }
}