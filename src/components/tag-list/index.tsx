import { Component, h } from 'preact';
import Tag from '../tag';
import NewTag from '../tag-new';
import * as style from "./style.css";

interface Props {
  tags: string[];
  updateTags: (tags: string[]) => void;
}
interface State {
  active?: number;
}

export default class TagList extends Component<Props, State> {
  public onToggle = (offset: number) => {
    if(this.state.active===offset) {
      this.setState({active: undefined})
    } else {
      this.setState({active: offset})
    }
  }
  public onUpdate = (tag: string, key: number) => {
    const tags = [...this.props.tags]
    tags[key]=tag;
    this.setState({active: undefined});
    this.props.updateTags(tags);
  }
  public onDelete = (key: number) => {
    const tags = [...this.props.tags]
    tags.splice(key,1)
    this.setState({active: undefined});
    this.props.updateTags(tags);
  }
  public onAdd = (tag: string) => {
    const tags = [...this.props.tags]
    tags.push(tag)
    this.setState({active: undefined});
    this.props.updateTags(tags);
  }

  public render({ tags }: Props, { active }: State) {
    const length = tags.length;
    return (
      <ul class={style.tagList} >
        {tags && Array.isArray(tags) && tags.map((tag, i)=>(
          <li key={tag} class={style.tagListItem}>
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
