goog.provide('thurloat.voiceChat');
goog.provide('thurloat.voiceChat.loadMessages');
goog.provide('thurloat.voiceChat.postData');

goog.require('goog.Uri.QueryData');
goog.require('goog.dom');
goog.require('goog.net.XhrIo');
goog.require('goog.structs.Map');


/**
 * Create a new message and insert it into the first position.
 *
 * @param {string} sender The name of the message sender.
 * @param {string} message The message body.
 * @param {string} id The message's unique identifier.
 */
thurloat.voiceChat.makeMessage = function(sender, message, id) {
  var new_el = goog.dom.createElement('span');
  new_el.className = 'msg';
  new_el.innerHTML = sender + ': \"' + message + '\"';
  var child = goog.dom.getFirstElementChild('room');
  goog.dom.insertSiblingAfter(new_el, goog.dom.getElement('starting_message'));
  goog.dom.getElement('latest_msg').value = id;
};


/**
 * General response handler for the Message Response from the Server
 * sends each message off to get inserted into the DOM.
 *
 * @param {goog.net.XhrIo} xhr An in-flight request looking for a nice response.
 */
thurloat.voiceChat.messageResponseHandler = function(xhr) {
  if (xhr.isSuccess()) {
    msg = xhr.getResponseJson();
    for (m in msg) {
      thurloat.voiceChat.makeMessage(msg[m]['p'], msg[m]['m'], msg[m]['i']);
    }
  }
};


/**
 * function that checks the server for new messages, called at an interval
 * from the initial loadMessages() function
 */
thurloat.voiceChat.keepLoadingMessages = function() {
  var new_msgs_xhrio = new goog.net.XhrIo();
  goog.events.listen(new_msgs_xhrio, goog.net.EventType.COMPLETE, function(e) {
    thurloat.voiceChat.messageResponseHandler(new_msgs_xhrio);
  });
  var data = goog.Uri.QueryData.createFromMap(new goog.structs.Map({
    'latest': goog.dom.getElement('latest_msg').value
  }));
  new_msgs_xhrio.send('/load_msgs', 'POST', data.toString());
};


/**
 * Sets the voice input box's input back to empty.
 */
thurloat.voiceChat.resetVoiceText = function() {
  goog.dom.getElement('voice_input').value = '';
};


/**
 * Post new data to the server, and clear out the voice texts o the user can
 * start speaking again immediately.
 *
 * @param {string} name_value The name of the sender.
 * @param {string} voice_value The voice message to be submitted.
 */
thurloat.voiceChat.postData = function(name_value, voice_value) {
  var xhr = new goog.net.XhrIo();
  var data_map = new goog.structs.Map({'person': name_value,
    'message': voice_value});
  var data = goog.Uri.QueryData.createFromMap(data_map);
  goog.events.listen(xhr, goog.net.EventType.COMPLETE, function(e) {
    if (xhr.isSuccess()) {
      goog.dom.getElement('info').innerHTML = xhr.getResponseText();
      setTimeout(thurloat.voiceChat.resetVoiceText, 3000);
    }else {
    }
  });
  xhr.send('/msg_post', 'POST', data.toString());
};


/**
 * Module initial call to load up the first set of messages, and start up
 * the repeating server check for new messages.
 */
thurloat.voiceChat.loadMessages = function() {
  var xhr = new goog.net.XhrIo();
  goog.events.listen(xhr, goog.net.EventType.COMPLETE, function(e) {
    thurloat.voiceChat.messageResponseHandler(xhr);
  });
  xhr.send('/load_msgs', 'GET');
  setInterval(thurloat.voiceChat.keepLoadingMessages, 6000);
};

goog.exportSymbol('thurloat.voiceChat.loadMessages',
    thurloat.voiceChat.loadMessages);
goog.exportSymbol('thurloat.voiceChat.postData', thurloat.voiceChat.postData);
