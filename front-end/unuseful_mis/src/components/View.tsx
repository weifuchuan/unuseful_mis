import ReactTable, { Column } from "react-table";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

export default withRouter(
	class View extends React.Component<RouteComponentProps<any>> {
		render() {
			const {
				data,
				columns
			}: { data: any[]; columns: string[] } = this.props.location.state;
			return (
				<div className="full flex-center">
					<ReactTable
						data={data}
						columns={columns.map<Column>(c => ({
							Header: c,
							accessor: c
						}))}
						defaultPageSize={10}
						className="full"
					/>
				</div>
			);
		}
	}
);
