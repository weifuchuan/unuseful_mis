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
	List
} from "antd";
import { Store } from "src/store";
import ReactTable, { Column } from "react-table";
import View from "./View";
import { Student as StudentModel } from "src/store";
import { c } from "src/kit";
import { FormComponentProps } from "antd/lib/form";
import { Moment } from "moment";
import { EditableString, EditableSelect, EditableDatePicker } from "./kit";
import { observable } from "mobx";

const ScrollArea = require("react-scrollbar");

interface IProps extends RouteComponentProps<any, StaticContext> {
	store: Store;
}

@inject("store")
@observer
class Student extends React.Component<IProps> {
	render() {
		return (
			<Layout className="flex">
				<Layout.Sider theme="dark">
					<Menu
						style={{ width: "100%" }}
						mode="inline"
						theme="dark"
						onSelect={({ key }) => {
							if (key === "view") {
								this.props.history.push(
									`${this.props.match.path}/view`,
									c({
										data: this.props.store.students.slice(),
										columns: Object.keys(new StudentModel())
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
										data: this.props.store.students.slice(),
										columns: Object.keys(new StudentModel())
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

export default withRouter(Student);

@inject("store")
@observer
class Add extends React.Component<{ store?: Store }> {
	render() {
		return (
			<AddForm
				onSubmit={async (data, callback) => {
					try {
						await this.props.store.addStudent(data);
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
				<Form.Item {...layout} label="名字（name）">
					{getFieldDecorator("name", {
						rules: [{ required: true, message: "Please input name!" }]
					})(<Input />)}
				</Form.Item>
				<Form.Item {...layout} label="性别（sex）">
					{getFieldDecorator("sex", {
						initialValue: "男"
					})(
						<Select>
							<Select.Option value="男">男</Select.Option>
							<Select.Option value="女">女</Select.Option>
						</Select>
					)}
				</Form.Item>
				<Form.Item {...layout} label="生日（birthday）">
					{getFieldDecorator("birthday", {
						rules: [{ required: true, message: "Please input birthday!" }]
					})(<DatePicker />)}
				</Form.Item>
				<Form.Item {...layout} label="国家（nation）">
					{getFieldDecorator("nation", {
						rules: [{ required: true, message: "Please input nation!" }]
					})(<Input />)}
				</Form.Item>
				<Form.Item {...layout} label="籍贯（native）">
					{getFieldDecorator("native", {
						rules: [{ required: true, message: "Please input native!" }]
					})(<Input />)}
				</Form.Item>
				<Form.Item {...layout} label="班级id（clazz id）">
					{getFieldDecorator("clazzId", {
						rules: [{ required: true, message: "Please select class id!" }]
					})(
						<Select>
							{this.props.store.clazzes.map((clazz, i) => {
								return (
									<Select.Option key={i} value={clazz.id}>{`${clazz.id}: ${
										clazz.name
									} / ${clazz.institute} / ${clazz.grade}`}</Select.Option>
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
									data.birthday = (data.birthday as Moment).format(
										"YYYY-MM-DD"
									);
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
Table: student
----------+------------------+------+-----+---------+---------
 Field    | Type             | Null | Key | Default | Remarks 
----------+------------------+------+-----+---------+---------
 id       | INT UNSIGNED(10) | NO   | PRI |         |         
 name     | VARCHAR(32)      | NO   |     |         |         
 sex      | VARCHAR(2)       | NO   |     | 男       |         
 birthday | DATE(10)         | NO   |     |         |         
 nation   | VARCHAR(32)      | NO   |     |         |         
 native   | VARCHAR(32)      | NO   |     |         |         
 clazzId  | INT UNSIGNED(10) | NO   |     |         |         
----------+------------------+------+-----+---------+---------
*/

const AddForm = Form.create()(_AddForm);

@inject("store")
@observer
class Upd extends React.Component<{ store: Store }> {
	@observable students: StudentModel[] = [];

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
								await store.updateStudents(this.students);
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
							(this.students as any).clear();
							this.students.push(
								...observable(c<StudentModel[]>(this.props.store.students))
							);
						}}
					>
						恢复修改
					</Button>
				</div>
				<ReactTable
					data={this.students.slice()}
					columns={Object.keys(new StudentModel()).map(
						(col): Column => {
							let Cell: (data: any) => React.ReactNode;
							switch (col) {
								case "name":
								case "native":
								case "nation":
									Cell = EditableString(
										(index, id) => this.students[index][id],
										(value, index, id) => (this.students[index][id] = value),
										{ width: "100%", height: "100%" }
									);
									break;
								case "sex":
									Cell = EditableSelect(
										(index, id) => this.students[index][id],
										() => ["男", "女"],
										(value, index, id) => (this.students[index][id] = value)
									);
									break;
								case "birthday":
									Cell = EditableDatePicker(
										(index, id) => this.students[index][id],
										(value, index, id) => (this.students[index][id] = value)
									);
									break;
								case "clazzId":
									Cell = EditableSelect(
										(index, id) => this.students[index][id],
										() => store.clazzes.map(c => c.id),
										(value, index, id) => (this.students[index][id] = value)
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
		(this.students as any).clear();
		this.students.push(
			...observable(c<StudentModel[]>(this.props.store.students))
		);
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
					dataSource={this.props.store.students.slice()}
					renderItem={student => (
						<List.Item
							actions={[
								<a
									onClick={async () => {
										if (window.confirm("确认删除？")) {
											try {
												await this.props.store.deleteStudent(student);
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
								{Object.keys(student).reduce(
									(v, key) => `${v}${key}: ${student[key]} `,
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
