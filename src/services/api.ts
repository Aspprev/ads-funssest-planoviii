import axios from 'axios'

const api = axios.create({
  // baseURL: 'http://192.1.0.52:2020/webrunstudio/',
  // baseURL: 'https://apihmg.aspprev.tec.br/'
  baseURL: 'https://api.aspprev.tec.br/',
})

export default api
