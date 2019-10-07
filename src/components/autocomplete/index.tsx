import { Component, h } from 'preact';
import * as style from "./style.css";

interface Props {
  suggestions: string[];
}
interface State {
  activeSuggestion: number;
  filteredSuggestions: string[];
  showSuggestions: boolean;
  userInput: string;
}

export default class Autocomplete extends Component<Props, State> {
  public state = { 
    activeSuggestion: 0,
    filteredSuggestions: this.props.suggestions,
    showSuggestions: false,
    userInput: ""
  }
  public onChange = (e: any) => { 
    // @ts-ignore
    const userInput = e.currentTarget.value;
    
//    console.log("changed", userInput) 
    const filteredSuggestions = this.props.suggestions.filter(x=>x.toLowerCase().startsWith(userInput.toLowerCase()))
//    console.log(filteredSuggestions);
    this.setState({filteredSuggestions, userInput})
  }
  public onClick = (e: any) => { 
    const value = e.currentTarget.innerText;
    console.log("clicked", value) 
    this.setState({userInput: value, activeSuggestion: 0, filteredSuggestions: [value]})
  }
  public onKeyDown = (e: any) => { 
    // @ts-ignore
    const key = e.keyCode;
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
      case 13: // enter
        const userInput = filteredSuggestions[activeSuggestion]
        activeSuggestion = 0;
        this.setState({activeSuggestion, userInput})
        break;
    }
    // console.log("keyed", key, this.state.activeSuggestion) 
  }
  public render({ suggestions }: Props, { }: State) {
    const suggestionsListComponent = <div class={style.suggestions} >
      {this.state.filteredSuggestions.map((suggestion, i) => (
        <li onClick={this.onClick}
            class={i===this.state.activeSuggestion ? style.activeSuggestion : undefined}>
          {suggestion}
        </li>
      ))}
      </div>
    return (
      <div class={style.autocomplete}>
        <input
          type="text"
          onChange={this.onChange}
          onKeyUp={this.onChange}
          onKeyDown={this.onKeyDown}
          value={this.state.userInput}
          autofocus={true}
        />
        {suggestionsListComponent}
              </div>
    );
  }
}
