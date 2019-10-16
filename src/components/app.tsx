import { Component, h } from "preact";
import { Route, Router, RouterOnChangeArgs } from "preact-router";

import FoodListRoute from "../routes/food-list-route";
import FoodRoute from "../routes/food-route";
import Home from "../routes/home";
import Profile from "../routes/profile";
import TagListRoute from "../routes/tag-list-route";
import TagRoute from "../routes/tag-route";
import Header from "./header";

if ((module as any).hot) {
    // tslint:disable-next-line:no-var-requires
    require("preact/debug");
}

export default class App extends Component {
    public currentUrl?: string;
    public handleRoute = (e: RouterOnChangeArgs) => {
        this.currentUrl = e.url;
    };

    public render() {
        return (
            <div id="app">
                <Header />
                <Router onChange={this.handleRoute}>
                    <Route path="/" component={Home} />
                    <Route path="/profile/" component={Profile} />
                    <Route path="/food/" component={FoodListRoute} />
                    <Route path="/food/:foodId" component={FoodRoute} />
                    <Route path="/tags/" component={TagListRoute} />
                    <Route path="/tags/:tagId" component={TagRoute} />
                </Router>
            </div>
        );
    }
}
