import { Component, h } from 'preact';
import { Link } from 'preact-router/match';
import { FoodType } from "../../types";
import { firestore } from '../firebase'
import TagList from '../tag-list';
import * as style from "./style.css";

interface Props extends FoodType {}

export default class FoodLink extends Component<Props> {

    public render({ id, title }: Props) {
        return (
          <Link activeClassName="" href={`/food/${id}`}>
          <img alt={title} src={`https://storage.googleapis.com/karens-kitchen.appspot.com/assets/images/${id}.jpg`}/>
          { /* title */ }
          </Link>
        );
    }
}
