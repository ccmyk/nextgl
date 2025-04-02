"use client";

export default function useLoadMedia() {
  const logError = (type, src) => {
    console.warn(`${type} failed to load: ${src}`);
  };

  const loadImages = async (container, onImageLoaded) => {
    const images = container.querySelectorAll("img[data-src]");
    return await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            img.onload = () => {
              if (onImageLoaded) onImageLoaded(img);
              resolve();
            };
            img.onerror = () => {
              logError("Image", img.dataset.src || img.src);
              resolve(); // Prevent breaking flow
            };
            // Fallback to `src` if `data-src` not available
            img.src = img.dataset.src || img.src;
          })
      )
    );
  };

  const loadVideos = async (container, onVideoLoaded) => {
    const videos = container.querySelectorAll("video[data-src]");
    return await Promise.all(
      Array.from(videos).map(
        (video) =>
          new Promise((resolve) => {
            video.onloadeddata = () => {
              if (onVideoLoaded) onVideoLoaded(video);
              resolve();
            };
            video.onerror = () => {
              logError("Video", video.dataset.src || video.src);
              resolve(); // Prevent breaking flow
            };
            // Fallback to `src` if `data-src` not available
            video.src = video.dataset.src || video.src;

            // Remove autoplay to optionally allow streaming
            video.pause();
          })
      )
    );
  };

  return { loadImages, loadVideos };
}