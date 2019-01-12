
BUGS:

FEATURES:

    - reverse split direction (like from other side, allow changing corners)
    - Allow for < 1.0 ratios
    
    - use TypeScript .. to specify the classes and have some solid form !
    - use SASS
    - use GULP
    
    - add JSON export for the settings !! 
        (it would be nice if it could also store image path)
    - store settings in the browser cache to restore right away !
        
    - separate splits section from the base section .. now it's a little mess 
        - remove "splits" from the beggining of the fields to make them more readable
          just add some label to the whole section
          
    - allow to remove image
    - allow to set area color (when not image)
    - allow set exact dimensions for the area (when not image)
        - also export at that dimensions
        
    - allow option to copy SVG/bitmap into clipboard to super fast use in the PS or AD
    
    - Allow subdivision layering system ..
        - add big + button at the top left of the each sequence section to define a new layering
        - each layer is a split subdivision
        - you can set :
            - threshold
            - ratio
            - color 
            - direction
            - symmetry
            - pretty much anything that could generate another grid within the gird
    
    - Diagonal boxes intesection grid
    - Circle intersection grids
    - Special visualization points for diagonal intersections
    
    - Allow for more complex grid generation layering to achieve more complex results. 
    
    - Pixel aligment
    - Fixed canvas size with width & height in pixels
    - Allow for multiple image layers with opacity and basic transform, support PNG, JPG, GIF, SVG !
    
    - Export at Image dimensions 
    - Export PNG at custom resolution (or res. multiplier)
    - SVG Export settings
        - stroke size
        - stroke opacity
        - naming of the layers !
    
    - Improve UI 
        - docking / overlay
        - nice and big sliders
        - nice and readable text and values
        - allow for entering values directly
        - export settings into special CFG file
