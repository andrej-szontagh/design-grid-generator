
function generateSVG (seq_horizontal, seq_vertical, colors, width, height) {
    
    var data = "";
    
    var w = width;
    var h = height;
    
    var s1 = '   ';
    var s2 = s1 + s1;
    var s3 = s2 + s1;
    var s4 = s3 + s1;
    var s5 = s4 + s1;
    
    var style, opacity, seq, color_css;
    
    style = 'style="fill-rule:evenodd; clip-rule:evenodd; stroke-linejoin:round; stroke-miterlimit:1.41421;"';
            
    data = data.concat ('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', "\n");
    //data = data.concat ('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', "\n");
    data = data.concat ('<svg id="grid" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" ' + style + ' version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/">', "\n");
    
    // container
    
    data = data.concat (s1 + '<g id="grid">', "\n");
    
    {
        // backplate
        
        style = 'style="stroke:black; stroke-width:1.0; fill:none;"';        
        
        data = data.concat (s2 + '<rect id="backplate" x="0" y="0" width="' + w + '" height="' + h + '" ' + style + '/>', "\n");

        // base grid
        
        color_css = cssColorHSLA (
            colors.base_hue,
            colors.base_saturation,
            colors.base_lightness, 
            100);
        
        opacity = colors.base_opacity * 0.01; // from percent to factor
    
        style = 'style=" stroke:' + color_css + '; stroke-width:1.0; opacity:' + opacity + ';"';
        
        data = data.concat (s2 + '<g id="base" ' + style + ' >', "\n");

        {        
            // horizontal
            seq     = seq_horizontal;
            data    = exportLines (data, seq.stack, w, h, "horizontal", s3, s1, "", true);
            
            // vertical
            seq     = seq_vertical;
            data    = exportLines (data, seq.stack, w, h, "vertical", s3, s1, "", false);
        }
        
        data = data.concat (s2 + '</g>', "\n");
        
        // splits
        
        data = exportSplits (data, seq_horizontal, seq_vertical, colors, w, h, s2, s1);
    }
    
    // end container
    data = data.concat (s1 + '</g>', "\n");
    
    // end SVG
    data = data.concat ('</svg>', "\n");
        
    return data;
}

function exportSplits (data, seq_h, seq_v, colors, w, h, intend, intend_step) {
    
    var l = Math.max (seq_h.splits.length, seq_v.splits.length);
    
    var c = colors.splitsStart ();
        
    for (var i = 0; i < l; i ++) {
        
        var color_css = cssColorHSLA (c.h, c.s, c.l, 100);
        
        var style = 'style=" stroke:' + color_css + '; stroke-width:1.0; opacity:' + (c.o * 0.01) + ';"';
        
        data = data.concat (intend + '<g id="level' + (i + 1) + '" ' + style + ' >', "\n");
        
        if (i < seq_h.splits.length) {
    
            data = exportLines (data, seq_h.splits [i], w, h, "horizontal", 
            
                intend + intend_step, 
                intend_step,             
                "",
                true
            );
        }
        
        if (i < seq_v.splits.length) {
    
            data = exportLines (data, seq_v.splits [i], w, h, "vertical", 
            
                intend + intend_step, 
                intend_step, 
                "",
                false
            );
        }
        
        colors.splitsAdvance (c);
        
        // dummy group to prevent Affinity Designer from 
        // collapsing parent group if it contains only one child group        
        data = data.concat (intend + intend_step + '<g></g>', "\n");        
        
        data = data.concat (intend + '</g>', "\n");        
    }
        
    return data;
}

function exportLines (data, stack, w, h, group_name, intend, intend_step, style, horizontal) {

    data = data.concat (intend + '<g id="' + group_name + '" ' + style + ' >', "\n");
    data = data.concat (
    
        (horizontal) ? 
        
            exportLinesH (stack, w, h, intend + intend_step, '') :
            exportLinesV (stack, w, h, intend + intend_step, '')
    );
    
    data = data.concat (intend + '</g>', "\n");
    
    return data;
}

function exportLinesH (values, w, h, intend, style) {
    
    var r = "";
    
    for (var i = 0; i < values.length; i ++) { 
    
        var y = values [i] * h;
    
        r = r.concat (intend + '<line x1="' + 0 + '" y1="' + y + '" x2="' + w + '" y2="' + y + '" ' + style + ' />\n');
    }
    
    return r;
}
    
function exportLinesV (values, w, h, intend, style) {
    
    var r = "";
    
    for (var i = 0; i < values.length; i ++) { 
    
        var x = values [i] * w;
    
        r = r.concat (intend + '<line x1="' + x + '" y1="' + 0 + '" x2="' + x + '" y2="' + h + '" ' + style + ' />\n');
    }
        
    return r;
}

function downloadTextFile (filename, text) {

    var element = document.createElement ('a');
    
    element.setAttribute ('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent (text));
    element.setAttribute ('download', filename);

    element.style.display = 'none';
    
    document.body.appendChild (element);    element.click ();
    document.body.removeChild (element);
}
