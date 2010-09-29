function Block(x, y, color, lineColor){
  this.x = x || 0;
  this.y = y || 0;
  this.color = color || '#ff242c';
  this.lineColor = lineColor || '#b12222';
}

Block.prototype.render = function(ctx){
  var cs = World.CELL_SIZE;
  var r0 = cs/10, r1 = r0*5, c = cs/2, cx = c + (this.x * cs), cy = c + (this.y * cs);

  rg = ctx.createRadialGradient(cx, cy, r0, cx, cy, cs);
  rg.addColorStop(0, this.color);
  rg.addColorStop(1, this.lineColor);
  
  ctx.fillStyle = rg; //this.color;
  ctx.strokeStyle = this.lineColor;
  ctx.fillRect(this.x * cs, this.y * cs, cs, cs);
  ctx.strokeRect(this.x * cs, this.y * cs, cs, cs);
}