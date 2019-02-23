const indexHTML = appName => `<!doctype html>
<html>

<head>
	<title>${appName}</title>
	<meta charset="utf-8">
	<script src="wasm_exec.js"></script>
	<script>
		if (!WebAssembly.instantiateStreaming) { // polyfill
			WebAssembly.instantiateStreaming = async (resp, importObject) => {
				const source = await (await resp).arrayBuffer();
				return await WebAssembly.instantiate(source, importObject);
			};
		}
		const go = new Go();
		WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject).then((result) => {
			go.run(result.instance);
		});
	</script>
</head>

<body></body>

</html>`;

module.exports = indexHTML;
