import { Component, h } from "preact";
import { route } from 'preact-router';
import { firestore } from "../../components/firebase"
import FoodList from "../../components/food-list"
import TagSelector from "../../components/tag-selector";
import { FoodType } from '../../types';
import * as style from "./style.css";

interface Props {
    filter: string;
}

interface State {
    appliedFilter?: string;
    foods: FoodType[];
    lastRef?: any;
    queryFilter?: any;
}
const pageSize = 20;
const foodstore = firestore.collection("foods");

export default class FoodListRoute extends Component<Props, State> {
    public state: State = {
        foods: [],
    };


    public filterFoods = (filter: string) => {
        const appliedFilter = filter || "";
        const queryFilter = (appliedFilter === "") ? foodstore : foodstore.where("allTags", "array-contains", filter);
        queryFilter.limit(pageSize).get().then((snapshots: any) => {
            const docs = snapshots.docs;
            const lastRef = docs[pageSize-1];
            const foods = [...docs.map((doc: any)=>doc.data())];
            this.setState({appliedFilter, queryFilter, lastRef, foods});
        });
    }

    public onMore = (e: any) => {
        e.preventDefault();
        this.state.queryFilter.startAfter(this.state.lastRef).limit(pageSize)
        .get().then((snapshots: any) => {
            const docs = snapshots.docs;
            const lastRef = docs[pageSize-1];
            const foods = [...this.state.foods, ...docs.map((doc: any)=>doc.data())];
            this.setState({lastRef, foods});
        });

    }
    // gets called when this route is navigated to
    // public componentDidMount() {
    //     if(this.state.filter !== this.props.filter){
    //         this.filterFoods(this.props.filter);
    //     }
    // }

    // public handleChange = (e: Event) => {
    //     // @ts-ignore
    //     this.setState({filter: e.target.value})
    // }
    // public handleSubmit = (e: Event) => {
    //     e.preventDefault();
    //     this.filterFoods(this.state.filter);
    // }
    public handleFilter = (tag: string) => {
        route("/food?filter="+tag);
    }
  
    public render({ filter }: Props, { foods, appliedFilter }: State) {
        const f = filter || "";
        if(appliedFilter!==f) {
            this.filterFoods(f)
        }
        return (
            
            <div class={style.profile}>
                <TagSelector value={f} onSelect={this.handleFilter} onEscape={()=>{}} />

                {foods && <FoodList foods={foods}/>}
                {!(foods.length % pageSize) && <button onClick={this.onMore}>More</button> }

            </div>
        );
    }
}
