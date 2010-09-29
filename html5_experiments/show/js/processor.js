// Please, hack me!
// I'm doing that

const PI4 = 0.785398;

var doc = document;

//Main object
var processor = {
  distance: 30,
  isFirefox35: function() {
    var ua = navigator.userAgent;
    // Gecko ?
    if (ua.indexOf("Gecko") == -1)
      return false;

    // Geck >= 1.9.1 ?
    return !(ua.indexOf("rv:1.9.1") == -1 &&
             ua.indexOf("rv:1.9.2") == -1);
  },
  // Init
  doLoad: function() {
    // Some init
    this.displayBackground = true;
    this.video = doc.getElementById("video");
    this.mirrorVideo = doc.getElementById("mirrorVideo");
    this.mirrorVideoCtx = this.mirrorVideo.getContext("2d");
    this.partialVideo = doc.getElementById("partialVideo");
    this.partialVideoCtx = this.mirrorVideo.getContext("2d");

    var self = this;

    // If the videos end, play again
    this.video.addEventListener("ended", function() {
      try { clearTimeout(self.timeout); } catch(e) {}
      self.video.play(); 
      // Work around: https://bugzilla.mozilla.org/show_bug.cgi?id=488287
      self.videoIsPlaying();
    }, true);
    
    var tiny_video = doc.getElementById("tiny_video");
    tiny_video.addEventListener("ended", function() {
      tiny_video.play(); 
    }, true);

    // Update the text while typing for the "your text" pattern
    doc.getElementById("message").addEventListener("keyup", function() {
      self.updateText();
    }, true);

    // Init the "your drawing" pattern
    this.initPainter();

    // Init the pong pattern
    var pongCtx = doc.getElementById("pong").getContext("2d");
    this.pong = new Pong(pongCtx);
    setInterval(function () {self.pong.update()}, 50);

    // ... some stuffs
    this.oldShape1 = null;
    this.oldShape2 = null;

    // Set the first pattern
    this.updatePattern(doc.getElementById("logo"), true);
    
    // Set the first Background
    this.updateBackground(doc.getElementById('bg_white'));

    // Set the events listeners for the main video (update button)
    this.video.addEventListener("pause", function() { self.updateButtons(false); }, false);
    this.pageLoaded = true;
    this.startPlayer();
  },
  videoIsPlaying: function() {
      this.updateButtons(true);
      this.timerCallback();
  },
  videoIsReady: function() {
    this.videoLoaded = true;
    this.startPlayer();
  },
  startPlayer: function() {
    if (!this.videoLoaded || !this.pageLoaded) return;
    doc.getElementById("player").style.display = "block";
    this.width = this.video.width; //this.video.videoWidth;
    this.height = this.video.height; //this.video.videoHeight;
    this.mirrorVideo.width = this.width;
    this.mirrorVideo.height =  this.height;
    this.mirrorVideoCtx.fillStyle = "white";
    this.mirrorVideoCtx.strokeStyle = "black";
  },

  // Handle the click on background
  updateBackground: function(el){
    var old = doc.querySelector("div[bg_chosen='true']");
    if (old) {
      old.removeAttribute("bg_chosen");
    }
    el.setAttribute("bg_chosen", "true");
    this.mirrorVideo.style.background = el.style.background;
  },
  // Handle the click on patterns
  updatePattern: function(elt, bg) {
    this.pattern = null;
    var old = doc.querySelector("*[pattern='true']");
    if (old) {
      old.removeAttribute("pattern");
    }
    elt.setAttribute("pattern", "true");
    this.pattern = elt;
    this.displayBackground = bg;
  },
  // Videos control
  playVideo: function() {
    this.video.play();
    this.videoIsPlaying();
  },
  stopVideo: function() {
    this.video.pause();
    clearTimeout(this.timeout);
  },
  // Main loop
  timerCallback: function() {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    var self = this;
    this.timeout = setTimeout(function () {
        self.timerCallback();
      }, 50);
  },

  // Update the SVG button
  updateButtons: function(play) {
    doc.getElementById("playButton").setAttribute("play", play);
    doc.getElementById("stopButton").setAttribute("play", play);
  },
  // Handling some patterns (text, drawing)
  updateText: function() {
    var txt = doc.getElementById("message").value;
    var ctx = doc.getElementById("yourtext").getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.font = "50px bold";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.clearRect(0, 0, 150, 150);
    ctx.save();
    ctx.translate(75, 75);
    ctx.rotate(PI4);
    ctx.translate(-75, -75);
    ctx.fillText(txt, 75, 75, 150);
    ctx.restore();
  },
  clearPainter: function() {
    var elt = doc.getElementById("yourdrawing");
    var ctx = elt.getContext("2d");
    ctx.clearRect(0, 0, 150, 150);
    this.oldCoord = {};
  },
  initPainter: function() {
    var drawing = false;
    var elt = doc.getElementById("yourdrawing");
    var ctx = elt.getContext("2d");
    this.oldCoord = {};
    ctx.fillStyle = ctx.createPattern(doc.getElementById("logo"), "repeat");

    var self = this;
    elt.addEventListener("mousedown", function() {
      drawing = true;
    }, true);
    elt.addEventListener("mouseup", function() {
      drawing = false;
      elt.removeAttribute("pattern");
    }, true);
    elt.addEventListener("mousemove", function(e) {
      if (!drawing) return;
      
      var offsetLeft = 0;
      var offsetTop = 0;
      var fat = elt;
      
      while(fat.offsetParent){
        offsetLeft += fat.offsetLeft
        offsetTop += fat.offsetTop
        fat = fat.offsetParent
      }
      
      var x = e.clientX - offsetLeft + window.pageXOffset;
      var y = e.clientY - offsetTop + window.pageYOffset;

      var r = 20;
      if (self.oldCoord.x) {
        ctx.fillStyle = "rgba(250, 0, 0, 1)";
        ctx.fillCircle(self.oldCoord.x - (r+2)/2, self.oldCoord.y - (r+2)/2, r + 2);
      }
      self.oldCoord.x = x;
      self.oldCoord.y = y;
      ctx.drawImage(doc.getElementById("logo"), x - r, y - r, r, r);
    }, true);
  },

  // Compute Video movements
  isBackgroundPixel: function(r, g, b){
    
    if(r >= 210 && g >= 210 & b >= 210)
      return true;
    
    return false;
  },
  isTrackingPixel: function(r, g, b){
    // if(r < 10 && g < 10 && b > 30)
    //   return true;
    //   
    // if(r < 50 && g < 50 && b > 100)
    //   return true;
      
    if(r > 230 && b > 150 && g > 100 && g < 130)
      return true;
      
    if(r > 240 && b > 200 && g > 130 && g < 160)
      return true;
      
    return false;
  },
  dist: function(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  },
  computeFrame: function() {
    this.partialVideoCtx.clearRect(0, 0, this.width, this.height);
    try {
      this.partialVideoCtx.drawImage(this.video, 0, 0, this.width, this.height);
    } catch(e) {
      return;
    }
    var frame = this.partialVideoCtx.getImageData(0, 0, this.width, this.height);

    var cx = null;
    var cy = null;

    var x, y;

    var weight = 0;

    var shape1 = null;
    var shape2 = null;
    var currentPoint = null;

    var r, g, b, x, y;

    var D = this.distance;

    var l = frame.data.length / 4;

    // We dont' need to compute each pixels
    var step = 1;
    for (var i = 0; i < l; i += step) {
      r = frame.data[i * 4 + 0];
      g = frame.data[i * 4 + 1];
      b = frame.data[i * 4 + 2];

      x = i % this.width;
      y = Math.round(i / this.width);

      if(this.isBackgroundPixel(r, g, b)){
        frame.data[i * 4 + 3] = 0;
      }
      // Is it a white pixel ?
      if (this.isTrackingPixel(r, g, b)) {
        
        if (!shape1) {
          // no shape yet, create the first one
          shape1 = {};
          shape1.x = x;
          shape1.y = y;
          shape1.weight = 1;
        } else {
          // This pixel is in the first or in the second shape ?
          var d = this.dist(x, y, shape1.x, shape1.y);
          if (d < D) {
            // increment first shape size
            shape1.x += 1/(shape1.weight + 1) * (x - shape1.x);
            shape1.y += 1/(shape1.weight + 1) * (y - shape1.y);
            shape1.weight++;
          } else {
            if (!shape2) {
              // define shape 2
              shape2 = {};
              shape2.x = x;
              shape2.y = y;
              shape2.weight = 1;
            } else {
              // increment second shape size
              var d = this.dist(x, y, shape2.x, shape2.y);
              if (d < D) {
                shape2.x += 1/(shape2.weight + 1) * (x - shape2.x);
                shape2.y += 1/(shape2.weight + 1) * (y - shape2.y);
                shape2.weight++;
              }
            }
          }
        }
      }
      // Too shaking
      // if (x >= (this.width - step)) i+= step * this.width;
    }
    // We didn't find any shape
    if (!shape1 || !shape2) return;

    // Ok, we've got all the needed shapes
    // Find the correct shape (to avoid a flip)
    if (this.oldShape1) {
      var dist1 = this.dist(shape1.x, shape1.y, this.oldShape1.x, this.oldShape1.y);
      var dist2 = this.dist(shape1.x, shape1.y, this.oldShape2.x, this.oldShape2.y);

      if (dist2 < dist1) {
        var tmp = shape2;
        shape2 = shape1;
        shape1 = tmp;
      }
    }
    else{
      var tmp = shape2;
      shape2 = shape1;
      shape1 = tmp;      
    }

    // Save the shape positions
    this.oldShape1 = shape1;
    this.oldShape2 = shape2;

    //write mirror without backfround
    this.mirrorVideoCtx.putImageData(frame, 0, 0, this.width, this.height);

    // A set of transformations
    this.mirrorVideoCtx.save();

    var d = this.dist(shape1.x, shape1.y, shape2.x, shape2.y);
    var a = Math.acos((shape2.x - shape1.x) / d);
    var delta = d / 141;
    this.mirrorVideoCtx.translate(shape1.x, shape1.y);
    if (shape1.y > shape2.y)
      this.mirrorVideoCtx.rotate(-a - PI4);
    else
      this.mirrorVideoCtx.rotate(a - PI4);
    this.mirrorVideoCtx.scale(delta, delta);

    // Paint the pattern
    if (this.pattern) {
      if (this.displayBackground) {
        this.mirrorVideoCtx.fillRect(-2, -2, 104, 104);
        this.mirrorVideoCtx.strokeRect(-2, -2, 104, 104);
      }
      try {
        this.mirrorVideoCtx.drawImage(this.pattern, 0, 0, 100, 100);
      } catch(e){};
    }
    this.mirrorVideoCtx.restore();

    return;
  }
};

// ... cool, isn't it :)
// yes it is...