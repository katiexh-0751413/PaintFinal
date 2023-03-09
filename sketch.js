let c = "black";
let eraserMode = false;
let slider = 10; // initial size of pen and eraser
let colorPicker;
let saveImage;
let colors = ["black", "gray", "white", "red", "orange", "yellow", "green", "blue", "indigo", "violet"];
let saveButton;
let menuHeight = 60;
let previousState;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  // save state at beginning for blank canvas
  saveState();

  // Draw a black outline around the canvas
  noFill();
  stroke(200);
  strokeWeight(1);
  rect(0, 0, width, height);

  // Add a menu bar
  fill(230);
  rect(0, 0, width, menuHeight);

  // Add a "Save" button to the menu bar
  saveButton = createButton("Save");
  saveButton.position(width-55, 20);
  saveButton.class("button");
  saveButton.mousePressed(function() {
     // Create a new graphics object to hold the portion of the canvas we want to save
    let graphics = createGraphics(width, height-menuHeight);

    // Draw the portion of the canvas we want to save onto the graphics object
    graphics.image(get(0, menuHeight, width, height-menuHeight), 0, menuHeight);

    // Save the graphics object as a PNG file
    saveCanvas(graphics, 'myDrawing', 'png');
  });

  // Add a "Clear" button to the menu bar
  clearButton = createButton("Clear");
  clearButton.position(10, 5);
  clearButton.class("button");
  clearButton.mousePressed(function() {
    // Display a confirmation popup
    var confirmed = confirm("Are you sure you want to clear your drawing? This will erase all your previous work.");
    // If the user clicks "OK", clear the canvas
    if (confirmed) {
      // Clear only the area below the menu bar
      clearDrawing();
    }
  });

  // Add an "Undo" button to the menu bar
  undoButton = createButton("Undo");
  undoButton.position(10, 35);
  undoButton.class("button");
  undoButton.mousePressed(function() {
    undoToPreviousState();
  });

  // Add an "Eraser" button to the menu bar
  eraserButton = createButton("Eraser");
  eraserButton.position(85, 5);
  eraserButton.class("button");
  eraserButton.mousePressed(function() {
    eraserMode = true;
  });

  // Add a "Pen" button to the menu bar
  penButton = createButton("Pen");
  penButton.position(155, 5);
  penButton.class("button");
  penButton.mousePressed(function() {
      eraserMode = false;
    });

  // Add a color panel to the menu bar
  let startX = 220;
  let circleSize = 20;

  // Draw the color circles
  for (let i = 0; i < colors.length; i++) {
    let colorX = startX + (i * circleSize * 1.5);
    colorButton = createButton("");
    colorButton.position(colorX, 10);
    colorButton.style('background-color', colors[i]);
    colorButton.style('border-radius', '50%');
    colorButton.style('height', '20px');
    colorButton.style('width', '20px');
    colorButton.style('border', 'none');
    colorButton.class("button");
    colorButton.mousePressed(function() {
      eraserMode = false;
      colorButtonClicked(colors[i]);
    });
  }

  // Writing the colors text
  let pickerX = startX + (colors.length / 4 * circleSize * 1.5);
  stroke(0);
  strokeWeight(0.5);
  fill(100, 100, 100);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("Colors", pickerX + 70, 45);

  // Add a size slider to the menu bar
  slider = createSlider(1, 50, slider);
  slider.position(75, 30);
  textSize(8);
  text("Size", 147, 52);

  // Adding a color picker
  colorPicker = createColorPicker(c);
  colorPicker.position(550, 10);
  colorPicker.class("button");
  colorPicker.input(handleColorInput);
  textSize(10);
  text("Color Picker", 575, 50);

  // Draw line between clear button and slider
  let lineX = (clearButton.position().x + slider.position().x + clearButton.width) / 2;
  stroke(200);
  strokeWeight(1);
  line(lineX, 10, lineX, 50);

  // Draw line between slider and colors
  lineX = (slider.position().x + startX + slider.width) / 2;
  line(lineX, 10, lineX, 50);

  // Draw line between color panel and color picker
  lineX = (startX + (colors.length * circleSize * 1.35) + colorPicker.position().x) / 2;
  line(lineX, 10, lineX, 50);

  // Draw line between color picker and save button
  lineX = (colorPicker.position().x + saveButton.position().x) / 2;
  line(lineX, 10, lineX, 50);
}

function colorButtonClicked(buttonColor) {
  c = buttonColor;
  stroke(buttonColor);
}

function handleColorInput() {
  eraserMode = false;
  c = this.value();
}

function draw() {
  colorPicker.value(c);
  if (mouseIsPressed && mouseY > menuHeight + slider.value() / 2) { // Check if mouse is inside canvas
    if (eraserMode) {
      stroke(255); // Use white for eraser
    } else {
      stroke(c); // Use selected color for pen
    }
    line(mouseX, mouseY, pmouseX, pmouseY);
    // Set the stroke weight of the pen and eraser
    strokeWeight(slider.value());
  }
}

function clearDrawing() {
    // Clear only the area below the menu bar
    fill(255);
    stroke(200);
    strokeWeight(1);
    rect(0, menuHeight, width, height);
}

function keyPressed(e) {
  // check if the event parameter (e) has Z (keycode 90) and ctrl or cmnd
  if (e.keyCode == 90 && (e.ctrlKey || e.metaKey)) {
    undoToPreviousState();
  }
}

function undoToPreviousState() {
  // if previousState doesn't exist ie is null
  // return without doing anything
  if (!previousState) {
    return;
  }
  // else draw the previous state
  image(previousState, 0, menuHeight);
  // then set previous state to null
  previousState = null;
}

function mousePressed() {
  // the moment input is detect save the state
  saveState();
}

function saveState() {
  // save state by taking image of background below the menu bar
  previousState = get(0, menuHeight, width, height-menuHeight);
}