//
//  GalleryViewController.swift
//  BLETest
//
//  Created by Aakash on 4/25/18.
//  Copyright © 2018 adamallard. All rights reserved.
//

import UIKit

class GalleryViewController: UIViewController {

    
    @IBOutlet weak var imageView: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        getImage(imageName: "test.png")
    }

    func getImage(imageName: String){
        let fileManager = FileManager.default
        let imagePath = (NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0] as NSString).appendingPathComponent(imageName)
        if fileManager.fileExists(atPath: imagePath){
            imageView.image = UIImage(contentsOfFile: imagePath)
        }else{
            print("Panic! No Image!")
        }
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
