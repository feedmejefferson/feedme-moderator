import { Component, h } from 'preact';
import { Link } from 'preact-router/match';
import * as style from "./style.css";

interface Props {
  id: string;
  title: string;
  highlight?: boolean;
}

export default class FoodLink extends Component<Props> {

    public render({ id, title, highlight }: Props) {
        return (
          <a href={`/food/${id}`}>
          <img class={highlight ? style.highlight : ""} alt={title} src={`https://storage.googleapis.com/feedme-moderator.appspot.com/assets/images/${id}.jpg`}/>
          { /* title */ }
          </a>
        );
    }
}
