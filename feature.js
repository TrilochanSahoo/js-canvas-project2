const container = document.getElementById('container');
const btn = document.getElementById('btn');
btn.addEventListener('click',function(){
    container.classList.add("hidden");
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const canvasRadius = canvas.height/2
    console.log(canvasRadius)
    let particlesArray;
    var dis;

    // mouse position
    let mouse = {
        x : null,
        y: null,
        radius : (canvas.height/180)*(canvas.width/180)
    }

    window.addEventListener('mousemove',function(e){
        mouse.x = e.x;
        mouse.y = e.y;
    })
    console.log(canvas.width,canvas.height)
    // create the particle
    class Particle{
        constructor(x, y, directionx, directiony, size, color){
            this.x = x;
            this.y = y;
            this.directionx = directionx;
            this.directiony = directiony;
            this.size = size;
            this.color = color;
        }
        draw(){
            //  background circle
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvasRadius, canvasRadius, 0, Math.PI*2, false);
            ctx.fillStyle = 'red'
            ctx.stroke()
            // ctx.fill();
            ctx.closePath();

            // particle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false);
            ctx.fillStyle = 'red'
            ctx.fill();
            ctx.closePath();
            
            // circle
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height/2, 50, 0, Math.PI*2, false);
            ctx.fillStyle = '#e4038671'
            ctx.stroke()
            ctx.fill();
            ctx.closePath();
            
            // circle around the mouse pointer 
            if(Math.abs(dis)<=canvasRadius){
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 20, 0,Math.PI*2,false);
                ctx.fillStyle = "#ffa9ecd8";
                ctx.fill()
                ctx.closePath();
            }
            


        }
        
        // check particles postion, check mouse position, move the particle, draw the particle
        update(){
            // check the particle for boundary condition
            
            // if (this.x>canvas.width || this.x<0){
            //     this.directionx = -this.directionx;
            // }
            // if (this.y>canvas.height || this.y<0){
            //     this.directiony = -this.directiony;
            // }
            // check collision detection mouse position / particle position
            let dx = mouse.x-this.x;
            let dy = mouse.y-this.y;
            let distance = Math.sqrt(dx*dx+dy*dy);
            if(distance < mouse.radius+this.size){
                if (mouse.x < this.x && this.x < canvas.width - this.size *10){
                    this.x += 10;
                }
                if (mouse.x > this.x && this.x > this.size *10){
                    this.x -= 10;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size *10){
                    this.y += 10;
                }
                if (mouse.y > this.y && this.y < this.size *10){
                    this.y -= 10;
                }
            }
            // move particle 
            this.x += this.directionx;
            this.y += this.directiony;

            // check the particle for circular boundary condition 
            const dx1 = this.x - (canvas.width/2);
            const dy1 = this.y - canvasRadius;
            console.log(dx1)
            console.log(dy1)
            const colision = Math.sqrt(dx1*dx1+dy1*dy1) >= canvasRadius-this.size
            console.log(colision)
            if (colision) {
                console.log('Out of circle bounds!')
                var theta = Math.atan2(dy1, dx1)
                var R = canvasRadius - this.size
            
                this.x = (canvas.width/2) + R * Math.cos(theta)
                this.y = canvasRadius + R * Math.sin(theta)

                this.directionx *= -1
                this.directiony *= -1
            }
            // draw particle 
            this.draw();
        }
    }

    // create particleArray 
    function init(){
        particlesArray = [];
        let numberofPrticles = (canvas.height*canvas.width)/7000;
        for(let i = 0; i< numberofPrticles; i++){
            let size = (Math.random()*5)+1;
            // console.log(size)

            let x = ((Math.random()*((canvas.width/2)+canvasRadius-5))+((canvas.width/2)-canvasRadius+1));
            let y = ((Math.random()*canvas.height)+2);
            let directionx = (Math.random()*12)-4;
            let directiony = (Math.random()*12)-4;
            let color = 'red';
            particlesArray.push(new Particle(x, y, directionx, directiony, size, color));
        }
    }

    // check for lines
    function connect(){
        let opacityvalue = 1;
        for (let a = 0; a<particlesArray.length;a++){
            for(let b = a; b<particlesArray.length;b++){
                let distance = (((particlesArray[a].x-particlesArray[b].x)*(particlesArray[a].x-particlesArray[b].x))+((particlesArray[a].y-particlesArray[b].y)*(particlesArray[a].y-particlesArray[b].y)));
                if(distance<(canvas.width/10)*(canvas.height/10)){
                    opacityvalue = 1 - (distance/20000);
                    let dx =mouse.x - particlesArray[a].x;
                    let dy = mouse.y - particlesArray[a].y;
                    let mousedistance = Math.sqrt(dx*dx+dy*dy);
                    if(mousedistance < 150){
                        ctx.strokeStyle = 'rgba(179, 41, 233,'+opacityvalue+')';
                    }else{
                        ctx.strokeStyle = 'rgba(0,0,255,'+opacityvalue+')';
                    }
                    // line between particles 
                    let pdis = Math.sqrt((Math.pow((particlesArray[a].x-particlesArray[b].x),2))+(Math.pow((particlesArray[a].y-particlesArray[b].y),2)))
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    if (pdis<80){
                        ctx.moveTo(particlesArray[a].x,particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x,particlesArray[b].y);
                        ctx.stroke();
                    }

                    // line between center to mouse
                    var cx = canvas.width/2;
                    var cy = canvas.height/2;
                    var dcx = mouse.x-cx;
                    var dcy = mouse.y-cy;
                    var angle = Math.atan2(dcy, dcx);
                    var xx = cx + canvasRadius*Math.cos(angle);
                    var yy = cy + canvasRadius*Math.sin(angle);
                    dis =Math.sqrt(dcx*dcx+dcy*dcy);
                    ctx.lineWidth = 0.1;
                    strokeStyle = 'rgba(255,255,0,0.03)';
                    ctx.beginPath();
                    if(Math.abs(dis)>canvasRadius){
                        ctx.moveTo(cx, cy);
                        ctx.lineTo(xx, yy);
                    }else{
                        ctx.moveTo(cx, cy);
                        ctx.lineTo(mouse.x, mouse.y);
                    }
                    ctx.stroke();

                    // line between mousepoint to particle 
                    if(Math.abs(dis)<=canvasRadius){
                        ctx.lineWidth = 0.1;
                        ctx.beginPath();
                        if (mousedistance<200){
                            ctx.moveTo(mouse.x,mouse.y);
                            ctx.lineTo(particlesArray[a].x,particlesArray[a].y);
                            ctx.strokeStyle = 'rgba(179, 41, 233,'+opacityvalue+')';
                            ctx.stroke();
                        }
                    }
                }
            }
        }
    }

    function animate(){
        requestAnimationFrame(animate);
        ctx.clearRect(0,0,innerWidth,innerHeight);
        for(let i = 0; i<particlesArray.length;i++){
            particlesArray[i].update();
        }
        connect();
    }

    window.addEventListener('resize', 
        function(){
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            mouse.radius = ((canvas.height/80) * (canvas.height/80));
            init();
        }
    );

    // mouse out event
    window.addEventListener('mouseout',
        function(){
            mouse.x = undefined;
            mouse.x = undefined;
        }
    )
    init();
    animate();
})
