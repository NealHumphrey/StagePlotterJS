
window.onload = function() {

var stage = new fabric.Canvas('stage');
	stage.selection = false; 				//need to disable grouping so that connector lines work. Future upgrade - handle logic to make connector lines draggable.
var prep = new fabric.Canvas('prep');
	prep.selection = false; 				//prep area should just be buttons, no need to group objects. 


//Make a new type of rectangle with text in it (not editable text)
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
	    ctx.font = '18px Helvetica';
	    ctx.fillStyle = '#333';
	    var wordwidth = ctx.measureText(this.get('label'),1).width;
	    ctx.fillText(this.label, -wordwidth/2, -this.height/2 + 18);
	  }
});
fabric.LabeledRect.fromObject = function(options) {
          return new fabric.LabeledRect(options);
        }


/*
*Tried making an editable text class with more colored background padding... didn't work
fabric.EditableRect = fabric.util.createClass(fabric.IText, {
	type: 'editableRect',
	initialize: function(options) {
	    options || (options = { });
	    this.callSuper('initialize', options);
	    this.set('textPadding', options.textPadding || 10);
	  },
	  toObject: function() {
	    return fabric.util.object.extend(this.callSuper('toObject'), {
	      textPadding: this.get('textPadding')
	    });
	  },
	  _render: function(ctx) {
	    this.callSuper('_render', ctx);
	   //if(this.backgroundColor) {
	   	ctx.save();
      	ctx.fillStyle = '#35586C';
		    ctx.fillRect(
		        this._getLeftOffset()-10,
		        this._getTopOffset()-5,
		        this.width +20,
		        this.height +10
	      	);
	    ctx.restore();
		//}
		
	  }
});
fabric.EditableRect.fromObject = function(options) {
          return new fabric.EditableRect(options);
        }
*/




//Store all the object properties in one place
var library = {
	prepProperties: {
		selectable: false,		//Allows user to move
		left: 10,				//location on canvas
	},

	stageProperties: {
		left: 100,
		top: 50,
		selectable: true,		//Allows user to move
		lockScalingX: true,
		lockScalingY: true,
		hasBorders: true,
		hasControls: true,
		hasRotatingPoint: true,
		cornerSize:10,
		transparentCorners:false,
		padding: 10, //padding between object and controls
		originX: 'center',
		originY: 'center',
		//individual controlling corners option are a function, set on load
	},

	diBox: {
		label: 'DI',
		fill: 'gray',
		width: 40,
		height: 25,
		hoverCursor: "Yo",
		opacity: 1,
		rx: 3, 				//radius of corner
		ry: 3,				//radius of corner
	},

	text: {
		fill: '#AEEEEE', 
		width:130, 
		height:50, 
		backgroundColor: '#35586C',
		fontFamily:'Arial', 
		fontSize: 18,
		textAlign: 'center',
	},

	line: {
		stroke: '#333',
		strokeWidth: 3,
		selectable: false,
		opacity: .6,
	},

	connector: {
		left: 0,
		top: 0,
		strokeWidth: 3,
		radius: 5,
		fill: '#fff',
		stroke: '#666',
		hasControls: false,
		hasBorders: true,
		padding: 10,
		opacity: 1,
		originX: 'center',
		originY: 'center',
	},

	ampSVGsrc: 'svg/amp_nick_bluth.svg',
	micSVGsrc: 'svg/microphone_josh_vasby.svg',
	monitorSVGsrc: 'svg/speaker_iconoci_rotated.svg',
	speakerSVGsrc: 'svg/speaker_iconoci.svg',
	drumSVGsrc: 'svg/drum_parkjisun.svg',

};


//Add all the shapes to the prep area
//TODO - would be cleaner to create a function to do SVGs and Shapes by passing array of objects and top locations....
var SVG = {};
var itemsWithConnectors = [];


var text = new fabric.IText("Musician Name\n(instrument)",library.text).set($.extend({},library.prepProperties,{top:10, addConnector: false}));			//TODO change back to IText
prep.add(text);

var diBox = new fabric.LabeledRect(library.diBox).set($.extend({},library.prepProperties,{top:75, addConnector: true}));			//use jQuery .extend to overwrite only the 'top' property
prep.add(diBox);

loadSVG(library.ampSVGsrc,'speaker',125,true);
loadSVG(library.micSVGsrc,'mic',200,true);
loadSVG(library.monitorSVGsrc,'monitor',275,false);
loadSVG(library.speakerSVGsrc,'speaker',350,false);
loadSVG(library.drumSVGsrc,'drum',425,false);

stage.renderAll();
prep.renderAll();



function loadSVG(src,name,top,addConnector) {
	fabric.loadSVGFromURL(src,
		function(objects,options) {
    		var obj = fabric.util.groupSVGElements(objects, options);
 			obj.set($.extend({},library.prepProperties,{top:top}));
 			obj.addConnector = addConnector;
	 		prep.add(obj);
	 		SVG[name] = obj;
		});
};

function makeConnector(left, top, lineEndObj) {
	var c = new fabric.Circle($.extend({},library.connector,{left: left, top:top}));
	c.lineEndObj = lineEndObj;
	return c;
}

function makeLine(coords) {
	return new fabric.Line(coords, library.line);
}

function addConnector(obj,canvas,offsetX,offsetY) {
	offsetX = (typeof offsetX === 'undefined') ? 25 : offsetX;
	offsetY = (typeof offsetX === 'undefined') ? 25 : offsetY;
	//TODO add if statement here to make sure obj is already on canvas

	var line = makeLine([obj.get('left'),obj.get('top'),obj.get('left')+ offsetX, obj.get('top') + offsetY]);
	var connector = makeConnector(line.get('x2'), line.get('y2'),line);
	obj.lineStartObj = line;

  	stage.add(line, connector);
  	stage.bringToFront(obj);
}

function getConnectorForLine(line){
	var objects = stage.getObjects()
	for(var i=0; i < objects.length; i++) {
		if(objects[i].lineEndObj === line) {
			return objects[i];
		}
	}
	return null;
}


//Click 'prep' shape to duplicate on the stage
prep.on('mouse:down', function(options){
	if(options.target) {
		if (fabric.util.getKlass(options.target.type).async) {  //TODO getKlass has optional second argument of namespace
		 	options.target.clone(function (obj) {
			    obj.set(library.stageProperties);
			    obj.setControlsVisibility({bl:false, br:false,mb:false,ml:false, mr:false, mt:false, tl:false, tr:false, mtr:true}); //Only allow rotation, so only show rotation control box.
			    stage.add(obj);
			    if (options.target.addConnector){	//this will need to be changed when saving function is added.
			    	addConnector(obj,stage,50,50);
				}
		  	});
		}
		else {
			var obj = options.target.clone().set(library.stageProperties);
			obj.setControlsVisibility({bl:false, br:false,mb:false,ml:false, mr:false, mt:false, tl:false, tr:false, mtr:true});
		  	stage.add(obj);
		  	if (obj.type!=='i-text'){
		  		addConnector(obj,stage,50,50);
		  	}
		}
	}
});


stage.on('object:moving', function(e) {
    var p = e.target;
    	if(p.lineEndObj){	//if it's a connector, adjust x2 and y2
    		p.lineEndObj.set({ 'x2': p.left, 'y2': p.top });
    	}
    	else if(p.lineStartObj){					//if it's an object, adjust x1 and y1
    		p.lineStartObj.set({ 'x1': p.left, 'y1': p.top });
    	}
    stage.renderAll();
  });


//listen for delete keys
var deleteObject = function(e) {
  if (46 === e.keyCode || 8 === e.keyCode) {
  		e.preventDefault();
		var obj = stage.getActiveObject();
		if(obj) {
			obj.remove();
			var line = obj.lineStartObj;
		}
		if(line){
			var connector = getConnectorForLine(line);
		}
		if(line){
			line.remove();
		}
		if(connector){
			connector.remove();
		}
	}
};

//Apply the listener to a wrapper so that we can appropriately distinguish between editing text and deleting objects
var canvasWrapper = document.getElementById('canvasWrap');
canvasWrapper.tabIndex = 1000;
canvasWrapper.addEventListener("keydown", deleteObject, false);
canvasWrapper.style.outline = "none";

};//.onload
