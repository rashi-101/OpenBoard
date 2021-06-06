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
let lineArr =[];
let undoArr = [];
let redoArr=[];

// if(localStorage.getItem("points")){
//     points = JSON.parse(localStorage.getItem("points"));
// }
// if(localStorage.getItem("imgArr")){
//     imgArr = JSON.parse(localStorage.getItem("imgArr"));
// }
// if(localStorage.getItem("lineArr")){
//     lineArr = JSON.parse(localStorage.getItem("lineArr"));
// }
// redraw();
if(localStorage.getItem("undoArr")){
    undoArr = JSON.parse(localStorage.getItem("undoArr"));
    if(undoArr.length!=0){
        if(undoArr[0].points.length>0){
            points = undoArr[0].points;
        }
        if(undoArr[0].imgArr.length>0){
         imgArr = undoArr[0].imgArr;
        }
        if(undoArr[0].lineArr.length>0){
            lineArr = undoArr[0].lineArr;
        }
    }
    
    redraw();
}

widgetsContainer.addEventListener("dragstart", function (event) {
    // windowContainer.removeEventListener("mousedown",pencilMouseDown);
    this.style.opacity = '0.4';
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - event.clientY));
 
});

windowContainer.addEventListener("dragover", function (e) {
    // windowContainer.removeEventListener("mousedown",pencilMouseDown);
    e.preventDefault();
});
windowContainer.addEventListener("drop", function (event) {
    // windowContainer.removeEventListener("mousedown",pencilMouseDown);

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

    function pencilMouseDown (e) {
        console.log("pencil mousedown");
         tool.beginPath();
        tool.moveTo(e.clientX, e.clientY);
        let toolColor=tool.strokeStyle;
        let lineWidth= tool.lineWidth;
        points.push({ x: e.clientX, y: e.clientY, erased:false, toolColor:toolColor, type:"md",lineWidth:lineWidth});
        // undoEle.push({ x: e.clientX, y: e.clientY, erased:false, toolColor:toolColor, type:"md",lineWidth:lineWidth,widget:"pencil"});
        windowContainer.addEventListener("mousemove", mouseMove);

        function mouseMove(e) {
            let x = e.clientX;
            let y = e.clientY;
            tool.lineTo(x, y);
            points.push({ x: x, y: y, erased:false, toolColor:toolColor, type:"mm",lineWidth:lineWidth});
            // undoEle.push({ x: x, y: y, erased:false, toolColor:toolColor, type:"mm",lineWidth:lineWidth});
            tool.stroke();
            // tool.save();
        }
        windowContainer.addEventListener("mouseup", pencilUp);
        function pencilUp(e) {
            undoArr.push({points:[...points], imgArr:[...imgArr],lineArr:[...lineArr]});
            // state++;
            windowContainer.removeEventListener("mousemove", mouseMove);
            windowContainer.removeEventListener("mousedown",pencilMouseDown);
            localStorage.setItem("undoArr",JSON.stringify([...undoArr.slice(undoArr.length-1)]));
            windowContainer.removeEventListener("mouseup",pencilUp);
        }
    }
}

window.addEventListener("resize", function () {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    for(let i=0;i<ptSize.length;i++){
        ptSize[i].addEventListener("click",function(){
            tool.lineWidth=ptSize[i].id;
        });
    }
    // if(points.length !=0 || imgArr.length!=0 || lineArr.length!=0){
        redraw();   
});
function redraw() { 
//     let currIdx;
//   let pArr ;
//   let lArr;
//    let iArr;
    if(undoArr.length!=0 &&undoArr!=null){
         currIdx =undoArr.length-1; 
         points = undoArr[currIdx].points;
         imgArr = undoArr[currIdx].imgArr;
        lineArr = undoArr[currIdx].lineArr;
    }else{
        points=[];
        imgArr=[];
        lineArr=[];
    }
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
            let wid = imgArr[i].wid;
            let ht = imgArr[i].ht;
        tool.drawImage(img, 0, 0,img.width,img.height,imgArr[i].x,imgArr[i].y,wid,ht);
        tool.beginPath();
                tool.rect(imgArr[i].x, imgArr[i].y, wid, ht);
                tool.lineWidth = 3;
                tool.strokeStyle = 'black';
                tool.stroke();
    }

    if(lineArr!=null){
        for(let i=0; i<lineArr.length; i++){
            tool.strokeStyle = lineArr[i].toolColor;
            tool.lineWidth = lineArr[i].lineWidth;
            tool.beginPath();
            tool.moveTo(lineArr[i].startX, lineArr[i].startY);
            tool.lineTo(lineArr[i].endX, lineArr[i].endY);
            tool.stroke();
        }
    }
    localStorage.setItem("undoArr",JSON.stringify([...undoArr.slice(undoArr.length-1)]));
}
}

clearCanvas.addEventListener("click", function(){
    if(confirm("All your progress will be gone, are you sure you want to clear the slate?")){
        undoArr=[];
    redoArr=[];
    tool.clearRect(0, 0, canvas.width, canvas.height);
    redraw()
    }
    console.log("cleaar click"); 
    // while(undoArr.length!=0){
    //     redoArr.push(undoArr.pop());
    // }
    ;
});

eraser.addEventListener("click", function(){
    console.log("clicked eraser")
    tool.lineWidth=3;
    tool.lineCap = 'round';
    // windowContainer.removeEventListener("mousedown", pencilMouseDown);
    // windowContainer.removeEventListener("mousedown",pencilMouseDown);
    for(let i=0;i<ptSize.length;i++){
        ptSize[i].addEventListener("click",function(){
            tool.lineWidth+=ptSize[i].id;
        });
    }
    windowContainer.addEventListener("mousedown", eraserMouseDown);
    
});
function eraserMouseDown(e){
    tool.beginPath();
    tool.moveTo(e.clientX, e.clientY);
    tool.strokeStyle = canvas.style.backgroundColor;
    let toolColor=tool.strokeStyle;
    let lineWidth=tool.lineWidth;
    points.push({ x: e.clientX, y: e.clientY, erased:true, toolColor:toolColor, type:"md",lineWidth:lineWidth});
    windowContainer.addEventListener("mousemove",eraseMoouseUp);
    function eraseMoouseUp(ev){
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
    let x = ev.clientX;
        let y = ev.clientY;   
        tool.lineTo(x, y);
        points.push({ x: x, y: y, erased:true, toolColor:toolColor, type:"mm",lineWidth:lineWidth});
        tool.stroke();
    }
    windowContainer.addEventListener("mouseup", eraseUp);
    function eraseUp (e) {
        undoArr.push({points:[...points], imgArr:[...imgArr],lineArr:[...lineArr]});
        localStorage.setItem("undoArr",JSON.stringify([...undoArr.slice(undoArr.length-1)]));
        windowContainer.removeEventListener("mousemove", eraseMoouseUp);
        windowContainer.removeEventListener("mousedown",eraserMouseDown);
       windowContainer.removeEventListener("mouseup",eraseUp);
    }        
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


undo.addEventListener("click",function(){
    console.log("undo clicked");
    if(undoArr.length==0){
        alert("You havent done enough to regret your past");
        // localStorage.clear();
    }else{
        redoArr.push(undoArr.pop());
        tool.clearRect(0, 0, canvas.width, canvas.height);
        redraw();
    }   
});

redo.addEventListener("click",function(){
    if(redoArr.length==0){
        alert("Nothing to redo, its too late now to think over your carefree decisions");
    }else{
        undoArr.push(redoArr.pop());
        tool.clearRect(0, 0, canvas.width, canvas.height);
        redraw();
    }   
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
    windowContainer.style.cursor="crosshair";
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
                windowContainer.addEventListener("mouseup",stopImg);
                function stopImg(ev){
                    let btmRightX = ev.clientX;
                    let btmRightY = ev.clientY;
                    let newWidth = btmRightX-x;
                    let newHeight = btmRightY-y;
                    console.log(newWidth+","+newHeight);
                tool.drawImage(img, 0, 0,img.width,img.height,x,y,newWidth,newHeight);
                tool.beginPath();
                tool.rect(x, y, newWidth, newHeight);
                tool.lineWidth = 3;
                tool.strokeStyle = 'black';
                tool.stroke();
                    windowContainer.removeEventListener("mousedown",drawImg);
                    imgArr.push({img:img.src,x:x,y:y,ht:newHeight,wid:newWidth});
                    undoArr.push({points:[...points], imgArr:[...imgArr],lineArr:[...lineArr]});
                    localStorage.setItem("undoArr",JSON.stringify([...undoArr.slice(undoArr.length-1)]));
                    windowContainer.style.cursor="context-menu";
                    windowContainer.removeEventListener("mouseup",stopImg);
                }
                
            }    
        };
        FR.readAsDataURL(this.files[0]); 
    }
}

line.addEventListener("click",lineClick);

function lineClick(){
    // windowContainer.removeEventListener("mousedown",pencilMouseDown)
    windowContainer.removeEventListener("mousedown",eraserMouseDown);
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
    windowContainer.addEventListener("mousedown",drawLine);
    function drawLine(e){
        let startx = e.clientX;
        let starty = e.clientY;
        windowContainer.style.cursor="crosshair";
        tool.beginPath();
        tool.moveTo(e.clientX,e.clientY);
        let toolColor = tool.strokeStyle;
        let lineWidth = tool.lineWidth;
        windowContainer.addEventListener("mouseup",lineUp);
        function lineUp(ev){
            console.log("up")
            let endx = ev.clientX;
            let endy = ev.clientY;
            lineArr.push({startX:startx, startY:starty, endX:endx, endY:endy, toolColor:toolColor,lineWidth:lineWidth, linecap:tool.lineCap});
            tool.lineTo(ev.clientX,ev.clientY);
            tool.stroke();
            tool.closePath();
            windowContainer.style.cursor="context-menu";
           windowContainer.removeEventListener("mousedown",drawLine);
           windowContainer.removeEventListener("mouseup", lineUp);
           undoArr.push({points:[...points], imgArr:[...imgArr],lineArr:[...lineArr]});
           localStorage.setItem("undoArr",JSON.stringify([...undoArr.slice(undoArr.length-1)]));
        }
    }
    
}
