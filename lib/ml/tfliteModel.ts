// Important: Do NOT import `react-native-fast-tflite` at module scope.
// If the native module isn't compiled into the binary (Expo Go / stale dev-client build),
// it will crash immediately on app startup.

let modelPromise: Promise<any> | null = null;

export async function getPlantDiseaseModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      try {
        // Use `require()` (not `import()`) so Metro includes the module in the initial bundle.
        // `import()` can trigger a runtime bundle fetch in dev, which looks like an app refresh.
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require("react-native-fast-tflite");
        const loadTensorflowModel = (mod as any).loadTensorflowModel as (
          asset: any,
        ) => Promise<any>;

        return await loadTensorflowModel(
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require("../../assets/models/plant_disease.tflite"),
        );
      } catch (e: any) {
        // Give a helpful error instead of a TurboModuleRegistry crash.
        const msg =
          "TFLite native module is missing. You must rebuild and run a Dev Client (Expo Go will not work).\n" +
          "Run: `npx expo prebuild --clean` then `npx expo run:android`, and start Metro with `npm start -- --dev-client`.";
        const err = new Error(msg);
        (err as any).cause = e;
        throw err;
      }
    })();
  }
  return modelPromise;
}
