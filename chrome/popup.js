/* global chrome */
/* global $ */

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action:"readPage"});	
});

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if(request.action == 'read') {
        $.post('http://localhost:5000/keywords', {'data_to_analyze': request.data}, function(resp) {
            resp = JSON.parse(resp);
            chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: "readKeywords", keywords: resp.keywords});
            });
        });
        $.post('http://localhost:5000/sentiment', {'data_to_analyze': request.data}, function(resp) {
            resp = JSON.parse(resp);
            img_src = null;
            if (resp.sentiment >=0 && resp.sentiment < 5){
                img_src = "Img/emojis/negative.png";
            }
            else if(resp.sentiment>=5 && resp.sentiment <8) {
                img_src = "Img/emojis/neutral.png";
            }
            else {
                img_src = "Img/emojis/positive.png";
            }
            $('#sentiment').prepend('<img src = ' + img_src +' width="60" height="60">');
        });
        $.post('http://localhost:5000/language', {'data_to_analyze': request.data}, function(resp) {
            resp = JSON.parse(resp);
            $('#language').text(resp.language[0]);
        });
        $.post('http://localhost:5000/virality', {'data_to_analyze': request.data}, function(resp) {
            resp = JSON.parse(resp);
            $('#virality').prepend("<h2>Virality Score</h2>\n");
            $('#viralityval').prepend((resp.virality[0]*100).toString().substring(0,4) + "%");
        });
        $.post('http://localhost:5000/political', {'data_to_analyze': request.data}, function(resp) {
            resp = JSON.parse(resp);
            var pieData = [
            {
                value: resp.political[0].Libertarian,
                color: "#FDB45C",
                highlight: "#FFC870",
                label: "Libertarian"
            },
            {
                value: resp.political[0].Liberal,
                color: "#949FB1",
                highlight: "#A8B3C5",
                label: "Liberal"
            },
            {
                value: resp.political[0].Conservative,
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "Conservative"
            },
            {
                value: resp.political[0].Green,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Green"
            }];
            var ctx = document.getElementById("chart-area").getContext("2d");
            window.myPie = new Chart(ctx).Doughnut(pieData);
            $('#legend1').prepend('<li style="float : left; white-space: nowrap;"><span class="cons"></span> <div id = "key3">Conservative</div></li><li style="float : right; white-space: nowrap;"><div id = "key4">Green</div> <span class="grn"></span></li> ')
            $("#legend2").prepend('<li style="float : left; white-space: nowrap;"><span class="libt"></span> <div id = "key1">Libertarian</div></li><li style="float : right; white-space: nowrap;"><div id = "key2">Liberal</div> <span class="libr"></span></li>')
        });
        $.post('http://localhost:5000/text_tags', {'data_to_analyze': request.data}, function(resp) {
            resp = JSON.parse(resp);
            $('#category').prepend('<h2>Categories</h2>');
            $('#text_tag1').text(resp.text_tags[0][0].split(/[_]+/).join(" "));
            $('#text_tag2').text(resp.text_tags[1][0].split(/[_]+/).join(" "));
            $('#text_tag3').text(resp.text_tags[2][0].split(/[_]+/).join(" "));
        });
    }
});




