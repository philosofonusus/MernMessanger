import axios from "axios"

const DEV_ROOT = "http://localhost:3875"

export const Api = axios.create({
   baseURL: `${DEV_ROOT}`
})

export const Users = axios.create({
   baseURL: `${DEV_ROOT}/api/users`
})


export default { Users, Api }