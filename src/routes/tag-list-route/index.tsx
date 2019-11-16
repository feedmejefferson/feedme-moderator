import { Component, h } from "preact";
import { route } from "preact-router";
import { dimensions } from "../../components/fingerprint";
import { firestore } from "../../components/firebase"
import TagTable from "../../components/tag-table";
import { tagStats } from "../../state/indices";
import { TagStat, TagStats } from "../../types";
import * as style from "./style.css";

interface Props {
    sort?: string;
    order?: string;
    index?: number;
}
interface State {
    tags: TagStats;
    stats: TagStat[];
}
const EMPTY_DIMS: number[] = [0,0,0,0,0,0,0,0,0,0,0,0];

export default class TagListRoute extends Component<Props, State> {
    public unsubscribeTagStats = () => {};

    public onSort = (sort: string, index?: number) => {
        const order = !(sort===this.props.sort && !index || this.props.index && 1*this.props.index===index) ? 'd' : (this.props.order==='d') ? 'a' : 'd';
        const sortRoute = "/tags?sort=" + sort + ( index!==undefined ? "&index=" + index : "" ) + "&order=" + order; 
        route(sortRoute, true);
    }
    public componentWillMount() {
        this.unsubscribeTagStats = tagStats.onSnapshot(doc => {
            const tags = doc.data() as TagStats;
            // const stats = Object.values(tags).map(stat => ({...stat, totalTags: stat.containsTags+stat.descriptiveTags+stat.isTags }))
            // handle elements that don't already have a redundant id attribute with their key value
            // and ones that are missing a vector space (most likely because they were created on the fly)
            const stats = Object.keys(tags).map(key => {
                const stat = tags[key]
                return {dims: EMPTY_DIMS, id: key, ...stat, totalTags: stat.containsTags+stat.descriptiveTags+stat.isTags }
            })
            this.setState({tags, stats})});      
    }
    public componentWillUnmount() {
        this.unsubscribeTagStats();
    }

    public render({sort, index, order}: Props, {stats}: State) {
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

        return (
            <div class={style.page}>
                <h1>Tags</h1>
                <p>
                Click any of the table column headers to sort the table by that
                column, or click one of the following meaning dimensions: 
                { [...dimensions].splice(1).map((dim,i)=><button key={i} onClick={()=>this.onSort("dims",i+1)}>{dim.left} / {dim.right}</button>)}
                </p>
                <TagTable stats={sortedStats} sort={this.onSort}/>
            </div>
        );
    }
}
