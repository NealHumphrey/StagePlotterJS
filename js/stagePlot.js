
window.onload = function() {
// create a wrapper around native canvas element (with id="c")
var stage = new fabric.Canvas('stage');
var prep = new fabric.Canvas('prep');

var prepRect = new fabric.Rect({left:10,top:10,fill:'red', width:130, height:50, cornerSize:5, padding:10, rx:3, ry:3, selectable:false})
prep.add(prepRect);


//now load an amp
var svgSrc = "svg/amp_nick_bluth.svg"
var amp = fabric.loadSVGFromURL(svgSrc);


    fabric.loadSVGFromURL(svgSrc,function(objects,options) {
    	var obj = fabric.util.groupSVGElements(objects, options);
 		obj.set({
                left: 10,
                top: 100,
                width:100,		//?? affects the control box size, not image
                height:100,
                selectable:false
        });

 		prep.add(obj);
    });

stage.renderAll();
prep.renderAll();
//add some event listeners
prep.on('mouse:down', function(options){
	if(options.target) {
		//TODO need to make it so that the object's group is cloned, if it has one (i.e. to include the object label)
		//TODO error in the clone() function for SVG objects... - potential? http://stackoverflow.com/questions/29494372/fabric-js-clone-path-group-type-object
		console.log('object clicked', options.target.type);
		var newItem = options.target.clone();
		newItem.set({top:50, left:50});
		stage.add(newItem);
		stage.renderAll();
	}
});

};

//resizing example for mobile responsive: http://stackoverflow.com/questions/28301286/scale-fabric-js-canvas-objects
//putting limits on the outer border drag area example: http://stackoverflow.com/questions/19979644/set-object-drag-limit-in-fabric-js




/*old examples
//Adda a rectangle, a label and group them
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

var boxTitle = new fabric.Text('Neal', { 
	left:100, 
	top:300,
	fontFamily: 'Arial',
	fontSize: 16
	});

var labeledPerson = new fabric.Group([rect, boxTitle],{
	left: 150,
	top:100
	});

stage.add(labeledPerson);

*/