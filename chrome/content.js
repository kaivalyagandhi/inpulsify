function highlight(container, set, spanClass) {
    var content = container.innerText;
    content = content.split(/[ ,.'’]+/);
    for (i = 0; i < content.length; i++) {
	var lowerCaseWord = content[i].toLowerCase();
	if (set.has(lowerCaseWord)) {
	    content[i] = "<span class='" + spanClass + "' style='font-weight:bold'>" + content[i] + "</span>";
	}
    }
    container.innerHTML = content.join(" ");
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == "readPage") {
		var text = $(".postArticle p").text();
		chrome.runtime.sendMessage({
			data: text,
			action: "read"
		});
	}
	if (request.action == "readKeywords") {
		var keywordSet = new Set(request.keywords);
		var paragraphs = $(".postArticle-content p");
		for (j = 0; j < paragraphs.length; j++) {
			highlight(paragraphs[j], keywordSet, "highlight");
		}
	}
});
