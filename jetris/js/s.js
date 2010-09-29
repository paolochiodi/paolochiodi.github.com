function S(world){
  var c = S.color, lc = S.lineColor;
  this.world = world;
  
  initial_x = Math.floor(World.MAX_WIDTH / 2)
  
  this.blocks = [new Block(initial_x,0,c,lc), new Block(initial_x+1,0,c,lc), new Block(initial_x-1,1,c,lc), new Block(initial_x,1,c,lc)];
}

S.prototype = new Shape();

S.color = '#f5a93f';
S.lineColor = '#cb4319';

S.width = 2;
S.height = 2;