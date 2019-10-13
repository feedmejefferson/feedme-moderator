import { Component, h } from "preact";
import { firestore } from "../../components/firebase"
import TagDetail from "../../components/tag-detail";
import { TagType } from "../../types";
import * as style from "./style.css";

interface Props {
    tagId: string;
}
interface State {
    tag?: TagType
}
const tagStore = firestore.collection("tags");

export default class TagRoute extends Component<Props, State> {
    public render({tagId}: Props, { tag }: State) {
        // update the state if we need to render for a new tag id
        if(!tag || tag.id !==tagId) {
            tagStore.doc(tagId).get().then(doc => {
                this.setState({tag: doc.data() as TagType})
            })    
        }
        return (
            <div class={style.tag}>
                { !tag && "loading..." }
                { tag && <TagDetail {...tag} /> }
            </div>
        );
    }
}
