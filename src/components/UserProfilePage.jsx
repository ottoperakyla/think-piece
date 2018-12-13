import React, { Component } from 'react';
import { auth, firestore, storage } from '../firebase';
import PostsForUser from './PostsForUser';
import Post from './Post';
import withUser from './withUser';


class UserProfile extends Component {
  state = { displayName: '' };
  imageInput = null;

  get uid() {
    if (!this.props.user) return;
    return this.props.user.uid;
  }

  get userRef() {
    return firestore.collection('users').doc(this.uid);
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  get file() {
    return this.imageInput && this.imageInput.files[0];
  }

  handleSubmit = event => {
    event.preventDefault();

    const { displayName } = this.state;

    if (displayName) {
      this.userRef.update(this.state);
    }

    if (this.file) {
      storage
        .ref()
        .child('user-profiles')
        .child(this.uid)
        .child(this.file.name)
        .put(this.file)
        .then(resp => resp.ref.getDownloadURL())
        .then(photoURL => this.userRef.update({ photoURL }));
    }
  };

  render() {
    const { displayName } = this.state;

    return <div>Loading…</div>;

    return (
      <section className="UserProfile">
        <form onSubmit={this.handleSubmit} className="UpdateUser">
          <input
            type="text"
            name="displayName"
            value={displayName}
            placeholder="Display Name"
            onChange={this.handleChange}
          />
          <input type="file" ref={ref => (this.imageInput = ref)} />
          <input className="update" type="submit" />
        </form>
        <div>
          <PostsForUser uid={this.uid}>
            {posts => posts.map(post => <Post {...post} key={post.id} />)}
          </PostsForUser>
        </div>
      </section>
    );
  }
}

export default withUser(UserProfile);