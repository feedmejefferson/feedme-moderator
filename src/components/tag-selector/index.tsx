import { Component, h } from 'preact';
import { firestore } from "../../components/firebase";
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
  userInput?: string;
  tags: string[];
}
const filterSuggestions = (tags: string[], pattern: string): string[] => {
  const filterValue = pattern && pattern.toLowerCase() || "";
  return tags.filter(tag=>tag.startsWith(filterValue))
}
const tagPromise = firestore.collection("indexes").doc("tagIds").get();

export default class TagSelector extends Component<Props, State> {
  public input: any = null;
  public state: State = { 
    activeSuggestion: 0,
    filteredSuggestions: [],
    showSuggestions: false,
    tags: []
  }

  public componentWillMount() {
    tagPromise.then(doc => {
      const data = doc.data();
      const tags = data && data.ids;
      this.setState({tags})});
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
    const filteredSuggestions = filterSuggestions(this.state.tags, userInput)
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
    const showSuggestions = true;
    let activeSuggestion = this.state.activeSuggestion
    const filteredSuggestions = this.state.filteredSuggestions;
    switch(key) {
      case 38: // up arrow
        activeSuggestion -= activeSuggestion === 0 ? 0 : 1;
        this.setState({activeSuggestion, showSuggestions})
        break;
      case 40: // down arrow
        activeSuggestion += activeSuggestion < filteredSuggestions.length-1 ? 1 : 0;
        this.setState({activeSuggestion, showSuggestions})
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
  public render({ value }: Props, { userInput, filteredSuggestions, activeSuggestion, showSuggestions }: State) {
    if(userInput===undefined) {
      this.setState({userInput: value || "", filteredSuggestions: filterSuggestions(this.state.tags, value)})
      return ("loading...")
    }
    const suggestionsListComponent = <ul class={style.list} >
      {filteredSuggestions.map((suggestion, i) => (
        <li key={i}
            onMouseDown={this.onClick}
            onMouseOver={this.onMouseOver}
            class={i===activeSuggestion ? style.activeSuggestion : undefined}
            >
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
          name={userInput}
          tabIndex={0}
          onBlur={this.escape}
          onFocus={e=>this.setState({showSuggestions: true})}
          onChange={this.onChange}
          onKeyUp={this.onChange}
          onKeyDown={this.onKeyDown}
          ref={i=>this.input=i}
          value={userInput}
        />
        {showSuggestions && suggestionsListComponent}
      </div>
    );
  }
  public componentDidMount(){
    if(this.input && this.props.focus) {
      this.input.focus()
    }
  }
}
