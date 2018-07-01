import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import "./index.less";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "mobx-react";
import store from "./store";
import 'react-table/react-table.css'

ReactDOM.render(
	<Router basename="/#">
		<Provider store={store}>
			<App />
		</Provider>
	</Router>,
	document.getElementById("root") as HTMLElement
);
registerServiceWorker();
