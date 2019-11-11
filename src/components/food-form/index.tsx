import { Component, h } from 'preact';
import { FoodType } from "../../types";
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
    firestore.collection("foods").doc(this.props.id).update(this.state);
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
              <button onClick={this.handleSubmit}>Submit</button>
            </form>
          </div>
        );
    }
}
