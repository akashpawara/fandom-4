var imageDataArray = [];
var canvasCount = 35;
const img1=".img-1";
const img2=".img-2";
const img3=".img-3";
const img4=".img-4";
const img5=".img-5";
const img6=".img-6";
const img7=".img-7";
const img8=".img-8";
const img9=".img-9";
const img10=".img-10";
const img11=".img-11";
const img12=".img-12";
setTimeout(()=>{ snap(img1);}, 200);
setTimeout(function(){ snap(img2);}, 4500);
// setTimeout(function(){ snap(img3);}, 500);
// setTimeout(function(){ snap(img4);}, 500);
// setTimeout(function(){ snap(img5);}, 500);
// setTimeout(function(){ snap(img6);}, 500);
// setTimeout(function(){ snap(img7);}, 500);
// setTimeout(function(){ snap(img8);}, 500);
// setTimeout(function(){ snap(img9);}, 500);
// setTimeout(function(){ snap(img10);}, 500);
// setTimeout(function(){ snap(img11);}, 500);
// setTimeout(function(){ snap(img12);}, 500);
async function snap(img){
  html2canvas($(img)[0]).then(canvas => {
    //capture all div data as image
    ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixelArr = imageData.data;
    createBlankImageData(imageData);
    //put pixel info to imageDataArray (Weighted Distributed)
    for (let i = 0; i < pixelArr.length; i+=4) {
      //find the highest probability canvas the pixel should be in
      let p = Math.floor((i/pixelArr.length) *canvasCount);
      let a = imageDataArray[weightedRandomDistrib(p)];
      a[i] = pixelArr[i];
      a[i+1] = pixelArr[i+1];
      a[i+2] = pixelArr[i+2];
      a[i+3] = pixelArr[i+3]; 
    }
    //create canvas for each imageData and append to target element
    for (let i = 0; i < canvasCount; i++) {
      let c = newCanvasFromImageData(imageDataArray[i], canvas.width, canvas.height);
      c.classList.add("dust");
      $(".content").append(c);
    }
    //clear all children except the canvas
    // $(".content").children().not(".dust").fadeOut(2500);
    $(img).fadeOut(2500);
    //apply animation
    $(".dust").each( function(index){
      animateBlur($(this),0.8,200);
      setTimeout(() => {
        animateTransform($(this),100,-100,chance.integer({ min: -15, max: 15 }),800+(110*index));
      }, 70*index); 
      //remove the canvas from DOM tree when faded
      $(this).delay(70*index).fadeOut((110*index)+800,"easeInQuint",()=> {$( this ).remove();});
    });
  });
 
}
function weightedRandomDistrib(peak) {
  var prob = [], seq = [];
  for(let i=0;i<canvasCount;i++) {
    prob.push(Math.pow(canvasCount-Math.abs(peak-i),3));
    seq.push(i);
  }
  return chance.weighted(seq, prob);
}
function animateBlur(elem,radius,duration) {
  var r =0;
  $({rad:0}).animate({rad:radius}, {
      duration: duration,
      easing: "easeOutQuad",
      step: function(now) {
        elem.css({
              filter: 'blur(' + now + 'px)'
          });
      }
  });
}
function animateTransform(elem,sx,sy,angle,duration) {
  var td = tx = ty =0;
  $({x: 0, y:0, deg:0}).animate({x: sx, y:sy, deg:angle}, {
      duration: duration,
      easing: "easeInQuad",
      step: function(now, fx) {
        if (fx.prop == "x") 
          tx = now;
        else if (fx.prop == "y") 
          ty = now;
        else if (fx.prop == "deg") 
          td = now;
        elem.css({
              transform: 'rotate(' + td + 'deg)' + 'translate(' + tx + 'px,'+ ty +'px)'
          });
      }
  });
}
function createBlankImageData(imageData) {
  for(let i=0;i<canvasCount;i++)
  {
    let arr = new Uint8ClampedArray(imageData.data);
    for (let j = 0; j < arr.length; j++) {
        arr[j] = 0;
    }
    imageDataArray.push(arr);
  }
}
function newCanvasFromImageData(imageDataArray ,w , h) {
  var canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      tempCtx = canvas.getContext("2d");
      tempCtx.putImageData(new ImageData(imageDataArray, w , h), 0, 0);
  return canvas;
}
