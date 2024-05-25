let canvas;
let connections = [
    [0,1], [1,2], [2,3], [3,4], //thumb
    [0,5], [5,6], [6,7], [7,8], //index
    [0,9], [9,10], [10,11], [11,12], //middle
    [0,13], [13,14], [14,15], [15,16], //ring
    [0,17], [17,18], [18,19], [19,20], //pinky
    [2,5], [5,9], [9,13], [13,17] //mesh
];

let sketch = function(p) {

    p.setup = function() {
        canvas = p.createCanvas(640, 480, p.WEBGL);
        canvas.id('canvas')

    };

    p.draw = function() {
        console.log("constant draw function")
        p.translate(-p.width/2, -p.height/2);
        p.clear();


        if (detections != undefined){
            if (detections.multiHandLandmarks != undefined){
                p.drawHands();
            };
        };
    };

    p.drawHands = function() {
        let positions = [];
        

        for (let i = 0; i < detections.multiHandLandmarks.length; i++){
            p.strokeWeight(8);
            p.stroke(255, 100, 0);
            let landmarks = detections.multiHandLandmarks[i];
            for (let j = 0; j < landmarks.length; j++){
                let x = detections.multiHandLandmarks[i][j].x * p.width;
                let y = detections.multiHandLandmarks[i][j].y * p.height;
                let z = detections.multiHandLandmarks[i][j].z;
                positions.push({"x":x, "y":y, "z":z});

                p.point(x, y, z+1)
            };
            

            if (positions.length != 0) {

                p.stroke(240, 240, 240)
                p.strokeWeight(3);

                for (let i = 0; i < connections.length; i++){
                    p1 = connections[i][0];
                    p2 = connections[i][1];

                    let x1 = positions[p1].x;
                    let y1 = positions[p1].y;
                    let z1 = positions[p1].z;

                    let x2 = positions[p2].x;
                    let y2 = positions[p2].y;
                    let z2 = positions[p2].z;

                    p.line(x1, y1, z1, x2, y2, z2);
                };
            };
            positions = [];
        };
    };
}
let myp5 = new p5(sketch);
