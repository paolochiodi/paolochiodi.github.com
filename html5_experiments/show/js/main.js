
window.onload = function (){

  var w = window,
      doc = document,
      v = doc.getElementById('video');
      
  processor.doLoad();
  
  if(v.readyState === v.HAVE_FUTURE_DATA || v.readyState === v.HAVE_ENOUGH_DATA){
    processor.videoIsReady();
  }
  else{
    v.oncanplay = function(){ alert('qui'); processor.videoIsReady(); };
  }
  
  doc.getElementById('playButton').addEventListener('click', function(){ processor.playVideo(); }, true);
  doc.getElementById('stopButton').addEventListener('click', function(){ processor.stopVideo(); }, true);
  doc.getElementById('tiny_video').addEventListener('click', updatePattern, true);
  doc.getElementById('logo').addEventListener('click', updatePattern, true);
  doc.getElementById('logo_tr').addEventListener('click', updatePattern, true);
  doc.getElementById('pong').addEventListener('click', updatePattern, true);
  doc.getElementById('yourtext').addEventListener('click', function() {
    processor.updatePattern(this, this.getAttribute('bg') === '1'); 
    doc.getElementById('message').focus();
    processor.updateText();
  }, true);
  doc.getElementById('yourdrawing').addEventListener('click', updatePattern, true);
  doc.getElementById('clear').addEventListener('click', function(){  processor.clearPainter(); }, true);
  
  doc.getElementById('bg_red').addEventListener('click', updateBackground, true);
  doc.getElementById('bg_blue').addEventListener('click', updateBackground, true);
  doc.getElementById('bg_white').addEventListener('click', updateBackground, true);
  doc.getElementById('bg_image').addEventListener('click', updateBackground, true);
  
  
  function updatePattern(){
    processor.updatePattern(this, this.getAttribute('bg') === '1');
  }
  
  function updateBackground(){ processor.updateBackground(this); }

};