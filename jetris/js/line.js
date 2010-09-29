function Line(world){
  var c = Line.color, lc = Line.lineColor;
  this.world = world;
  
  initial_x = Math.floor(World.MAX_WIDTH / 2)
  
  this.blocks = [new Block(initial_x-1,0,c,lc), new Block(initial_x,0,c,lc), new Block(++initial_x,0,c,lc), new Block(++initial_x,0,c,lc)];
}


Line.prototype = new Shape();

Line.color = '#eb605f';
Line.lineColor = '#df1613';

Line.width = 4;
Line.height = 1;