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
import { Clazz as ClazzModel } from "src/store";
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

const ScrollArea = require("react-scrollbar");

interface IProps extends RouteComponentProps<any, StaticContext> {
	store: Store;
}

@inject("store")
@observer
class Clazz extends React.Component<IProps> {
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
										data: this.props.store.clazzes.slice(),
										columns: Object.keys(new ClazzModel())
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
										data: this.props.store.clazzes.slice(),
										columns: Object.keys(new ClazzModel())
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

export default withRouter(Clazz);

@inject("store")
@observer
class Add extends React.Component<{ store?: Store }> {
	render() {
		return (
			<AddForm
			onSubmit={async (data, callback) => {
				try {
					await this.props.store.addClazz(data);
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
				<Form.Item {...layout} label="班级（name）">
					{getFieldDecorator("name", {
						rules: [{ required: true, message: "Please input name!" }]
					})(<Input />)}
				</Form.Item>
				<Form.Item {...layout} label="学院（institute）">
					{getFieldDecorator("institute", {
						rules: [{ required: true, message: "Please input institute!" }]
					})(<Input />)}
				</Form.Item>
				<Form.Item {...layout} label="年级（grade）">
					{getFieldDecorator("grade", {
						rules: [{ required: true, message: "Please input grade!" }]
					})(<Input />)}
				</Form.Item>
				<Form.Item {...layout} label="人数（num）">
					{getFieldDecorator("num", {
						rules: [{ required: true, message: "Please input num!" }]
					})(<InputNumber min={0} />)}
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
Table: clazz
-----------+------------------+------+-----+---------+---------
 Field     | Type             | Null | Key | Default | Remarks 
-----------+------------------+------+-----+---------+---------
 id        | INT UNSIGNED(10) | NO   | PRI |         |         
 name      | VARCHAR(32)      | NO   |     |         |         
 institute | VARCHAR(64)      | NO   |     |         |         
 grade     | VARCHAR(32)      | NO   |     |         |         
 num       | INT UNSIGNED(10) | NO   |     |         |         
-----------+------------------+------+-----+---------+---------
*/

const AddForm = Form.create()(_AddForm);

@inject("store")
@observer
class Upd extends React.Component<{ store: Store }> {
	@observable clazzes: ClazzModel[] = [];

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
								await store.updateClazzes(this.clazzes);
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
							(this.clazzes as any).clear();
							this.clazzes.push(
								...observable(c<ClazzModel[]>(this.props.store.clazzes))
							);
						}}
					>
						恢复修改
					</Button>
				</div>
				<ReactTable
					data={this.clazzes.slice()}
					columns={Object.keys(new ClazzModel()).map(
						(col): Column => {
							let Cell: (data: any) => React.ReactNode;
							switch (col) {
								case "name":
								case "grade":
								case "institute":
									Cell = EditableString(
										(index, id) => this.clazzes[index][id],
										(value, index, id) => (this.clazzes[index][id] = value),
										{ width: "100%", height: "100%" }
									);
									break;
								case "num":
									Cell = EditableNumber(
										(index, id) => this.clazzes[index][id],
										(value, index, id) => (this.clazzes[index][id] = value),
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
		(this.clazzes as any).clear();
		this.clazzes.push(...observable(c<ClazzModel[]>(this.props.store.clazzes)));
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
					dataSource={this.props.store.clazzes.slice()}
					renderItem={clazz => (
						<List.Item
							actions={[
								<a
									onClick={async () => {
										if (window.confirm("确认删除？")) {
											try {
												await this.props.store.deleteClazz(clazz);
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
								{Object.keys(clazz).reduce(
									(v, key) => `${v}${key}: ${clazz[key]} `,
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
