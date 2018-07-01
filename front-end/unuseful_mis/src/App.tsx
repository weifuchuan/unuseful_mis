import * as React from "react";
import { Layout, Menu } from "antd";
import "./index.less";
import {
	Route,
	Switch,
	withRouter,
	RouteComponentProps,
	Redirect
} from "react-router";
const Loadable = require("react-loadable")

const { Header } = Layout;

interface IProps extends RouteComponentProps<any> {}

class App extends React.Component<IProps> {
	render() {
		return (
			<Layout className="layout">
				<Header>
					<div className="flex full">
						<div
							style={{
								color: "white",
								fontSize: "1.5em",
								marginRight: "1em",
								marginLeft: "-1em"
							}}
						>
							学生成绩管理系统
						</div>
						<Menu
							theme="dark"
							mode="horizontal"
							style={{ lineHeight: "64px" }}
							onSelect={({ key }) => {
								if (key === "1") this.props.history.push("/student");
								if (key === "2") this.props.history.push("/clazz");
								if (key === "3") this.props.history.push("/course");
								if (key === "4") this.props.history.push("/score");
								if (key === "5") this.props.history.push("/search");
							}}
						>
							<Menu.Item key="1">学生</Menu.Item>
							<Menu.Item key="2">班级</Menu.Item>
							<Menu.Item key="3">课程</Menu.Item>
							<Menu.Item key="4">成绩</Menu.Item>
							<Menu.Item key="5">查询</Menu.Item>
						</Menu>
					</div>
				</Header>
				<Switch>
					<Route
						path="/student"
						component={Loadable({
							loader: () => import("./components/Student"),
							loading: Loading
						})}
					/>
					<Route
						path="/clazz"
						component={Loadable({
							loader: () => import("./components/Clazz"),
							loading: Loading
						})}
					/>
					<Route
						path="/course"
						component={Loadable({
							loader: () => import("./components/Course"),
							loading: Loading
						})}
					/>
					<Route
						path="/score"
						component={Loadable({
							loader: () => import("./components/Score"),
							loading: Loading
						})}
					/>
					<Route
						path="/search"
						component={Loadable({
							loader: () => import("./components/Search"),
							loading: Loading
						})}
					/>
					<Redirect from="/" to="/student" />
				</Switch>
			</Layout>
		);
	}
}

const Loading = () => <div>加载中...</div>;

export default withRouter(App);
