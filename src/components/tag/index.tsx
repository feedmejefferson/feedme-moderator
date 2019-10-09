import { Component, h } from 'preact';
import TagSelector from '../tag-selector';
import * as style from "./style.css";

interface Props {
  tag: string,
  offset: number,
  onUpdate: (tag: string, key: number) => void;
  onDelete: (key: number) => void;
  onToggle: (key: number) => void;
  editable: boolean;

}

export default class Tag extends Component<Props> {
  public onChange = (value: string) => { 
    if(!value) { 
      this.props.onDelete(this.props.offset) } 
    else {
      this.props.onUpdate(value, this.props.offset);
    }
  }
  public onButtonClick = (e: any) => { 
    this.props.onDelete(this.props.offset);
  }
  public toggle = (e?: any) => {
    this.props.onToggle(this.props.offset);
  }
  public render({ tag, offset, editable }: Props) {
    return (
      <span key={offset}>
        {/* editable && <input type="text" value={tag} onChange={this.onChange} autofocus={true} onBlur={this.toggleOff} /> */}
        { editable && <TagSelector value={tag} onSelect={this.onChange} onEscape={this.toggle} />}
        { !editable && <button class={style.tagButton} onClick={this.toggle}>{tag}</button>}
        <button class={style.deleteButton} onClick={this.onButtonClick}>X</button>
      </span>
    );
  }
}
