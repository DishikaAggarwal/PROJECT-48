var ball;
var bg;
var xval=30;
var yval=30;
var bluegroup,greengroup,pinkgroup,purplegroup,yellowgroup,allgroup,shooter;
var ballarr=[],mainarr=[],newballarr=[],matchingBalls=[];
var edges;
var ballGroup;
var dangerLineImg;

function preload ()
{
        //loading images
        bg=loadImage("images/background2.jpg");
        blueimg=loadImage("images/blueball.png");
        greenimg=loadImage("images/greenball.png");
        pinkimg=loadImage("images/pinkball.png");
        purpleimg=loadImage("images/purpleball.png");
        yellowimg=loadImage("images/yellowball.png");
        gameOverImage=loadImage("images/gameOver.png");
        dangerLineImg=loadImage("images/dangerLine.jpg")
}


function setup()
 {
        createCanvas(555,700);
        
        //making groups
        allgroup=new Group();
        generateNewShooter();
        
        //gamoOverSprite
        gameOver=createSprite(300,300);
        gameOver.addImage(gameOverImage);
        gameOver.visible=false;
       
        for(var r=0;r<5;r++)
        {
                for(var c=0;c<10;c++)
                {
                        ball=createSprite(xval,yval,50,50);
                        ballarr.push(ball);                     
                        ball.setCollider("circle",0,0,70)
                        var rand=Math.round(random(1,5));
                        ball.colorNum=rand;
                        ball.rowNum=r;
                        ball.colNum=c;
                        allgroup.add(ball);
                        ballselect(ball,rand);
                        xval=xval+55;
               }
                xval=30;
                yval=yval+55;
                mainarr.push(ballarr);
                ballarr=[];
            
        }

        //dangerLine
        lines=createSprite(300,510,1200,5);    
         lines.shapeColor="red";
         lines.addImage(dangerLineImg);
        lines.scale=0.3;

        //Making ballGroup
         ballGroup=new Group();
         ballGroup.add(ball);
 }


 
 //creating shooter
 function generateNewShooter()
 {
        shooter=createSprite(280,570,10,10);
        shooter.setCollider("circle",0,0,80)
        var randm=Math.round(random(1,5));
        ballselect(shooter,randm);
        shooter.colorNum=randm;
       
 }

function draw()
 {
  background(bg);

  //adding text
  fill("blue");
  textSize(40);
  strokeWeight(10);
  textFont("Algerian")
  text("Bubble Shooter",90,650)
  
  fill("blue");
  textSize(15);
  strokeWeight(10);
  textFont("Algerian")
 text("Shoot As more bubbles as you can!!!",112,690)


  if(shooter==null)
  {
          generateNewShooter();
  }  
  if (mouseWentUp("leftButton")&&(shooter.velocityX===0)) {
        //console.log("here");
        angle=(180/Math.PI)*Math.atan2(mouseY-shooter.y, mouseX-shooter.x);
        shooter.setSpeedAndDirection(10, angle);
      }

  fill("black");
  if(allgroup.isTouching(shooter))
  { 
        allgroup.add(shooter);
  for(var r=mainarr.length-1;r>=0;r--)
  {
          ballarr=mainarr[r];
          for(var c=0;c<ballarr.length;c++)
          {
                  if((shooter!=undefined) && (ballarr[c]!==undefined) && (shooter.isTouching(ballarr[c])))//
                  {
                        shooter.setVelocity(0,0);

                        var cr=r; cc=c;
                        if(shooter.y-21>=ballarr[c].y)
                        //shooter is below hit ball so set it below the hit ball. 
                        //y increases top to down. x increases left to right
                        {
                                shooter.y=ballarr[c].y+55;
                                shooter.x=ballarr[c].x;
                                cr=r;
                                cc=c;
                        }
                        else //shooter is above hit ball 
                        {
                                shooter.y=ballarr[c].y;
                                cr=r-1;
                                if (shooter.x>ballarr[c].x) //shooter is on right of hit ball
                                {
                                        shooter.x=ballarr[c].x+55;
                                        cc=c+1;
                                }
                                else
                                {
                                        shooter.x=ballarr[c].x-55;
                                        cc=c-1;
                                }
                        }
                          if(cr===mainarr.length-1) //check if new row of ball need to be created
                          {
                                  newballarr=[];
                                  newballarr.length=ballarr.length;
                                  shooter.rowNum=mainarr.length;
                                  shooter.colNum=cc;
                                  newballarr[cc]=shooter;
                                  mainarr.push(newballarr);
                                  checkColorRange(mainarr.length-1,cc,shooter.colorNum);
                          }
                          else
                          {
                                  newballarr=mainarr[cr+1];
                                  shooter.rowNum=cr+1;
                                  shooter.colNum=cc;
                                  if(newballarr[cc]!==undefined)
                                  {
                                        console.log("Over writing at "&cr+1&" "&cc);
                                        newballarr[cc].destroy();
                                }
                                newballarr[cc]=shooter;
                                  mainarr[cr+1]=newballarr;
                                  checkColorRange(cr+1,cc,shooter.colorNum);
                          }
                          shooter=null;
                          break;       
                  }
          }
          if (shooter===undefined) break;
  }
  
  }

//making balls come down
if (frameCount%300===0)
       {
               allgroup.setVelocityYEach(2)
       }
       else{
               allgroup.setVelocityYEach(0)
      
       }

       //gameOver
       if(allgroup.isTouching(lines)&&shooter!==null)
       {
               console.log("bye time");
               allgroup.destroyEach();
               shooter.destroy();
               line.visible=false;
               gameOver.visible=true;
       
       }
      
       //shooter should bouceOff the edges
        edges=createEdgeSprites();
        if(shooter!==null)
        {
        shooter.bounceOff(edges);
        }


        drawSprites();
 
}
function ballselect(ball,rand)
{
        switch(rand)
        {
          case 1: ball.addImage(blueimg);
                  break;
          case 2: ball.addImage(greenimg);
                  break;
          case 3: ball.addImage(pinkimg);
                  break;
          case 4: ball.addImage(purpleimg);
                  break;
          case 5: ball.addImage(yellowimg);
                  break;
                  
        }       
        ball.scale=0.35
}


function checkColorRange(r,c,colorCode)
{
       matchingBalls=[];
       var ballRow=[];
       console.log("Initiating at "+matchingBalls.length);
       checkColumn(r,c,colorCode);
       if(matchingBalls.length>2)
       {
               console.log("Destroying "+matchingBalls.length)
               console.log(matchingBalls);
               for(var i=0;i<matchingBalls.length;i++)
               {
                       
                       ballRow=mainarr[matchingBalls[i].rowNum];
                
                       if (ballRow[matchingBalls[i].colNum]!==undefined)
                       {
                               console.log("NULLING "+matchingBalls[i].rowNum+" "+matchingBalls[i].colNum);
                                ballRow[matchingBalls[i].colNum]=undefined;
                       }
                       
                       
                       matchingBalls[i].destroy();
                       
               }
               
               
       }
}


function checkColumn(r,c,colorCode)
 {
  var thisCol=[];       
         for(var a=r;a>=0;a--)
         {
                thisCol=mainarr[a];
                if((thisCol[c]!=undefined)&&(thisCol[c].colorNum===colorCode))
                {
                        if(matchingBalls.indexOf(thisCol[c])===-1)
                        {
                                console.log("Found at "+a+" "+c);
                                matchingBalls.push(thisCol[c]);
                                checkRow(a,c,colorCode);      
                        }
                        else
                        {
                               
                        }
                }
                else
                {
                        break;
                }
         }
        
         for(var a=r+1;a<mainarr.length;a++)
         {
                 thisCol=mainarr[a];
                 if((thisCol[c]!=undefined)&&(thisCol[c].colorNum===colorCode))
                 {
                        
                         if(matchingBalls.indexOf(thisCol[c])===-1)
                        
                         {
                                console.log("Found at "+a+" "+c);
                                matchingBalls.push(thisCol[c]);
                                checkRow(a,c,colorCode);     
                         }
                         else
                         {
                                
                         }
                 }
                 else
                {
                        break;
                }
         }
        
         

 }

 function checkRow(r,c,colorCode)
 {
         var rowarr=[];
         rowarr=mainarr[r];
         for(var cRight=c+1;cRight<rowarr.length;cRight++)
         {
                
                 if((rowarr[cRight]!=undefined)&&(rowarr[cRight].colorNum===colorCode))
                 {
                        
                         if(matchingBalls.indexOf(rowarr[cRight])===-1)
                        
                         {
                                console.log("Found at "+r+" "+cRight);
                                matchingBalls.push(rowarr[cRight]);
                                checkColumn(r,cRight,colorCode);        
                         }
                         else
                         {
                                
                         }
                 }
                 else
                 {
                         break;
                 }
         }
         
         for(var cLeft=c-1;cLeft>=0;cLeft--)
         {
                 if((rowarr[cLeft]!=undefined)&&(rowarr[cLeft].colorNum===colorCode))
                {
                        
                        if(matchingBalls.indexOf(rowarr[cLeft])===-1)
                        
                        {
                                console.log("Found at "+r+" "+cLeft);
                                matchingBalls.push(rowarr[cLeft]);
                                checkColumn(r,cLeft,colorCode);        
                        }
                        else
                        {
                                //break;
                        }
                }
                else
                {
                        break;
                }
         }
 }
