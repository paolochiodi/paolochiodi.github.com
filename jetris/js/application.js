/*
  TETRIS

* render: render background, blocks
* objects involved: single block, shapes

* capire se ho riempito la riga
* se si, eliminarla

* i blocchi sencendono ogni n tick

*/
var world;

window.onload = function(){
  var viewport = document.getElementById('viewport'),
      ctx = viewport.getContext('2d');
  
  document.onkeydown = key_down;

  world = new World(ctx);

  tick();
}

function key_down(e){
  world.pushEvent(e);
}


function tick(){
  world.tick();  
  window.setTimeout(tick, 1000 / 50);
}
