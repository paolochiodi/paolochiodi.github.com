window.onload = function(){
  
  processor.init();
  
  var pl = document.getElementById('play');
  var ps = document.getElementById('pause');
  var vd = document.getElementById('video');

  pl.onclick = function(){
    pl.style.display = 'none';
    ps.style.display = '';
    processor.play();
    return false
  }
  
  ps.onclick = function(){
    pl.style.display = '';
    ps.style.display = 'none';
    processor.pause();
    return false
  }
  
  vd.addEventListener('ended', function() {
    processor.pause();
    pl.style.display = '';
    ps.style.display = 'none';
  }, true);
  
}