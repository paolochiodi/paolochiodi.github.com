var doc = document,
    ww = window;

var processor = {
  freq:50,
  stepx:6,
  stepy:10,
  charset:['.','-',':','+','o','x','!','?','C','O','X','$','A','%','&','#','@'], //.'+o!?ICOXRA$%#@
  init:function(){
    this.video = doc.getElementById('video');
    this.partialVideo = doc.getElementById('partialVideo');
    this.partialVideoCtx = this.partialVideo.getContext('2d');
    this.asciiPlayer = doc.getElementById('asciiPlayer');
    this.width = this.video.width; //this.video.videoWidth;
    this.height = this.video.height; //this.video.videoHeight;
    this.ascii = doc.getElementById('ascii');
    this.br_fact = this.charset.length / 255;
    this.n = 0;
    this.q = this.stepx*this.stepy;
    this.time = 0;
    this.fps = document.getElementById('fps').firstChild;
    
    var m = this.matrix = [],
        el = this.ascii,
        stepx = this.stepx,
        stepy = this.stepy;
        
    el.style.lineHeight = el.style.fontSize = stepy + 'px';
    
    for(var i = 0, lh = this.height; i < lh; i+=stepy){
      var d = doc.createElement('div');
      el.appendChild(d);

      m[i] = []
      for(var j = 0, lw = this.width; j < lw; j+=stepx){
        var s = doc.createElement('span');
        s.appendChild(doc.createTextNode('*'));
        d.appendChild(s);
        
        m[i][j] = s;        
      }
    }
    
    var self = this;
    
    this.t = function(){
      // var before = new Date();
      self.update();
      // var after = new Date();
      // self.time += after.getTime() - before.getTime();
      // self.n++;
      // if(self.n < 500){
      //   self.fps.data = Math.round((self.time / self.n)*1000)/1000;
      // }
    }
  },
  play:function(){
    this.playing = true;
    this.video.play();
    this.update();
  },
  pause:function(){
    this.playing = false;
    this.video.pause();
  },
  update:function(){
    var cx = this.partialVideoCtx,
        lw = this.width,
        lh = this.height;

    cx.drawImage(this.video, 0, 0, lw, lh);
    
    var frame = cx.getImageData(0, 0, lw, lh).data;
        stepx = this.stepx,
        stepy = this.stepy,
        m = this.matrix,
        q = this.q
        cs = this.charset,
        br_fact = this.br_fact
        rescue = cs[cs.length-1];

    for(var h = 0; h < lh; h+=stepy){
      for(var w = 0; w < lw; w+=stepx){
        var r = 0,
            g = 0,
            b = 0;
            
        for (var j = 0; j < stepy; j++) {
          var hjlw = ((h + j)*lw);
          for (var i = 0; i < stepx; i++) {
            var pos = (hjlw + w + i)*4;
            r += frame[pos];
            g += frame[++pos];
            b += frame[++pos];
          }
        }

        r = ~~(r/q);
        g = ~~(g/q);
        b = ~~(b/q);

        var br = ~~((0.299*r + 0.587*g + 0.114*b)*br_fact);

        var e = m[h][w];
        e.style.color = 'rgb(' + r + ',' + g + ',' + b + ')';
        e.firstChild.data = (cs[br] || rescue);
      }
    }

    if(this.playing){
      ww.setTimeout(this.t, this.freq);
    }
  } 

}