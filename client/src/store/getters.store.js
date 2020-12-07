export const getters = (state, module, states) => {
   let newState = {}
   states.forEach(key => newState[key] = state[module][key])
   return { state: newState }
}