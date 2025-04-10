import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';  // 👈 Import to receive data
import './../App.css';
import { TruvideoSdkCamera } from 'truvideo-capacitor-camera-sdk';
import { TruvideoSdkVideo } from 'truvideo-capacitor-video-sdk';
import { toast } from 'react-toastify';

function VideoComponent() {
  const location = useLocation();
  const { uploadedVideos = [] } = location.state || {};
  const [selectedVideos, setSelectedVideos] = useState([]);

  useEffect(() => {
    const subscription = TruvideoSdkCamera.addListener("cameraEvent", (event) => {
      console.log("Camera Event:", event.cameraEvent);
    });

    return () => {
      subscription?.remove?.();
    };
  }, [uploadedVideos]);

  const handleCheckboxChange = (url) => {
    setSelectedVideos((prevSelected) =>
      prevSelected.includes(url)
        ? prevSelected.filter((item) => item !== url)
        : [...prevSelected, url]
    );
  };

  const defaultConfig = {
    height: '640',
    width: '480',
    framesRate: 'twentyFourFps',
    videoCodec: 'h264',
  };

  const safeFirstSelected = selectedVideos[0];

  const apiHandlers = {
    async mergeVideos() {
      if (!safeFirstSelected) return;

      try {
        const payload = {
          resultPath: "",
          videoUris: JSON.stringify(selectedVideos),
          config: JSON.stringify(defaultConfig),
        };
        const { result } = await TruvideoSdkVideo.mergeVideos(payload);
        console.log("Merge Video Response:", result);
        toast.success('Merge successful!');
      } catch (error) {
        console.error("❌ Failed to Merge Videos:", error);
        toast.error('Merge Failed!');
      } finally {
        setSelectedVideos([]);
      }
    },

    async compareVideos() {
      if (!safeFirstSelected) return;

      try {
        const { result } = await TruvideoSdkVideo.compareVideos(JSON.stringify(selectedVideos));
        console.log("Comparison result:", result);
        toast.success('Compare successful!');
      } catch (error) {
        console.error("❌ Failed to Compare Videos:", error);
        toast.error('Compare Failed!');
      } finally {
        setSelectedVideos([]);
      }
    },

    async generateThumbnail() {
      if (!safeFirstSelected) return;

      try {
        const payload = {
          resultPath: "",
          videoPath: JSON.stringify(safeFirstSelected),
          config: JSON.stringify(defaultConfig),
          position: 1000,
          width: 640,
          height: 480,
          precise: false,
        };
        const { result } = await TruvideoSdkVideo.generateThumbnail(payload);
        console.log("Thumbnail Generation Result:", result);
        toast.success('Thumbnail Generation successful!');
      } catch (error) {
        console.error("❌ Failed to Generate Thumbnail:", error);
        toast.error('Thumbnail Generation Failed!');
      } finally {
        setSelectedVideos([]);
      }
    },

    async encodeVideo() {
      if (!safeFirstSelected) return;

      try {
        const payload = {
          resultPath: "",
          videoUri: JSON.stringify(safeFirstSelected),
          config: JSON.stringify(defaultConfig),
        };
        const { result } = await TruvideoSdkVideo.encodeVideo(payload);
        console.log("Encode Result:", result);
        toast.success('Encode successful!');
      } catch (error) {
        console.error("❌ Failed to Encode Video:", error);
        toast.error('Encode Failed!');
      } finally {
        setSelectedVideos([]);
      }
    },

    async cleanNoise() {
      if (!safeFirstSelected) return;

      try {
        const payload = {
          resultPath: "",
          videoPath: JSON.stringify(safeFirstSelected),
        };
        const { result } = await TruvideoSdkVideo.cleanNoise(payload);
        console.log("Clean Noise Result:", result);
        toast.success('Clean Noise successful!');
      } catch (error) {
        console.error("❌ Failed to Clean Noise:", error);
        toast.error('Clean Noise Failed!');
      } finally {
        setSelectedVideos([]);
      }
    },

    async editVideo() {
      if (!safeFirstSelected) return;

      try {
        const payload = {
          resultPath: "",
          videoPath: JSON.stringify(safeFirstSelected),
          config: JSON.stringify(defaultConfig),
        };
        const { result } = await TruvideoSdkVideo.editVideo(payload);
        console.log("Edit Video Response:", result);
        toast.success('Edit successful!');
      } catch (error) {
        console.error("❌ Failed to Edit Video:", error);
        toast.error('Edit Failed!');
      } finally {
        setSelectedVideos([]);
      }
    },

    async concatVideos() {
      if (!safeFirstSelected) return;

      try {
        const payload = {
          resultPath: "",
          videoUris: JSON.stringify(selectedVideos),
        };
        const { result } = await TruvideoSdkVideo.concatVideos(payload);
        console.log("Concat Video Response:", result);
        toast.success('Concat successful!');
      } catch (error) {
        console.error("❌ Failed to Concat Videos:", error);
        toast.error('Concat Failed!');
      } finally {
        setSelectedVideos([]);
      }
    },

    async getVideoInfo() {
      if (!safeFirstSelected) return;

      try {
        const payload = { videoPath: JSON.stringify(safeFirstSelected) };
        const { result } = await TruvideoSdkVideo.getVideoInfo(payload);
        console.log("Get Video Info Response:", result);
      } catch (error) {
        console.error("❌ Failed to Get Video Info:", error);
        toast.error('Failed to get Video Info!');
      } finally {
        setSelectedVideos([]);
      }
    },
  };



  return (
    <div className="video-list">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      {uploadedVideos.length > 0 ? (
        <>
        {uploadedVideos.map((url, index) => (
            <div key={index} className="video-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <input
                type="checkbox"
                checked={selectedVideos.includes(url)}
                onChange={() => handleCheckboxChange(url)}
                style={{ marginRight: '10px' }}
              />
              {/* <video src={url} controls width="30" height="40" /> */}
              <span>{url}</span>

            </div>
          ))}

          {/* Action Buttons */}
          <div className="video-actions" style={{ marginTop: '20px' }}>
            <button onClick={apiHandlers.mergeVideos}>Merge Videos</button>
            <button onClick={apiHandlers.compareVideos}>Compare Videos</button>
            <button onClick={apiHandlers.generateThumbnail}>Generate Thumbnail</button>
            <button onClick={apiHandlers.encodeVideo}>Encode Video</button>
            <button onClick={apiHandlers.cleanNoise}>Clean Noise</button>
            <button onClick={apiHandlers.editVideo}>Edit Video</button>
            <button onClick={apiHandlers.concatVideos}>Concat Videos</button>
            <button onClick={apiHandlers.getVideoInfo}>Get Video Info</button>
          </div>
        </>
      ) : (
        <p>No videos available.</p>
      )}
    </div>
  );
}

export default VideoComponent