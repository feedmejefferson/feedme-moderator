import { Component, h } from "preact";
import TagList from "../../components/tag-list";
import * as style from "./style.css";

const updateTags = (newTags: string[]) => {};
interface Props {}
export default class Home extends Component<Props> {
    public render() {
        return (
            <div class={style.home}>
                <h1>Home</h1>
                <p>This is the Home component.</p>
                <TagList updateTags={updateTags} tags={[
                    "hello",
                    "world",
                    "you",
                    "big",
                    "fuzzy",
                    "thing",
                    "things"
                ]}/>
            </div>
        );
    }
}
