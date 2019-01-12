
function canvasDrawStackHoriz (ctx, stack, transform, w, h, style) {
    
    ctx.beginPath ();
    ctx.strokeStyle = style;
    
    for (var i = 0; i < stack.length; i ++) { 
    
        var y = stack [i] * h;
        
        ctx.moveTo (transform.x + 0*transform.s, transform.y + y*transform.s);  
        ctx.lineTo (transform.x + w*transform.s, transform.y + y*transform.s);
    }
    
    ctx.stroke ();
}
    
function canvasDrawStackVert (ctx, stack, transform, w, h, style) {
    
    ctx.beginPath ();
    ctx.strokeStyle = style;
    
    for (var i = 0; i < stack.length; i ++) { 
    
        var x = stack [i] * w;
    
        ctx.moveTo (transform.x + x*transform.s, transform.y + 0*transform.s);
        ctx.lineTo (transform.x + x*transform.s, transform.y + h*transform.s);
    }
    
    ctx.stroke ();
}
