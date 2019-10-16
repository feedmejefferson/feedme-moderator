import { Component, h } from 'preact';
import { Link } from 'preact-router/match';
import { FoodType } from "../../types";
import { firestore } from '../firebase'
import FoodLink from '../food-link';
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

const TagLinks = ({tags}:{tags: string[]}) => <span>{tags.map((tag,i)=>(
  <span key={tag}>
    <Link activeClassName="" href={`/tags/${tag}`}>{tag}</Link>
    { i<tags.length-1 && ", "} 
  </span>
))}</span>

export default class FoodDetail extends Component<Props, State> {

    public render({ id, author, authorProfileUrl, title, originTitle, originUrl, license, licenseUrl, isTags, containsTags, descriptiveTags }: Props, {  }: State) {
        return (
          <div class={style.food}>
            <h1>{title}</h1>
            <p>
              <strong>Main Tags:</strong> <TagLinks tags={isTags} /> 
              {" "}
              <strong>Contains Tags:</strong> <TagLinks tags={containsTags} /> 
              {" "}
              <strong>Additional Tags:</strong> <TagLinks tags={descriptiveTags} />
            </p>
            <FoodLink id={id} title={title} />
            <p>
              Originally Titled: <a href={originUrl} target="_blank" rel="noopener noreferrer">{originTitle}</a>
              { author && " by " }
              { author && <a href={authorProfileUrl} target="_blank" rel="noopener noreferrer">{author}</a> }
              { license && " licensed under " }
              { license && <a href={licenseUrl} target="_blank" rel="noopener noreferrer">{license}</a> }
              .
            </p>
          </div>
        );
    }
}
