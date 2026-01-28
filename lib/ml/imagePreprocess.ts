import { toByteArray } from "base64-js";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import jpeg from "jpeg-js";

/**
 * Preprocesses an image for EfficientNetV2 (or MobileNet) TFLite models.
 * * LOGIC MATCH:
 * 1. Python: cv2.resize(img, (224, 224))  <-> TS: manipulateAsync resize
 * 2. Python: cv2.cvtColor(BGR2RGB)        <-> TS: jpeg-js decodes to RGBA, we pick RGB
 * 3. Python: img.astype(np.float32)       <-> TS: new Float32Array (values 0-255)
 * 4. Python: NO / 255                     <-> TS: We do NOT divide by 255
 * * @param uri - The file URI of the image
 * @param width - Model input width (Default 224 for EfficientNetV2B0)
 * @param height - Model input height (Default 224 for EfficientNetV2B0)
 */
export async function imageUriToFloat32Array(
  uri: string,
  width: number = 224,
  height: number = 224,
): Promise<Float32Array> {
  // STEP 1: Resize NATIVELY.
  // We pass the target width/height dynamically to support different EfficientNet variants.
  const manipResult = await manipulateAsync(
    uri,
    [{ resize: { width, height } }],
    { compress: 1, format: SaveFormat.JPEG, base64: true },
  );

  const base64 = manipResult.base64;
  if (!base64) throw new Error("Could not get base64 from ImageManipulator");

  // STEP 2: Decode JPEG to RGBA (Raw Pixels)
  const jpegData = toByteArray(base64);
  const decoded = jpeg.decode(jpegData, { useTArray: true }); // Returns w * h * 4 (RGBA)
  const { data } = decoded;

  // STEP 3: Convert RGBA -> RGB and cast to Float32
  // Tensor shape: [1, width, height, 3]
  const float32 = new Float32Array(width * height * 3);

  let j = 0;
  for (let i = 0; i < data.length; i += 4) {
    // data[i] is an integer 0-255.
    // We assign it directly to float32, resulting in a float 0.0-255.0
    float32[j++] = data[i]; // Red
    float32[j++] = data[i + 1]; // Green
    float32[j++] = data[i + 2]; // Blue
    // i+3 is Alpha, we ignore it.
  }

  return float32;
}
