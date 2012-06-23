/*
settings:
A sample file for setting JsEngine vars and game settings

Has to be loaded before main.js
*/

// Settings for the engine
var loopSpeed=30;
var loopsPerColCheck=2;

// Set number of layers
var layers=12;

// Set static layers (Static layers are layers that has to be manually redrawn)
// Use static layers as much as possible (for backgrounds and such), since non-static layers are ressource hungry.
var staticDepths=new Array(0,1,8,9);
var canvasResX=600;
var canvasResY=750;