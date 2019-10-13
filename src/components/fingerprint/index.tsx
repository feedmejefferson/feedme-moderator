import { Component, h } from 'preact';
import { Link } from 'preact-router/match';
import TagSelector from '../tag-selector';
import * as style from "./style.css";

interface Props {
  dims: number[];
}
const Bar = ({dim}:{dim:number}) => {
  const color = dim<0 ? "red" : "blue";
  const size = 100*dim;
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
        <p>Fingerprint: {dims && dims.join(", ")}</p>
        <ul>
        {[...dims].slice(1).map((dim,i)=>
        <li key={i}>
          <Bar dim={dim} />
        </li>
        )}
        </ul>
      </div>
    );
  }
}
