
function stack_get (ratio, steps, cutoff) {

    var stack = [];
    
    if (ratio >= 1.0) {
    
        var t = 1.0;
        
        var sum = 0;
        
        var tmp = [];
        
        for (var i = 0; i < steps; i ++) {
        
            t *= ratio;
            
            sum += t;
            
            tmp.push (sum);
        }
        
        // normalize & filter
        for (var i = 0; i < steps; i ++) {
        
            var v = tmp [i] / sum;
        
            if (v >= cutoff) {
        
                stack.push (v);
            }
        }
    }
    
    return stack;
}

function stack_split (stack, threshold, ratio, cutoff) {

    var tmp     = [];
    var splits  = [];
    
    var prev = 0.0;
    
    for (var i = 0; i < stack.length; i ++) { 
    
        var next = stack [i];
        
        if (next != prev) {
    
            var w = Math.abs (next - prev);
            
            if (w > threshold) {
            
                w = w - (w / ratio);
                
                if (w >= cutoff) {

                    // add extra split value
                    tmp     .push (prev + w);
                    splits  .push (prev + w);
                }
            }
        }
        
        prev = next;
        
        tmp.push (next);
    }
        
    return { stack : tmp, splits: splits };
}

function stack_symmetrical (stack) {

    var tmp = [];
    
    for (var i = 0; i < stack.length; i ++) { 
    
        tmp.push (stack [i] * 0.5);
    }
    
    var t = 0.5;
    
    // for the splits we have to duplicate the last value if is not exactly in the center
    
    var last = stack [stack.length - 1];
    
    if (last < 1.0) {
        
        t += (1.0 - last) * 0.5;
        
        tmp.push (t);
    }
    
    for (var i = stack.length - 1; i > 0; i --) {
    
        t += (stack [i] - stack [i - 1]) * 0.5;
    
        tmp.push (t);
    }
    
    return tmp;
}

function generateSequence (sequence) {

    var stack   = stack_get (sequence.ratio, sequence.steps, sequence.cutoff);    
    var tmp     = stack.slice ();
    var splits  = [];
    
    // console.log ("stack > length : " + stack.length);
    
    for (var i = 0; i < sequence.splits_iterations; i ++) { 
    
        var r = stack_split (tmp, 
        
            sequence.splits_threshold, 
            sequence.splits_ratio, 
            sequence.splits_cutoff);
        
        tmp = r.stack;
        
        // console.log ("split_" + i + " > length : " + r.splits.length);
        
        splits.push (r.splits);
    }
    
    if (sequence.symmetrical) {
    
        stack = stack_symmetrical (stack);
        
        for (var i = 0; i < splits.length; i ++) {
            
            splits [i] = stack_symmetrical (splits [i]);
        }
    }
            
    return { stack: stack, splits: splits };
}

