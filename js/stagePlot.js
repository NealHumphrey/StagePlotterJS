
window.onload = function() {
// create a wrapper around native canvas element (with id="c")
var stage = new fabric.Canvas('stage');


//example object - a rectangle
var rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: 'red',
  width: 50,
  height: 50,
  cornerSize:8,
  hasRotatingPoint: true,
  hoverCursor: "Yo",
  opacity: 0.9,
  padding: 10, //padding between object and controls
  rx: 3, 				//radius of corner
  ry: 3,				//radius of corner
  scaleX: 2,			//optional - only use if using logic to resize
  scaleY: 2,
  selectable: true,		//default=true. Allows user to move
});
// "add" rectangle onto canvas
stage.add(rect);


//now load an amp
var svgSrc = "svg/amp_nick_bluth.svg"
var amp = fabric.loadSVGFromURL(svgSrc);


    fabric.loadSVGFromURL(svgSrc,function(objects,options) {
    	var obj = fabric.util.groupSVGElements(objects, options);
 		obj.set({
                left: 250,
                top: 100,
                width:100,		//?? affects the control box size, not image
                height:100
        });

 		stage.add(obj).renderAll();

 		/*
        var loadedObjects = new fabric.Group(group);

        loadedObjects.set({
                left: 200,
                top: 100,
                width:175,
                height:175
        });

        canvas.add(loadedObjects);
        canvas.renderAll();
		*/
    });

    /*function(item, object) {
            object.set('id',item.getAttribute('id'));
            group.push(object);
    });
	*/
};

//resizing example for mobile responsive: http://stackoverflow.com/questions/28301286/scale-fabric-js-canvas-objects
