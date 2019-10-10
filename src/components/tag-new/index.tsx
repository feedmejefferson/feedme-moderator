import { Component, h } from 'preact';
import TagSelector from '../tag-selector';
import * as style from "./style.css";

interface Props {
  onAdd: (tag: string) => void;
  onToggle: (offset: number) => void;
  offset: number;
  editable: boolean;

}
interface State {
}

export default class NewTag extends Component<Props, State> {
  public toggle = () => {
    this.props.onToggle(this.props.offset)
  }
  public render({ editable }: Props, { }: State) {
    return (
      <span>
        { editable && <TagSelector value="" onSelect={this.props.onAdd} onEscape={this.toggle} focus={true} />}
        { !editable && <button type="button" class={style.addButton} onClick={this.toggle}>+</button>}
      </span>
    );
  }
}
