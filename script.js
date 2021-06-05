
let widgetsContainer = document.querySelector(".widget-container");
let windowContainer = document.querySelector(".window-container ");
let pencil = document.querySelector("#pencil");
let canvas = document.querySelector("#canvas");
let tool = canvas.getContext("2d");
let functions = document.querySelector(".functions");
let clearCanvas = document.querySelector("#clear");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let eraser = document.querySelector("#eraser");
let points = [];
let color = document.querySelectorAll(".color");
let canvasColor = document.querySelector("#canvas-color");
canvasColor.defaultValue="#F5F5F5";
canvas.style.backgroundColor=canvasColor.value;
let zoomIn = document.querySelector("#zoom-in");
let zoomOut = document.querySelector("#zoom-out");
let undo = document.querySelector("#undo");
let redo = document.querySelector("#redo");
let download = document.querySelector("#download");
let upload = document.querySelector("#imgUpload");
let imgArr =[];
let ptSize = document.querySelectorAll(".line-width");
let line = document.querySelector("#line");

if(localStorage.getItem("points")){
    points = JSON.parse(localStorage.getItem("points"));
}
if(localStorage.getItem("imgArr")){
    imgArr = JSON.parse(localStorage.getItem("imgArr"));
}
redraw();

widgetsContainer.addEventListener("dragstart", function (event) {
    windowContainer.removeEventListener("mousedown",pencilMouseDown);
    this.style.opacity = '0.4';
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - event.clientY));
 
});

windowContainer.addEventListener("dragover", function (e) {
    windowContainer.removeEventListener("mousedown",pencilMouseDown);
    e.preventDefault();
});
windowContainer.addEventListener("drop", function (event) {
    windowContainer.removeEventListener("mousedown",pencilMouseDown);

    var offset = event.dataTransfer.getData("text/plain").split(',');
    widgetsContainer.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    widgetsContainer.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
    widgetsContainer.style.opacity = '1';
    event.preventDefault();
});

pencil.addEventListener("click", drawWithPencil);
function drawWithPencil(e) {
    console.log("clicked pencil");
    windowContainer.addEventListener("mousedown", pencilMouseDown);   
    windowContainer.removeEventListener("mousedown",eraserMouseDown);
    //windowContainer.removeEventListener("mousedown",lineMouseDown);
    tool.strokeStyle="black";
    tool.lineWidth=1;
    tool.lineCap = 'round';
    // tool.globalAlpha = 0.2;
    // tool.shadowBlur=15;
    // tool.shadowColor='red';
    for(let i=0; i<color.length; i++){
        color[i].addEventListener("click",function(){
            tool.strokeStyle = color[i].classList[1];
        });
    }
    for(let i=0;i<ptSize.length;i++){
        ptSize[i].addEventListener("click",function(){
            tool.lineWidth=ptSize[i].id;
        });
    }
}
function pencilMouseDown (e) {
    console.log("pencil mousedown");
     tool.beginPath();
    tool.moveTo(e.clientX, e.clientY);
    let toolColor=tool.strokeStyle;
    let lineWidth= tool.lineWidth;
    points.push({ x: e.clientX, y: e.clientY, erased:false, toolColor:toolColor, type:"md",lineWidth:lineWidth});
    windowContainer.addEventListener("mousemove", mouseMove);
    function mouseMove(e) {
        let x = e.clientX;
        let y = e.clientY;
        tool.lineTo(x, y);
        points.push({ x: x, y: y, erased:false, toolColor:toolColor, type:"mm",lineWidth:lineWidth});
        tool.stroke();
        // tool.save();
    }
    windowContainer.addEventListener("mouseup", function (e) {
        windowContainer.removeEventListener("mousemove", mouseMove);
        localStorage.setItem("points", JSON.stringify(points));
    });
}

window.addEventListener("resize", function () {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    for(let i=0;i<ptSize.length;i++){
        ptSize[i].addEventListener("click",function(){
            tool.lineWidth=ptSize[i].id;
        });
    }
    if(points.length !=0){
        redraw();
    }
});
function redraw() { 
    if(points!=null){
    for (let i = 0; i < points.length; i++) { 
        if(points[i].erased==true){
            tool.strokeStyle=canvas.style.backgroundColor;
        }else{
            tool.strokeStyle=points[i].toolColor;
        }
        tool.lineWidth=points[i].lineWidth;
            //console.log(tool.strokeStyle);
            if(points[i].type=="md"){
                tool.beginPath();
                tool.moveTo(points[i].x, points[i].y);
            }else{
                tool.lineTo(points[i].x, points[i].y);
                tool.stroke();
            }
    }
    }
    if(imgArr!=null){
    for(let i=0; i<imgArr.length; i++){
        let img = new Image();
            img.src = imgArr[i].img;
        tool.drawImage(img, 0, 0,img.width,img.height,imgArr[i].x,imgArr[i].y,200,200);
        tool.beginPath();
                tool.rect(imgArr[i].x, imgArr[i].y, 200, 200);
                tool.lineWidth = 3;
                tool.strokeStyle = 'black';
                tool.stroke();
    }
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("imgArr", JSON.stringify(imgArr));

}
}

let canvasCleared = false;
clearCanvas.addEventListener("click", function(){
    console.log("cleaar click")
    // tool.clearRect(0, 0, canvas.width, canvas.height);
    canvasCleared = true;
    while(points.length!=0){
        redoArr.push(points.pop());
    }
    tool.clearRect(0, 0, canvas.width, canvas.height);
    imgArr=[];
    redraw();
});

eraser.addEventListener("click", function(){
    console.log("clicked eraser")
    tool.lineWidth=3;
    tool.lineCap = 'round';
    windowContainer.removeEventListener("mousedown", pencilMouseDown);
    windowContainer.removeEventListener("mousedown",pencilMouseDown);
    windowContainer.addEventListener("mousedown", eraserMouseDown);
    
});
function eraserMouseDown(e){
    tool.beginPath();
    
    tool.moveTo(e.clientX, e.clientY);
    tool.strokeStyle = canvas.style.backgroundColor;
    let toolColor=tool.strokeStyle;
    let lineWidth=tool.lineWidth;
    points.push({ x: e.clientX, y: e.clientY, erased:true, toolColor:toolColor, type:"mm",lineWidth:lineWidth});

    windowContainer.addEventListener("mousemove",eraseMoouseUp);
    function eraseMoouseUp(e){
    // let x = e.clientX;
    // let y = e.clientY - functions.getBoundingClientRect().height;
    // tool.lineTo(x, y);
    // let ptToErase = points.filter(function(point){return y.toFixed(2)==(point.y).toFixed(2)});
    // if(ptToErase.length!=0){
    //     ptToErase[0].type="md";
    //     for(let i=0; i<ptToErase.length; i++){
    //         // ptToErase[i].type = "md";
    //         ptToErase[i].toolColor= canvas.style.backgroundColor;
    //     }
    // }
    // tool.stroke();
    let x = e.clientX;
        let y = e.clientY;
        
        tool.lineTo(x, y);
        points.push({ x: x, y: y, erased:true, toolColor:toolColor, type:"mm",lineWidth:lineWidth});
        tool.stroke();
    }
    windowContainer.addEventListener("mouseup", function (e) {
        windowContainer.removeEventListener("mousemove", eraseMoouseUp);
        localStorage.setItem("points", JSON.stringify(points));

    });        
}

canvasColor.addEventListener("change",function(){
        canvas.style.backgroundColor=this.value;
        redraw();
});

let xscale =1,yscale =1;

zoomIn.addEventListener("click", function(){
    console.log("zoom xli");
    
    if(xscale<=1.8 &&yscale<=1.8){
        xscale+=0.2;
    yscale+=0.2;
        canvas.style.transform = `scale(${xscale,yscale})`;
    }else{
        alert("No more zooming in allowed");
    }
});
zoomOut.addEventListener("click", function(){
    console.log("zoom xli");
    
    if(xscale>=1.2 && yscale>=1.2){
        xscale-=0.2;
    yscale-=0.2;
        canvas.style.transform = `scale(${xscale,yscale})`;
    }else{
        alert("No more zooming out allowed");
    }
});

let redoArr=[];
undo.addEventListener("click",function(){
    windowContainer.removeEventListener("mousedown",pencilMouseDown);
    windowContainer.removeEventListener("mousedown",eraserMouseDown);
    windowContainer.removeEventListener("mousedown",pencilMouseDown);
    console.log("undo clicked");
    if(canvasCleared){
        while(redoArr.length!=0){
            points.push(redoArr.pop());
        }
        calvasCleared = false;
    }else{
        redoArr.push(points.pop());
        let i=points.length-1;
        while(points[i].type!="md"){
           redoArr.push(points.pop());
            i--;
        }
        redoArr.push(points.pop());
        tool.clearRect(0, 0, canvas.width, canvas.height);
    }
        redraw();
});

redo.addEventListener("click",function(){
    windowContainer.removeEventListener("mousedown",pencilMouseDown);
    windowContainer.removeEventListener("mousedown",eraserMouseDown);
    let i=redoArr.length-1;
    while(redoArr.length!=0 || redoArr[i].type!="md"){
        points.push(redoArr.pop());
    }
    redraw();
});

download.addEventListener("click",function(){
    let link = canvas.toDataURL();
    let anchor = document.createElement("a");
    anchor.href = link;
    anchor.download="openboard.png";
    anchor.click();
})


upload.addEventListener("change", uploadImage);
function uploadImage(){
    if (this.files && this.files[0]) {
        var FR = new FileReader();
        FR.onload = function (e) {
            let img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                windowContainer.addEventListener("mousedown",drawImg);
            };
            function drawImg(e){
                let x = e.clientX;
                let y = e.clientY;
                tool.drawImage(img, 0, 0,img.width,img.height,x,y,200,200);
                tool.beginPath();
                tool.rect(x, y, 200, 200);
                tool.lineWidth = 3;
                tool.strokeStyle = 'black';
                tool.stroke();
                windowContainer.addEventListener("mouseup",function(){
                    windowContainer.removeEventListener("mousedown",drawImg);
                });
                imgArr.push({img:img.src,x:x,y:y});
                localStorage.setItem("imgArr",JSON.stringify(imgArr));

            }
            
        };
        FR.readAsDataURL(this.files[0]);
        
    }
}

line.addEventListener("click",function(){
    windowContainer.removeEventListener("mousedown",pencilMouseDown)
    windowContainer.removeEventListener("mousedown",eraserMouseDown);
    windowContainer.addEventListener("mousedown",drawLine);
    tool.strokeStyle="black";
    tool.lineWidth=1;
    tool.lineCap = 'butt';
    for(let i=0; i<color.length; i++){
        color[i].addEventListener("click",function(){
            tool.strokeStyle = color[i].classList[1];
        });
    }
    for(let i=0;i<ptSize.length;i++){
        ptSize[i].addEventListener("click",function(){
            tool.lineWidth=ptSize[i].id;
        });
    }
    function drawLine(e){
        windowContainer.style.cursor="crosshair";
        tool.beginPath();
        tool.moveTo(e.clientX,e.clientY);
        windowContainer.addEventListener("mouseup",function(ev){
            tool.lineTo(ev.clientX,ev.clientY);
            tool.stroke();
            windowContainer.style.cursor="context-menu";
        });
    }
});


