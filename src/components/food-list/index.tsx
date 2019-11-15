import { Component, h } from 'preact';
import { FoodType } from "../../types";
import FoodLink from '../food-link';
import * as style from "./style.css";

interface Props {
    foodIds: string[];
}

export default class FoodList extends Component<Props> {
  public render({ foodIds }: Props) {
    return (
      <div>

        <ul class={style.masonry}>
    {foodIds.map(food => 
      <li key={food} class={style.masonryBrick}>
      <FoodLink id={food} title={"Food Image " + food} />
      </li>)}
        </ul>

      </div>
    );
  }
}
