import { useEffect, useState } from 'react';
import './App.css';
import { TruvideoSdkCamera } from 'truvideo-capacitor-camera-sdk';
import { TruVideoSdkCore } from 'truvideo-capacitor-core-sdk';

function App() {
  const [value, setValue] = useState();
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();
  const [isAuthenticationExpire, setIsAuthenticationExpire] = useState(true);
  const [testIosPlugin, setTestIosPlugin]  = useState(false); 

  // useEffect(() => {
  //   const eventTarget = new EventTarget();
  //   // Listener for 'onProgress' event
  //   eventTarget.addEventListener('cameraEvent', (event) => {
  //     console.log('onProgress event:', event);
  //   });

  //   eventTarget.addListener('cameraEvent', (event) => {
  //     console.log('onProgress event:', event);
  //   });

  //   TruvideoSdkCamera.addListener("cameraEvent", (event) => {
  //     console.log("Received Camera Event:", event);
  //   });
  // })

    // async function testPluginIos() {
    //   try {
    //     const result = await TruVideoSdkCore.echo({value : "Hello ISO "}); 
    //     setTestIosPlugin(result);
    //     console.log("Plugin Response on iOS:", result);
    //   } catch (error) {
    //     console.error("Error on iOS:", error);
    //   }
    // }
    // testPluginIos();


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
        // await TruVideoSdkCore.authenticate({
        //   apiKey: apiKey,
        //   payload: pay,
        //   signature: signature.signature,
        //   externalId: externalId
        // });
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
      console.log("📤 Sending JSON:", jsonString);

      const response = await TruvideoSdkCamera.initCameraScreen({ configuration: jsonString });
      console.log("📸 Captured Image Path:", response.imagePath);

    } catch (error) {
      console.error("Camera error:", error);
    }
  }

  // const eventEmitter = new NativeEventEmitter(NativeModules.TruVideoReactMediaSdk);

  // const onUploadProgress = eventEmitter.addListener('onProgress', (event) => {
  //   // handle progress with recieved JSON
  //   console.log('onProgress event:', event);
  // });

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
      
    </div>
  );
}

export default App;
