import { Component, h } from 'preact';
import { Link } from 'preact-router/match';
import { TagStat } from '../../types';
import * as style from "./style.css";

interface Props {
  stats: TagStat[];
  sort: (key: string, index?: number) => void;
}

export default class TagTable extends Component<Props> {
  public render({stats, sort}: Props) {
    return (
      <table>
        
        <tr>
          <th onClick={()=>sort("id")}>Tag</th>
          <th onClick={()=>sort("isTags")}>Main Count</th>
          <th onClick={()=>sort("containsTags")}>Contained Count</th>
          <th onClick={()=>sort("descriptiveTags")}>Addtional Count</th>
          <th onClick={()=>sort("totalTags")}>Total Count</th>
        </tr>
        {stats.map((stat,i)=>
        <tr key={i}>
          <td><Link activeClassName='' href={`/tags/${stat.id}`}>{stat.id}</Link></td>
          <td class={style.numeric}><Link activeClassName='' href={`/food?filter=${stat.id}&tagtype=isTags`}>{stat.isTags}</Link></td>
          <td class={style.numeric}><Link activeClassName='' href={`/food?filter=${stat.id}&tagtype=containsTags`}>{stat.containsTags}</Link></td>
          <td class={style.numeric}><Link activeClassName='' href={`/food?filter=${stat.id}&tagtype=descriptiveTags`}>{stat.descriptiveTags}</Link></td>
          <td class={style.numeric}><Link activeClassName='' href={`/food?filter=${stat.id}`}>{stat.totalTags}</Link></td>
        </tr>

        )}
      </table>
    );
  }
}
