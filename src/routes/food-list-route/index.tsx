import { Component, h } from "preact";
import { route } from 'preact-router';
import { dimensions } from "../../components/fingerprint";
import { firestore } from "../../components/firebase"
import FoodLink from "../../components/food-link";
import FoodList from "../../components/food-list"
import TagSelector from "../../components/tag-selector";
import { foodStats, tagFoodsIndex } from "../../state/indices"
import { FoodType } from '../../types';
import * as style from "./style.css";


interface Props {
    filter?: string;
    sort?: string;
    order?: string;
    index?: number;
}

interface State {
    foods: any;
    stats: any[];
    visibleCount: number;
    invertedIndex: any;
}

const pageSize = 20;
const OPTS = { passive:true };

export default class FoodListRoute extends Component<Props, State> {
    public unsubscribeTagFoods = () => {};
    public unsubscribeFoodStats = () => {};

    public onSort = (sort: string, index?: number) => {
        const order = !(sort===this.props.sort && !index || this.props.index && 1*this.props.index===index) ? 'd' : (this.props.order==='d') ? 'a' : 'd';
        const sortRoute = "/food?sort=" + sort + 
        ( index!==undefined ? "&index=" + index : "" ) + 
        ( this.props.filter!==undefined ? "&filter=" + this.props.filter : "" ) + 
        "&order=" + order; 
        route(sortRoute, true);
    }
    public loadMore = () => {
        const visibleCount = this.state.visibleCount;
        if(visibleCount < this.state.stats.length){
            this.setState({visibleCount: visibleCount + pageSize})
        }
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
    public componentWillMount() {
        this.unsubscribeFoodStats = foodStats.onSnapshot(doc => {
            const foods = doc.data() || {};
            const stats = Object.values(foods)
            this.setState({foods, stats, visibleCount: pageSize})
        });      
        this.unsubscribeTagFoods = tagFoodsIndex.onSnapshot(doc => {
            const invertedIndex = doc.data() || {};
            this.setState({invertedIndex})
        });      
    }


    public componentWillUnmount() {
        removeEventListener('scroll', this.onScroll);
        this.unsubscribeFoodStats();
        this.unsubscribeTagFoods();
    }

    public handleFilter = (tag: string) => {
        const filterRoute = "/food?filter=" + tag +
        ( this.props.index!==undefined ? "&index=" + this.props.index : "" ) + 
        ( this.props.sort!==undefined ? "&sort=" + this.props.sort : "" ) + 
        ( this.props.order!==undefined ? "&order=" + this.props.order : "" );
        route(filterRoute, true);
    }
  
    public render({ sort, order, index, filter }: Props, { stats, visibleCount, invertedIndex }: State) {
        if(!stats) { return ("loading...")}

        let sortedStats = stats;
        if(sort) {
            const compare = (a: any, b: any) => {
                const o = order === 'd' ? 1 : -1;
                const s = sort || "id"
                const A = index ? a[s][index] : a[s]
                const B = index ? b[s][index] : b[s]
                return o * (A < B ? 1 : A > B ? -1 : 0); 
            }
            sortedStats = [...stats].sort(compare)    
        }
        const showFoods = invertedIndex && filter && invertedIndex[filter];
        const f = showFoods ? (stat: any) => showFoods.foods.includes(stat.id): (stat: any) => true;
        const filteredStats = sortedStats.filter(f);

        return (
            
            <div class={style.profile}>
                <h1>Filter by Tags</h1>
                <p>
                Sort foods by <button onClick={()=>this.onSort("updated")}>Last Updated</button>
                or one of the following meaning dimensions: 
                { [...dimensions].splice(1).map((dim,i)=><button key={i} onClick={()=>this.onSort("dims",i+1)}>{dim.left} / {dim.right}</button>)}
                </p>

                <TagSelector value={filter ? filter : ""} onSelect={this.handleFilter} onEscape={()=>{}} />
                <ul class={style.masonry}>
                    {filteredStats.slice(0,visibleCount).map(stat => 
                    <li key={stat.id} class={style.masonryBrick}>
                    <FoodLink title="" id={stat.id} />
                    </li>)}
                </ul>
                { (visibleCount < filteredStats.length) && <button onClick={this.onMore}>More</button> }

            </div>
        );
    }
}
