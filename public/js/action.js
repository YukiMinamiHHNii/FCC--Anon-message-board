(() => {
	handleSubmit();
})();

function handleSubmit() {
	document.addEventListener("submit", e => {
		e.preventDefault();
		let data = new FormData(e.target);

		e.target.action = e.target.classList.contains("thread")
			? `${e.target.baseURI}api/threads/${data.get("board")}`
			: `${e.target.baseURI}api/replies/${data.get("board")}`;

		if (
			e.target.attributes.getNamedItem("method").value == "GET" ||
			e.target.attributes.getNamedItem("method").value == "POST"
		) {
			e.target.submit();
		} else {
			ajaxRequest(
				{
					type: e.target.attributes.getNamedItem("method").value,
					endpoint: e.target.action,
					args: data
				},
				result => {
					alert(result.status);
				}
			);
		}
	});
}

function ajaxRequest(data, result) {
	let req = getXHRType();

	req.open(data.type, data.endpoint, true);

	req.addEventListener("readystatechange", e => {
		if (req.readyState === 4) {
			return result(JSON.parse(req.response));
		}
	});

	if (data.type !== "GET") {
		req.send(data.args);
	} else {
		req.send();
	}
}

function getXHRType() {
	let request;
	if (window.XMLHttpRequest) {
		request = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}

	return request;
}
