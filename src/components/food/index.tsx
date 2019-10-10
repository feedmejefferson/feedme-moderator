import { Component, h } from 'preact';
import { firestore } from '../firebase'
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

interface Props extends FoodModel {}
interface State extends FoodModel {}

export default class Food extends Component<Props, State> {
  public state = { ...this.props }

  public handleChange = (e: Event) => { 
    // @ts-ignore
  this.setState({[e.target.name]: e.target.value})
  }
  public handleUpdateTags = (newTags: string[]) => { 
    this.setState({containsTags: newTags})
  }

  public handleSubmit = (e: Event) => { 
    e.preventDefault();
    firestore.collection("foods").doc(this.state.id).set(this.state);
  }

    public render({  }: Props, { id, author, title, originTitle, containsTags }: State) {
        return (
          <div class={style.food}>
            <h3>Profile: {id}</h3>
            <form>
              <label for="title">Title: </label>
              <input type="text" name="title" onChange={this.handleChange}
              value={title}/>
              <p>Originally Titled: {originTitle}</p>
              <p>Tags: <TagList tags={containsTags} updateTags={this.handleUpdateTags}/></p>
              <p>Author: {author}</p>
{/*
              <label for="author">Author</label>
              <input type="text" name="author" onChange={this.handleChange}
              value={author}/>

*/}
              <button onClick={this.handleSubmit}>Submit</button>
            </form>
          </div>
        );
    }
}
