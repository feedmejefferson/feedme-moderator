import { Component, h } from 'preact';
import { FoodSpace } from '../../types';
import Fingerprint from '../fingerprint';
import FoodLink from '../food-link';
import * as style from "./style.css";

interface Props extends FoodSpace {}

export default class FoodVector extends Component<Props> {
  public render({ id, dims, neighbors }: Props) {
    return (
      <div>
        <h2>Similar Foods</h2>
        <ul class={style.masonry}>
        {neighbors && neighbors.map((n,i)=>
        <li key={i} class={style.masonryBrick}>
          <FoodLink id={n} title="" />
        </li>
        )}
        </ul>
        <Fingerprint dims={dims} />
      </div>
    );
  }
}
