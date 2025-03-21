import { useEffect, useState } from 'react';
import './App.css';
import { TruvideoSdkCamera } from 'truvideo-capacitor-camera-sdk';
// import { Authentication } from 'truvideo-capacitor-core-sdk';
// import { TruvideoSdkCamera } from 'truvideo-capacitor-camera-sdk'

function App() {
  const [value, setValue] = useState();
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();
  const [isAuthenticationExpire, setIsAuthenticationExpire] = useState(true);
  const [testIosPlugin, setTestIosPlugin]  = useState(false); 

    // async function testPluginIos() {
    //   try {
    //     const result = await Authentication.echo({value : "Hello ISO "}); 
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
  //     response = await Authentication.echo({ value: "Hello from New Capacitor Plugin !" });
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
  //     response = await Authentication.isAuthenticated();
  //     console.log("isAuthenticated Response:", response);
  //   } catch (error) {
  //     console.error("Error in checking isAuthenticated :", error);
  //   }
  //   return response.isAuthenticated
  // }

  // async function isAuthenticationExpired() {
  //   let response;
  //   try {
  //     response = await Authentication.isAuthenticationExpired();
  //     setIsAuthenticationExpire(response.isAuthenticationExpired);
  //     console.log("isAuthenticationExpired Response:", response);
  //   } catch (error) {
  //     setValue(error);
  //     console.error("Error in checking isAuthenticationExpired:", error);
  //   }
  //   return response.isAuthenticationExpired
  // }

  // async function auth() {
  //   try {
  //     const isAuth = await Authentication.isAuthenticated();
  //     console.log('isAuth', isAuth.authenticate);
  //     // Check if authentication token has expired
  //     const isAuthExpired = await Authentication.isAuthenticationExpired();
  //     console.log('isAuthExpired', isAuthExpired.isAuthenticationExpired);
  //     //generate payload for authentication
  //     const payload = await Authentication.generatePayload();
  //     const pay = String(payload.generatePayload);
  //     const apiKey = "EPhPPsbv7e";
  //     const secretKey = "9lHCnkfeLl";

  //     const signature = await Authentication.toSha256String({
  //       secretKey: secretKey,
  //       payload: pay
  //     });
  //     setValue1(signature.signature);
  //     const externalId = "";
  //     // Authenticate user
  //     if (!isAuth.isAuthenticated || isAuthExpired.isAuthenticationExpired) {
  //       await Authentication.authenticate({
  //         apiKey: apiKey,
  //         payload: pay,
  //         signature: signature.signature,
  //         externalId: externalId
  //       });
  //     }
  //     // If user is authenticated successfully
  //     const initAuth = await Authentication.initAuthentication();
  //     setValue2("Auth success");
  //     console.log('initAuth', initAuth.initAuthentication);
  //   } catch (error) {
  //     setValue2("Auth fail");
  //     console.log('error', error);
  //   }

  // }

  const secretKey  = {
    lensFacing: TruvideoSdkCamera.LensFacing.Front, //Front and Back option are there
    flashMode: TruvideoSdkCamera.FlashMode.Off,// On and Off option are there
    orientation: TruvideoSdkCamera.Orientation.Portrait, // Portrait, LandscapeLeft,LandscapeRight and PortraitReverse option are there
    outputPath: "",
    frontResolutions: [],
    frontResolution: 'nil',
    backResolutions: [],
    backResolution: 'nil',
    mode: TruvideoSdkCamera.Mode.Picture, // Picture,Video and VideoAndPicture options are there
  };
  
  async function openCamera() {
    try {
      const response = await TruvideoSdkCamera.initCameraScreen({ configuration: JSON.stringify(secretKey) })
      console.log("Captured Image Path:", response.imagePath);
    } catch (error) {
      console.error("Camera error:", error);
    }
  }



// window.testEcho = () => {
//     TruvideoSdkCamera.initCameraScreen({ configuration: JSON.stringify(secretKey) })
// }

  return (
    <div className="AFpp">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      
      <h1> Hello Devs </h1>
      <h2> {value}</h2>
      <h2> {value2}</h2>
       <h2> {value1 && "Token  " + value1}</h2>
      <h2> {isAuthenticationExpire}</h2>
      
      {/* <button onClick={() => auth()}>Click to Auth </button> */}
      <button onClick={() => openCamera()}>Open Camera  </button>
      <h2>Hii </h2>
    </div>
  );
}

export default App;
