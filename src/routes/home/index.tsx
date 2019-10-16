import { Component, h } from "preact";
import { Link } from "preact-router/match";
import * as style from "./style.css";

const updateTags = (newTags: string[]) => {};
interface Props {}
export default class Home extends Component<Props> {
    public render() {
        return (
            <div class={style.home}>
                <h1>Home</h1>
                <p>Welcome to the Feed Me, Jefferson! content currator.</p>
                <p>
                    Use the <Link activeClassName="" href="/food">Food</Link> tab
                    to explore food images and filter them by tags.
                </p>
                <p>
                    Use the <Link activeClassName="" href="/tags">Tags</Link> tab
                    to explore tags and the meaning that they attach to foods.
                </p>
                
            </div>
        );
    }
}
