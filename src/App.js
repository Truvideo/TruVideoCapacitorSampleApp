import { useEffect, useState } from 'react';
import './App.css';
import { TruvideoSdkCamera } from 'truvideo-capacitor-camera-sdk';
import { TruVideoSdkCore } from 'truvideo-capacitor-core-sdk';
import { TruvideoSdkMedia } from 'truvideo-capacitor-media-sdk'
function App() {
  const [value, setValue] = useState();
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();
  const[isUploaded, setIsUploaded] = useState(); 
  const[uploadedImages, setUploadedImages] = useState([]); 
  const [isAuthenticationExpire, setIsAuthenticationExpire] = useState(true);
  const [testIosPlugin, setTestIosPlugin]  = useState(false); 

  useEffect(() => {
    console.log("uploadedImages" ,uploadedImages); 
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
        console.log(`✅ Upload Complete for file ${event.id}:`, event.response);
    });

    return () => {
        console.log("🧹 Removing upload event listeners...");
        onUploadProgress.remove();
        onUploadError.remove();
        onUploadComplete.remove();
    };
  }, []);


    async function testPluginIos() {
      try {
        const result = await TruvideoSdkMedia.echo({value : "Hello Media "}); 
        setTestIosPlugin(result);
        console.log("Plugin Response on iOS:", result);
      } catch (error) {
        console.error("Error on iOS:", error);
      }
    }


  // async function testPlugin() {
  //   let response;
  //   try {
  //     response = await TruVideoSdkCore.echo({ value: "Hello from New Capacitor Plugin !" });
  //     setValue(response.value);
  //     console.log("Plugin Response:", response);
  //   } catch (error) {
  //     setValue(error);
  //     console.error("Error using plugin:", error);
  //   }
  //   return response.value
  // }


  // async function isUserAuthenticated() {
  //   let response;
  //   try {
  //     response = await TruVideoSdkCore.isAuthenticated();
  //     console.log("isAuthenticated Response:", response);
  //   } catch (error) {
  //     console.error("Error in checking isAuthenticated :", error);
  //   }
  //   return response.isAuthenticated
  // }

  // async function isAuthenticationExpired() {
  //   let response;
  //   try {
  //     response = await TruVideoSdkCore.isAuthenticationExpired();
  //     setIsAuthenticationExpire(response.isAuthenticationExpired);
  //     console.log("isAuthenticationExpired Response:", response);
  //   } catch (error) {
  //     setValue(error);
  //     console.error("Error in checking isAuthenticationExpired:", error);
  //   }
  //   return response.isAuthenticationExpired
  // }

  async function auth() {
    try {
      const isAuth = await TruVideoSdkCore.isAuthenticated();
      // console.log('isAuth', isAuth.authenticate);
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
      setValue2("Auth success");
      console.log('initAuth', initAuth.initAuthentication);
    } catch (error) {
      setValue2("Auth fail");
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
    mode: TruvideoSdkCamera.Mode?.Picture || "picture"
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
      console.log("📸 Captured Image Path:", response.result);
      const resultData = response.result; 
     
      if (typeof resultData === "string") {
        try {
            mediaItems = JSON.parse(resultData);
            console.log("✅ Parsed mediaItems:", mediaItems);
        } catch (error) {
            console.error("❌ Failed to parse response.result:", error);
        }
      } else if (Array.isArray(resultData)) {
        mediaItems = resultData;
      }

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

      if(Array.isArray(mediaItems)){
          for (const item of mediaItems) {
            try {
              console.log("item" , item.filePath ); 
              const payload = {
                filePath: item.filePath, 
                tag: JSON.stringify(tag),
                metaData: JSON.stringify(metaData),
              };
              const uploadMediaResponse = await TruvideoSdkMedia.uploadMedia(payload); 
              console.log("uploadMedia Responnse " , uploadMediaResponse.response ); 
              const url =  uploadMediaResponse.response.uploadedFileURL || uploadMediaResponse.response.remoteUrl; 
              if(url) 
                setUploadedImages((prevImages) => [...prevImages, url]);

            }catch (uploadError) {
              console.error("❌ Upload failed for:", item.filePath, uploadError);
          }
        }
        setIsUploaded("Upload Success")

      }else {
        console.error("❌ Camera Upload Failed: mediaItems is not an array.");
    }
      
    } catch (error) {
      console.error("Camera error:", error);
    }
  }

  return (
    <div className="App">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      
      <h1> Hello Devs </h1>
      <h2> {value}</h2>
      <button onClick={() => auth()}>Click to Auth </button>
      <br></br>
      <h2> {value2}</h2>
      <br></br>
      <br></br>
      <button onClick={() => openCamera()}>Open Camera  </button>

      <br></br>
      <br></br>
      <h2> {isUploaded}</h2>
      <h3>{uploadedImages}</h3>
    </div>
  );
}

export default App;
