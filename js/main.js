$(document).ready(function() {
    $('#fullpage').fullpage({
        anchors:['slide1', 'slide2', 'slide3', 'slide4', 'slide5', 'slide6', 'slide7', 'slide8'],
        sectionsColor: ['#fec215', '#cbd6d6', '#010108', '#6296ab', '#0f3c22', '#4BBFC3', '#130c2c','#000'],
    });

	
    $('#cake').click(function(){
    	setTimeout(function(){
    		$('.anton-face').fadeIn('slow');
    	},200)
    	
    })

    var c = document.getElementById("c");
    var ctx = c.getContext("2d");

    var bc = document.createElement("canvas");
    var bCtx = bc.getContext("2d");

    var cw = c.width = bc.width = window.innerWidth,
      cx = cw / 2;
    var ch = c.height = bc.height = window.innerHeight + 100,
      cy = ch;

    var frames = 0;
    var requestId = null;
    var rad = (Math.PI / 180);
    var kappa = 0.5522847498;

    var x, y;
    bCtx.strokeStyle = "#abcdef";
    bCtx.lineWidth = 1;

    var balloons = [];

    function Balloon() {
      this.r = randomIntFromInterval(20, 70);
      this.R = 1.4 * this.r;
      this.x = randomIntFromInterval(this.r, cw - this.r);
      this.y = ch + 2 * this.r;
      this.a = this.r * 4.5;
      this.pm = Math.random() < 0.5 ? -1 : 1;
      this.speed = randomIntFromInterval(1.5, 4);
      this.k = this.speed / 5;
      this.hue = this.pm > 0 ? "200" : "270";
    }

    function Draw() {

      updateBallons(bCtx);

      ctx.clearRect(0, 0, cw, ch);
      var img = bc;
      ctx.drawImage(img, 0, 0);

      requestId = window.requestAnimationFrame(Draw);
    }
    //requestId = window.requestAnimationFrame(Draw);

    function Init() {
      if (requestId) {
        window.cancelAnimationFrame(requestId);
        requestId = null;
      }
      cw = c.width = bc.width = window.innerWidth, cx = cw / 2;
      ch = c.height = bc.height = window.innerHeight + 100, cy = ch;
      bCtx.strokeStyle = "#abcdef";
      bCtx.lineWidth = 1;
      Draw();
    }

    setTimeout(function() {
      Init();
      window.addEventListener('resize', Init, false);
    }, 15);

    function updateBallons(ctx) {
      frames += 1;
      if (frames % 37 == 0 && balloons.length < 37) {
        var balloon = new Balloon();
        balloons.push(balloon);
      }
      ctx.clearRect(0, 0, cw, ch);

      for (var i = 0; i < balloons.length; i++) {
        var b = balloons[i];
        if (b.y > -b.a) {
          b.y -= b.speed
        } else {
          b.y = parseInt(ch + b.r + b.R);
        }

        var p = thread(b, ctx);
        b.cx = p.x;
        b.cy = p.y - b.R;
        ctx.fillStyle = Grd(p.x, p.y, b.r, b.hue)
        drawBalloon(b, ctx);
      }
    }

    function drawBalloon(b, ctx) {

      var or = b.r * kappa; // offset

      var p1 = {
        x: b.cx - b.r,
        y: b.cy
      }
      var pc11 = {
        x: p1.x,
        y: p1.y + or
      }
      var pc12 = {
        x: p1.x,
        y: p1.y - or
      }

      var p2 = {
        x: b.cx,
        y: b.cy - b.r
      }
      var pc21 = {
        x: b.cx - or,
        y: p2.y
      }
      var pc22 = {
        x: b.cx + or,
        y: p2.y
      }

      var p3 = {
        x: b.cx + b.r,
        y: b.cy
      }
      var pc31 = {
        x: p3.x,
        y: p3.y - or
      }
      var pc32 = {
        x: p3.x,
        y: p3.y + or
      }

      var p4 = {
        x: b.cx,
        y: b.cy + b.R
      };
      var pc41 = {
        x: p4.x + or,
        y: p4.y
      }
      var pc42 = {
        x: p4.x - or,
        y: p4.y
      }

      var t1 = {
        x: p4.x + .2 * b.r * Math.cos(70 * rad),
        y: p4.y + .2 * b.r * Math.sin(70 * rad)
      }
      var t2 = {
        x: p4.x + .2 * b.r * Math.cos(110 * rad),
        y: p4.y + .2 * b.r * Math.sin(110 * rad)
      }

      //balloon
      ctx.beginPath();
      ctx.moveTo(p4.x, p4.y);
      ctx.bezierCurveTo(pc42.x, pc42.y, pc11.x, pc11.y, p1.x, p1.y);
      ctx.bezierCurveTo(pc12.x, pc12.y, pc21.x, pc21.y, p2.x, p2.y);
      ctx.bezierCurveTo(pc22.x, pc22.y, pc31.x, pc31.y, p3.x, p3.y);
      ctx.bezierCurveTo(pc32.x, pc32.y, pc41.x, pc41.y, p4.x, p4.y);
      //knot
      ctx.lineTo(t1.x, t1.y);
      ctx.lineTo(t2.x, t2.y);
      ctx.closePath();
      ctx.fill();
    }

    function thread(b, ctx) {
      ctx.beginPath();

      for (var i = b.a; i > 0; i -= 1) {
        var t = i * rad;
        x = b.x + b.pm * 50 * Math.cos(b.k * t - frames * rad)
        y = b.y + b.pm * 25 * Math.sin(b.k * t - frames * rad) + 50 * t
        ctx.lineTo(x, y)
      }
      ctx.stroke();
      return p = {
        x: x,
        y: y
      }
    }

    function Grd(x, y, r, hue) {
      grd = ctx.createRadialGradient(x - .5 * r, y - 1.7 * r, 0, x - .5 * r, y - 1.7 * r, r);
      grd.addColorStop(0, 'hsla(' + hue + ',100%,65%,.95)');
      grd.addColorStop(0.4, 'hsla(' + hue + ',100%,45%,.85)');
      grd.addColorStop(1, 'hsla(' + hue + ',100%,25%,.80)');
      return grd;
    }

    function randomIntFromInterval(mn, mx) {
      return ~~(Math.random() * (mx - mn + 1) + mn);
    }

var bits=40; // how many bits
var speed=15; // how fast - smaller is faster
var bangs=5; // how many can be launched simultaneously (note that using too many can slow the script down)
var colours=new Array("#03f", "#f03", "#0e0", "#93f", "#0cf", "#f93", "#f0c"); 
//                     blue    red     green   purple  cyan    orange  pink

    /****************************
    *      Fireworks Effect     *
    *(c)2004-14 mf2fm web-design*
    *  http://www.mf2fm.com/rv  *
    * DON'T EDIT BELOW THIS BOX *
    ****************************/
    var bangheight=new Array();
    var intensity=new Array();
    var colour=new Array();
    var Xpos=new Array();
    var Ypos=new Array();
    var dX=new Array();
    var dY=new Array();
    var stars=new Array();
    var decay=new Array();
    var swide=800;
    var shigh=600;
    var boddie;

    if (typeof('addRVLoadEvent')!='function') function addRVLoadEvent(funky) {
      var oldonload=window.onload;
      if (typeof(oldonload)!='function') window.onload=funky;
      else window.onload=function() {
        if (oldonload) oldonload();
        funky();
      }
    }

    addRVLoadEvent(light_blue_touchpaper);

    function light_blue_touchpaper() { if (document.getElementById) {
      var i;
      boddie=document.createElement("div");
      boddie.style.position="fixed";
      boddie.style.top="0px";
      boddie.style.left="0px";
      boddie.style.overflow="visible";
      boddie.style.width="1px";
      boddie.style.height="1px";
      boddie.style.backgroundColor="transparent";
      document.body.appendChild(boddie);
      set_width();
      for (i=0; i<bangs; i++) {
        write_fire(i);
        launch(i);
        setInterval('stepthrough('+i+')', speed);
      }
    }}

    function write_fire(N) {
      var i, rlef, rdow;
      stars[N+'r']=createDiv('|', 12);
      boddie.appendChild(stars[N+'r']);
      for (i=bits*N; i<bits+bits*N; i++) {
        stars[i]=createDiv('*', 13);
        boddie.appendChild(stars[i]);
      }
    }

    function createDiv(char, size) {
      var div=document.createElement("div");
      div.style.font=size+"px monospace";
      div.style.position="absolute";
      div.style.backgroundColor="transparent";
      div.appendChild(document.createTextNode(char));
      return (div);
    }

    function launch(N) {
      colour[N]=Math.floor(Math.random()*colours.length);
      Xpos[N+"r"]=swide*0.5;
      Ypos[N+"r"]=shigh-5;
      bangheight[N]=Math.round((0.5+Math.random())*shigh*0.4);
      dX[N+"r"]=(Math.random()-0.5)*swide/bangheight[N];
      if (dX[N+"r"]>1.25) stars[N+"r"].firstChild.nodeValue="/";
      else if (dX[N+"r"]<-1.25) stars[N+"r"].firstChild.nodeValue="\\";
      else stars[N+"r"].firstChild.nodeValue="|";
      stars[N+"r"].style.color=colours[colour[N]];
    }

    function bang(N) {
      var i, Z, A=0;
      for (i=bits*N; i<bits+bits*N; i++) { 
        Z=stars[i].style;
        Z.left=Xpos[i]+"px";
        Z.top=Ypos[i]+"px";
        if (decay[i]) decay[i]--;
        else A++;
        if (decay[i]==15) Z.fontSize="7px";
        else if (decay[i]==7) Z.fontSize="2px";
        else if (decay[i]==1) Z.visibility="hidden";
        if (decay[i]>1 && Math.random()<.1) {
           Z.visibility="hidden";
           setTimeout('stars['+i+'].style.visibility="visible"', speed-1);
        }
        Xpos[i]+=dX[i];
        Ypos[i]+=(dY[i]+=1.25/intensity[N]);

      }
      if (A!=bits) setTimeout("bang("+N+")", speed);
    }

    function stepthrough(N) { 
      var i, M, Z;
      var oldx=Xpos[N+"r"];
      var oldy=Ypos[N+"r"];
      Xpos[N+"r"]+=dX[N+"r"];
      Ypos[N+"r"]-=4;
      if (Ypos[N+"r"]<bangheight[N]) {
        M=Math.floor(Math.random()*3*colours.length);
        intensity[N]=5+Math.random()*4;
        for (i=N*bits; i<bits+bits*N; i++) {
          Xpos[i]=Xpos[N+"r"];
          Ypos[i]=Ypos[N+"r"];
          dY[i]=(Math.random()-0.5)*intensity[N];
          dX[i]=(Math.random()-0.5)*(intensity[N]-Math.abs(dY[i]))*1.25;
          decay[i]=16+Math.floor(Math.random()*16);
          Z=stars[i];
          if (M<colours.length) Z.style.color=colours[i%2?colour[N]:M];
          else if (M<2*colours.length) Z.style.color=colours[colour[N]];
          else Z.style.color=colours[i%colours.length];
          Z.style.fontSize="13px";
          Z.style.visibility="visible";
        }
        bang(N);
        launch(N);
      }
      stars[N+"r"].style.left=oldx+"px";
      stars[N+"r"].style.top=oldy+"px";
    } 

    window.onresize=set_width;
    function set_width() {
      var sw_min=999999;
      var sh_min=999999;
      if (document.documentElement && document.documentElement.clientWidth) {
        if (document.documentElement.clientWidth>0) sw_min=document.documentElement.clientWidth;
        if (document.documentElement.clientHeight>0) sh_min=document.documentElement.clientHeight;
      }
      if (typeof(self.innerWidth)!="undefined" && self.innerWidth) {
        if (self.innerWidth>0 && self.innerWidth<sw_min) sw_min=self.innerWidth;
        if (self.innerHeight>0 && self.innerHeight<sh_min) sh_min=self.innerHeight;
      }
      if (document.body.clientWidth) {
        if (document.body.clientWidth>0 && document.body.clientWidth<sw_min) sw_min=document.body.clientWidth;
        if (document.body.clientHeight>0 && document.body.clientHeight<sh_min) sh_min=document.body.clientHeight;
      }
      if (sw_min==999999 || sh_min==999999) {
        sw_min=800;
        sh_min=600;
      }
      swide=sw_min;
      shigh=sh_min;
    }
});