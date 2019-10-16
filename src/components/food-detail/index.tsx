import { Component, h } from 'preact';
import { FoodType } from "../../types";
import { firestore } from '../firebase'
import TagList from '../tag-list';
import * as style from "./style.css";

interface FoodModel {
  title: string,
  originTitle: string,
  id: string, 
  author: string,
  isTags: string[],
  containsTags: string[], 
  descriptiveTags: string[]
}

interface Props extends FoodType {}
interface State extends FoodType {}

export default class FoodDetail extends Component<Props, State> {

    public render({ id, author, title, originTitle, isTags, containsTags, descriptiveTags }: Props, {  }: State) {
        return (
          <div class={style.food}>
            <h3>{title}</h3>
              <p>Originally Titled: {originTitle}</p>
              <p>Main Tags: {isTags.join(", ")}</p>
              <p>Contains Tags: {containsTags.join(", ")}</p>
              <p>Descriptive Tags: {descriptiveTags.join(", ")}</p>
              <p>Author: {author}</p>
          </div>
        );
    }
}
