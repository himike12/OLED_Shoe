# OLED_Shoe


This is the git repository for both the mobile application as well as the hardware design and code.

The Hardware file includes all of the files relating to the hardware design as well as the software for the embedded microcontroller.

Dependencies:

Linux
For 64-bit Linux users, libc6:i386, libstdc++6:i386, libncurses5:i386 and libudev1:i386 need to be installed :
  * sudo dpkg --add-architecture i386
  * sudo apt-get update
  * sudo apt-get -y install libc6:i386 libstdc++6:i386 libncurses5:i386 libudev1:i386
  
From the Library Manager:
  * Adafruit_GFX_Library
  * BLEPeripheral
  * PL_microEPD

Programmer:
  * CMSIS-DAP
