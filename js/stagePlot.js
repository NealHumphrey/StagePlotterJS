
/*Extend the functionality of Fabric.js
*
*
*/


var stagePlot = {};
//Make a Labeled Rectangle
fabric.LabeledRect = fabric.util.createClass(fabric.Rect, {

	  type: 'labeledRect',

	  initialize: function(options) {
	    options || (options = { });

	    this.callSuper('initialize', options);
	    this.set('label', options.label || '');
	  },

	  toObject: function() {
	    return fabric.util.object.extend(this.callSuper('toObject'), {
	      label: this.get('label')
	      //name: this.get('name')  //TODO move this to modify/extend the Object 'class' instead?
	    });
	  },

	  _render: function(ctx) {
	    this.callSuper('_render', ctx);

	    ctx.font = '20px Helvetica';
	    ctx.fillStyle = '#333';
	    ctx.fillText(this.label, -this.width/2, -this.height/2 + 20);
	  }
});
fabric.LabeledRect.fromObject = function(options) {
          return new fabric.LabeledRect(options);
        }







fabric.ExtendedItext = fabric.util.createClass(fabric.IText, {

	  type: 'extendedItext',

	  initialize: function(options) {
	    options || (options = { });

	    this.callSuper('initialize', options);
	    this.set('label', options.label || '');
	  },

	  toObject: function() {
	    return fabric.util.object.extend(this.callSuper('toObject'), {
	      label: this.get('label')
	      //name: this.get('name')  //TODO move this to modify/extend the Object 'class' instead?
	    });
	  },

	  _render: function(ctx) {
	    this.callSuper('_render', ctx);
	    var rx = 5,
          ry = 5,
          w = 200,
          h = 75,
          x =this.left,
          y = this.top,
          isRounded = rx !== 0 || ry !== 0,
          k = 1 - 0.5522847498 /* "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf) */;

	      ctx.beginPath();

	      ctx.moveTo(x + rx, y);

	      ctx.lineTo(x + w - rx, y);
	      isRounded && ctx.bezierCurveTo(x + w - k * rx, y, x + w, y + k * ry, x + w, y + ry);

	      ctx.lineTo(x + w, y + h - ry);
	      isRounded && ctx.bezierCurveTo(x + w, y + h - k * ry, x + w - k * rx, y + h, x + w - rx, y + h);

	      ctx.lineTo(x + rx, y + h);
	      isRounded && ctx.bezierCurveTo(x + k * rx, y + h, x, y + h - k * ry, x, y + h - ry);

	      ctx.lineTo(x, y + ry);
	      isRounded && ctx.bezierCurveTo(x, y + k * ry, x + k * rx, y, x + rx, y);

	      ctx.closePath();

	      ctx.fill();
	      this._renderStroke(ctx);
	    
	  }
});
fabric.ExtendedItext.fromObject = function(options) {
          return new fabric.LabeledRect(options);
        }






///////////////////////////////////////////////////
window.onload = function() {

/*Extend the functionality of Fabric.js
*
*
*/
// create a wrapper around native canvas element (with id="c")
var stage = new fabric.Canvas('stage');
var prep = new fabric.Canvas('prep');



//Add a rectangle with label via the extended class ExtendedItext
var extendedItext = new fabric.ExtendedItext(
	'label',
	 {	fill: '#A00000', 
		left: 10, 
		top: 100, 
		width:130, 
		height:50, 
		cornerSize:5, 
		padding:10, 
		rx:3, 
		ry:3, 
		selectable:false,
		textBackgroundColor:'#add8e6'})
prep.add(extendedItext);

/*
//Add a rectangle with label via group
var prepRect = new fabric.Rect({originX: 'center', originY: 'center', fill:'red', width:130, height:50, cornerSize:5, padding:10, rx:3, ry:3, selectable:false})
var boxTitle = new fabric.IText('Neal\n(Violin)', {originX: 'center', originY: 'center', fontFamily: 'Arial', fontSize: 18 });
var labeledPerson = new fabric.Group([prepRect, boxTitle],{left: 10, top: 10, selectable:false});
prep.add(labeledPerson);


//Add a rectangle with label via the extended class LabeledRectangle
var labeledRect = new fabric.LabeledRect({label:'Neal\n\r(labeled instrument)', fill:'red', left: 10, top: 100, width:130, height:50, cornerSize:5, padding:10, rx:3, ry:3, selectable:false})
prep.add(labeledRect);


*/

//load just a title
var soloTitle = new fabric.IText('Neal', {left:10, top:200, fontFamily: 'Arial', 
	fontSize: 18, cornerSize:5, padding:10, 
	selectable:false,
	fill: '#AEEEEE',
	backgroundColor: '#35586C' });
prep.add(soloTitle);

//now load an amp
var svgSrc = "svg/amp_nick_bluth.svg"
var amp = fabric.loadSVGFromURL(svgSrc);


    fabric.loadSVGFromURL(svgSrc,function(objects,options) {
    	var obj = fabric.util.groupSVGElements(objects, options);
 		obj.set({
                left: 10,
                top: 250,
                width:100,		//?? affects the control box size, not image
                height:100,
                selectable:false
        });

 		prep.add(obj);
    });


//load a textbox
var textbox = new fabric.Textbox('This is my box', {
	left:10, 
	top:350, 
	width: 100, 
	minWidth:100, 
	fontFamily:'Arial', 
	fontSize: 18, 
	cornerSize:5, 
	padding:10, 
	selectable:false,
	fill: '#AEEEEE',
	backgroundColor: '#35586C',
	lineheight: 1.5,
	//originX: 'center',
	//originY: 'center',
	textAlign: 'center'
	});
prep.add(textbox);


stage.renderAll();
prep.renderAll();
//add some event listeners
prep.on('mouse:down', function(options){
	if(options.target) {
		console.log(options.target.type);
		console.log(fabric.util.getKlass(options.target.type));

		if (fabric.util.getKlass(options.target.type).async) {  //TODO getKlass has optional second argument of namespace
			console.log('entered')
		  options.target.clone(function (clone) {
		    clone.set({left: 200, top: 100});
		    stage.add(clone);
		  });
		}
		else {
		
		  stage.add(options.target.clone().set({left: 100, top: 100}));
		}
	}
});

};

//resizing example for mobile responsive: http://stackoverflow.com/questions/28301286/scale-fabric-js-canvas-objects
//putting limits on the outer border drag area example: http://stackoverflow.com/questions/19979644/set-object-drag-limit-in-fabric-js
//Example for grouping/ungrouping to allow editing of IText that is stuck in a group: http://stackoverflow.com/questions/24449481/fabric-js-grouped-itext-not-editable
		//but - looks like it re-groups everything on the canvas....
		//Potential way to overcome: use intersection to regroup with the next closest object: http://fabricjs.com/intersection/
//text resolution problem: http://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas




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





//Find Objects by Name. Extend the built in Canvas functionality. Copied from : http://stackoverflow.com/questions/20824019/fabric-js-get-objects-by-name
/**
 * Item name is unique
 */
fabric.Canvas.prototype.getItemByName = function(name) {
  var object = null,
      objects = this.getObjects();

  for (var i = 0, len = this.size(); i < len; i++) {
    if (objects[i].name && objects[i].name === name) {
      object = objects[i];
      break;
    }
  }

  return object;
};

/**
 * Item name is non-unique
 */
fabric.Canvas.prototype.getItemsByName = function(name) {
  var objectList = [],
      objects = this.getObjects();

  for (var i = 0, len = this.size(); i < len; i++) {
    if (objects[i].name && objects[i].name === name) {
      objectList.push(objects[i]);
    }
  }

  return objectList;
};


