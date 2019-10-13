import { Component, h } from "preact";
import { firestore } from "../../components/firebase"
import FoodList from "../../components/food-list"
import TagSelector from "../../components/tag-selector";
import * as style from "./style.css";

interface Props {
    filter: string;
}

interface State {
    foods: any[];
    filter: string;
}
export default class FoodRoute extends Component<Props, State> {
    public state = {
        foods: [],
        filter: ""
    };

    public foodstore = firestore.collection("foods");

    public filterFoods = (filter: string) => {
        const query = filter && filter !== "" ? this.foodstore.where("containsTags", "array-contains", filter) : this.foodstore 
        query  // .orderBy("id").limit(5)
            .get().then(q => {this.setState({filter, foods: q.docs.map(doc => doc.data())})});
    }

    // gets called when this route is navigated to
    public componentDidMount() {
        if(this.state.filter !== this.props.filter){
            this.filterFoods(this.props.filter);
        }
    }

    // public handleChange = (e: Event) => {
    //     // @ts-ignore
    //     this.setState({filter: e.target.value})
    // }
    // public handleSubmit = (e: Event) => {
    //     e.preventDefault();
    //     this.filterFoods(this.state.filter);
    // }
    public handleFilter = (tag: string) => {
        this.filterFoods(tag);
    }
  
    public render({ }: Props, { foods, filter }: State) {
        return (
            
            <div class={style.profile}>
                <TagSelector value={filter} onSelect={this.handleFilter} onEscape={()=>{this.handleFilter("")}} />

                {foods && <FoodList foods={foods}/>}
            </div>
        );
    }
}
