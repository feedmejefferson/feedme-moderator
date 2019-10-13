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
        <Fingerprint dims={dims} />
        <ul>
        {neighbors && neighbors.map((n,i)=>
        <li key={i}>
          <Link activeClassName="" href={"/tags/"+n}>{n}</Link>
        </li>
        )}
        </ul>
      </div>
    );
  }
}
