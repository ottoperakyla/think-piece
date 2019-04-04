import React, { Component, createContext } from 'react'
import { auth, createUserProfileDocument } from '../firebase';

export const UserContext = createContext({ user: null })

class UserProvider extends Component {
  state = {
    user: null
  }

  userUnsubscribe = null

  componentDidMount = async () => {
    this.authUnsubscribe = auth.onAuthStateChanged(async userData => {
      const user = await createUserProfileDocument(userData)
      console.log(user)
      this.setState({ user })
    })
  }

  componentWillUnmount() {
    this.userUnsubscribe()
  }

  render() {
    const { user } = this.state
    const { children } = this.props

    return (
      <UserContext.Provider value={user}>{children}</UserContext.Provider>
    )
  }
}

export default UserProvider
