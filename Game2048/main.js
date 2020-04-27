var board=new Array();
var score=0;
var hasConflicted=new Array();

// 具体每个小格子怎么控制
$(document).ready(function(){
    newgame();
});

function newgame(){
    // 初始化棋盘格
    init();
    // 在随机两个格子生成数字，所以下面调用了两次
    generateOneNumber();//这个函数是随机的在一个空闲的格子并且生成一个数字
    generateOneNumber();
}

function init(){
    // 对16个格子的位置进行赋值
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++)
        {
            var gridCell=$("#g-"+i+"-"+j);
            gridCell.css('top',getPostTop(i,j));
            gridCell.css('left',getPostLeft(i,j));
        }
    //下面一个二维数组，并且初值为0
    for(var i=0;i<4;i++){
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }     
    }

    updateBoardView();//这个函数的作用是通过board数组的值对页面中numberCell的元素进行操作
    score=0;
}

function updateBoardView(){
    $(".number-cell").remove();
    // 遍历board数组，根据board数组来设置相应的number-cell的值
    for(var i=0;i<4;i++)
    {
        for(var j=0;j<4;j++)
        {
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell=$("#number-cell-"+i+"-"+j);
            


            if(board[i][j]==0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPostTop(i,j)+50);
                theNumberCell.css('left',getPostLeft(i,j)+50);
                

            }else{
                theNumberCell.css('width','100px');
                theNumberCell.css('height','100px');
                theNumberCell.css('top',getPostTop(i,j));
                theNumberCell.css('left',getPostLeft(i,j));
                theNumberCell.css('background',getNumberBackGround(board[i][j]));//board[i][j]传进去，根据不同的数字给numberCell返回不同的背景
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j]=false;//每一次更新当然是还没有发生过碰撞的
        }
    }
}

function generateOneNumber(){
    if(nospace(board))
    return false;

    // 随机一个位置
    var randx=parseInt(Math.floor(Math.random()*4));
    var randy=parseInt(Math.floor(Math.random()*4));
    
    var times=0;
    while(times<50){//这个循环用来判断，如果board[randx][randy]==0可用，就跳出循环，否则就会一直循环
        if(board[randx][randy]==0)
        break;

        randx=parseInt(Math.floor(Math.random()*4));
        randy=parseInt(Math.floor(Math.random()*4));

        times++;
    }

    // 如果计算机随机的找了50次都没有找到，那么下面我们人工的来找到一次
    if(times==50){
        for(var i=0;i<4;i++)
            for(var j=1;j<4;j++){
                if(board[i][j]==0){
                    randx=i;
                    randy=j;
                }
            }
    }

    // 随机一个数字
    var randNumber=Math.random()<0.5?2:4;

    // 在随机的位置上将随机的数字真正的显示出来
    board[randx][randy]=randNumber;
    showNumber(randx,randy,randNumber);
    return true;
}

$(document).keydown(function(event){
    switch(event.keyCode){
        case 37:
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 38:
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39:
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40:
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        default:
            break;
    }
});

function isgameover(){
    if(nospace(board) && nomove(board)){
        gameover();
    }
}

function gameover(){
    alert("Game Over!");
}

function moveLeft(){
    if(!canMoveLeft(board))
        return false;
    
    for(var i=0;i<4;i++)
    for(var j=1;j<4;j++){
        if(board[i][j]!=0){
        // 那么这时候我们要对这个元素所有的左侧元素进行判断，所以再搞一个循环
        for(var k=0;k<j;k++){
            if(board[i][k]==0 && noBlock(i,k,j,board)){
                // move
                showMoveAnimation(i,j,i,k);
                board[i][k]=board[i][j];
                board[i][j]=0;
                continue;
            }
            else if(board[i][k]==board[i][j] && noBlock(i,k,j,board) && !hasConflicted[i][k]){
                // move
                showMoveAnimation(i,j,i,k);
                // 这种情况也会产生一次移动，还会产生叠加add
                board[i][k] += board[i][j];
                board[i][j]=0;
                // addscore
                score+=board[i][k];
                updateScore(score);

                hasConflicted[i][k]=true;
                continue;
            }
        }
        }
    }
    setTimeout('updateBoardView()',200);
    return true;
}

function moveRight(){
    if(!canMoveRight(board))
        return false;

        for(var i=0;i<4;i++){
            for(var j=2;j>=0;j--){
                if(board[i][j]!=0){
                    for(var k=3;k>j;k--){
                        if(board[i][k]==0 && noBlock(i,j,k,board)){
                            // move
                            showMoveAnimation(i,j,i,k);
                            board[i][k]=board[i][j];
                            board[i][j]=0;
                            continue;
                        }
                        else if(board[i][k]==board[i][j] && noBlock(i,j,k,board) && !hasConflicted[i][k]){
                            // move
                            showMoveAnimation(i,j,i,k);
                            // 这种情况也会产生一次移动，还会产生叠加add
                            board[i][k] += board[i][j];
                            board[i][j]=0;
                            // addscore
                            score+=board[i][k];
                            updateScore(score);

                            hasConflicted[i][k]=true;
                            continue;
                        }
                    }
                }
            }
        }

        setTimeout('updateBoardView()',200);
        return true;
}

function moveUp(){
    if(!canMoveUp(board))
    return false;

        for(var j=0;j<4;j++){
            for(var i=1;i<4;i++){
                if(board[i][j]!=0){
                    for(var k=0;k<i;k++){

                        if(board[k][j]==0 && noBlockToo(j,k,i,board)){
                            // move
                            showMoveAnimation(i,j,k,j);
                            board[k][j]=board[i][j];
                            board[i][j]=0;
                            continue;
                        }
                        else if(board[k][j]==board[i][j] && noBlockToo(j,k,i,board) && !hasConflicted[k][j]){
                            // move
                            showMoveAnimation(i,j,k,j);
                            // add
                            board[k][j]+=board[i][j];
                            board[i][j]=0;
                            // addscore
                            score+=board[k][j];
                            updateScore(score);

                            hasConflicted[k][j]=true;
                            continue;
    
                        }
    
                    }
                }
    
            }
        }

    setTimeout('updateBoardView()',200);
    return true;
}

function moveDown(){
    if(!canMoveDown(board))
    return false;

        for(var j=0;j<4;j++){
            for(var i=2;i>=0;i--){//循环要从最后一行近的行开始，这样游戏规则才会比较严谨
                if(board[i][j]!=0){
                    for(var k=3;k>i;k--){

                        if(board[k][j]==0 && noBlockToo(j,i,k,board)){
                            // move
                            showMoveAnimation(i,j,k,j);
                            board[k][j]=board[i][j];
                            board[i][j]=0;
                            continue;
                        }
                        else if(board[k][j]==board[i][j] && noBlockToo(j,i,k,board) && !hasConflicted[k][j]){
                            // move
                            showMoveAnimation(i,j,k,j);
                            // add
                            board[k][j]+=board[i][j];
                            board[i][j]=0;
                            // addscore
                            score+=board[k][j];
                            updateScore(score);

                            hasConflicted[k][j]=true;
                            continue;
                        }
                    }
                }
            }
        }

    setTimeout('updateBoardView()',200);
    return true;
}





