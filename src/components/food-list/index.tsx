import { Component, h } from 'preact';
import Food from "../food";
// import * as style from "./style.css";

interface Props {
    foods: any[];
}
interface State {
  filter: string;
}

export default class FoodList extends Component<Props> {
  public render({ foods }: Props, { filter }: State) {
    return (
      <div>

        <ul>
          {foods.map((food, i) => <Food {...food} key={i} />)}
        </ul>

      </div>
    );
  }
}
