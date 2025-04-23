import { useEffect, useState } from 'react';
import './../css/App.css';
import './../css/home.css'
import { TruvideoSdkCamera, TruvideoSdkCameraLensFacing } from 'truvideo-capacitor-camera-sdk';
import { TruVideoSdkCore } from 'truvideo-capacitor-core-sdk';
import { TruvideoSdkMedia } from 'truvideo-capacitor-media-sdk'
import { useHistory } from 'react-router-dom';

function HomeComponent() {
  const [isAuthenticatedLoader, setIsAuthenticatedLoader] = useState(false);
  const [value1, setValue1] = useState();
  const [authenticationValue, setAuthenticationValue] = useState();
  const [isUploaded, setIsUploaded] = useState();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const history = useHistory();

  // Listeners 
  useEffect(() => {
    TruvideoSdkCamera.addListener("cameraEvent", (event) => {
      console.log("Received Camera Event:", event.cameraEvent);
    });
    const onUploadProgress = TruvideoSdkMedia.addListener("onProgress", (event) => {
      console.log(`⏳ Upload Progress: ${event.progress}% for file ${event.id}`);
    });

    const onUploadError = TruvideoSdkMedia.addListener("onError", (event) => {
      console.error(`❌ Upload Error for file ${event.id}:`, event.error);
    });
    const onUploadComplete = TruvideoSdkMedia.addListener("onComplete", (event) => {
      console.log(`Upload Complete for fileeventn  ${event.id}:`, event)
    });

    return () => {
      console.log("🧹 Removing upload event listeners...");
      onUploadProgress.remove();
      onUploadError.remove();
      onUploadComplete.remove();
    };
  }, []);

  useEffect(() => {
    auth();
    const savedImages = JSON.parse(sessionStorage.getItem('uploadedImages') || '[]');
    const savedVideos = JSON.parse(sessionStorage.getItem('uploadedVideos') || '[]');

    setUploadedImages(savedImages);
    setUploadedVideos(savedVideos);
  }, [])


  async function auth() {
    try {
      setIsAuthenticatedLoader(true);
      console.log("Mode", TruvideoSdkCamera.Mode.VIDEO_AND_PICTURE)

      const isAuth = await TruVideoSdkCore.isAuthenticated();

      // Check if authentication token has expired
      const isAuthExpired = await TruVideoSdkCore.isAuthenticationExpired();
      console.log('isAuthExpired', isAuthExpired.isAuthenticationExpired);
      //generate payload for authentication
      const payload = await TruVideoSdkCore.generatePayload();
      const pay = String(payload.generatePayload);
      const apiKey = "EPhPPsbv7e";
      const secretKey = "9lHCnkfeLl";

      const signature = await TruVideoSdkCore.toSha256String({
        secretKey: secretKey,
        payload: pay
      });
      setValue1(signature.signature);
      const externalId = "";
      // Authenticate user
      if (!isAuth.isAuthenticated || isAuthExpired.isAuthenticationExpired) {
        await TruVideoSdkCore.authenticate({
          apiKey: apiKey,
          payload: pay,
          signature: signature.signature,
          externalId: externalId
        });
      }
      console.log('isAuth', isAuth.isAuthenticated);
      // If user is authenticated successfully
      const initAuth = await TruVideoSdkCore.initAuthentication();
      setIsAuthenticatedLoader(false);
      setAuthenticationValue("Authentication Successfull");
      console.log('initAuth', initAuth.initAuthentication);
    } catch (error) {
      setAuthenticationValue("Authentication failed");
      console.log('error', error);
    }

  }

  const secretKey = {
    lensFacing: TruvideoSdkCamera.LensFacing?.Front || "front",
    flashMode: TruvideoSdkCamera.FlashMode?.Off || "off",
    orientation: TruvideoSdkCamera.Orientation?.Portrait || "portrait",
    outputPath: "",
    frontResolutions: [],
    frontResolution: null,
    backResolutions: [],
    backResolution: null,
    mode: TruvideoSdkCamera.Mode.VideoAndPicture || "videoAndPicture"

  };

  const formattedSecretKey = {
    ...secretKey,
    lensFacing: String(secretKey.lensFacing),
    flashMode: String(secretKey.flashMode),
    orientation: String(secretKey.orientation),
    mode: String(secretKey.mode)
  };


  async function openCamera() {
    try {
      const jsonString = JSON.stringify(formattedSecretKey);
      console.log("📤 Opening Camera :", jsonString);
      let mediaItems = []

      const response = await TruvideoSdkCamera.initCameraScreen({ configuration: jsonString });
      console.log("📸 Captured Image Path:", response);
      const resultData = response.result;
      console.log("📸 resultData :", response.result);
      if (typeof resultData === "string") {
        try {
          mediaItems = JSON.parse(resultData);
          console.log("✅ Parsed mediaItems:", mediaItems.result);
        } catch (error) {
          console.error("❌ Failed to parse response.result:", error);
        }
      } else if (Array.isArray(resultData)) {
        mediaItems = resultData;
      }
      console.log("media Items ", mediaItems);

      const tag = {
        key: "value",
        color: "red",
        orderNumber: "123"
      };
      const metaData = {
        key: "value",
        key1: 1,
        key2: [4, 5, 6]
      };
      const videoUrls = [];
      const imageUrls = [];
      const mediaUrls = [];
      if (Array.isArray(mediaItems)) {
        for (const item of mediaItems) {
          try {
            if (!item?.filePath) {
              console.warn("Skipping item without filePath:", item);
              continue;
            }
             const payload = {
              filePath: item.filePath,
              tag: JSON.stringify(tag),
              metaData: JSON.stringify(metaData),
            };

            const uploadMediaResponse = await TruvideoSdkMedia.uploadMedia(payload);

            console.log("uploadMedia Response (full):", JSON.stringify(uploadMediaResponse, null, 2));

            //Now get the remoteUrl
            const url = item?.filePath;
            const type = item?.type;

            if (url) {
              if (type === "VIDEO") {
                videoUrls.push(url);
              } else if (type === "PICTURE" || type === "IMAGE") {
                imageUrls.push(url);
              } else {
                console.warn("Unknown media type:", type);
              }
              mediaUrls.push(url); 
            } else {
              console.error("❌ Upload failed", uploadMediaResponse);
            }
          } catch (uploadError) {
            console.error("❌ Upload failed for:", item.filePath, uploadError);
          }
        }
        setIsUploaded("Upload Success")
        console.log("Video URLs:", videoUrls);
        console.log("Image URLs:", imageUrls);
        setUploadedVideos(videoUrls);
        setUploadedImages(imageUrls)

        
        // Setting up Images 
        const previousImages = JSON.parse(sessionStorage.getItem('uploadedImages') || '[]');
        const updatedImages = [...previousImages, ...imageUrls];
        setUploadedImages(updatedImages);
        sessionStorage.setItem('uploadedImages', JSON.stringify(updatedImages));
        
        // Setting up Videos
        const previousVideos = JSON.parse(sessionStorage.getItem('uploadedVideos') || '[]');
        const updatedVideos = [...previousVideos, ...videoUrls];
        setUploadedVideos(updatedVideos);
        sessionStorage.setItem('uploadedVideos', JSON.stringify(updatedVideos));

      } else {
        console.error("❌ Camera Upload Failed: mediaItems is not an array.");
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  }

  const handleImageClick = () => {
    if (uploadedImages.length > 0) {
      history.push('/image', {
        uploadedImages: uploadedImages
      });
    }
  }

  const handleVideoClick = () => {
    if (uploadedVideos.length > 0) {
      history.push('/video', {
        uploadedVideos: uploadedVideos
      });
    }
  }

  return (
    <div className="container">
      <h1 className="title">Hello Devs</h1>

      {/* Inline Loader */}
      {isAuthenticatedLoader ? (
        <div className="inline-loader">
          <div className="loader" />
          <span style={{ marginLeft: 10, marginBottom: 40 }}>Authenticating...</span>
        </div>
      ) :
        <h2 className="subtitle">{authenticationValue}</h2>
      }

      <div className="button-wrapper">
        <button className="button" onClick={openCamera}>📷 Camera</button>
      </div>
      <div className="button-wrapper">
        <button className="button" onClick={handleImageClick}>🖼️ Image</button>
      </div>
      <div className="button-wrapper">
        <button className="button" onClick={handleVideoClick}>🎥 Video</button>
      </div>

    </div>
  );
}

export default HomeComponent;
