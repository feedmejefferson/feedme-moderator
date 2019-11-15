import { Component, h } from 'preact';
import { foodStats, tagFoodsIndex } from "../../state/indices";
import { FoodType } from "../../types";
import firebase from "../firebase";
import { firestore } from '../firebase'
import FoodLink from '../food-link';
import TagList from '../tag-list';
import * as style from "./style.css";

interface Props extends FoodType {
  onSubmit?: () => void;
}
interface State extends Partial<FoodType> {}

export default class FoodForm extends Component<Props, State> {
  public handleChange = (e: Event) => { 
    // @ts-ignore
    this.setState({[e.target.name]: e.target.value})
  }
  public handleUpdateTags = (newTags: string[]) => { 
    this.setState({containsTags: newTags})
  }

  public handleSubmit = (e: Event) => { 
    e.preventDefault();
    let allTags = this.props.allTags ? [...this.props.allTags] : [];
    let additions: string[] = [];
    let subtractions: string[] = [];
    if(this.state.isTags || this.state.containsTags || this.state.descriptiveTags) {
      const isTags = this.state.isTags || this.props.isTags;
      console.log("is", isTags)
      const containsTags = this.state.containsTags || this.props.containsTags;
      console.log("contains", containsTags)
      const descriptiveTags = this.state.descriptiveTags || this.props.descriptiveTags;
      console.log("descriptive", descriptiveTags)
      const allNewTags = Array.from(new Set([...isTags, ...containsTags, ...descriptiveTags]))
      const allOldTags = [...allTags];
      console.log("old", allOldTags)
      console.log("new", allNewTags)
      additions = [...allNewTags].filter(x => !allOldTags.includes(x))
      subtractions = [...allOldTags].filter(x => !allNewTags.includes(x))
      console.log("added tags", additions);
      console.log("removed tags", subtractions);
      allTags = allNewTags;
    }
    firestore.collection("foods").doc(this.props.id).update({...this.state, allTags, updated: firebase.firestore.FieldValue.serverTimestamp() });
    // update the last updated timestamp in the food index
    const foodStatUpdates: any = {};
    foodStatUpdates[`${this.props.id}.updated`] = firebase.firestore.FieldValue.serverTimestamp();
    foodStats.update(foodStatUpdates);
    // update the inverted index to add or remove this food from each of the tags
    if(additions.length + subtractions.length > 0){
      const tagFoodUpdates: any = {};
      additions.forEach(tag => tagFoodUpdates[`${tag}.foods`] = firebase.firestore.FieldValue.arrayUnion(this.props.id))
      subtractions.forEach(tag => tagFoodUpdates[`${tag}.foods`] = firebase.firestore.FieldValue.arrayRemove(this.props.id))
      console.log(tagFoodUpdates)
      tagFoodsIndex.update(tagFoodUpdates);
    }

    if(this.props.onSubmit) {
      this.props.onSubmit();
    }
  }

  public render(props: Props, state: State) {
        return (
          <div class={style.food}>
            <FoodLink id={props.id} title={props.title} />
            <form>
              <label for="title">Title: </label>
              <input type="text" name="title" onChange={this.handleChange}
              value={state.title || props.title}/>
              <p>Main Tags: <TagList tags={state.isTags || props.isTags} updateTags={(tags)=>this.setState({isTags: tags})}/></p>
              <p>Contains Tags: <TagList tags={state.containsTags || props.containsTags} updateTags={(tags)=>this.setState({containsTags: tags})}/></p>
              <p>Descriptive Tags: <TagList tags={state.descriptiveTags || props.descriptiveTags} updateTags={(tags)=>this.setState({descriptiveTags: tags})}/></p>
              <p>last updated: {props.updated && props.updated instanceof firebase.firestore.Timestamp && props.updated.toDate().toISOString()}</p> 
              <button onClick={this.handleSubmit}>Submit</button>
            </form>
          </div>
        );
    }
}
