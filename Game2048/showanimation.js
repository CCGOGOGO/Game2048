function showNumber(i,j,randNumber){
    var numberCell=$("#number-cell-"+i+"-"+j);

    numberCell.css('background',getNumberBackGround(randNumber));
    numberCell.css('color',getNumberColor(randNumber));
    numberCell.text(randNumber);

    numberCell.animate({
        width:'100px',
        height:'100px',
        top:getPostTop(i,j),
        left:getPostLeft(i,j)
    },50);
}//这里的一块代码就是实现numberCell在获得的随机位置上显示随机数

function showMoveAnimation(fromx,fromy,tox,toy){
    var numberCell=$("#number-cell-"+fromx+"-"+fromy);
    numberCell.animate({
        // width:'100px',
        // height:'100px',
        top:getPostTop(tox,toy),
        left:getPostLeft(tox,toy)
    },200);
}//这里的一块代码是实现移动

function updateScore(score){
    $('#score').text(score);
}