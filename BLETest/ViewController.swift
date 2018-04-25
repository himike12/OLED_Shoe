//
//  ViewController.swift
//  BLETest
//
//  Created by Adam Allard on 4/22/18.
//  Copyright © 2018 adamallard. All rights reserved.
//

import UIKit
import CoreBluetooth

class ViewController: UIViewController {

    @IBOutlet weak var btnScan: UIButton!
    @IBOutlet weak var btnWrite: UIButton!
    @IBOutlet weak var btnDisconnect: UIButton!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
 
    }

    @IBAction func btnScanClick(_ sender: UIButton) {
        manager.scanForPeripherals(withServices: nil, options: nil)
    }
 
    @IBAction func btnWriteClick(_ sender: UIButton) {
        if isMyPeripheralConected {
            let dataToSend: Data = "Data-To-Send".data(using: String.Encoding.utf8)!
            myBluetoothPeripheral.writeValue(dataToSend, for: myCharacteristic, type: CBCharacteristicWriteType.withoutResponse)
        } else {
            print("Not connected")
        }
    }
    
    @IBAction func btnDisconnectClick(_ sender: UIButton) {
        manager.cancelPeripheralConnection(myBluetoothPeripheral)
    }
    

}
