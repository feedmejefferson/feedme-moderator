import { Component, h } from "preact";
import { Link } from "preact-router/match";
import { dimensions } from "../../components/fingerprint";
import { firestore } from "../../components/firebase"
import TagTable from "../../components/tag-table";
import { TagStat, TagStats } from "../../types";
import * as style from "./style.css";

interface Props {
}
interface State {
    tags: TagStats;
    stats: TagStat[];
    sortKey: { key: string, index?: number, order: number }
}

const tagPromise = firestore.collection("indexes").doc("tagStats").get();


export default class TagListRoute extends Component<Props, State> {
    public onSort = (key: string, index?: number) => {
        const s = this.state.sortKey;
        const order = !s ? 1 : !(key===s.key && index===s.index) ? 1 : -1 * s.order;
        const sortKey = { key, index, order }
        const compare = (a: any, b: any) => {
            const A = index ? a[key][index] : a[key]
            const B = index ? b[key][index] : b[key]
            return order * (A < B ? 1 : A > B ? -1 : 0); 
        }
        const stats = [...this.state.stats]
        stats.sort(compare)
        this.setState({stats, sortKey})
    }

    public componentWillMount() {
        tagPromise.then(doc => {
            const tags = doc.data() as TagStats;
            const stats = Object.values(tags).map(stat => ({...stat, totalTags: stat.containsTags+stat.descriptiveTags+stat.isTags }))
            this.setState({tags, stats})});      
    }

    public render({}: Props, {stats}: State) {
        if(!stats) { return ("loading...")}
        return (
            <div class={style.page}>
                <h1>Tags</h1>
                <p>
                Click any of the table column headers to sort the table by that
                column, or click one of the following meaning dimensions: 
                { [...dimensions].splice(1).map((dim,i)=><button key={i} onClick={()=>this.onSort("dims",i)}>{dim.left} / {dim.right}</button>)}
                </p>
                <TagTable stats={stats} sort={this.onSort}/>
            </div>
        );
    }
}
