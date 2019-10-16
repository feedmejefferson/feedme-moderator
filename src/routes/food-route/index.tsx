import { Component, h } from "preact";
import { firestore } from "../../components/firebase"
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
}

const foodStore = firestore.collection("foods");
const vectorStore = firestore.collection("foodspace");

export default class FoodRoute extends Component<Props, State> {
    public render({foodId}: Props, { food, foodspace }: State) {
        // update the state if we need to render for a new tag id
        if(!food || food.id !==foodId) {
            foodStore.doc(foodId).get().then(doc => {
                this.setState({food: doc.data() as FoodType})
            })    
        }
        if(!foodspace || foodspace.id !==foodId) {
            vectorStore.doc(foodId).get().then(doc => {
                this.setState({foodspace: doc.data() as FoodSpace})
            })    
        }
        return (
            <div class={style.tag}>
                { !food && "loading..." }
                { food && <FoodDetail {...food} /> }
                { foodspace && <FoodVector {...foodspace}/>}
            </div>
        );
    }
}
