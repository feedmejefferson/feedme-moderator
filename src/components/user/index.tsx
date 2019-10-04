import { Component, h } from 'preact';
import * as style from "./style.css";

interface Props {
    user: any;
}

export default class User extends Component<Props> {

    public render({ user }: Props) {
        return (
          <div>
            <h1>Profile: {user.displayName}</h1>
              <img alt={user.displayName} src={user.photoURL} class={style.avatar} />
              <p>This is the user profile for a user named {user.displayName}.</p>
          </div>
        );
    }
}
