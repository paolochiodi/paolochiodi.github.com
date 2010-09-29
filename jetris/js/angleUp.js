function AngleUp(world){
  var c = AngleUp.color, lc = AngleUp.lineColor;
  this.world = world;
  
  initial_x = Math.floor(World.MAX_WIDTH / 2)
  
  this.blocks = [new Block(initial_x-1,1,c,lc), new Block(initial_x,1,c,lc), new Block(++initial_x,1,c,lc), new Block(initial_x,0,c,lc)];
}

AngleUp.color = '#c8e8cf';
AngleUp.lineColor = '#009937';

AngleUp.prototype = new Shape();

AngleUp.width = 3;
AngleUp.height = 2;