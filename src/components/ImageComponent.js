import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';  // 👈 Import to receive data
import './../App.css';
import { TruvideoSdkCamera } from 'truvideo-capacitor-camera-sdk';
// import { TruvideoSdkVideo } from 'truvideo-capacitor-video-sdk';
import { TruvideoSdkImage } from 'truvideo-capacitor-image-sdk'
import { toast } from 'react-toastify';

function ImageComponent() {
    const location = useLocation(); // 👈 get router state
    console.log("location.state" ,JSON.stringify( location.state));
    const { uploadedImages = [] } = location.state || {};

    console.log("uploadedImages" , uploadedImages) ;
    const [selectedImages, setSelectedImages] = useState([]);


    useEffect(() => {
        console.log("uploadedImages" ,uploadedImages); 
    
        TruvideoSdkCamera.addListener("cameraEvent", (event) => {
        console.log("Camera Event:", event.cameraEvent);
        });  
  }, []);


  async function editVideo() {
    if (!selectedImages[0]) return;

    try {
      const payload = {
        inputPath: selectedImages[0],
        outputPath: ""
      };
      const { result } = await TruvideoSdkImage.editImage(payload);
      console.log("Edit Video Response:", result);
      toast.success('Edit successful!');
    } catch (error) {
      console.error("❌ Failed to Edit Video:", error);
      toast.error('Edit Failed!');
    } finally {
      setSelectedImages([]);
    }
  }

  const handleCheckboxChange = (url) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(url)
        ? prevSelected.filter((item) => item !== url)
        : [...prevSelected, url]
    );
  };
  return (
    <div className="video-list">
      {uploadedImages.length > 0 ? (
        <>
        {uploadedImages.map((url, index) => (
            <div key={index} className="video-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <input
                type="checkbox"
                checked={selectedImages.includes(url)}
                onChange={() => handleCheckboxChange(url)}
                style={{ marginRight: '10px' }}
              />
              <span>{url}</span>

            </div>
          ))}

          {/* Action Buttons */}
          <div style={{ marginTop: '20px' }}>
            <button disabled={selectedImages.length === 0} style={{ marginRight: '10px' }} onClick={() => editVideo()}>
              Edit Video
            </button>
           
          </div>
        </>
      ) : (
        <p>No videos available.</p>
      )}
    </div>
  );
}

export default ImageComponent