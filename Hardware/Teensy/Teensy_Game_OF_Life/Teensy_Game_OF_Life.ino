/* ****************************************************************************************
   Test program for displaying images on the Plastic Logic ePaper displays
**************************************************************************************** */
#include <Adafruit_GFX.h>
#include "PL_microEPD.h"

#define XGRID 29
#define YGRID 14
#define NUM_RUNS 80
#define DELAY 400

#define EPD_RST     A4      // Please align with your individual wiring
#define EPD_BUSY    A5      // Please align with your individual wiring
#define EPD_CS      10
PL_microEPD display(EPD_CS, EPD_RST, EPD_BUSY); 

bool mainGrid[XGRID][YGRID];
bool editGrid[XGRID][YGRID];

int runs = 0;

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
  delay(DELAY);

}

void loop() {

  // Increment the number of runs
  runs++;

  // Restart the game after so many runs
  if(runs == NUM_RUNS){
    clearMainGrid();
    setInitialCells();
    runs = 0;
    display.update();
  }

  // Normal run opperation
  display.clear();
  applyRules();
  copyEditGridToMainGrid();
  displayMainGridCells();
  drawGrid();
  display.update(EPD_UPD_MONO);
  delay(DELAY);
  

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
  
//  // Blinker
  mainGrid[6][10] = true;
  mainGrid[6][11] = true;
  mainGrid[6][12] = true;

  // Glider
  mainGrid[8][7] = true;
  mainGrid[9][8] = true;
  mainGrid[10][6] = true;
  mainGrid[10][7] = true;
  mainGrid[10][8] = true;

  // Glider2
  mainGrid[14][11] = true;
  mainGrid[15][12] = true;
  mainGrid[16][10] = true;
  mainGrid[16][11] = true;
  mainGrid[16][12] = true;
 
  // Beacon
  mainGrid[0][0] = true;
  mainGrid[0][1] = true;
  mainGrid[1][0] = true;
  mainGrid[1][1] = true;
  mainGrid[2][2] = true;
  mainGrid[2][3] = true;
  mainGrid[3][2] = true;
  mainGrid[3][3] = true;

  // Pentadecathlon
  mainGrid[14][3] = true;
  mainGrid[14][4] = true;
  mainGrid[14][5] = true;
  mainGrid[15][2] = true;
  mainGrid[15][6] = true;
  mainGrid[16][1] = true;
  mainGrid[16][7] = true;
  mainGrid[18][0] = true;
  mainGrid[18][8] = true;
  mainGrid[19][0] = true;
  mainGrid[19][8] = true;
  mainGrid[23][3] = true;
  mainGrid[23][4] = true;
  mainGrid[23][5] = true;
  mainGrid[22][2] = true;
  mainGrid[22][6] = true;
  mainGrid[21][1] = true;
  mainGrid[21][7] = true;

  // Square
  mainGrid[27][12] = true;
  mainGrid[27][12] = true;
  mainGrid[28][13] = true;
  mainGrid[28][13] = true;

  // Glider Gun
//  mainGrid[1][6] = true;
//  mainGrid[1][7] = true;
//  mainGrid[2][6] = true;
//  mainGrid[2][7] = true;
//
//  mainGrid[11][6] = true;
//  mainGrid[11][7] = true;
//  mainGrid[11][8] = true;
//  mainGrid[12][5] = true;
//  mainGrid[12][9] = true;
//  mainGrid[13][4] = true;
//  mainGrid[13][10] = true;
//  mainGrid[14][4] = true;
//  mainGrid[14][10] = true;
//  mainGrid[15][7] = true;
//  mainGrid[16][5] = true;
//  mainGrid[16][9] = true;
//  mainGrid[17][6] = true;
//  mainGrid[17][7] = true;
//  mainGrid[17][8] = true;
//  mainGrid[18][7] = true;
//
//  mainGrid[21][4] = true;
//  mainGrid[21][5] = true;
//  mainGrid[21][6] = true;
//  mainGrid[22][4] = true;
//  mainGrid[22][5] = true;
//  mainGrid[22][6] = true;
//  mainGrid[23][3] = true;
//  mainGrid[23][7] = true;
//  mainGrid[25][2] = true;
//  mainGrid[25][3] = true;
//  mainGrid[25][7] = true;
//  mainGrid[25][8] = true;
//
//  mainGrid[35][4] = true;
//  mainGrid[35][5] = true;
//  mainGrid[35][4] = true;
//  mainGrid[35][5] = true;

  // Toad
  mainGrid[2][7] = true;
  mainGrid[3][7] = true;
  mainGrid[4][7] = true;
  mainGrid[1][8] = true;
  mainGrid[2][8] = true;
  mainGrid[3][8] = true;
  
}


// Draws the grid
void drawGrid() {
  int i, j;
  for(i = 0; i <= XGRID; i++) {
    display.drawLine(i*5, 0, i*5, YGRID*5, EPD_LGRAY);
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
          if(x >= 0 && y >= 0) {
            // Add to neighbors if there is a neighbor at (x,y)
            if(mainGrid[x][y] == true) neighbors++;
          }
        }
      }
      if(mainGrid[i][j] == true) neighbors--;

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
  memcpy(mainGrid, editGrid, XGRID*YGRID*sizeof(bool));
}

