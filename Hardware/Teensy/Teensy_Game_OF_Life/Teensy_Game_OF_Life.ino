/* ****************************************************************************************
   Test program for displaying images on the Plastic Logic ePaper displays
**************************************************************************************** */
#include <Adafruit_GFX.h>
#include "PL_microEPD.h"

#define XGRID 29
#define YGRID 14

#define EPD_RST     A4      // Please align with your individual wiring
#define EPD_BUSY    A5      // Please align with your individual wiring
#define EPD_CS      10
PL_microEPD display(EPD_CS, EPD_RST, EPD_BUSY); 

bool mainGrid[XGRID][YGRID];
bool editGrid[XGRID][YGRID];

void setup() {
  
  SPI.begin();                            // Bus initialisation, UC8156 supp. max 10Mhz (writing)
  SPI.beginTransaction(SPISettings(4000000, MSBFIRST, SPI_MODE0));//and 6.6Mhz (reading)

  // Paperino ePaper initialisation and refresh screen 
  display.begin();

  clearMainGrid();
  setInitialCells();
  drawGrid();
  display.update();
  delay(1000);
  displayMainGridCells();
  drawGrid();
  display.update(EPD_UPD_MONO);
  delay(1000);

}

void loop() {

  display.clear();
  applyRules();
  copyEditGridToMainGrid();
  drawGrid();
  displayMainGridCells();
  display.update();
  delay(1000);
  

}

// Clears the main grid
void clearMainGrid() {
  int i, j;
  for(i = 0; i < XGRID; i++) {
    for(j = 0; j < YGRID; j++) {
      mainGrid[i][j] = false;
    }
  }
}


// Sets the initial grid bits
void setInitialCells() {
  mainGrid[14][6] = true;
  mainGrid[14][7] = true;
  mainGrid[14][8] = true;

  mainGrid[5][5] = true;
  mainGrid[6][6] = true;
  mainGrid[7][4] = true;
  mainGrid[7][5] = true;
  mainGrid[7][6] = true;
}


// Draws the grid
void drawGrid() {
  int i, j;
  for(i = 0; i <= XGRID; i++) {
    display.drawLine(i*5, 0, i*5, YGRID*5 -5, EPD_LGRAY);
  }
  for(j = 0; j < YGRID; j++) {
    display.drawLine(0, j*5, XGRID*5, j*5, EPD_LGRAY);
  }
}


// Displays the cells in the main grid
void displayMainGridCells() {
  int i, j;
  for(i = 0; i < XGRID; i++) {
    for(j = 0; j < YGRID; j++) {
      if(mainGrid[i][j] == true) {
         display.fillRect(i*5, j*5, 5, 5, EPD_BLACK);
      }
    }
  }
}


// Apply the rules for game of life to the mainGrid
void applyRules() {
  int i, j, k, l;
  for(i = 0; i < XGRID; i++) {
    for(j = 0; j < YGRID; j++) {
      int neighbors = 0;

      // Check each possible neighbor and see if they are alive
      // If so, add 1 to neighbors for each cell alive 
      for(k = -1; k < 2; k++) {
        for(l = -1; l < 2; l++) {
          // check if valid index
          int x = i+k;
          int y = j+l;
          if(x >= 0 && y >= 0 && (x != i && y != j)) {
            // Add to neighbors if there is a neighbor that (x,y)
            if(mainGrid[x][y] == true) neighbors++;
          }
        }
      }

      // Apply the rules to the cell based on the value of neighbors
      if(mainGrid[i][j]) {  // if alive
        if(neighbors < 2 || neighbors > 3) {
          editGrid[i][j] = false; // check for overpopulation or underpopulation
        }
        else {
          editGrid[i][j] = true;
        }
      }
      else {  // if dead
        if(neighbors == 3) {
          editGrid[i][j] = true;
        }
        else {
          editGrid[i][j] = false;
        }
      }
    }
  }
}

void copyEditGridToMainGrid() {
  int i, j;
  for(i = 0; i < XGRID; i++) {
    for(j = 0; j < YGRID; j++) {
      mainGrid[i][j] = editGrid[i][j];
    }
  }
}

