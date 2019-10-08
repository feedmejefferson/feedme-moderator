import { Component, h } from 'preact';
import Tag from '../tag';
import * as style from "./style.css";

interface Props {
  tags: string[];
  updateTags: (tags: string[]) => void;
}
interface State {
  tags: string[];
}

export default class TagList extends Component<Props, State> {
  public state = { 
    tags: this.props.tags
  }
  public onUpdate= (tag: string, key: number) => {
    const tags = [...this.state.tags]
    tags[key]=tag;
    this.setState({tags});
  }
  public onDelete = (key: number) => {
    const tags = [...this.state.tags]
    tags.splice(key,1)
    this.setState({tags});
  }
  public render({ }: Props, { tags }: State) {
    return (
      <ul class={style.tagList} >
        {this.state.tags.map((tag, i)=>(
          <Tag tag={tag} key={i} offset={i} 
          onDelete={this.onDelete} 
          onUpdate={this.onUpdate} />
        ))}
      </ul>
    );
  }
}
