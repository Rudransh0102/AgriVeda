import { loadTensorflowModel } from "react-native-fast-tflite";
import { imageUriToFloat32Array } from "./imagePreprocess";

// 1. HARDCODE CLASSES (Ensure this matches your Python notebook output exactly)
const CLASS_LABELS = [
  "Algal Leaf Spot (Jackfruit)",
  "Anthracnose (Mango)",
  "Aphids (Cotton)",
  "Apple scab (Apple)",
  "Bacterial Blight (Cotton)",
  "Bacterial Canker (Mango)",
  "Bacterial Leaf Spot (Pumpkin)",
  "Bacterial spot (Peach)",
  "Bacterial spot (Pepper, bell)",
  "Bacterial spot (Tomato)",
  "BacterialBlights (Sugarcane)",
  "Black Rot (Cauliflower)",
  "Black Spot (Jackfruit)",
  "Black rot (Apple)",
  "Black rot (Grape)",
  "BrownSpot (Rice)",
  "Cedar apple rust (Apple)",
  "Cercospora leaf spot Gray leaf spot (Corn (maize))",
  "Common rust (Corn (maize))",
  "Cutting Weevil (Mango)",
  "Die Back (Mango)",
  "Downy Mildew (Pumpkin)",
  "Early blight (Potato)",
  "Early blight (Tomato)",
  "Esca (Black Measles) (Grape)",
  "Gall Midge (Mango)",
  "Haunglongbing (Citrus greening) (Orange)",
  "Healthy (Cauliflower)",
  "Healthy (Cotton)",
  "Healthy (Jackfruit)",
  "Healthy (Mango)",
  "Healthy (Rice)",
  "Healthy (Sugarcane)",
  "Healthy Leaf (Pumpkin)",
  "Hispa (Rice)",
  "Late blight (Potato)",
  "Late blight (Tomato)",
  "Leaf Mold (Tomato)",
  "Leaf blight (Isariopsis Leaf Spot) (Grape)",
  "Leaf scorch (Strawberry)",
  "LeafBlast (Rice)",
  "Mosaic (Sugarcane)",
  "Mosaic Disease (Pumpkin)",
  "Northern Leaf Blight (Corn (maize))",
  "Powdery Mildew (Cotton)",
  "Powdery Mildew (Mango)",
  "Powdery Mildew (Pumpkin)",
  "Powdery mildew (Cherry (including sour))",
  "RedRot (Sugarcane)",
  "Rust (Sugarcane)",
  "Septoria leaf spot (Tomato)",
  "Sooty Mould (Mango)",
  "Spider mites Two-spotted spider mite (Tomato)",
  "Target Spot (Tomato)",
  "Target spot (Cotton)",
  "Tomato Yellow Leaf Curl Virus (Tomato)",
  "Tomato mosaic virus (Tomato)",
  "Unknown Disease",
  "Yellow (Sugarcane)",
  "healthy (Apple)",
  "healthy (Blueberry)",
  "healthy (Cherry (including sour))",
  "healthy (Corn (maize))",
  "healthy (Grape)",
  "healthy (Peach)",
  "healthy (Pepper, bell)",
  "healthy (Potato)",
  "healthy (Raspberry)",
  "healthy (Soybean)",
  "healthy (Strawberry)",
  "healthy (Tomato)",
];

let model: any = null;

export async function predictDisease(imageUri: string) {
  try {
    // 2. Load Model (Singleton)
    if (!model) {
      console.log("Loading TFLite Model...");
      model = await loadTensorflowModel(
        require("../../assets/models/crop_disease_model.tflite"),
      );
    }

    // 3. Preprocess (Returns Float32Array)
    const inputTensor = await imageUriToFloat32Array(imageUri, 224, 224);

    // 4. Run Inference (THE FIX IS HERE)
    // react-native-fast-tflite expects an ARRAY of TypedArrays.
    // Do NOT wrap it in { data: ... }. Pass the Float32Array directly.
    const outputs = await model.run([inputTensor]);

    // 5. Post-process
    // outputs[0] is the probabilities array (Float32Array)
    const probabilities = outputs[0];

    // Safely convert to normal array if needed, though usually it's iterable
    const scores = (
      probabilities.length ? probabilities : Object.values(probabilities)
    ) as number[];

    let maxScore = 0;
    let maxIndex = 0;

    for (let i = 0; i < scores.length; i++) {
      if (scores[i] > maxScore) {
        maxScore = scores[i];
        maxIndex = i;
      }
    }

    const resultLabel = CLASS_LABELS[maxIndex] || "Unknown";
    console.log(`Prediction: ${resultLabel} (${maxScore.toFixed(2)})`);

    return {
      disease_name: resultLabel,
      confidence_score: maxScore,
    };
  } catch (error) {
    console.error("Prediction Error:", error);
    throw error;
  }
}
