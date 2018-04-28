//
//  SecondViewController.swift
//  BLETest
//
//  Created by Aakash on 4/25/18.
//  Copyright © 2018 adamallard. All rights reserved.
//

import UIKit

class SecondViewController: UIViewController , UINavigationControllerDelegate , UIImagePickerControllerDelegate {
    @IBAction func onSaveButton(_ sender: Any) {
        saveImage(imageName: "test.png")
    }
    @IBAction func onGalleryButton(_ sender: Any) {
        performSegue(withIdentifier: "gallerySegue", sender: self)
    }
    
    @IBOutlet weak var ImageView: UIImageView!
    override func viewDidLoad() {
        super.viewDidLoad()

        ImageView.backgroundColor = UIColor.lightGray
        // Do any additional setup after loading the view.
    }
    
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        dismiss(animated: true, completion: nil)
    }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        let selectedImage = info[UIImagePickerControllerOriginalImage] as! UIImage
        ImageView.image = selectedImage
        ImageView.contentMode = .scaleAspectFill
        
        dismiss(animated: true, completion: nil)
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        let controller = UIImagePickerController()
        controller.delegate = self;
        controller.sourceType = .photoLibrary
        
        present(controller, animated: true, completion: nil)
    }

    func saveImage(imageName: String){
        //create an instance of the FileManager
        let fileManager = FileManager.default
        //get the image path
        let imagePath = (NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0] as NSString).appendingPathComponent(imageName)
        //get the image we took with camera
        let image = ImageView.image!
        //get the PNG data for this image
        let data = UIImagePNGRepresentation(image)
        //store it in the document directory    fileManager.createFile(atPath: imagePath as String, contents: data, attributes: nil)
        fileManager.createFile(atPath: imagePath as String, contents: data, attributes: nil)
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
