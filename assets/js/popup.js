var QR_SIZE = 300;
var fore_bg;
var back_bg;
var img_size;
var is_transparnet_bg;
var currentdata;

var img_history;
var text_history;
var qr_history = [];



$(function () {
  var config_obj = JSON.parse(localStorage.getItem('config')) || {};
  fore_bg = config_obj.fore_bg || '#000000';
  back_bg = config_obj.back_bg || '#ffffff';
  img_size = config_obj.size;
  is_transparnet_bg = config_obj.is_transparnet_bg;

  setTimeout(function () {
    $('#qrcode-href').css('visibility', 'visible').focus().select();
  }, 99);


  chrome.tabs.query({ active: true, currentWindow: true }, updateContentByTabs);
  $("#qrcode-regenerate").click(renderQRHandler);
  $("#qrcode-history").click(addQRHistory);
  $("#qrcode-checkhistory").click(hideandseek);
  $("#qrcode-checkhistory").click(checkQRhistory);
  $("#qrcode-clear-history").click(clearHistory);
  $('#version').text(chrome.app.getDetails().version);
  $('#credit_get').click(function () {
    trackContent('credit:get_this');
  })
  $('#credit_support').click(function () {
    trackContent('credit:support');
  })
  // Not firing when paste by mouse.
  $('#qrcode-href').on('keydown', function () {
    renderQRHandler();
  })
  $('#qrcode-href').on('keyup', function (e) {
    renderQRHandler();
    //---      if(e.keyCode == 13){
    //---        var currentText = $('#qrcode-href').val();
    //---        $('#qrcode-href').replaceWith('<textarea id="qrcode-href"></textarea>');
    //---        $('#qrcode-href').val(currentText);
    //---        //$('#qrcode-href').remove();
    //---      }
  })

  if (window.location.search.includes('?c=')) {
    $('body').css('margin', '0 auto');
    $('body').css('height', 'auto');
    $('#settings').hide();
    $('#ctxt-only').show();
    $('.popup-footer-right').appendTo('body').addClass('ctxt-only-style');
    var c = window.location.search.split('?c=')[1];
    c = decodeURIComponent(c);
    var check = setInterval(function () {
      if ($('#qrcode-href')) {
        $('#qrcode-href').val(c);
        $('#qrcode-regenerate').click();
        $('#qrcode-history').click();
        $('#qrcode-checkhistory').click();
        $('#qrcode-clear-history').click();
        clearInterval(check);
      }
    }, 99);
  }
});
// Button press handler
function renderQRHandler() {
  var href = $("#qrcode-href").val();
  var $qrcode_img = $('#qrcode-img');
  $qrcode_img.html('');
  renderQR($qrcode_img, QR_SIZE, href);
  updateImgHref();
  trackContent('click:' + href);
}


document.addEventListener('DOMContentLoaded', function () {
  getQRHistory();
});

// QR code history function
function addQRHistory() {
  //var currentdate = new Date().toString();
  var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  var currentdate = new Date().toLocaleDateString("en", options);
  if (!qr_history.some(e => e.text == text_history)) {
    qr_history.push({
      "img": img_history,
      "text": text_history,
      "date": currentdate
    });
    saveQRHistory();
    console.log(qr_history);
  } else {
    //alert("Already exist");
  }

  var x = document.getElementById("qrcode-history");
  x.style.background = "green";
  x.style.color = "white";
  x.textContent = "Saved";

  saveQRHistory();
  //console.log(qr_history);
}

// Check history array
function checkQRhistory() {

  $("#history_table").find("table").remove();

  if (qr_history.length > 0) {
    var doc = document;

    var fragment = doc.createDocumentFragment();

    for (i = 0; i < qr_history.length; i++) {

      var tr = doc.createElement("tr");
      tr.setAttribute("class", "classsetter");      
      var td = doc.createElement("td");
      td.rowSpan = 2;
      var data = "<img src=" + qr_history[i].img + " width='70' height='70'>";
      td.innerHTML = data;


      tr.appendChild(td);

      td = doc.createElement("td");
      data = qr_history[i].text;
      td.innerHTML = data;

      tr.appendChild(td);

      //does not trigger reflow
      fragment.appendChild(tr);

      tr = doc.createElement("tr");
      td = doc.createElement("td");
      data = qr_history[i].date
      td.innerHTML = data;

      tr.appendChild(td);
      fragment.appendChild(tr);
    }

    var table = doc.createElement("table");

    table.appendChild(fragment);

    doc.getElementById("history_table").appendChild(table);
  } else {
    var theDiv = document.getElementById("history_table");
    var tr2 = document.createElement("tr");
    var td2 = document.createElement("td");
    var data2 = "Add data to history first";
    td2.innerHTML = data2;

    tr2.appendChild(td2);
    var table2 = document.createElement("table");
    table2.appendChild(tr2);
    document.getElementById("history_table").appendChild(table2);

    var x = document.getElementById("qrcode-history");
    x.style.background = "#e7e7e7";
    x.style.color = "black";
    x.textContent = "Save to History";
  }
  $('#history_table').find('tr').on('click', function () {
    //console.log($(this).text());
    hideandseek();
    $('#qrcode-href').val($(this).text());
    renderQRHandler();
  });
}

// Save QR history
function saveQRHistory(callback) {
  chrome.storage.local.set({ qr_history }, function () {
    if (typeof callback === 'function') {
      //If there was no callback provided, don't try to call it.
      callback();
    }
  });
}

// Restore QR history
function getQRHistory() {
  chrome.storage.local.get({ qr_history: [] }, function (data) {
    qr_history = data.qr_history;
    console.log(qr_history);
  });
}

// Clear history
function clearHistory() {
  qr_history = [];
  saveQRHistory();
  $("#history_table").find("table").remove();

  var theDiv = document.getElementById("history_table");
  var tr2 = document.createElement("tr");
  var td2 = document.createElement("td");
  var data2 = "Add data to history first";
  td2.innerHTML = data2;

  tr2.appendChild(td2);
  var table2 = document.createElement("table");
  table2.appendChild(tr2);
  document.getElementById("history_table").appendChild(table2);
}

function updateContentByTabs(tabs) {
  var href = tabs[0].url;
  var title = tabs[0].title;
  var $qrcode_img = $('#qrcode-img');
  setTimeout(function () {
    $qrcode_img.html('');
    renderQR($qrcode_img, QR_SIZE, href);
    updateImgHref();
  }, 70);
  $('#qrcode-href').val(href);
  trackContent('init:' + href);
}
function renderQR($el, the_size, the_text) {
  text_history = the_text;
  if (!qr_history.some(e => e.text == text_history)) {
    var x = document.getElementById("qrcode-history");
    x.style.background = "#e7e7e7";
    x.style.color = "black";
    x.textContent = "Save to History";
  } else {
    var x = document.getElementById("qrcode-history");
    x.style.background = "green";
    x.style.color = "white";
    x.textContent = "Saved";
  }
  var quiet = '0';
  if (back_bg != '#ffffff') {
    quiet = '1';
  }
  //console.log(is_transparnet_bg);
  if (is_transparnet_bg) {
    back_bg = null;
  }
  $el.qrcode(qrObjectBuilder(the_size, fore_bg, the_text, back_bg, quiet));
  $('#qrcode-img-buffer').empty().qrcode(qrObjectBuilder(the_size, fore_bg, the_text, back_bg, 0, true));
}
function qrObjectBuilder(s, f, t, b, q, c) {
  var r = 'image';
  if (c) {
    r = 'canvas';
  }
  //ecLevel: 'L',
  var o = {
    'render': r,
    size: s,
    fill: f,
    text: t,
    background: b,
    'quiet': q
  }
  //'L', 'M', 'Q' or 'H'
  o.ecLevel = 'L';
  return o;
}
function updateImgHref() {
  var link = $("#export")[0];
  link.download = 'exported_qrcode_image.png';/// set a filename or a default
  link.href = $('#qrcode-img-buffer > canvas')[0].toDataURL();

  img_history = link.href;
}

// Tracker
function trackContent(c) {
  chrome.extension.sendMessage({ pop: c }, function (response) {
  });
}

function hideandseek() {
  var w = document.getElementById("qrcode-clear-history");
  var x = document.getElementById("main-menu");
  var y = document.getElementById("history-menu");
  var z = document.getElementById("qrcode-checkhistory");
  if (x.style.display == 'none') {
    w.style.display = 'none';
    x.style.display = 'block';
    y.style.display = 'none';
    z.textContent = "Check History";
  } else if (x.style.display != 'none') {
    w.style.display = 'block';
    x.style.display = 'none';
    y.style.display = 'block';
    z.textContent = "Back";
  }
}