import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from '../router/index'
import AuthService from '../AuthService'

Vue.use(Vuex)

//Allows axios to work locally or live
let base = window.location.host.includes('localhost:8080') ? '//localhost:3000/' : '/'

let api = Axios.create({
  baseURL: base + "api/",
  timeout: 3000,
  withCredentials: true
})

export default new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    resetState(state) {
      state = {
        user: {}
      }
    },
    setItem(state, payload) {
      state[payload.address] = payload.data;
    },
    removeItem(state, payload) {
      state[payload.address].filter(item => item._id = payload.data._id)
    },
    resetItem(state, payload) {
      state[payload.address].clear()
    }
  },
  actions: {
    //SECTION  -- AUTH STUFF --
    async register({ commit, dispatch }, creds) {
      try {
        let user = await AuthService.Register(creds)
        commit('setUser', user)
        router.push({ name: "boards" })
      } catch (e) {
        console.warn(e.message)
      }
    },
    async login({ commit, dispatch }, creds) {
      try {
        let user = await AuthService.Login(creds)
        commit('setUser', user)
        router.push({ name: "boards" })
      } catch (e) {
        console.warn(e.message)
      }
    },
    async logout({ commit, dispatch }) {
      try {
        let success = await AuthService.Logout()
        if (!success) { }
        commit('resetState')
        router.push({ name: "login" })
      } catch (e) {
        console.warn(e.message)
      }
    },
    // SECTION functional actions
    get({ commit }, payload) {
      api
        .get("" + payload.address)
        .then(res => {
          commit(payload.commit, {
            data: res.data,
            address: payload.commitAddress
          });
        })
        .catch(e => console.error(e));
    },
    getOne({ commit }, payload) {
      api
        .get("" + payload.address + "/" + payload.data._id)
        .then(res => {
          commit(payload.commit, {
            data: res.data,
            address: payload.commitAddress
          });
        })
        .catch(e => console.error(e));
    },
    getOneByAnother({ commit }, payload) {
      api
        .get(
          "" +
          payload.address1 +
          "/" +
          payload.data._id +
          "/" +
          payload.address2
        )
        .then(res => {
          commit(payload.commit, {
            data: res.data,
            address: payload.commitAddress
          });
        });
      // for using ref's. address 1 is where the id/ref comes from, address 2 is what youre looking for, commitAddress is where it's going in the state.
    },
    create({ commit }, payload) {
      api
        .post("" + payload.address, payload.data)
        .then(res => {
          commit(payload.commit, {
            data: res.data,
            address: payload.commitAddress
          });
        })
        .catch(e => console.error(e));
    },
    edit({ commit }, payload) {
      api
        .put(
          "" + payload.address + "/" + payload.data._id || payload._id,
          payload.data
        )
        .then(res => {
          commit(payload.commit, {
            data: res.data,
            address: payload.commitAddress
          });
        })
        .catch(e => console.error(e));
    },
    delete({ commit }, payload) {
      api.delete("" + payload.address + "/" + payload.data._id).then(res => {
        commit(payload.commit, {
          data: res.data,
          address: payload.commitAddress
        });
      });
    },
    setActive({ commit }, payload) {
      commit(payload.commit, {
        data: payload.data,
        address: payload.commitAddress
      })
    }
  }
})
