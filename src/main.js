
var fileReader  = new FileReader ();

var img         = null;
var img_opacity = 1.0;

var view        = { x: 0.0, y: 0.0, s: 1.0 };

var area_w      = -1.0;
var area_h      = -1.0;

var colors = {
    
    base_hue:                   0,
    base_saturation:            100,
    base_lightness:             60,
    base_opacity:               100,
    base_css:                   "#000000",
    
    // splits
    splits_hue:                 0,
    splits_hue_shift:           0.0,
    splits_saturation:          100,
    splits_saturation_shift:    1.0,
    splits_lightness:           80,
    splits_lightness_shift:     1.0,
    splits_opacity:             50,
    splits_opacity_shift:       1.0 - GOLDEN_RATIO_INV,
    splits_css:                 "#000000",
    
    splitsStart: function () {
        
        return {
            
            h: colors.splits_hue % 360,
            s: colors.splits_saturation,
            l: colors.splits_lightness,
            o: colors.splits_opacity,
        };
    },
    
    splitsAdvance: function (c) {
        
        c.h = (c.h + colors.splits_hue_shift) % 360;
        
        c.s *= colors.splits_saturation_shift;
        c.l *= colors.splits_lightness_shift;
        c.o *= colors.splits_opacity_shift;
    },
}

var seq_horizontal = {
    
    stack:                          [],
    splits:                         [],
    
    // general
    cutoff:                         0.03,
    symmetrical:                    true,    

    // base
    ratio:                          GOLDEN_RATIO,
    steps:                          10,
    
    // splits
    splits_threshold:               0.05,
    splits_ratio:                   GOLDEN_RATIO,
    splits_iterations:              3,
    splits_cutoff:                  0.03,
};
    
var seq_vertical = {
    
    stack:                          [],
    splits:                         [],
    
    // general
    cutoff:                         0.03,
    symmetrical:                    true,    

    // base
    ratio:                          GOLDEN_RATIO,
    steps:                          10,
    
    // splits
    splits_threshold:               0.05,
    splits_ratio:                   GOLDEN_RATIO,
    splits_iterations:              3,
    splits_cutoff:                  0.03,
};

function updateColors (colors) {

    colors.base_css = cssColorHSLA (
        colors.base_hue, 
        colors.base_saturation, 
        colors.base_lightness, 
        colors.base_opacity);
        
    colors.splits_css = cssColorHSLA (
        colors.splits_hue, 
        colors.splits_saturation, 
        colors.splits_lightness, 
        colors.splits_opacity);
}

function updateSequence (seq) {

    var s = generateSequence (seq);

    seq.stack   = s.stack;
    seq.splits  = s.splits;
}

function updateArea (canvas) {
    
    // initialize area
    if (img !== null) {
    
        area_w = img.width;
        area_h = img.height;
        
    } else {
        
        area_w = canvas.width;
        area_h = canvas.height;
    }
}

function fitToView (canvas) {
    
    // scale to fit the canvas
    view.s = Math.min (
        canvas.width    / area_w, 
        canvas.height   / area_h);
    
    // center
    view.x = (canvas.width  - view.s * area_w) * 0.5;
    view.y = (canvas.height - view.s * area_h) * 0.5;
}

function draw () {

    // update colors
    updateColors (colors);

    // update sequences
    updateSequence (seq_horizontal);
    updateSequence (seq_vertical);
    
    var canvas      = document.getElementById ("canvas");
    var container   = document.getElementById ("canvas-container");
    
    if (null == canvas || !canvas.getContext) return;

    var ctx = canvas.getContext ("2d");
    
    // calculate canvas dimensions
    /*
    var cw = container.clientWidth;
    var ch = container.clientHeight;
    
    var nw = cw;
    var nh = ch;
    
    if (img !== null) {
        
        nw = img.width;
        nh = img.height;
    }
    
    var f = Math.min (cw / nw, ch / nh);

    canvas.width  = nw * f;
    canvas.height = nh * f;
    */

    canvas.width  = container.clientWidth;
    canvas.height = container.clientHeight;
    
    if (area_w < 0 || area_h < 0) {
        
        updateArea (canvas);
    }
    
    ctx.clearRect (0, 0, canvas.width, canvas.height);
    
    if (img !== null) {
    
        ctx.imageSmoothingEnabled = false;
        ctx.globalAlpha = img_opacity;
        ctx.drawImage (img, view.x, view.y, view.s * img.width, view.s * img.height);
        ctx.globalAlpha = 1.0;
        
    } else {
        
        ctx.fillStyle = 'rgb(25,25,25)';
        ctx.fillRect (view.x, view.y, view.s * area_w, view.s * area_h);
    }
    
    // BASE
    
    canvasDrawStackHoriz    (ctx, seq_horizontal.stack, view, area_w, area_h, colors.base_css);
    canvasDrawStackVert     (ctx, seq_vertical  .stack, view, area_w, area_h, colors.base_css);
    
    // SPLITS
    {
        var l = Math.max (
            seq_horizontal  .splits.length,
            seq_vertical    .splits.length);
            
        var c = colors.splitsStart ();
        
        for (var i = 0; i < l; i ++) {
            
            var css = cssColorHSLA (c.h, c.s, c.l, c.o);
            
            if (i < seq_horizontal.splits.length) {
                
                canvasDrawStackHoriz (ctx, seq_horizontal.splits [i], view, area_w, area_h, css);
            }
            
            if (i < seq_vertical.splits.length) {
                
                canvasDrawStackVert (ctx, seq_vertical.splits [i], view, area_w, area_h, css);
            }
            
            colors.splitsAdvance (c);
        }
    }    
}
    
function onload () {

    draw ();
    
    uiGenerateSeq (seq_vertical);
    uiGenerateSeq (seq_horizontal);
    
    uiGenerateColors (colors);
    
    // create new div container for this section ..
    
    var p = document.getElementById ("control-panel");
    
    var container = document.createElement ("div");

    container.className = "general";
    
    p.appendChild (container);
    
    p = container;
    
    // add UI elements
    
    uiButton (p, "export_svg", "Export SVG", function (value) { 
    
        downloadTextFile ("grid_export.svg", generateSVG (seq_horizontal, seq_vertical, colors, 1000, 1000));
        
        return value;
    });
    
    uiUploadButton (p, "import_bg", "Import Image", fileReader, function () { 

    });
    
    uiSlider (p, "image_opacity", 0.0, 1.0, 0.01, img_opacity, function (v) { img_opacity = v; });
    
    // EVENTS ..
            
    fileReader.onload = function (e) {
    
        if (img == null) {
            img = new Image ();
            
            img.onload = function () {
            
                updateArea  (canvas);
                fitToView   (canvas);
            
                draw ();
            };
        }            
    
        img.src = e.target.result;
    };
    
    // CANVAS EVENTS ..
    
    var canvas = document.getElementById ("canvas");
            
    // drop images right at the canvas ..
    
    canvas.addEventListener ('dragover', function (event) {
    
        event.preventDefault ();
    });

    canvas.addEventListener ('drop', function (event) {
    
        event.preventDefault ();
        
        fileReader.readAsDataURL (event.dataTransfer.files [0]);
    });
    
    // panning ..
    
    var body = document.getElementsByTagName ("BODY") [0];
    
    var dragging            = false;
    var dragging_start_x    = -1;    
    var dragging_start_y    = -1;
    var dragging_start_vx   = -1;
    var dragging_start_vy   = -1;
    
    function clampViewPos () {
        
        //view.x = Math.min (0.0, Math.max (-canvas.width     * (view.s - 1.0), view.x));
        //view.y = Math.min (0.0, Math.max (-canvas.height    * (view.s - 1.0), view.y));
    }
    
    canvas.addEventListener ("mousedown", function (event) {
        
        if (!dragging) {
            dragging = true;
            
            dragging_start_x    = event.clientX;
            dragging_start_y    = event.clientY;
            dragging_start_vx   = view.x;
            dragging_start_vy   = view.y;
            
            //console.log ("drag start");
        }
        
    }, false);
    
    body.addEventListener ("mousemove", function (event) {
        
        if (dragging) {
            
            view.x = dragging_start_vx + (event.clientX - dragging_start_x);
            view.y = dragging_start_vy + (event.clientY - dragging_start_y);
            
            clampViewPos ();
            
            draw ();
            
            //console.log ("dragging");
        }
        
    }, false);
    
    body.addEventListener ("mouseleave", function (event) {
        
        if (dragging) {
            dragging = false;

            //console.log ("mouseleave");
        }
        
    }, false);
    
    body.addEventListener ("mouseup", function (event) {
        
        if (dragging) {
            dragging = false;
            
            //console.log ("drag stop");
        }
        
    }, false);
    
    // zooming ..
     
    function handleMouseWheel (event) {
        
        // console.log ("event.deltaY : " + event.deltaY);
        
        var step    = 0.15;        
        var scale   = 1.0 + ((event.deltaY < 0) ? step : -step);
        
        var prev = view.s;

        var zoom = Math.max (0.1, Math.min (10.0, prev * scale));
        
        scale = zoom / prev; // adjust scale with clamp
        
        //if (zoom > 1.0) {
        
            view.s = zoom;
            
            var cw = canvas.width;
            var ch = canvas.height;
            
            focus_x = cw * 0.5;
            focus_y = ch * 0.5;
            
            prev_vector_x = view.x - focus_x;
            prev_vector_y = view.y - focus_y;
            
            view.x = focus_x + prev_vector_x * scale;
            view.y = focus_y + prev_vector_y * scale;
            
            clampViewPos ();
            
/*            
        } else {
            
            view.x = 0.0;
            view.y = 0.0;
            view.s = 1.0;
        }
*/        
        draw ();
        
        event.preventDefault ();
        
        return false; 
    }
    
    canvas.addEventListener ("DOMMouseScroll",  handleMouseWheel, false);   // for Firefox
    canvas.addEventListener ('wheel',           handleMouseWheel, false);    
    
    // CENTER VIEW
    
    canvas.addEventListener ("dblclick",  function (event) {

        updateArea  (canvas);
        fitToView   (canvas);
        
        draw ();
    
    }, false);
    
    // WINDOW EVENTS ..
    
    window.onresize = function (event) {
    
        updateArea (canvas);
    
        draw ();
    };
}
