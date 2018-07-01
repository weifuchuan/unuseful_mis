import * as React from "react";
import { RouteComponentProps, withRouter, StaticContext } from "react-router";
import AceEditor from "react-ace";
import { inject, observer } from "mobx-react";
import { Store } from "../store";
import { observable } from "mobx";
import ReactTable, { Column } from "react-table";

var ace = require("brace");
require("brace/mode/mysql");
require("brace/theme/github");

interface IProps extends RouteComponentProps<any, StaticContext> {
	store: Store;
}

@inject("store")
@observer
class Search extends React.Component<IProps> {
	@observable sql: string = "";
	@observable maybeError: string = "";
	@observable columns: string[] = [];
	@observable data: any[] = [];

	search = async () => {
		this.maybeError = "";
		try {
      const { columns, data } = await this.props.store.search(this.sql);
      console.log(JSON.stringify({ columns, data } )); 
      (this.columns as any).clear(); 
      this.columns.push(...columns); 
      (this.data as any).clear(); 
      this.data.push(...data); 
		} catch (e) {
			this.maybeError = e.toString();
		}
	};

	render() {
		return (
			<div
				className="full flex"
				style={{ flexDirection: "column", overflow: "auto" }}
			>
				<div className="flex" style={{ flex: 2 }}>
					<div className="flex" style={{ flex: 3, flexDirection: "column" }}>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<a style={{ color: "#2F4F4F" }}>SQL查询编辑器</a>
							<a onClick={this.search}>查询</a>
						</div>
						<AceEditor
							style={{ flex: 1, width: "100%", height: "100%" }}
							mode="mysql"
							theme="github"
							name="blah2"
							onChange={sql => {
								this.sql = sql;
							}}
							value={this.sql}
							fontSize={15}
							showPrintMargin={true}
							showGutter={true}
							highlightActiveLine={true}
							setOptions={{
								enableBasicAutocompletion: true,
								enableLiveAutocompletion: true,
								enableSnippets: true,
								showLineNumbers: true,
								tabSize: 2
							}}
						/>
					</div>
					{this.maybeError ? (
						<div
							className="flex"
							style={{ flex: 1, backgroundColor: "#4B0082", color: "#fff" }}
						>
							{this.maybeError}
						</div>
					) : null}
				</div>
				<div className="flex" style={{ flex: 3 }}>
					<ReactTable
						data={this.data.slice()}
						columns={this.columns.map<Column>(c => ({
							Header: c,
							accessor: c
						}))}
						defaultPageSize={10}
						className="full"
					/>
				</div>
			</div>
		);
	}
}

export default withRouter(Search);
