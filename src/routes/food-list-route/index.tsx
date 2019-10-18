import { Component, h } from "preact";
import { route } from 'preact-router';
import { firestore } from "../../components/firebase"
import FoodList from "../../components/food-list"
import TagSelector from "../../components/tag-selector";
import { FoodType } from '../../types';
import * as style from "./style.css";

interface Props {
    filter: string;
    tagtype?: string;
}

interface State {
    appliedFilter?: string;
    foods: FoodType[];
    lastRef?: any;
    queryFilter?: any;
}
const pageSize = 20;
const foodstore = firestore.collection("foods");
const OPTS = { passive:true };

export default class FoodListRoute extends Component<Props, State> {
    public state: State = {
        foods: [],
    };


    public filterFoods = (filter: string, tagtype: string) => {
        const appliedFilter = filter || "";
        const queryFilter = (appliedFilter === "") ? foodstore : foodstore.where(tagtype, "array-contains", filter);
        queryFilter.limit(pageSize).get().then((snapshots: any) => {
            const docs = snapshots.docs;
            const lastRef = docs[pageSize-1];
            const foods = [...docs.map((doc: any)=>doc.data())];
            this.setState({appliedFilter, queryFilter, lastRef, foods});
        });
    }
    public loadMore = () => {
        this.state.queryFilter.startAfter(this.state.lastRef).limit(pageSize)
        .get().then((snapshots: any) => {
            const docs = snapshots.docs;
            const lastRef = docs[pageSize-1];
            const foods = [...this.state.foods, ...docs.map((doc: any)=>doc.data())];
            this.setState({lastRef, foods});
        });
    }
    public onMore = (e: any) => {
        e.preventDefault();
        this.loadMore();
    }
    public onScroll = (e: any) => {
        const el = document.scrollingElement;
        const viewHeight = el && el.clientHeight;
        const top = el && el.scrollTop;
        const height = el && el.scrollHeight;
        if(!(this.state.foods.length % pageSize) && height && top && viewHeight && height===top+viewHeight) {
            this.loadMore();
        }
    }
    public componentDidMount() {
        addEventListener('scroll', this.onScroll, OPTS);
    }
    public componentWillUnmount() {
        removeEventListener('scroll', this.onScroll);
    }

    public handleFilter = (tag: string) => {
        route("/food?filter="+tag);
    }
  
    public render({ filter, tagtype }: Props, { foods, appliedFilter }: State) {
        const f = filter || "";
        if(appliedFilter!==f) {
            this.filterFoods(f, tagtype || "allTags")
        }
        return (
            
            <div class={style.profile}>
                <h1>Filter by Tags</h1>
                <TagSelector value={f} onSelect={this.handleFilter} onEscape={()=>{}} />

                {foods && <FoodList foods={foods}/>}
                {!(foods.length % pageSize) && <button onClick={this.onMore}>More</button> }

            </div>
        );
    }
}
