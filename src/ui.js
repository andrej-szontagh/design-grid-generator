
var unique_id = 1;

function uiGenerateColors (colors) {
    
    var p = document.getElementById ("control-panel");

    // create new div container for this section ..
    
    var container = document.createElement ("div");

    container.className = "colors";
    
    p.appendChild (container);
    
    p = container;
    
    uiSlider (p, "base_hue",                0,      360,    1,      colors.base_hue,                function (v) { colors.base_hue                  = v; });
    uiSlider (p, "base_saturation",         0,      100,    1,      colors.base_saturation,         function (v) { colors.base_saturation           = v; });
    uiSlider (p, "base_lightness",          0,      100,    1,      colors.base_lightness,          function (v) { colors.base_lightness            = v; });
    uiSlider (p, "base_opacity",            0,      100,    1,      colors.base_opacity,            function (v) { colors.base_opacity              = v; });
    
    uiSlider (p, "splits_hue",              0,      360,    1,      colors.splits_hue,              function (v) { colors.splits_hue                = v; });
    uiSlider (p, "splits_hue_shift",        0,      360,    1,      colors.splits_hue_shift,        function (v) { colors.splits_hue_shift          = v; });
    uiSlider (p, "splits_saturation",       0,      100,    1,      colors.splits_saturation,       function (v) { colors.splits_saturation         = v; });
    uiSlider (p, "splits_saturation_shift", 0.1,    1.0,    0.01,   colors.splits_saturation_shift, function (v) { colors.splits_saturation_shift   = v; });
    uiSlider (p, "splits_lightness",        0,      100,    1,      colors.splits_lightness,        function (v) { colors.splits_lightness          = v; });
    uiSlider (p, "splits_lightness_shift",  0.1,    1.0,    0.01,   colors.splits_lightness_shift,  function (v) { colors.splits_lightness_shift    = v; });
    uiSlider (p, "splits_opacity",          0,      100,    1,      colors.splits_opacity,          function (v) { colors.splits_opacity            = v; });
    uiSlider (p, "splits_opacity_damping",  0.1,    1.0,    0.01,   colors.splits_opacity_shift,    function (v) { colors.splits_opacity_shift      = v; });
}

function uiGenerateSeq (seq) {
    
    var p = document.getElementById ("control-panel");

    // create new div container for this section ..
    
    var container = document.createElement ("div");

    container.className = "sequence";
    
    p.appendChild (container);
    
    p = container;

    // add UI elements
    
    // sequence general
    
    function getButtonValue (sym) {
    
        return (sym) ? "Symmetrical" : "Directional";
    }
    
    uiToggle (p, "symmetrical", "Mode", getButtonValue (seq.symmetrical), function (value) { 

        seq.symmetrical = !seq.symmetrical;
        
        draw ();
        
        return getButtonValue (seq.symmetrical);
    });
    
    // main subdivision
    
    uiSlider (p, "ratio",         1.0,    3.0,    0.0001, seq.ratio,  function (v) { seq.ratio = v; });
    uiSlider (p, "golden_ratio",  0,      3,      1,      0,          function (v) { 
    
        seq.ratio = GOLDEN_RATIO;
        
        for (var i = 0; i < v; i ++) {
        
            seq.ratio = Math.sqrt (seq.ratio);
        }
        
        setSliderValue (p, "ratio", seq.ratio);
    });
    
    uiSlider (p, "steps",     1, 50,  1,    seq.steps,  function (v) { seq.steps    = v; });
    uiSlider (p, "cutoff",  0.0, 0.5, 0.01, seq.cutoff, function (v) { seq.cutoff   = v; });
    
    // splits
    
    uiSlider (p, "splits_ratio",        1.0,    3.0,    0.0001, seq.splits_ratio,   function (v) { seq.splits_ratio = v; });
    uiSlider (p, "splits_golden_ratio", 0,      3,      1,      0,                  function (v) { 
    
        seq.splits_ratio = GOLDEN_RATIO;
        
        for (var i = 0; i < v; i ++) {
        
            seq.splits_ratio = Math.sqrt (seq.splits_ratio);
        }
        
        setSliderValue (p, "splits_ratio", seq.splits_ratio);
    });
    
    uiSlider (p, "splits_threshold",    0.0,    1.0,    0.001,  seq.splits_threshold,   function (v) { seq.splits_threshold     = v; });
    uiSlider (p, "splits_iterations",   0,      10,     1,      seq.splits_iterations,  function (v) { seq.splits_iterations    = v; });
    uiSlider (p, "splits_cutoff",       0.0,    0.1,    0.001,  seq.splits_cutoff,      function (v) { seq.splits_cutoff        = v; });
}

function uiSlider (parent, name, min, max, step, value, set_value) {
    
    var container       = document.createElement ("div");
    var container_info  = document.createElement ("div");
    
    container       .setAttribute ("class", "field-container");
    container_info  .setAttribute ("class", "field-container-info");
    
    var slider          = document.createElement ("input");
    var slider_label    = document.createElement ("div");
    var slider_value    = document.createElement ("div");

    slider.setAttribute ("type",    "range");
    slider.setAttribute ("class",   "slider");
    
    slider.setAttribute ("min",     toFloatNumberString (min));
    slider.setAttribute ("max",     toFloatNumberString (max));
    slider.setAttribute ("value",   toFloatNumberString (value));
    slider.setAttribute ("step",    toFloatNumberString (step));
    
    slider      .id   = "slider-" + name;
    slider      .name = "slider-" + name;
    slider_label.name = "slider-" + name + "-label";
    slider_value.name = "slider-" + name + "-value";
    
    slider_label.className = "field-label";
    slider_value.className = "field-value";
    
    slider_label.innerHTML = name.replace (/_/g, ' '); + " : ";
    
    container.appendChild (slider);
    container.appendChild (container_info);
    
    container_info.appendChild (slider_label);
    container_info.appendChild (slider_value);
    
    parent.appendChild (container);
    
    slider.value = value;
    
    slider_value.innerHTML = slider.value;
    
    slider.oninput = function () { 
    
        set_value (parseFloat (this.value));
    
        slider_value.innerHTML = this.value;
        
        draw ();
    }
}

function uiToggle (parent, name, label, value, callback) {

    var container       = document.createElement ("div");
    var container_info  = document.createElement ("div");
    
    container       .setAttribute ("class", "field-container");
    container_info  .setAttribute ("class", "field-container-info");
    
    var button          = document.createElement ("input");
    var button_label    = document.createElement ("label");
    var field_label     = document.createElement ("div");
    var field_value     = document.createElement ("div");

    name = "button-" + name;
    
    var id = name + unique_id ++;
    
    // container
    
    container.className = "field-container";
    
    // button
    
    button.setAttribute ("type", "button");
    button.setAttribute ("name",    name);    
    button.setAttribute ("id",      id);    
    button.className    = "button-invisible";
    
    // button label
    
    button_label.setAttribute ("for", id);
    
    // field
    
    field_label.innerHTML = label;
    field_label.classList.add ("field-label");
        
    field_value.innerHTML = value;
    field_value.classList.add ("field-value");
    
    // nodes
    
    container_info.appendChild (field_label);
    container_info.appendChild (field_value);
    
    button_label.appendChild (container_info);
    
    container.appendChild (button);
    container.appendChild (button_label);
        
    parent.appendChild (container);
    
    // actions
    
    button.onclick = function () { 
    
        // console.log ("toggle");
    
        field_value.innerHTML = callback (button.innerHTML);
    }
}

function uiButton (parent, name, label, callback) {

    var container       = document.createElement ("div");
    var button          = document.createElement ("input");

    name = "button-" + name;
    
    // container
    
    container.className = "field-container";
    
    // button
    
    button.setAttribute ("type", "button");
    
    button.setAttribute ("name",    name);    
    button.setAttribute ("id",      name);    
    button.className    = "button";
    button.value        = label;

    // nodes
    
    container.appendChild (button);
    
    parent.appendChild (container);
    
    // actions
    
    button.onclick = function () { 
    
        button.value = callback (button.value);
    }
}

function uiUploadButton (parent, name, label, reader, callback) {

    var container       = document.createElement ("div");
    var button          = document.createElement ("input");
    var button_label    = document.createElement ("label");

    name = "button-" + name;
    
    // container
    
    container.className = "field-container";
    
    // button
    
    button.setAttribute ("name",    name);    
    button.setAttribute ("id",      name);    
    button.setAttribute ("type",    "file");
    
    button.classList.add ("button");
    button.classList.add ("button-invisible");
    
    // button label
    
    button_label.setAttribute ("for", name);
    button_label.innerHTML = label;    
    button_label.className = "button";
    
    // nodes
    
    container.appendChild (button);
    container.appendChild (button_label);
    
    parent.appendChild (container);
    
    // actions
            
    button.addEventListener ('change', function () {
    
        var file = this.files [0];
        
        var r = file && reader.readAsDataURL (file); 
        
        if (r) {
        
            callback ();
        }
        
        return r;            
    });
}

function setSliderValue (parent, name, value) {

    var slider = parent.querySelector ('input[name="slider-' + name + '"]');
    
    slider.value = value;
    
    slider.oninput ();
}

function toFloatNumberString (num) { 

    if (Number.isInteger (num)) { 
    
        return num + ".0"
        
    } else {
    
        return num.toString (); 
    }
}    

function cssColorHSLA (h, s, l, a) {

    return "hsla(" + h + ", " + s + "%, " + l + "%, " + a + "%)";            
}
