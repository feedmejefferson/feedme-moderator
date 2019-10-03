import { Component, h } from 'preact';
import { auth } from '../firebase';

export default class SignOut extends Component {
  public render() {
    return (
      <section>
        <h1>Sign out</h1>
        <button onClick={() => auth.signOut()}>
          Sign Out
        </button>
      </section>
    );
  }
}