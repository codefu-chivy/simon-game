$(function() {
  var strict = false;
  var onOff = false;
  var changeBackground = false;
  var count = 0;
  var sequenceArr = [];
  var playerSeqArr = [];
  var $but1 = $("#top-left");
  var $but2 = $("#top-right");
  var $but3 = $("#lower-left");
  var $but4 = $("#lower-right");
  var buttons = [{name: $but1, oriColor: "green", clickColor: "lawngreen", num: "1"}, {name: $but2, oriColor: "red", clickColor: "darkred", num: "2"}, {name: $but3, oriColor: "yellow", clickColor: "goldenrod", num: "3"}, {name: $but4, oriColor: "blue", clickColor: "cyan", num: "4"}];
  var set;
  var random;
  var i = 0;
  
  //Toggles on and off on click
  function start() {
    i = 0;
    clearInterval(set);
    onOff = !onOff;
    onOff ? $(this).css("background-color", "Chartreuse") : $(this).css("background-color", "");
    beginSequence();
  }
  
  //Push random button object into sequence array; return if off
  function beginSequence() {
    if (onOff) {
      $("#count").html(count);
      random = Math.floor(Math.random() * 4);
      sequenceArr.push(buttons[random]);
    }  
    else {
      count = 0;
      $("#count").html("");
      sequenceArr = [];
      playerSeqArr = [];
      return;
    }
    set = setInterval(playSequence, 1000);
  }
  
  //Triggers audio and color animation for each element in sequence
  function playSequence() {
    sequenceArr[i].name.css("background-color", sequenceArr[i].clickColor);
    sequenceArr[i].name.animate({backgroundColor: sequenceArr[i].oriColor}, 700);
    sequenceArr[i].name.append("<audio src='https://s3.amazonaws.com/freecodecamp/simonSound" + sequenceArr[i].num + ".mp3' autoplay></audio>");
    i++;
    if (i >= sequenceArr.length) {
      clearInterval(set);
      $("#button").empty();
    }
  }
  
  //Check if user input matches sequence array; return if sequence is still running  
  function check() {
    var counter = 0;
    if (i < sequenceArr.length) {
      return;
    }
    playerSeqArr.push($(this));
    for (var j = 0; j < playerSeqArr.length; j++) {
      if (playerSeqArr[j].attr("id") !== sequenceArr[j].name.attr("id")) {
        if (!strict) {
          $("<h2 class='message'>Incorrect Sequence! Observe again.</h2>").prependTo("#background").fadeOut(2500);
          playerSeqArr = [];
          i = 0;
          set = setInterval(playSequence, 1000);
          break;
        }
        else {
          i = 0;
          count = 0;
          playerSeqArr = [];
          sequenceArr = [];
          $("<h2 class='message'>You lose!! Resetting!</h2>").prependTo("#background").fadeOut(2500);
          $("#count").html("0");
          beginSequence();
          return;
        }
      }
      else {
        counter++;
      }
    }
    if (counter === sequenceArr.length) {
      if (counter === 20) {
        $("body").append("<h1>YOU WON! You get to start all over again</h1>").fadeOut(3500);
        sequenceArr = [];
        count = 0;
      }
      else {
        count++;
      }
      $("#count").html(count);
      i = 0;
      playerSeqArr = [];
      beginSequence();
    }
  }
  
  $("#begin").click(start);
  $(".button").on({mousedown: function() {
    if (onOff) {
      for (var k = 0; k < buttons.length; k++) {
        if ($(this).attr("id") === buttons[k].name.attr("id")) {
          $(this).css("background-color", buttons[k].clickColor);
          $(this).animate({backgroundColor: buttons[k].oriColor}, 700);
          $(this).append("<audio src='https://s3.amazonaws.com/freecodecamp/simonSound" + buttons[k].num + ".mp3' autoplay></audio>");
        }
      }
    } 
  }, click: check})
  $("#strict-setting").click(function() {
    strict = !strict;
    if (strict) {
      $(this).css("background-color", "yellow");
    }  
    else {
      $(this).css("background-color", "");
    }
  });
  $("#background-change").click(function() {
    changeBackground = !changeBackground;
    changeBackground ? $("#background-images").slideDown() : $("#background-images").slideUp();
  });
  $("img").on({click: function() {var url = $(this).attr("src");
    $("body").css("background-image", "url" + "(" + url + ")")}, mouseover: function() {
      $(this).animate({opacity: "0.8"})
    }, mouseleave: function() {
      $(this).animate({opacity: "1.0"});
    }})
});