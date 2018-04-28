//
//  AppDelegate.swift
//  BLETest
//
//  Created by Adam Allard on 4/22/18.
//  Copyright © 2018 adamallard. All rights reserved.
//

import UIKit
import CoreBluetooth

var manager : CBCentralManager!
var myBluetoothPeripheral : CBPeripheral!
var myCharacteristic : CBCharacteristic!
var isMyPeripheralConected = false


@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, CBCentralManagerDelegate, CBPeripheralDelegate   {
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        manager = CBCentralManager(delegate: self, queue: nil)

        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
    }

    func applicationWillTerminate(_ application: UIApplication) {
    }


    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        var msg = ""
        
        switch central.state {
            case .poweredOff:
                msg = "Bluetooth is Off"
            case .poweredOn:
                msg = "Bluetooth is On"
            case .unsupported:
                msg = "Not Supported"
            default:
                msg = "Error"
        }
        
        print("STATE: " + msg)
    }
    
    
    func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
        print("Name: \(String(describing: peripheral.name))")
        
        if peripheral.name == "Shoes" {
            myBluetoothPeripheral = peripheral
            myBluetoothPeripheral.delegate = self
            
            manager.stopScan()
            manager.connect(myBluetoothPeripheral, options: nil)
            print("connected");
        }
    }
    
    
    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        isMyPeripheralConected = true
        peripheral.delegate = self
        peripheral.discoverServices(nil)
    }
    
    
    func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
        isMyPeripheralConected = false
    }
    
    
    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        if let servicePeripheral = peripheral.services as [CBService]? {
            for service in servicePeripheral {
                peripheral.discoverCharacteristics(nil, for: service)
            }
        }
    }
    
    
    func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
        if let characterArray = service.characteristics as [CBCharacteristic]? {
            for cc in characterArray {
                print("characeristic: " + cc.uuid.uuidString)
        
                if(cc.uuid.uuidString == "FFF1") {
                     myCharacteristic = cc
                    peripheral.readValue(for: cc)
                }
            }
        }
    }
    
    
    func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
        if (characteristic.uuid.uuidString == "FFF1") {
            let readValue = characteristic.value
            let value = (readValue! as NSData).bytes.bindMemory(to: Int.self, capacity: readValue!.count).pointee
            print (value)
        }
    }
    
    
    
}

