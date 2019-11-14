import { Component, h } from 'preact';
import { Link } from 'preact-router/match';
import { FoodType } from "../../types";
import firebase from '../firebase';
import { firestore } from '../firebase'
import FoodLink from '../food-link';
import TagList from '../tag-list';
import * as style from "./style.css";

interface Props extends FoodType {}

const TagLinks = ({tags}:{tags: string[]}) => <span>{tags && Array.isArray(tags) && tags.map((tag,i)=>(
  <span key={tag}>
    <Link activeClassName="" href={`/tags/${tag}`}>{tag}</Link>
    { i<tags.length-1 && ", "} 
  </span>
))}</span>

export default class FoodDetail extends Component<Props> {

    public render(props: Props) {
        return (
          <div class={style.food}>
            <h1>{props.title}</h1>
            <p>
              <strong>Main Tags:</strong> <TagLinks tags={props.isTags} /> 
              {" "}
              <strong>Contains Tags:</strong> <TagLinks tags={props.containsTags} /> 
              {" "}
              <strong>Additional Tags:</strong> <TagLinks tags={props.descriptiveTags} />
            </p>
            <FoodLink id={props.id} title={props.title} />
            <p>
              Originally Titled: <a href={props.originUrl} target="_blank" rel="noopener noreferrer">{props.originTitle}</a>
              { props.author && " by " }
              { props.author && <a href={props.authorProfileUrl} target="_blank" rel="noopener noreferrer">{props.author}</a> }
              { props.license && " licensed under " }
              { props.license && <a href={props.licenseUrl} target="_blank" rel="noopener noreferrer">{props.license}</a> }
              .
            </p>
            <p>last updated: {props.updated && props.updated instanceof firebase.firestore.Timestamp && props.updated.toDate().toISOString()}</p> 
          </div>
        );
    }
}
