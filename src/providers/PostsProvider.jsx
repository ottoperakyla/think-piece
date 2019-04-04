import React, { Component, createContext } from 'react'
import { postsListener } from '../api';

export const PostsContext = createContext()

class PostsProvider extends Component {
  state = {
    posts: []
  }

  postsUnsubscribe = null

  componentDidMount = async () => {
    this.postsUnsubscribe = postsListener(posts => {
      this.setState({ posts })
    })
  }

  componentWillUnmount() {
    this.postsUnsubscribe()
  }

  render() {
    const { posts } = this.state
    const { children } = this.props

    return (
      <PostsContext.Provider value={posts}>{children}</PostsContext.Provider>
    )
  }
}

export default PostsProvider
