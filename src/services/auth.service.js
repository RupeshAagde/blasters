import { LocalStorageService } from './localstorage.service'
import { isBrowser, isNode } from 'browser-or-node'
let IframeWindow = null
const AuthService = {
  fetchUserData() {
    return new Promise((resolve, reject) => {
      window.grimlock.getUser &&
        window.grimlock
          .getUser()
          .then((res) => {
            resolve({
              isLoggedIn: true,
              userData: res,
              userFetched: true
            })
          })
          .catch((err) => {
            resolve({
              isLoggedIn: false,
              userFetched: true
            })
          })
    })
  },
  openLoginScreen() {
    this.IframeWindow = window.grimlock.openLoginDialog()
    return
  },
  openRegisterScreen() {
    this.IframeWindow = window.grimlock.openRegisterDialog()
  },
  onUserLoggedIn() {
    if (this.IframeWindow) {
      this.IframeWindow.close()
      window.location.href = '/organizations'
    }
  },
  onUserLoggedOut() {
    //Handle logged out
    //Clear localstorage data here.

    if (isBrowser) {
      LocalStorageService.removeAll()
      window.location.href = '/'
    }
    return
  },
  signOutUser() {
    return (
      window.grimlock &&
      window.grimlock
        .logout()
        .then((res) => {
          return res.data
        })
        .catch((err) => {
          return { error: true, msg: err }
        })
    )
  }
}
export default AuthService
