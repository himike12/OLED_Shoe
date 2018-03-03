#include <Adafruit_GFX.h>
#include "PL_microEPD.h"
#include "imageData.h"
#include <BLEPeripheral.h>
#include "BLESerial.h"

#define VERSION_NUMBER 1.0

#define EPD_RST     A4      // Please align with your individual wiring
#define EPD_BUSY    A5      // Please align with your individual wiring
#define EPD_CS      10
PL_microEPD display(EPD_CS, EPD_RST, EPD_BUSY); 
int i=0;
int led = 6;
int led2 = 7;

// define pins (varies per shield/board)
#define BLE_REQ   10
#define BLE_RDY   2
#define BLE_RST   9

// create ble serial instance, see pinouts above
BLESerial BLESerial(BLE_REQ, BLE_RDY, BLE_RST);


String recievedLine = "";

void setup() {

    // First setup the screen and display the Bioworld logo at boot
    SPI.begin();                            // Bus initialisation, UC8156 supp. max 10Mhz (writing)
    SPI.beginTransaction(SPISettings(500000, MSBFIRST, SPI_MODE0));//and 6.6Mhz (reading)

    pinMode(led, OUTPUT);   
    pinMode(led2, OUTPUT);
    digitalWrite(led, HIGH); 
    digitalWrite(led2, HIGH); 

    // Mark the begining of the program by flashing an LED
    digitalWrite(led, LOW);
    delay(100); 
    digitalWrite(led, HIGH);
    delay(100); 
    digitalWrite(led, LOW);

    // Paperino ePaper initialisation and refresh screen 
    display.begin();

    // Display version number
    display.setCursor(1,1);                 // Set Cursor start position 
    display.println(VERSION_NUMBER);

    delay(500);
    // Draw the bitmap:
    // drawBitmap(x position, y position, bitmap data, bitmap width, bitmap height, color)
    display.drawBitmap(0, 0, BioworldLogo, 312, 74, EPD_BLACK);
    // Trigger a full image update
    display.update();
    
    
    // Start the bluetooth service
    // custom services and characteristics can be added as well
    BLESerial.setLocalName("UART");
    BLESerial.begin();

    // Mark the end of the boot by turning off the LED
    digitalWrite(led, HIGH);
    
}

void loop() {
  BLESerial.poll();

  getBluetoothData();
}


// Returns the data recieved from bluetooth as a string
void getBluetoothData() {

    digitalWrite(led2, LOW);
    
    // Get data from bluetooth
    if (BLESerial) {
        int byte;
        recievedLine = "";
        while ((byte = BLESerial.read()) > 0) {
            // Add each new character to the end of the string
            recievedLine += (char)byte;
            // If newline character, return the string
            if((char)byte == '\n') {
                digitalWrite(led2, HIGH);
                selectMode();
            }
        }
    }
}

// Recieves string, which is the data recieved from bluetooth and determines the mode function to go to
void selectMode() {
  char recievedData[20] = "";
  strcpy(recievedData, recievedLine.c_str());

  switch(recievedData[0]) {
    case '0':
      displayVersionNumber();
      break;
    case '1':
      displayProgrammedImage(recievedData[1]);
      break;
    case '2':
      displayText(recievedData);
      break;
    case '3':
      loopImages(recievedData[1]);
      break;
    default:
      display.clear();
      display.setCursor(1,1);
      display.println("Invalid Mode Number");
      display.update();
  }
}

// Dispaly the version number of the software on the screen (Mode 0)
void displayVersionNumber() {
  display.clear();
  display.setCursor(1,1);
  display.print("Version: ");
  display.print(VERSION_NUMBER);
  display.update();
}

// Display the image specified after the mode number (Mode 1)
void displayProgrammedImage(char imageNumChar) {
  switch(imageNumChar) {
    case '0':
      display.clear();
      display.drawBitmap(0, 0, gramophoneLGray, 312, 74, EPD_LGRAY);
      display.drawBitmap(0, 0, gramophoneDGray, 312, 74, EPD_DGRAY);
      display.drawBitmap(0, 0, gramophoneBlack, 312, 74, EPD_BLACK);
      display.update();
      break;
    case '1':
      display.clear();
      display.drawBitmap(0, 0, MountainsLGray, 312, 74, EPD_LGRAY);
      display.drawBitmap(0, 0, MountainsDGray, 312, 74, EPD_DGRAY);
      display.drawBitmap(0, 0, MountainsBlack, 312, 74, EPD_BLACK);
      display.update();
      break;
    case '2':
      display.clear();
      display.drawBitmap(0, 0, BarnLGray, 312, 74, EPD_LGRAY);
      display.drawBitmap(0, 0, BarnDGray, 312, 74, EPD_DGRAY);
      display.drawBitmap(0, 0, BarnBlack, 312, 74, EPD_BLACK);
      display.update();
      break;
    case '3':
      display.clear();
      display.drawBitmap(0, 0, A380LGray, 312, 74, EPD_LGRAY);
      display.drawBitmap(0, 0, A380DGray, 312, 74, EPD_DGRAY);
      display.drawBitmap(0, 0, A380Black, 312, 74, EPD_BLACK);
      display.update();
      break;
    case '4':
      display.clear();
      display.drawBitmap(0, 0, BioworldLogo, 312, 74, EPD_BLACK);
      display.update();
      break;
    default:
      display.clear();
      display.setCursor(1,1);
      display.println("Invalid Image Number");
      display.update();
  }
}

// Displays the text after the mode number (Mode 2)
void displayText(char recievedData[]){
  char text[20];
  int i;

  // Make a new char array but remove the first character (mode character)
  for(i = 0; i < 20; i++) {
    text[i] = recievedData[i + 1];
  }
  text[20] = '\0';

  // Display the text
  display.clear();
  display.setCursor(1,1);
  display.println(text);
  display.update();
}

// Loop and display all the images with a delay is second specified after the mode number(Mode 3)
void loopImages(char secDelayChar) {
  int secDelay = int(secDelayChar) - 48;
  int numImages = 4;
  int i;
  while(1){
    for(i = 0; i < numImages; i++) {
      displayProgrammedImage(i + 48);
      delay(secDelay *1000);
    }
  }
}



