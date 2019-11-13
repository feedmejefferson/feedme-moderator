import { Component, h } from "preact";
import { auth, firestore } from "../../components/firebase"
import Food from "../../components/food-detail";
import FoodDetail from "../../components/food-detail";
import FoodForm from "../../components/food-form";
import FoodVector from "../../components/food-vector";
import { FoodSpace, FoodType } from "../../types";
import * as style from "./style.css";

interface Props {
    foodId: string;
}
interface State {
    food?: FoodType;
    foodspace?: FoodSpace;
    edit?: boolean;
    user?: any;
}

const foodStore = firestore.collection("foods");
const vectorStore = firestore.collection("foodspace");

export default class FoodRoute extends Component<Props, State> {
    public unsubscribeAuth = () => { };
    public unsubscribeFoodStore = () => { };

    // gets called when this route is navigated to
    public componentDidMount() {
        this.unsubscribeAuth = auth.onAuthStateChanged(user => {this.setState({user})});
    }

    // gets called just before navigating away from the route
    public componentWillUnmount() {
        this.unsubscribeAuth();
        this.unsubscribeFoodStore();
    }

    public render({foodId}: Props, { food, foodspace, edit, user }: State) {
        // update the state if we need to render for a new tag id
        if(!food || food.id !==foodId) {
            this.unsubscribeFoodStore();
            this.unsubscribeFoodStore = foodStore.doc(foodId).onSnapshot(doc => {
                this.setState({edit: false, food: doc.data() as FoodType})
            })    
        }
        if(!foodspace || foodspace.id !==foodId) {
            vectorStore.doc(foodId).get().then(doc => {
                this.setState({foodspace: doc.data() as FoodSpace})
            })    
        }
        const Edit = () => {
            if(edit || !user) {
                return null;
            }
            return <button onClick={() => this.setState({edit: true})}>Edit</button>
        }
        return (
            <div class={style.tag}>
                { !food ? "loading..." : <Edit/> }
                { food && (edit ? <FoodForm {...food} key={food.id} onSubmit={() => this.setState({edit: false})}/> : <FoodDetail {...food} /> ) }
                { foodspace && <FoodVector {...foodspace}/>}
            </div>
        );
    }
}

