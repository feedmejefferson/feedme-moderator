import { Component, h } from 'preact';
import { foodCollection, foodStats, tagFoodsIndex, tagStats } from "../../state/indices";
import { FoodType } from "../../types";
import { FieldValue, Timestamp } from '../firebase'
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
    // always update the food metadata itself do this first in case anything
    // goes wrong while attempting to update the indexes
    foodCollection.doc(this.props.id).update({...this.state, updated: FieldValue.serverTimestamp() });

    // update the last updated timestamp in the food index
    const foodStatUpdates: any = {};
    foodStatUpdates[`${this.props.id}.updated`] = FieldValue.serverTimestamp();
    foodStats.update(foodStatUpdates);

    if(this.state.isTags || this.state.containsTags || this.state.descriptiveTags) {

      let additions: string[] = [];
      let subtractions: string[] = [];
      const tagStatUpdates: any = {};

      // This all really needs to get refactored into a nice function
      // way too much copy, paste, change here and there risk of typos
      let isTags = this.props.isTags;
      let containsTags = this.props.containsTags;
      let descriptiveTags = this.props.descriptiveTags;
      const allOldTags = Array.from(new Set([...isTags, ...containsTags, ...descriptiveTags]));
      const increment = FieldValue.increment(1);
      const decrement = FieldValue.increment(-1);
      const establish = FieldValue.increment(0);

      if(this.state.isTags) {
        const newTags = this.state.isTags;
        additions = [...newTags].filter(x => !isTags.includes(x))
        subtractions = [...isTags].filter(x => !newTags.includes(x))
        additions.forEach(tag => tagStatUpdates[`${tag}.isTags`] = increment);
        subtractions.forEach(tag => tagStatUpdates[`${tag}.isTags`] = decrement);
        isTags = newTags;
      }

      if(this.state.containsTags) {
        const newTags = this.state.containsTags;
        additions = [...newTags].filter(x => !containsTags.includes(x))
        subtractions = [...containsTags].filter(x => !newTags.includes(x))
        additions.forEach(tag => tagStatUpdates[`${tag}.containsTags`] = increment);
        subtractions.forEach(tag => tagStatUpdates[`${tag}.containsTags`] = decrement);
        containsTags = newTags;
      }

      if(this.state.descriptiveTags) {
        const newTags = this.state.descriptiveTags;
        additions = [...newTags].filter(x => !descriptiveTags.includes(x))
        subtractions = [...descriptiveTags].filter(x => !newTags.includes(x))
        additions.forEach(tag => tagStatUpdates[`${tag}.descriptiveTags`] = increment);
        subtractions.forEach(tag => tagStatUpdates[`${tag}.descriptiveTags`] = decrement);
        descriptiveTags = newTags;
      }


      // Finally, update the inverted index based on any or no changes
      // to the full set of all tags. Add or remove this food from each of the tags
      const allNewTags = Array.from(new Set([...isTags, ...containsTags, ...descriptiveTags]));
      additions = [...allNewTags].filter(x => !allOldTags.includes(x));
      subtractions = [...allOldTags].filter(x => !allNewTags.includes(x))

      if(additions.length + subtractions.length > 0){
        const tagFoodUpdates: any = {};
        additions.forEach(tag => {
          tagFoodUpdates[`${tag}.foods`] = FieldValue.arrayUnion(this.props.id)
          if(!tagStatUpdates[`${tag}.isTags`]) { tagStatUpdates[`${tag}.isTags`] = establish; }
          if(!tagStatUpdates[`${tag}.containsTags`]) { tagStatUpdates[`${tag}.containsTags`] = establish; }
          if(!tagStatUpdates[`${tag}.descriptiveTags`]) { tagStatUpdates[`${tag}.descriptiveTags`] = establish; }
        })
        subtractions.forEach(tag => tagFoodUpdates[`${tag}.foods`] = FieldValue.arrayRemove(this.props.id))

        tagStats.update(tagStatUpdates);
        tagFoodsIndex.update(tagFoodUpdates);
      }
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
              <p>last updated: {props.updated && props.updated instanceof Timestamp && props.updated.toDate().toISOString()}</p> 
              <button onClick={this.handleSubmit}>Submit</button>
            </form>
          </div>
        );
    }
}
