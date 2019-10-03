import { Component, h } from 'preact';
import { auth, googleAuthProvider } from '../firebase';

interface Props {
    user: any;
}

export default class User extends Component<Props> {

    public render({ user }: Props) {
        return (
          <div>
            <h1>Profile: {user.displayName}</h1>
              <p>This is the user profile for a user named {user.displayName}.</p>
          </div>
        );
    }
}
