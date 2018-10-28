var QR_SIZE = 300;
var fore_bg;
var back_bg;
var img_size;
var is_transparnet_bg;
var currentdata;

var img_history;
var text_history
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
  $("#qrcode-checkhistory").click(hideandseekbuttons);
  $("#return-menu").click(hideandseekbuttons);
  $("#return-menu").click(checkQRhistory);
  $("#return-menu").click(hideandseek);
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
        $('#return-menu').click();
        $("#choice").click();
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
  qr_history.push({
    "img": img_history,
    "text": text_history
  });
  saveQRHistory();
  console.log(qr_history);
}
// Check history array
function checkQRhistory() {
  $("#history_table").find("select").remove();

  if (qr_history.length > 0) {
    var doc = document;

    var fragment = doc.createDocumentFragment();

    for (i = 0; i < qr_history.length; i++) {

      var option = doc.createElement("option");
      var data = qr_history[i].text;
      option.innerHTML = data;

      //does not trigger reflow
      fragment.appendChild(option);
    }

    var select = doc.createElement("select");
    select.setAttribute('id', 'choice');
    select.setAttribute('multiple', 'multiple');
    select.appendChild(fragment);

    doc.getElementById("history_table").appendChild(select);
  } else {
    var theDiv = document.getElementById("history_table");
    var content = document.createTextNode("Add data the history first");
    theDiv.appendChild(content);
  }
  $("#choice").click(optionChose);
}

function optionChose() {

  var choiceValues = $("#choice").val();
  console.log(choiceValues);
  $('#qrcode-href').val(choiceValues);
  renderQRHandler();
  hideandseek();
  hideandseekbuttons();

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
  var x = document.getElementById("main-menu");
  var y = document.getElementById("history-menu");
  if (x.style.display == 'none') {
    x.style.display = 'block';
    y.style.display = 'none';
  } else if (x.style.display != 'none') {
    x.style.display = 'none';
    y.style.display = 'block';
  }
}

function hideandseekbuttons() {
  var a = document.getElementById("qrcode-checkhistory");
  var b = document.getElementById("return-menu");
  if (a.style.display == 'none') {
    a.style.display = 'block';
    b.style.display = 'none';
  } else if (a.style.display != 'none') {
    a.style.display = 'none';
    b.style.display = 'block';
  }
}