goog.provide('thurloat.voiceChat');
goog.provide('thurloat.voiceChat.loadMessages');
goog.provide('thurloat.voiceChat.postData');

goog.require('goog.dom');
goog.require('goog.net.XhrIo');
goog.require('goog.structs.Map');
goog.require('goog.Uri.QueryData');

thurloat.voiceChat.makeMessage = function(sender, message, id){
    var new_el = goog.dom.createElement('span');
    new_el.className = "msg";
    new_el.innerHTML = sender + ": \"" + message + "\"";
    var child = goog.dom.getFirstElementChild('room')
    goog.dom.insertSiblingAfter(new_el, goog.dom.getElement('starting_message'));
    goog.dom.getElement('latest_msg').value = id
};

thurloat.voiceChat.messageResponseHandler = function(xhr){
    if(xhr.isSuccess()){
         msg = xhr.getResponseJson();
         for(m in msg){
             thurloat.voiceChat.makeMessage(msg[m]['p'], msg[m]['m'], msg[m]['i']);
         }
     }
}

thurloat.voiceChat.keepLoadingMessages = function(){
      var new_msgs_xhrio = new goog.net.XhrIo();
      goog.events.listen(new_msgs_xhrio, goog.net.EventType.COMPLETE, function(e){
              thurloat.voiceChat.messageResponseHandler(new_msgs_xhrio)
        });
      var data = goog.Uri.QueryData.createFromMap(new goog.structs.Map({
          'latest': goog.dom.getElement('latest_msg').value
      }));
      new_msgs_xhrio.send('/load_msgs', 'POST', data.toString());
}
thurloat.voiceChat.resetVoiceText = function(){
    goog.dom.getElement('voice_input').value = '';
}
thurloat.voiceChat.postData = function(name_input, voice_input){
    var xhr = new goog.net.XhrIo();
    var data_map = new goog.structs.Map({'person': name_input, 'message': voice_input});
    var data = goog.Uri.QueryData.createFromMap(data_map);
    goog.events.listen(xhr, goog.net.EventType.COMPLETE, function(e){
        if (xhr.isSuccess()){
            goog.dom.getElement('info').innerHTML = xhr.getResponseText();
            setTimeout(thurloat.voiceChat.resetVoiceText, 3000);
          }else{
        }
    });
    xhr.send('/msg_post', 'POST', data.toString());
}

thurloat.voiceChat.loadMessages = function(){
  var xhr = new goog.net.XhrIo();
  goog.events.listen(xhr, goog.net.EventType.COMPLETE, function(e){
     thurloat.voiceChat.messageResponseHandler(xhr);
  });
  xhr.send('/load_msgs', 'GET');
  setInterval(thurloat.voiceChat.keepLoadingMessages, 6000);
}

goog.exportSymbol('thurloat.voiceChat.loadMessages', thurloat.voiceChat.loadMessages);
goog.exportSymbol('thurloat.voiceChat.postData', thurloat.voiceChat.postData);