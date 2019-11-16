import { Component, h } from "preact";
import { auth, FieldValue } from "../../components/firebase"
import FoodList from "../../components/food-list";
import TagDetail from "../../components/tag-detail";
import { foodCollection, foodStats, tagFoodsIndex, tagStats } from "../../state/indices";
import { TagStats } from "../../types";
import * as style from "./style.css";

interface Props {
    tagId: string;
}
interface State {
    stats?: TagStats;
    invertedIndex?: any;
    user?: any;
}

// const tagStore = firestore.collection("tags");

export default class TagRoute extends Component<Props, State> {
    public unsubscribeAuth = () => { };
    public unsubscribeTagStats = () => { };
    public unsubscribeInvertedIndex = () => { };

    public handleNuclear = () => {
        // Delete all remnants of the tag (within reason)
        const tag = this.props.tagId;
        const remove = FieldValue.arrayRemove(tag);
        const updated = FieldValue.serverTimestamp();
        const foodUpdates = { 
            isTags: remove, 
            containsTags: remove, 
            descriptiveTags: remove,
            updated
        }; 
        const invertedIndex = this.state.invertedIndex;
        const foodIds: string[] = invertedIndex && invertedIndex[tag] && invertedIndex[tag].foods;
        if(foodIds) {
            const foodStatUpdates: any = {};
            foodIds.forEach(foodId => {
                foodCollection.doc(foodId).update(foodUpdates);
                foodStatUpdates[`${foodId}.updated`]=updated;
            });
            foodStats.update(foodStatUpdates);
        }
 
        const deleteTag: any = {};
        deleteTag[this.props.tagId] = FieldValue.delete();
        tagStats.update(deleteTag);
        tagFoodsIndex.update(deleteTag);

        // since this is no longer a valid tag, go back to the previous route
        history.go(-1);

    }

    // gets called when this route is navigated to
    public componentDidMount() {
        this.unsubscribeAuth = auth.onAuthStateChanged(user => {this.setState({user})});
        this.unsubscribeTagStats = tagStats.onSnapshot(doc => {
            const stats = doc.data() as TagStats;
            this.setState({stats})
        });
        this.unsubscribeInvertedIndex = tagFoodsIndex.onSnapshot(doc => {
            const invertedIndex = doc.data();
            this.setState({invertedIndex})
        });
    }

    // gets called just before navigating away from the route
    public componentWillUnmount() {
        this.unsubscribeAuth();
        this.unsubscribeTagStats();
        this.unsubscribeInvertedIndex();
    }

    public render({tagId}: Props, { stats, invertedIndex, user }: State) {
        const foodIds = invertedIndex && invertedIndex[tagId] && invertedIndex[tagId].foods
        return (
            <div class={style.tag}>
                { stats  
                    ? stats[tagId] 
                        ? <TagDetail {...stats[tagId]} /> 
                        : "Not a tag!"
                    : "loading..." 
                }
                { user && <button onClick={() => this.handleNuclear()}>Delete Tag and Remove from all Foods</button> }
                <h2>Foods with this Tag</h2>
                { foodIds && <FoodList foodIds={foodIds} /> }
            </div>
        );
    }
}
