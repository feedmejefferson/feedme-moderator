import { Component, h } from "preact";
import { firestore } from "../../components/firebase"
import Food from "../../components/food-detail";
import FoodDetail from "../../components/food-detail";
import FoodForm from "../../components/food-form";
import { FoodType } from "../../types";
import * as style from "./style.css";

interface Props {
    foodId: string;
}
interface State {
    food?: FoodType
}
const tagStore = firestore.collection("foods");

export default class FoodRoute extends Component<Props, State> {
    public render({foodId}: Props, { food }: State) {
        // update the state if we need to render for a new tag id
        if(!food || food.id !==foodId) {
            tagStore.doc(foodId).get().then(doc => {
                this.setState({food: doc.data() as FoodType})
            })    
        }
        return (
            <div class={style.tag}>
                { !food && "loading..." }
                { food && <FoodForm {...food} /> }
            </div>
        );
    }
}
