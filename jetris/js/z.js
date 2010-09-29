function Z(world){
  var c = Z.color, lc = Z.lineColor;
  this.world = world;
  
  initial_x = Math.floor(World.MAX_WIDTH / 2)
  
  this.blocks = [new Block(initial_x-1,0,c,lc), new Block(initial_x,0,c,lc), new Block(initial_x,1,c,lc), new Block(++initial_x,1,c,lc)];
}

Z.prototype = new Shape();

Z.color = '#faedbd';
Z.lineColor = '#f1cd4a';

Z.width = 2;
Z.height = 2;