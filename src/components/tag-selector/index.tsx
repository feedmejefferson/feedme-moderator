import { Component, h } from 'preact';
import tagsJson from "../tag-list/tags.json";
import * as style from "./style.css";

interface Props {
  value: string;
  onSelect: (newValue: string) => void;
  onEscape: () => void;
  focus?: boolean;
}
interface State {
  activeSuggestion: number;
  filteredSuggestions: string[];
  showSuggestions: boolean;
  userInput: string;
}
const tags: string[] = tagsJson.tags;
const filterSuggestions = (filter: string) => tags.filter(x=>x.toLowerCase().startsWith(filter.toLowerCase()))

export default class TagSelector extends Component<Props, State> {
  public input: any = null;
  public state = { 
    activeSuggestion: 0,
    filteredSuggestions: filterSuggestions(this.props.value),
    showSuggestions: false,
    userInput: this.props.value
  }
    
  public select(value: string) {
    this.setState({userInput: value, filteredSuggestions: [value], activeSuggestion: 0})
    this.props.onSelect(value)
  }
  public escape = () => {
    this.setState({showSuggestions: false})
    this.props.onEscape()
  }
  public onChange = (e: any) => { 
    // @ts-ignore
    const userInput = e.currentTarget.value;
    const filteredSuggestions = filterSuggestions(userInput)
    this.setState({filteredSuggestions, userInput})
  }
  public onClick = (e: any) => { 
    const value = e.currentTarget.innerText;
    this.select(value);
  }
  public onMouseOver = (e: any) => { 
    const value = e.currentTarget.innerText;
    const activeSuggestion=this.state.filteredSuggestions.indexOf(value);
    this.setState({activeSuggestion})
  }
  public onKeyDown = (e: any) => { 
    // @ts-ignore
    const key = e.keyCode;
    const input = e.currentTarget.value
    let activeSuggestion = this.state.activeSuggestion
    const filteredSuggestions = this.state.filteredSuggestions;
    switch(key) {
      case 38: // up arrow
        activeSuggestion -= activeSuggestion === 0 ? 0 : 1;
        this.setState({activeSuggestion})
        break;
      case 40: // down arrow
        activeSuggestion += activeSuggestion < filteredSuggestions.length-1 ? 1 : 0;
        this.setState({activeSuggestion})
        break;
      case 27: // escape
        this.escape()
        break;
      case 13: // enter
        const userInput = filteredSuggestions[activeSuggestion] || input
        this.select(userInput);
        break;

    }
  }
  public render({ }: Props, { }: State) {
    const suggestionsListComponent = <ul class={style.list} >
      {this.state.filteredSuggestions.map((suggestion, i) => (
        <li onMouseDown={this.onClick}
            onMouseOver={this.onMouseOver}
            class={i===this.state.activeSuggestion ? style.activeSuggestion : undefined}>
          {suggestion}
        </li>
      ))}
      </ul>
      // @ts-ignore

    return (
      <div class={style.tagSelector}  
        tabIndex={0}   
      >
        <input
          type="text"
          name={this.state.userInput}
          tabIndex={0}
          onBlur={this.escape}
          onFocus={e=>this.setState({showSuggestions: true})}
          onChange={this.onChange}
          onKeyUp={this.onChange}
          onKeyDown={this.onKeyDown}
          ref={i=>this.input=i}
          value={this.state.userInput}
        />
        {this.state.showSuggestions && suggestionsListComponent}
      </div>
    );
  }
  public componentDidMount(){
    if(this.input && this.props.focus) {
      this.input.focus()
    }
  }
}
