import * as React from "react";
import { Student } from "../store";
import { Observer } from "mobx-react";
import { Select, DatePicker } from "antd";
const moment = require("moment");

export interface Cell<T> {
	original: T;
	row: T & {
		_original: T;
		_index: number;
		_nestingLevel: number;
		_viewIndex: number;
	};
	index: number;
	viewIndex: number;
	pageSize: number;
	page: number;
	level: number;
	nestingPath: number[];
	column: {
		Header: string;
		show: boolean;
		minWidth: number;
		className: string;
		style: React.StyleHTMLAttributes<{}>;
		headerClassName: string;
		headerStyle: React.StyleHTMLAttributes<{}>;
		footerClassName: string;
		footerStyle: React.StyleHTMLAttributes<{}>;
		filterAll: boolean;
		id: string;
	};
	value: string;
}

export function EditableString<T>(
	getter: (index: number, id: string) => string,
	setter: (value: string, index: number, id: string) => void,
	style: React.CSSProperties = {}
): (cell: Cell<T>) => React.ReactNode {
	return (cell: Cell<T>) => (
		<div
			style={{ backgroundColor: "#fafafa", ...style }}
			contentEditable
			suppressContentEditableWarning
			onBlur={e => {
				setter(e.target.innerHTML, cell.index, cell.column.id);
			}}
			dangerouslySetInnerHTML={{
				__html: getter(cell.index, cell.column.id)
			}}
		/>
	);
}

export function EditableNumber<T>(
	getter: (index: number, id: string) => number,
	setter: (value: number, index: number, id: string) => void,
	style: React.CSSProperties = {}
): (cell: Cell<T>) => React.ReactNode {
	return (cell: Cell<T>) => (
		<div
			style={{ backgroundColor: "#fafafa", ...style }}
			contentEditable
			suppressContentEditableWarning
			onBlur={e => {
				if (/^(\d+\.\d*)|(\.\d+)$/.test(e.target.innerHTML)) {
					setter(
						Number.parseFloat(e.target.innerHTML),
						cell.index,
						cell.column.id
					);
				} else if (/^(\d+)$/.test(e.target.innerHTML)) {
					setter(
						Number.parseInt(e.target.innerHTML),
						cell.index,
						cell.column.id
					);
				}
			}}
			dangerouslySetInnerHTML={{
				__html: getter(cell.index, cell.column.id).toString()
			}}
		/>
	);
}

export function EditableSelect<T>(
	getter: (index: number, id: string) => string | number,
	valuesGetter: () => (string | number)[],
	setter: (value: number | string, index: number, id: string) => void,
	style: React.CSSProperties = {}
): (cell: Cell<T>) => React.ReactNode {
	return (cell: Cell<T>) => (
		<Select
			value={getter(cell.index, cell.column.id)}
			style={style}
			onChange={(v: string | number) => {
				setter(v, cell.index, cell.column.id);
			}}
		>
			<Select.Option value={undefined} key={-1}>{"(无)"}</Select.Option>
			{valuesGetter().map((v, i) => (
				<Select.Option value={v} key={i}>
					{v}
				</Select.Option>
			))}
		</Select>
	);
}

export function EditableDatePicker<T>(
	getter: (index: number, id: string) => string,
	setter: (value: number | string, index: number, id: string) => void,
	style: React.CSSProperties = {}
): (cell: Cell<T>) => React.ReactNode {
	return (cell: Cell<T>) => (
		<DatePicker
			style={style}
			value={moment(getter(cell.index, cell.column.id))}
			onChange={date =>
				setter(date.format("YYYY-MM-DD"), cell.index, cell.column.id)
			}
			allowClear={false}
		/>
	);
}
