import { Component, h } from 'preact';
import { Link } from 'preact-router/match';
import TagSelector from '../tag-selector';
import * as style from "./style.css";

interface Props {
  dims: number[];
}
interface Dimension {
  left: string;
  right: string;
}
export const dimensions: Dimension[] = [
  { left: "ignore", right: "ignore"},
  { left: "sweet", right: "savory"},
  { left: "fresh", right: "cooked"},
  { left: "asian", right: "italian"},
  { left: "vegetable forward", right: "meat and potatoes"},
  { left: "stovetop", right: "oven"},
  { left: "homemade", right: "fastfood"},
  { left: "compound word", right: "single word"},
  { left: "prepared food", right: "ingredient"},
  { left: "vegetarian", right: "meaty"},
  { left: "?10?", right: "?10?"},
  { left: "?11?", right: "?11?"},
  { left: "?12?", right: "?12?"},
]
const Bar = ({dim}:{dim:number}) => {
  const color = dim<0 ? "red" : "blue";
  const size = 150*dim;
  const left = dim<0 ? 50+size : 50; 
  const width = dim<0 ? -size : size;
  return <div class={style.bar} style={{
    background: color, 
    width: `${width}%`,
    left: `${left}%`,
  }}/>
} 
export default class Fingerprint extends Component<Props> {
  public render({ dims }: Props) {
    return (
      <div>
        <table>
        {[...dims].map((dim,i)=>
        ( i>0 && <tr key={i}>
          <td class={style.leftCol}>{dimensions[i].left}</td>
          <td class={style.barCell}>
            <Bar dim={dim} />
          </td>
          <td class={style.rightCol}>{dimensions[i].right}</td>
        </tr>)
        )}
        </table>
      </div>
    );
  }
}
