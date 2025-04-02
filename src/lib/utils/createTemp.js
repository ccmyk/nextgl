// src/lib/utils/createTemp.js
export async function createTemp(tempConfig) {
  try {
    if (!tempConfig) throw new Error("Missing `tempConfig` for createTemp");

    const canvas = document.createElement("canvas");
    canvas.width = tempConfig.width || 400;
    canvas.height = tempConfig.height || 400;

    const context = canvas.getContext("webgl");
    if (!context) throw new Error("Unable to initialize WebGL context.");

    return {
      canvas,
      context,
    };
  } catch (error) {
    console.error("Error in createTemp:", error.message);
    throw error;
  }
}