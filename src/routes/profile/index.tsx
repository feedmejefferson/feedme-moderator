import { Component, h } from "preact";
import { auth } from "../../components/firebase"
import SignIn from "../../components/SignIn"
import SignOut from "../../components/SignOut"
import User from "../../components/user"
import * as style from "./style.css";

interface Props {
}

interface State {
    user: any;
}
export default class Profile extends Component<Props, State> {
    public state = {
        user: null
    };


    public unsubscribeAuth = () => { };

    // gets called when this route is navigated to
    public componentDidMount() {
        this.unsubscribeAuth = auth.onAuthStateChanged(user => {this.setState({user})});
    }

    // gets called just before navigating away from the route
    public componentWillUnmount() {
        this.unsubscribeAuth();
    }

    public render({ }: Props, { user }: State) {
        return (
            <div class={style.profile}>
            {!user && <SignIn/>}
            {user &&  <User user={user}/>}
            {user &&  <SignOut/>}
            </div>
        );
    }
}
