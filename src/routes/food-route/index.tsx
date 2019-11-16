import { Component, h } from "preact";
import { auth } from "../../components/firebase"
import FoodDetail from "../../components/food-detail";
import FoodForm from "../../components/food-form";
import FoodVector from "../../components/food-vector";
import { foodCollection, foodStats } from "../../state/indices";
import { FoodStats, FoodType } from "../../types";
import * as style from "./style.css";

interface Props {
    foodId: string;
}
interface State {
    food?: FoodType;
    stats?: FoodStats;
    edit?: boolean;
    user?: any;
}

export default class FoodRoute extends Component<Props, State> {
    public unsubscribeAuth = () => { };
    public unsubscribeFoodStore = () => { };
    public unsubscribeFoodStats = () => { };

    // gets called when this route is navigated to
    public componentDidMount() {
        this.unsubscribeAuth = auth.onAuthStateChanged(user => {this.setState({user})});
        this.unsubscribeFoodStats = foodStats.onSnapshot(doc => {
            const stats = doc.data() as FoodStats;
            this.setState({stats})
        });      
    }

    // gets called just before navigating away from the route
    public componentWillUnmount() {
        this.unsubscribeAuth();
        this.unsubscribeFoodStore();
    }

    public render({foodId}: Props, { food, stats, edit, user }: State) {
        // update the state if we need to render for a new tag id
        if(!food || food.id !==foodId) {
            this.unsubscribeFoodStore();
            this.unsubscribeFoodStore = foodCollection.doc(foodId).onSnapshot(doc => {
                const f = doc.data() as FoodType;
                // fix issues where empty arrays come through as objects
                if(!Array.isArray(f.isTags)) { f.isTags = []; }
                if(!Array.isArray(f.containsTags)) { f.containsTags = []; }
                if(!Array.isArray(f.descriptiveTags)) { f.descriptiveTags = []; }
                this.setState({edit: false, food: f})
            })    
        }
        const Edit = () => {
            if(edit || !user) {
                return null;
            }
            return <button onClick={() => this.setState({edit: true})}>Edit</button>
        }
        const foodspace = stats && stats[foodId];
        return (
            <div class={style.tag}>
                { !food ? "loading..." : <Edit/> }
                { food && (edit ? <FoodForm {...food} key={food.id} onSubmit={() => this.setState({edit: false})}/> : <FoodDetail {...food} /> ) }
                { foodspace && <FoodVector {...foodspace}/>}
            </div>
        );
    }
}

