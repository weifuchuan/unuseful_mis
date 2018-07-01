import * as React from "react";
import {
	RouteComponentProps,
	withRouter,
	StaticContext,
	Switch,
	Route,
	Redirect
} from "react-router";
import { inject, observer } from "mobx-react";
import {
	Layout,
	Menu,
	Icon,
	Form,
	Input,
	Select,
	DatePicker,
	Button,
	message,
	List,
	InputNumber
} from "antd";
import { Store } from "src/store";
import ReactTable, { Column } from "react-table";
import View from "./View";
import { Score as ScoreModel } from "src/store";
import { c } from "src/kit";
import { FormComponentProps } from "antd/lib/form";
import { Moment } from "moment";
import {
	EditableString,
	EditableSelect,
	EditableDatePicker,
	EditableNumber
} from "./kit";
import { observable } from "mobx";

interface IProps extends RouteComponentProps<any, StaticContext> {
	store: Store;
}

@inject("store")
@observer
class Score extends React.Component<IProps> {
	
	render() {
		return (
			<Layout className="flex">
				<Layout.Sider theme="dark">
					{/* <ScrollArea className="full"> */}
					<Menu
						style={{ width: "100%" }}
						mode="inline"
						theme="dark"
						onSelect={({ key }) => {
							if (key === "view") {
								this.props.history.push(
									`${this.props.match.path}/view`,
									c({
										data: this.props.store.scores.slice(),
										columns: Object.keys(new ScoreModel())
									})
								);
							} else {
								this.props.history.push(`${this.props.match.path}/${key}`);
							}
						}}
					>
						<Menu.Item key="view">查看</Menu.Item>
						<Menu.Item key="add">新增</Menu.Item>
						<Menu.Item key="upd">修改</Menu.Item>
						<Menu.Item key="del">删除</Menu.Item>
					</Menu>
					{/* </ScrollArea> */}
				</Layout.Sider>
				<Layout.Content className="full">
					<div className="full" style={{ padding: "1em" }}>
						<Switch>
							<Route path={`${this.props.match.path}/view`} component={View} />
							<Route path={`${this.props.match.path}/add`} component={Add} />
							<Route path={`${this.props.match.path}/upd`} component={Upd} />
							<Route path={`${this.props.match.path}/del`} component={Del} />
							<Redirect
								from={`${this.props.match.path}`}
								to={{
									pathname: `${this.props.match.path}/view`,
									state: c({
										data: this.props.store.scores.slice(),
										columns: Object.keys(new ScoreModel())
									})
								}}
							/>
						</Switch>
					</div>
				</Layout.Content>
			</Layout>
		);
	}
}

export default withRouter(Score);

@inject("store")
@observer
class Add extends React.Component<{ store?: Store }> {
	render() {
		return (
			<AddForm
			onSubmit={async (data, callback) => {
				try {
					await this.props.store.addScore(data);
					message.success("新增成功");
					callback(); 
				} catch (e) {
					message.error(e.toString());
				}
			}}
			/>
		);
	}
}

@inject("store")
@observer
class _AddForm extends React.Component<
	FormComponentProps & { store?: Store; onSubmit: (data: any, callback: ()=>void) => void }
> {
	render() {
		const layout = {
			labelCol: { xs: { span: 8 }, sm: { span: 6 } },
			wrapperCol: { xs: { span: 16 }, sm: { span: 18 } }
		};
		const { getFieldDecorator, validateFields } = this.props.form;
		return (
			<Form>
				<Form.Item {...layout} label="成绩（score）">
					{getFieldDecorator("score", {
						rules: [{ required: true, message: "Please input score!" }]
					})(<InputNumber min={0} />)}
				</Form.Item>
				<Form.Item {...layout} label="学期（term）">
					{getFieldDecorator("term", {
						rules: [{ required: true, message: "Please input term!" }]
					})(<InputNumber min={0} />)}
				</Form.Item>
				<Form.Item {...layout} label="学生Id（student id）">
					{getFieldDecorator("studentId", {
						rules: [
							{ required: true, message: "Please select prior studentId!" }
						]
					})(
						<Select>
							{this.props.store.students.map((student, i) => {
								return (
									<Select.Option key={i} value={student.id}>{`${student.id}: ${
										student.name
									}`}</Select.Option>
								);
							})}
						</Select>
					)}
				</Form.Item>
				<Form.Item {...layout} label="课程Id（course id）">
					{getFieldDecorator("courseId", {
						rules: [
							{ required: true, message: "Please select prior courseId!" }
						]
					})(
						<Select>
							{this.props.store.courses.map((course, i) => {
								return (
									<Select.Option key={i} value={course.id}>{`${course.id}: ${
										course.name
									}`}</Select.Option>
								);
							})}
						</Select>
					)}
				</Form.Item>
				<Form.Item>
					<div className="full flex" style={{ justifyContent: "flex-end" }}>
						<Button
							type="primary"
							onClick={() => {
								const errs = this.props.form.getFieldsError();
								for (let key in errs) {
									if (errs[key]) {
										message.error(`注意：输入有错(${key})`);
										return;
									}
								}
								validateFields((errors: any, values: any) => {
									for (let key in errors) {
										if (errors[key]) {
											return;
										}
									}
									const data: any = this.props.form.getFieldsValue();
									this.props.onSubmit(data, ()=>this.props.form.resetFields());
								});
							}}
						>
							增加
						</Button>
						<Button
							onClick={() => {
								this.props.form.resetFields();
							}}
							style={{ marginLeft: "1em" }}
						>
							清空
						</Button>
					</div>
				</Form.Item>
			</Form>
		);
	}
}

/*
Table: score
-----------+------------------+------+-----+---------+---------
 Field     | Type             | Null | Key | Default | Remarks 
-----------+------------------+------+-----+---------+---------
 id        | INT UNSIGNED(10) | NO   | PRI |         |         
 courseId  | INT UNSIGNED(10) | NO   |     |         |         
 studentId | INT UNSIGNED(10) | NO   |     |         |         
 term      | VARCHAR(100)     | NO   |     |         |         
 score     | DOUBLE(22)       | NO   |     |         |         
-----------+------------------+------+-----+---------+---------
*/

const AddForm = Form.create()(_AddForm);

@inject("store")
@observer
class Upd extends React.Component<{ store: Store }> {
	@observable scores: ScoreModel[] = [];

	render() {
		const store = this.props.store;
		return (
			<div style={{ display: "flex", flexDirection: "column", padding: "1em" }}>
				<div
					style={{
						flex: 1,
						display: "flex",
						justifyContent: "flex-end",
						padding: "1em",
						paddingRight: "0em"
					}}
				>
					<Button
						type="primary"
						onClick={async () => {
							try {
								await store.updateScores(this.scores);
								message.success("修改成功");
							} catch (e) {
								message.error("修改失败：" + e.toString());
							}
						}}
					>
						保存修改
					</Button>
					<Button
						style={{ marginLeft: "1em" }}
						onClick={() => {
							(this.scores as any).clear();
							this.scores.push(
								...observable(c<ScoreModel[]>(this.props.store.scores))
							);
						}}
					>
						恢复修改
					</Button>
				</div>
				<ReactTable
					data={this.scores.slice()}
					columns={Object.keys(new ScoreModel()).map(
						(col): Column => {
							let Cell: (data: any) => React.ReactNode;
							switch (col) {
								case "term":
									Cell = EditableString(
										(index, id) => this.scores[index][id],
										(value, index, id) => (this.scores[index][id] = value),
										{ width: "100%", height: "100%" }
									);
									break;
								case "score":
									Cell = EditableNumber(
										(index, id) => this.scores[index][id],
										(value, index, id) => (this.scores[index][id] = value),
										{ width: "100%", height: "100%" }
									);
									break;
								case "studentId":
									Cell = EditableSelect(
										(index, id) => this.scores[index][id],
										() => store.students.map(c => c.id),
										(value, index, id) => (this.scores[index][id] = value),
										{ width: "100%", height: "100%" }
									);
									break;
								case "courseId":
									Cell = EditableSelect(
										(index, id) => this.scores[index][id],
										() => store.courses.map(c => c.id),
										(value, index, id) => (this.scores[index][id] = value),
										{ width: "100%", height: "100%" }
									);
									break;
								default:
									Cell = undefined;
							}
							return Cell
								? {
										Header: col,
										accessor: col,
										Cell
								  }
								: {
										Header: col,
										accessor: col
								  };
						}
					)}
					defaultPageSize={10}
				/>
			</div>
		);
	}

	componentDidMount() {
		(this.scores as any).clear();
		this.scores.push(...observable(c<ScoreModel[]>(this.props.store.scores)));
	}
}

@inject("store")
@observer
class Del extends React.Component<{ store: Store }> {
	render() {
		return (
			<div
				className="full flex"
				style={{ flexDirection: "column", padding: "1em", overflow: "auto" }}
			>
				<List
					bordered={true}
					itemLayout="horizontal"
					dataSource={this.props.store.scores.slice()}
					renderItem={score => (
						<List.Item
							actions={[
								<a
									onClick={async () => {
										if (window.confirm("确认删除？")) {
											try {
												await this.props.store.deleteScore(score);
												message.success("删除成功");
											} catch (e) {
												message.error("删除失败: " + e.toString());
											}
										}
									}}
								>
									删除
								</a>
							]}
						>
							<div>
								{Object.keys(score).reduce(
									(v, key) => `${v}${key}: ${score[key]} `,
									""
								)}
							</div>
						</List.Item>
					)}
				/>
			</div>
		);
	}
}
