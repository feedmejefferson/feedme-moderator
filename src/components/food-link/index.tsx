import { Component, h } from 'preact';
import { Link } from 'preact-router/match';

interface Props {
  id: string;
  title: string;
}

export default class FoodLink extends Component<Props> {

    public render({ id, title }: Props) {
        return (
          <Link activeClassName="" href={`/food/${id}`}>
          <img alt={title} src={`https://storage.googleapis.com/karens-kitchen.appspot.com/assets/images/${id}.jpg`}/>
          { /* title */ }
          </Link>
        );
    }
}
