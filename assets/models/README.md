Place your on-device inference files here:

- `plant_disease.tflite` (TensorFlow Lite model)
- `labels.json` (array of class labels in the same order as the model output)

Notes:
- Expo Go cannot run native TensorFlow Lite modules.
- Use a Dev Client / prebuild build to run `react-native-fast-tflite`.

Preprocessing (matches current app code):
- Decode image -> RGB
- Resize to 224x224
- Convert to float32
- Do NOT divide by 255 (normalization is assumed inside the model)
