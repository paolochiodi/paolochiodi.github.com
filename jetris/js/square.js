function Square(world){
  var c = Square.color, lc = Square.lineColor;
  this.world = world;
  
  initial_x = Math.floor(World.MAX_WIDTH / 2)
  
  this.blocks = [new Block(initial_x,0,c,lc), new Block(initial_x,1,c,lc), new Block(++initial_x,0,c,lc), new Block(initial_x,1,c,lc)];
}

Square.color = '#55d2fb';
Square.lineColor = '#00397d';

Square.prototype = new Shape();

Square.width = 2;
Square.height = 2;