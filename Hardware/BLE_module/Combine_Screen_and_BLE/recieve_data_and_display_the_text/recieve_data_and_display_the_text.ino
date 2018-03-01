#include <Adafruit_GFX.h>
#include "PL_microEPD.h"
#include "imageData.h"
#include <BLEPeripheral.h>
#include "BLESerial.h"

#define EPD_RST     A4      // Please align with your individual wiring
#define EPD_BUSY    A5      // Please align with your individual wiring
#define EPD_CS      10
PL_microEPD display(EPD_CS, EPD_RST, EPD_BUSY); 
int i=0;
int led = 6;

// define pins (varies per shield/board)
#define BLE_REQ   10
#define BLE_RDY   2
#define BLE_RST   9

// create ble serial instance, see pinouts above
BLESerial BLESerial(BLE_REQ, BLE_RDY, BLE_RST);

// Temp string to hold incomming data
    String recievedLine = "";


void setup() {

    // First setup the screen and display the Bioworld logo at boot
    SPI.begin();                            // Bus initialisation, UC8156 supp. max 10Mhz (writing)
    SPI.beginTransaction(SPISettings(500000, MSBFIRST, SPI_MODE0));//and 6.6Mhz (reading)

    pinMode(led, OUTPUT);   

    // Mark the begining of the program by flashing an LED
    digitalWrite(led, HIGH);
    delay(100); 
    digitalWrite(led, LOW);    

    // Paperino ePaper initialisation and refresh screen 
    display.begin();

    // Display version number
    display.setCursor(1,1);                 // Set Cursor start position 
    display.println("0.04");
    display.println(BLE_ATTRIBUTE_MAX_VALUE_LENGTH);

    // Draw the bitmap:
    // drawBitmap(x position, y position, bitmap data, bitmap width, bitmap height, color)
    display.drawBitmap(0, 0, BioworldLogo, 312, 74, EPD_BLACK);
    // Trigger a full image update
    display.update();
    
    // Mark the end of the program by turning on the LED
    digitalWrite(led, HIGH);

    // Start the bluetooth service
    // custom services and characteristics can be added as well
    BLESerial.setLocalName("UART");
    BLESerial.begin();
}

void loop() {
  BLESerial.poll();

  getBluetoothData();
}


// Forward received data from bluetooth to be displayed on the screen
void getBluetoothData() {
    

    // Get data from bluetooth
    if (BLESerial) {
        int byte;
        while ((byte = BLESerial.read()) > 0) {
            recievedLine += (char)byte;
                // If newline character, print the text on the screen and empty the string
            if((char)byte == '\n') {
                display.clear();                        // Clear the image buffer
                display.setCursor(1,1);                 // Set Cursor start position 
                display.println(recievedLine.c_str());
                //recievedLine = "";
                // Trigger a full image update
                display.update();
            }
        }
    }
}
