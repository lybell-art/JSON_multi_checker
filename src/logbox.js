import { makeAutoObservable } from "mobx";

class ResultLog
{
	logs = [];
	isFinished = false;
	constructor()
	{
		makeAutoObservable(this);
	}
	flush()
	{
		this.logs=[];
		this.isFinished = false;
	}
	append(path, reason="")
	{
		reason = reason.toString();
		this.logs = [...this.logs, {main:`Invalid JSON Detected! : ${path}\n`, sub:reason} ];
	}
	finish()
	{
		this.isFinished = true;
	}
}

const resultLog = new ResultLog();

export default resultLog;