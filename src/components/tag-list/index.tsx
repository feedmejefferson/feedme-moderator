import { Component, h } from 'preact';
import Tag from '../tag';
import NewTag from '../tag-new';
import * as style from "./style.css";

interface Props {
  tags: string[];
  updateTags: (tags: string[]) => void;
}
interface State {
  tags: string[];
  active?: number;
}

export default class TagList extends Component<Props, State> {
  public state: State = { 
    tags: !this.props.tags ? [] : this.props.tags,
  }
  public onToggle = (offset: number) => {
    if(this.state.active===offset) {
      this.setState({active: undefined})
    } else {
      this.setState({active: offset})
    }
  }
  public onUpdate = (tag: string, key: number) => {
    const tags = [...this.state.tags]
    tags[key]=tag;
    this.setState({tags, active: undefined});
    this.props.updateTags(tags);
  }
  public onDelete = (key: number) => {
    const tags = [...this.state.tags]
    tags.splice(key,1)
    this.setState({tags, active: undefined});
    this.props.updateTags(tags);
  }
  public onAdd = (tag: string) => {
    const tags = [...this.state.tags]
    tags.push(tag)
    this.setState({tags, active: undefined});
    this.props.updateTags(tags);
  }

  public render({ }: Props, { tags, active }: State) {
    const length = tags.length;
    return (
      <ul class={style.tagList} >
        {console.log(tags)}
        {tags && Array.isArray(tags) && tags.map((tag, i)=>(
          <li key={i} class={style.tagListItem}>
            <Tag tag={tag} offset={i}
            editable={i===active} 
            onDelete={this.onDelete} 
            onUpdate={this.onUpdate}
            onToggle={this.onToggle} />
          </li>
          ))}
        <li class={style.tagListItem} key={length}>
          <NewTag onAdd={this.onAdd} 
          offset={length}
          editable={active===length}
          onToggle={this.onToggle}/>
        </li>
      </ul>
    );
  }
}
