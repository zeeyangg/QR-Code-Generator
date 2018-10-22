chrome.contextMenus.create({
  "title":"Share on Facebook",
  "contexts":["browser_action"],
  "onclick":function(info, tab) {
    chrome.tabs.create({url: 'https://www.facebook.com/sharer/sharer.php?u=https://chrome.google.com/webstore/detail/quick-qr-code-generator/afpbjjgbdimpioenaedcjgkaigggcdpp'});
  }
});

chrome.contextMenus.create({
  "title":"Share on Twitter",
  "contexts":["browser_action"],
  "onclick":function(info, tab) {
    chrome.tabs.create({url: 'https://twitter.com/home?status=https://chrome.google.com/webstore/detail/quick-qr-code-generator/afpbjjgbdimpioenaedcjgkaigggcdpp'});
  }
});

chrome.contextMenus.create({
  "title":"Share on Google+",
  "contexts":["browser_action"],
  "onclick":function(info, tab) {
    chrome.tabs.create({url: 'https://plus.google.com/share?url=https://chrome.google.com/webstore/detail/quick-qr-code-generator/afpbjjgbdimpioenaedcjgkaigggcdpp'});
  }
});


chrome.contextMenus.create({
  "title":"",
  "type":"separator",
  "contexts":["browser_action"],
  "onclick":function(info, tab) {
    chrome.tabs.create({url: 'https://plus.google.com/share?url=https://chrome.google.com/webstore/detail/quick-qr-code-generator/afpbjjgbdimpioenaedcjgkaigggcdpp'});
  }
});


chrome.contextMenus.create({
  "title":"Facebook Page",
  "contexts":["browser_action"],
  "onclick":function(info, tab) {
    chrome.tabs.create({url: 'https://www.facebook.com/quickqr'});
  }
});




chrome.contextMenus.create({
  "title":"Quick QR » “%s”",
  "contexts":["selection"],
  "onclick":function(info, tab) {
  	var target_content = '';
    if (info.selectionText) {
    	console.log('selectionText found:', info.selectionText);
    	target_content = info.selectionText;
    } else {
    	console.log('nothing but page:', info.pageUrl)
    	target_content = info.pageUrl;
    }
    chrome.tabs.create({url:"popup.html?c="+target_content});
  }
});



chrome.contextMenus.create({
  "title":"Quick QR » This Page",
  "contexts":["page"],
  "onclick":function(info, tab) {
  	var target_content = '';
    if (info.selectionText) {
    	console.log('selectionText found:', info.selectionText);
    	target_content = info.selectionText;
    } else {
    	console.log('nothing but page:', info.pageUrl)
    	target_content = info.pageUrl;
    }
    chrome.tabs.create({url:"popup.html?c="+target_content});
  }
});



chrome.contextMenus.create({
  "title":"Quick QR » This Link",
  "contexts":["link"],
  "onclick":function(info, tab) {
  	var target_content = '';
    if(info.linkUrl) {
    	console.log('link found:', info.linkUrl);
    	target_content = info.linkUrl;
    } else if (info.selectionText) {
    	console.log('selectionText found:', info.selectionText);
    	target_content = info.selectionText;
    } else {
    	console.log('nothing but page:', info.pageUrl)
    	target_content = info.pageUrl;
    }
    chrome.tabs.create({url:"popup.html?c="+target_content});
  }
});
