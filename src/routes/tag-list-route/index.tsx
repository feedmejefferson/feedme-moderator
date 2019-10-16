import { Component, h } from "preact";
import { Link } from "preact-router/match";
import { firestore } from "../../components/firebase"
import TagList from "../../components/tag-list";
import { TagType } from "../../types";
import * as style from "./style.css";

const updateTags = (newTags: string[]) => {};
interface Props {
    tag?: string;
}
interface State {
    tags: string[];
}

const tagPromise = firestore.collection("indexes").doc("tagIds").get();


export default class TagListRoute extends Component<Props, State> {
    public state = {
        tags: []
    }

    public componentWillMount() {
        tagPromise.then(doc => {
            const data = doc.data();
            const tags = data && data.ids;
            this.setState({tags})});      
    }

    public render({}: Props, {tags}: State) {
        return (
            <div class={style.page}>
                <h1>Tags</h1>
                <ul>
                {tags.map(tag => <li key={tag}>
                <Link activeClassName="" href={`/tags/${tag}`}>{tag}</Link>
                </li>)}
                </ul>
            </div>
        );
    }
}
