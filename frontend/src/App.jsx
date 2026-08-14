import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
  };

  const predictDisease = async () => {
    if (!file) {
      setError("Please select a leaf image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData
      );

      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to the AI server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <div className="text-3xl">🌿</div>

            <div>
              <h1 className="text-xl font-bold">
                PlantGuard AI
              </h1>

              <p className="text-xs text-slate-400">
                Plant Disease Detection
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            ● AI Model Online
          </div>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* Hero */}
        <div className="text-center mb-12">

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Detect Plant Diseases
            <span className="text-green-400"> with AI</span>
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto">
            Upload a leaf image and our deep learning model will
            analyze it and identify the most likely plant disease.
          </p>

        </div>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Upload Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <h3 className="text-xl font-semibold mb-6">
              Upload Leaf Image
            </h3>

            <label className="block cursor-pointer">

              <div className="border-2 border-dashed border-slate-700 hover:border-green-500 rounded-xl p-10 text-center transition">

                {preview ? (
                  <img
                    src={preview}
                    alt="Leaf preview"
                    className="max-h-72 mx-auto rounded-lg object-contain"
                  />
                ) : (
                  <>
                    <div className="text-5xl mb-4">
                      📷
                    </div>

                    <p className="font-medium">
                      Click to select an image
                    </p>

                    <p className="text-sm text-slate-500 mt-2">
                      PNG, JPG or JPEG
                    </p>
                  </>
                )}

              </div>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />

            </label>

            <button
              onClick={predictDisease}
              disabled={!file || loading}
              className="w-full mt-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 disabled:bg-slate-700 disabled:text-slate-500 text-black font-semibold transition"
            >
              {loading ? "Analyzing..." : "🔬 Analyze Leaf"}
            </button>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

          </div>

          {/* Results */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <h3 className="text-xl font-semibold mb-6">
              AI Analysis
            </h3>

            {!result && !loading && (
              <div className="h-72 flex flex-col items-center justify-center text-center text-slate-500">

                <div className="text-5xl mb-4">
                  🧬
                </div>

                <p>
                  Your prediction will appear here
                </p>

              </div>
            )}

            {loading && (
              <div className="h-72 flex flex-col items-center justify-center">

                <div className="w-12 h-12 border-4 border-slate-700 border-t-green-400 rounded-full animate-spin mb-5"></div>

                <p className="text-slate-400">
                  AI is analyzing the leaf...
                </p>

              </div>
            )}

            {result && (
              <div className="space-y-6">

                <div>
                  <p className="text-sm text-slate-500">
                    Detected Disease
                  </p>

                  <h4 className="text-2xl font-bold text-green-400 mt-1">
                    {result.disease}
                  </h4>
                </div>

                <div>
                  <div className="flex justify-between mb-2">

                    <span className="text-sm text-slate-400">
                      Confidence
                    </span>

                    <span className="font-semibold">
                      {result.confidence}%
                    </span>

                  </div>

                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-green-400 transition-all"
                      style={{
                        width: `${result.confidence}%`
                      }}
                    />

                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-800">

                  <p className="text-sm text-slate-500 mb-1">
                    Model
                  </p>

                  <p className="font-medium">
                    ResNet50 Transfer Learning
                  </p>

                </div>

                <div className="p-5 rounded-xl bg-green-500/10 border border-green-500/20">

                  <p className="text-sm text-slate-400">
                    Prediction Status
                  </p>

                  <p className="text-green-400 font-semibold mt-1">
                    ✓ Analysis Complete
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* Model Information */}
        <div className="mt-10 grid md:grid-cols-3 gap-5">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-2xl mb-2">🤖</p>
            <h3 className="font-semibold">Deep Learning</h3>
            <p className="text-sm text-slate-500 mt-1">
              ResNet50 image classification model
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-2xl mb-2">🌱</p>
            <h3 className="font-semibold">PlantVillage</h3>
            <p className="text-sm text-slate-500 mt-1">
              Trained using plant leaf images
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-2xl mb-2">📊</p>
            <h3 className="font-semibold">95.18%</h3>
            <p className="text-sm text-slate-500 mt-1">
              Validation accuracy achieved
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">

        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-slate-500">

          PlantGuard AI • Deep Learning Plant Disease Detection

        </div>

      </footer>

    </div>
  );
}

export default App;