function World(ctx){
  this.ctx = ctx;
  this.currentShape = this.getRandomShape();
  this.blocks = [];
  this.events = [];
}

World.CELL_SIZE = 20;
World.MAX_HEIGHT = 20;
World.MAX_WIDTH = 15;
World.shapes = [Line, Square, AngleDown, AngleUp, S, Z];

World.prototype.getRandomShape = function(){
  return new World.shapes[Math.round(Math.random() + Math.random() / 2 * 33) % World.shapes.length](this);
}

World.prototype.orphanedBlocks = function(blocks){
  var bs = this.blocks;
  while(blocks.length){
    var b = blocks.pop(),
        y = World.MAX_HEIGHT - b.y;

    if(!bs[y]){
      bs[y] = [];
    }
    bs[y][b.x] = b;
  }
  this.checkLines();
}

World.prototype.render = function(){
  
  //clear canvas
  var cs = World.CELL_SIZE,
      ctx = this.ctx;
  ctx.clearRect(0,0,(World.MAX_WIDTH+1)*cs,(World.MAX_HEIGHT+1)*cs);
  
  //render orphaned blocks
  var b = this.blocks;
  for(var i=0,len=b.length;i<len;i++){
    var bi = b[i];
    if(bi){
      for(var j=0,lenj=bi.length;j<lenj;j++){
        if(bi[j]){
          bi[j].render(ctx);
        }
      }
    }
  }
  
  this.currentShape.render(ctx);
}

World.prototype.checkLines = function(){
  var bs = this.blocks,
      removed = false;
  for(var i=bs.length;--i>0;){
    var row = bs[i],
        row_len = World.MAX_WIDTH;
    if(row){
      for(var j=0,lenj = row.length;j<lenj;j++){
        if(row[j]){
          row_len--;
        }
      }
      if(!row_len){
        removed = true;
        bs.splice(i,1);
        bs[bs.length] = [];
      }
    }
  }
  
  if(removed){
    this.compactLines();
  }

  return;
}

World.prototype.compactLines = function(){
  var bs = this.blocks,
      max_h = World.MAX_HEIGHT;
      removed = false;
  for(var i=0,len = bs.length;i<len;i++){
    var row = bs[i];
    if(row){
      var row_len = row.length,
          new_y = max_h - i;
      
      for(var j=0,lenj = row.length;j<lenj;j++){
        if(row[j]){
          row[j].y = new_y;
        }
      }
    }
  }
}

World.prototype.is_busy = function(x, y){
  
  if(y >= World.MAX_HEIGHT || x < 0 || x >= World.MAX_WIDTH){
    return true;
  }
  
  var row = this.blocks[World.MAX_HEIGHT - y];
      
  if(row){
    return !!row[x];
  }
  
  return false;
}

World.prototype.pushEvent = function(e){
  switch(e.keyCode){
    case 37:
      this.events[this.events.length] = 'left';
      break;
    case 38:
      this.events[this.events.length] = 'up';
      break;
    case 39:
      this.events[this.events.length] = 'right';
      break;
    case 40:
      this.events[this.events.length] = 'down';
      break;
  }
}

World.prototype.getEvent = function(){
  return this.events.pop();
}

World.prototype.tick = function(){
  
  var s = this.currentShape;
  s.tick();

  if(!s.alive){
    this.currentShape = this.getRandomShape();
  }
    
  this.render();
}