function Shape(world){
  this.world
  this.max_ticks = this.ticks = 20; //scende ogni 20 secondi
  this.x = this.y = 0;
  this.alive = true;
}

Shape.prototype.tick = function(){
  /* operazione che puo fare in un tick:
    - scendere
    - girare
    - sciogliersi in blocchi
  */
  
  if(--this.ticks > 0){
    // controlla input
    switch(this.world.getEvent()){
      case "down":
        this.goDown();
        break;
      case "left":
        this.goLeft();
        break;
      case "right":
        this.goRight();
        break;
      case "up":
        this.rotate();
        break;
      
    }
  }
  else{
    //scende di uno o si stabilizza
    this.ticks = this.max_ticks;
    this.stepDown();
  }
}

Shape.prototype.rotate = function(){
  
  //find max_y, max_x, min_x, min_y
  var bs = this.blocks,
      b = bs[0],
      max_y = b.y,
      max_x = b.x,
      min_y = max_y,
      min_x = max_x;
  
  for(var i=1, len = bs.length; i < len; i++){
    b = bs[i];
    if(b.y < min_y){
      min_y = b.y;
    }
    if(b.x < min_x){
      min_x = b.x;
    }
    if(b.y > max_y){
      max_y = b.y;
    }
    if(b.x > max_x){
      max_x = b.x;
    }
  }
  
  max_y -= min_y;
  max_x -= min_x;
  
  var center_y = max_y/2,
      center_x = max_x/2;
      
  var new_blocks = [];
  //calcola nuovi x e y
  
  min_x += center_x;
  min_y += center_y;

  for(var i=0, len = bs.length; i < len; i++){
    b = bs[i];
    
    var x = b.x - min_x,  
        y = b.y - min_y,
        swap = y;

    y = x;
    x = -swap;
    
    new_blocks[new_blocks.length]  = new Block(Math.ceil(min_x + x), Math.ceil(min_y + y), b.color, b.lineColor);
  }
  
  var w = this.world;
  
  for(var i=0, len = new_blocks.length; i < len; i++){
    b = new_blocks[i];
    if(w.is_busy(b.x, b.y)){
      return;
    }
  }
  
  this.blocks = new_blocks;
  
  return;
}

Shape.prototype.goDown = function(){
  this.ticks = 1
  this.max_ticks = 1;
  return;
}

Shape.prototype.goLeft = function(){
  var b = this.blocks;
  if(!this.collides(-1,0)){
    for(var i=0, len=b.length; i<len;i++){
      b[i].x--;
    }
  }
}

Shape.prototype.goRight = function(){
  var b = this.blocks;
  if(!this.collides(+1,0)){
    for(var i=0, len=b.length; i<len;i++){
      b[i].x++;
    }
  }
}

Shape.prototype.stepDown = function(){
  if(this.collides(0,+1)){
    this.world.orphanedBlocks(this.blocks);
    this.alive = false;
  }
  else{
    var b = this.blocks;
    for(var i=0, len=b.length; i<len;i++){
      b[i].y++;
    }    
  }
}

Shape.prototype.render = function(ctx){
  var b = this.blocks;
  for(var i=0, len=b.length; i<len;i++){
    b[i].render(ctx);
  }
  return;
}

Shape.prototype.collides = function(op_x, op_y){
  var b = this.blocks,
      w = this.world,
      h = World.MAX_HEIGHT;
  for(var i=0, len=b.length; i<len;i++){
    if(w.is_busy(b[i].x + op_x, b[i].y+op_y)){
      return true
    }
  }
  
  return false;
}

