import { Component, h } from "preact";
import { Link } from "preact-router/match";
import * as style from "./style.css";

export default class Header extends Component {
    public render() {
        return (
            <header class={style.header}>
                <h1>Preact App</h1>
                <nav>
                    <Link activeClassName={style.active} href="/">
                        Home
                    </Link>
                    <Link activeClassName={style.active} href="/food">
                        Food
                    </Link>
                    <Link activeClassName={style.active} href="/tags">
                        Tags
                    </Link>
                    <Link activeClassName={style.active} href="/profile">
                        Profile
                    </Link>
                </nav>
            </header>
        );
    }
}
