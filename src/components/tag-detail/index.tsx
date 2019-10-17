import { Component, h } from 'preact';
import { Link } from 'preact-router/match';
import { TagType } from '../../types';
import Fingerprint from '../fingerprint';
// import * as style from "./style.css";

interface Props extends TagType {}

export default class TagDetail extends Component<Props> {
  public render({ id, dims, neighbors }: Props) {
    return (
      <div>
        <h1>{id}</h1>
        <h2>Fingerprint</h2>
        <Fingerprint dims={dims} />
        <h2>Similar Tags</h2>
        <ul>
        {neighbors && neighbors.map((n,i)=>
        <li key={i}>
          <Link activeClassName="" href={"/tags/"+n}>{n}</Link>
        </li>
        )}
        </ul>
        <h2><Link activeClassName="" href={`/food?filter=${id}`}>Foods tagged with {id}</Link></h2>
      </div>
    );
  }
}
