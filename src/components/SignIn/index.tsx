import { Component, h } from 'preact';
import { auth, googleAuthProvider } from '../firebase';

export default class SignIn extends Component {
  public render() {
    return (
      <section>
        <h1>Sign in</h1>
        <button onClick={() => auth.signInWithRedirect(googleAuthProvider)}>
          Sign In
        </button>
      </section>
    );
  }
}