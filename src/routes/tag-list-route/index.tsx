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
    tags: TagType[];
}

export default class TagListRoute extends Component<Props, State> {
    public state = {
        tags: []
    }
    public tagstore = firestore.collection("tags");

    public query = this.tagstore
    // .where("containsTags", "array-contains", filter) : this.foodstore 
    // query  // .orderBy("id").limit(5)
         .get().then(q => {this.setState({tags: q.docs.map(doc => doc.data() as TagType)})});

    public render({tag}: Props) {
        return (
            <div class={style.page}>
                <h1>Tags</h1>
                <ul>
                {this.state.tags.map((x: any) => <li key={x.id}>
                <Link activeClassName="" href={`/tags/${x.id}`}>{x.pretty}</Link>
                </li>)}
                </ul>
            </div>
        );
    }
}
