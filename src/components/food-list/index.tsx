import { Component, h } from 'preact';
import { FoodType } from "../../types";
import Food from "../food";
// import * as style from "./style.css";

interface Props {
    foods: FoodType[];
}
interface State {
  filter: string;
}

export default class FoodList extends Component<Props> {
  public render({ foods }: Props, { filter }: State) {
    return (
      <div>

        <ul>
    {foods.map((food, i) => <Food key={food.id} {...food} />)}
        </ul>

      </div>
    );
  }
}
