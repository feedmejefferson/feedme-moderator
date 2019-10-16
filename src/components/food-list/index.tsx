import { Component, h } from 'preact';
import { FoodType } from "../../types";
import FoodLink from '../food-link';
import * as style from "./style.css";

interface Props {
    foods: FoodType[];
}

export default class FoodList extends Component<Props> {
  public render({ foods }: Props) {
    return (
      <div>

        <ul class={style.masonry}>
    {foods.map(food => 
      <li key={food.id} class={style.masonryBrick}>
      <FoodLink {...food} />
      </li>)}
        </ul>

      </div>
    );
  }
}
