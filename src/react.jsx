import {Fragment} from "react";
import {createRoot} from "react-dom/client";
import logData from "./logbox.js";
import { observer } from "mobx-react-lite";

const App = observer( function({rawLogs})
{
	const logs = rawLogs.logs.map( ({main, sub=null})=>(<Fragment key={main}>
		<p className="invalid">{main}</p>
		<p className="invalid reason">{sub}</p>
	</Fragment>) );

	return (<>
		{logs}
		{(rawLogs.isFinished && logs.length === 0) && <p className="valid">All JSON Files are Valid!</p>}
	</>);
} );

export default function render()
{
	const container = document.getElementById("result");
	const root = createRoot(container);
	root.render(<App rawLogs={logData}/>);
}
