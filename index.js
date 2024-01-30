let clicks = 0;
let georges = 0;
let image = document.getElementById('georgie');
let body = document.getElementsByTagName('body')[0];
let size = 25;



function updateScreen(){
    clicks += 1;
    console.log(clicks);

    if (clicks == 1){
        image.src='assets/george1.jpg';
        georges += 1;
    }

    else if (clicks == 2){
        image.src='assets/george2.jpg';
        body.style.backgroundImage = 'url(assets/candles1.jpg)';
        body.style.backgroundColor = '#ff00ff';
        georges += 1;
    }

    else if (clicks > 2 && clicks < 11) {
        console.log("testing testing 123");
        body.style.backgroundImage = 'url(assets/candles' + (clicks-1) + '.jpg';
    }

    else if (clicks > 10 && clicks < 35){
        georges += 1;
        console.log(georges);
        image.src='assets/george'+georges+'.jpg';
    }

    else if (clicks == 35){
        html = `<div class="row center">
        <div class="col">
          <button id="yes-button" class="yes-no-buttons" onclick="options()">YES</button>
        </div>
        <div class="col">
          <button class="yes-no-buttons" onclick="bigYes()">NO</button>
        </div>
        </div>`

        document.getElementById('yes-no').innerHTML = html;
        

    }
}

function bigYes(){
    size += 15;
    document.getElementById('yes-button').style.fontSize = size + 'px';

}

function options(){
    html = `<div class="div options">
    option a: Takeaway, friends, two canvi, and we swap every 10 mins (properly now cause im somewhat competent with painting)<br><br>
    option b: woof woof cafe<br><br>
    option c: zeeeeezeees or wagas<br><br>
    option always: james's match at 6!!!
    </div>`

    document.getElementById('yes-no').innerHTML = html;

}

