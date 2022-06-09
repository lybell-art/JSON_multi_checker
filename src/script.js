import JSZip from "jszip";
import appendReact from "./react.jsx";
import log from "./logbox.js";


function extractFileName(fullname)
{
	let matcher = fullname.match(/(.*)\.([^\s.]+)$/);
	if(matcher === null) return [fullname,null];
	return [ matcher[1], matcher[2] ];
}

async function traverseToValidator(zip)
{
	const validator = [];
	await zip.forEach((path,file)=>{
		const [,extension] = extractFileName(path);
		if(extension === "json") validator.push({path, promise:file.async("text").then( text=>JSON.parse(text) ) });
	});
	return validator;
}

async function validateJSONs(validator)
{
	const paths = validator.map( ({path})=>path );
	const promises = validator.map( ({promise})=>promise );

	const result = await Promise.allSettled(promises);

	const invalidPaths = [];
	for(let i=0; i<result.length; i++)
	{
		if(result[i].status === "rejected") invalidPaths.push({path:paths[i], reason:result[i].reason});
	}
	return invalidPaths;
}

function handleFiles()
{
	if(!this.files || this.files.length === 0) return;

	// read files, single json check
	const file=this.files[0];
	const [,extension] = extractFileName(file.name);

	log.flush();
	if(extension === "json")
	{
		file.text()
			.then(text=>JSON.parse(text))
			.catch(e=>log.append(file.name, e))
			.finally(()=>log.finish());
	}
	else
	{
		const zip = new JSZip();
		file.arrayBuffer()
			.then(blob=>zip.loadAsync(blob))
			.then(zip=>traverseToValidator(zip) )
			.then(validator=>validateJSONs(validator) )
			.then(invalidPaths=>invalidPaths.forEach( ({path, reason})=>log.append(path, reason)) )
			.finally(()=>log.finish());
	}
}

(function main()
{
	const importButton = document.getElementById("importFile");
	const importFile = document.getElementById('file');

	importButton.addEventListener("click", ()=>importFile.click());
	importFile.addEventListener("change", handleFiles);

	appendReact();
})();