import React, { useState, useRef } from "react";
import { Upload, X, Download, Loader2, FileText, Image } from "lucide-react";
import jsPDF from "jspdf";

const OCR_Convert = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [editableText, setEditableText] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size must be under 5MB");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setOcrResult(null);
      setEditableText("");
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setOcrResult(null);
    setEditableText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size <= 5 * 1024 * 1024) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setOcrResult(null);
      setEditableText("");
    } else if (droppedFile) {
      alert("File size must be under 5MB");
    }
  };

  // CORRECTED API CALL
const handleConvert = async () => {
  if (!file) return alert("Please select a file first.");

  const formData = new FormData();
  formData.append("file", file);

  setLoading(true);
  setOcrResult(null);
  setEditableText("");

  try {
    console.log("Sending request to: http://127.0.0.1:8000/api/ocr/upload/?file");

    const response = await fetch("http://127.0.0.1:8000/api/ocr/upload/?file", {
      method: "POST",
      body: formData,
      // DO NOT set headers – let browser add multipart boundary
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("OCR Success:", data);

    setOcrResult(data);
    setEditableText(data.extracted_text || "");
  } catch (error) {
    console.error("Fetch failed:", error);
    alert(
      "Failed to connect to OCR server.\n" +
      "Check:\n" +
      "1. Django running on http://127.0.0.1:8000\n" +
      "2. Open browser DevTools → Network tab → Look for failed request\n" +
      "3. Copy error and send to me."
    );
  } finally {
    setLoading(false);
  }
};

  const handleDownloadPDF = () => {
    if (!editableText.trim()) return;
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(editableText, 180);
    doc.text(splitText, 15, 20);
    const filename = `${file?.name.replace(/\.[^/.]+$/, "") || "ocr"}_extracted.pdf`;
    doc.save(filename);
  };

  const handleDownloadTXT = () => {
    if (!editableText.trim()) return;
    const blob = new Blob([editableText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.replace(/\.[^/.]+$/, "") || "ocr"}_extracted.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-base-100 text-base-content">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
            OCR Text Extractor
          </h1>
          <p className="mt-2 text-lg text-secondary">
            Upload → Convert → Edit → Download
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-base-200 rounded-2xl shadow-xl p-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div
              className="relative"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label
                htmlFor="dropzone-file"
                className={` w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center
                  ${dragActive ? "border-primary bg-primary/10" : "border-neutral"}
                  ${file ? "bg-success/10 border-success" : "bg-base-100 hover:bg-base-300"}
                `}
              >
                {preview ? (
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    {file?.type.startsWith("image/") ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-base-content/70">
                        <FileText className="w-16 h-16 mb-2" />
                        <p className="text-sm font-medium">{file.name}</p>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove();
                      }}
                      className="absolute top-2 right-2 bg-error text-error-content p-1.5 rounded-full shadow-md hover:bg-error/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-base-content/50" />
                    <p className="text-base-content font-medium">
                      <span className="text-primary">Click to upload</span> or drag & drop
                    </p>
                    <p className="text-xs text-base-content/60 mt-1">JPG, PNG, PDF (Max 5MB)</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  id="dropzone-file"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {file && (
              <button
                onClick={handleConvert}
                disabled={loading}
                className="w-full btn btn-primary flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Image className="w-5 h-5" />
                    Convert to Text
                  </>
                )}
              </button>
            )}
          </div>

          {/* Editor Section */}
          <div className="flex flex-col space-y-4">
            <div className="bg-base-100 rounded-xl p-4 shadow-inner flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-primary">Extracted Text</h2>
                {ocrResult?.ocr_confidence !== undefined && (
                  <span className="text-sm text-base-content/70">
                    Confidence: {ocrResult.ocr_confidence.toFixed(1)}%
                  </span>
                )}
              </div>

              <textarea
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                placeholder="OCR result will appear here... Edit freely!"
                className="flex-1 w-full bg-base-200 border border-neutral rounded-lg p-3 text-base-content resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                spellCheck={false}
                disabled={loading}
              />

              {ocrResult?.debug_image_url && (
                <p className="text-xs text-base-content/60 mt-2">
                  <a
                    href={ocrResult.debug_image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    View debug image
                  </a>
                </p>
              )}
            </div>

            {editableText && (
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 btn btn-secondary flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> PDF
                </button>
                <button
                  onClick={handleDownloadTXT}
                  className="flex-1 btn btn-outline flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> TXT
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-base-content/50 mt-6">
          API: POST http://127.0.0.1:8000/api/ocr/upload/?file
        </p>
      </div>
    </div>
  );
};

export default OCR_Convert;