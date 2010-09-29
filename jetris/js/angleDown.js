function AngleDown(world){
  var c = AngleDown.color, lc = AngleDown.lineColor;
  this.world = world;

  initial_x = Math.floor(World.MAX_WIDTH / 2)
  
  this.blocks = [new Block(initial_x-1,0,c,lc), new Block(initial_x,0,c,lc), new Block(++initial_x,0,c,lc), new Block(initial_x,1,c,lc)];
}

AngleDown.prototype = new Shape();

AngleDown.color = '#c6a7c2';
AngleDown.lineColor = '#a34083';

AngleDown.width = 3;
AngleDown.height = 2;