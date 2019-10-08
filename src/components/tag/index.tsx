import { Component, h } from 'preact';
import * as style from "./style.css";

interface Props {
  tag: string,
  offset: number,
  onUpdate: (tag: string, key: number) => void;
  onDelete: (key: number) => void;

}
interface State {
  editable: boolean;
}

export default class Tag extends Component<Props, State> {
  public state = { editable: false };
  public onChange = (e: any) => { 
    // @ts-ignore
    const userInput = e.currentTarget.value;
    this.toggleOff(e);
    this.props.onUpdate(userInput, this.props.offset);
  }
  public onButtonClick = (e: any) => { 
    console.log("delete me", this.props.offset)
    this.props.onDelete(this.props.offset);
  }
  public toggle = (e: any) => {
    console.log("toggling")
    this.setState({editable: !this.state.editable})
  }
  public toggleOff = (e: any) => {
    console.log("toggling off")
    this.setState({editable: false})
  }
  public render({ tag, offset }: Props, { editable }: State) {
    return (
      <li class={style.tag} key={offset}>
        { editable && <input type="text" value={tag} onChange={this.onChange} autofocus={true} onBlur={this.toggleOff} />}
        { !editable && <button class={style.tagButton} onClick={this.toggle}>{tag}</button>}
        <button class={style.deleteButton} onClick={this.onButtonClick}>X</button>
      </li>
    );
  }
}
