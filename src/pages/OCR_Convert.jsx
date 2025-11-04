'use client';

import React, { useState, useRef, useEffect } from "react";
import {
  Upload, Loader2, FileText, Image, Download, X,
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Quote, Undo, Redo, Code,
  Link, Unlink
} from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";

import { StarterKit } from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline as UnderlineExtension } from "@tiptap/extension-underline";
import { Link as LinkExtension } from "@tiptap/extension-link";
import html2pdf from "html2pdf.js";

const OCR_Convert = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const fileInputRef = useRef(null);
  const linkInputRef = useRef(null);

  // Tiptap Editor (Lists REMOVED)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        codeBlock: { HTMLAttributes: { class: 'bg-base-200 p-2 rounded' } },
        blockquote: { HTMLAttributes: { class: 'border-l-4 border-primary pl-4 italic' } },
        bulletList: false,     // DISABLED
        orderedList: false,    // DISABLED
        listItem: false,       // DISABLED
      }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      UnderlineExtension,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
          target: '_blank',
        },
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-64 p-4 border border-primary rounded-lg bg-base-100 text-base-content",
      },
    },
  });

  // Reset editor when file changes
  useEffect(() => {
    if (editor && !file) editor.commands.setContent("");
  }, [file, editor]);

  // Focus link input
  useEffect(() => {
    if (showLinkInput && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [showLinkInput]);

  // File Handlers
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) return alert("File size must be under 5MB");
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setOcrResult(null);
      editor?.commands.setContent("");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setOcrResult(null);
    setShowLinkInput(false);
    setLinkUrl("");
    editor?.commands.setContent("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragActive(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size <= 5 * 1024 * 1024) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setOcrResult(null);
      editor?.commands.setContent("");
    } else if (droppedFile) {
      alert("File size must be under 5MB");
    }
  };

  // OCR API
  const handleConvert = async () => {
    if (!file) return alert("Please select a file.");
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    editor?.commands.setContent("<p class='text-gray-500'>Processing...</p>");

    try {
      const res = await fetch("http://localhost:8000/api/ocr/upload/?file", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOcrResult(data);
      editor?.commands.setContent(data.extracted_text || "");
    } catch (err) {
      console.error(err);
      alert("OCR Failed. Is Django running?");
      editor?.commands.setContent("<p class='text-error'>Error processing file.</p>");
    } finally {
      setLoading(false);
    }
  };

  // Link
  const setLink = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const unsetLink = () => {
    editor?.chain().focus().unsetLink().run();
    setShowLinkInput(false);
    setLinkUrl("");
  };

  // Download
  const handleDownloadPDF = () => {
    if (!editor) return;
    const content = `<div style="padding: 20px; font-family: Arial;">${editor.getHTML()}</div>`;
    html2pdf()
      .set({ margin: 1, filename: `${file?.name?.replace(/\.[^/.]+$/, "") || "ocr"}_edited.pdf` })
      .from(content)
      .save();
  };

  const handleDownloadTXT = () => {
    if (!editor) return;
    const blob = new Blob([editor.getText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name?.replace(/\.[^/.]+$/, "") || "ocr"}_edited.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">OCR Text Editor</h1>
          <p className="text-lg text-secondary">Upload → Convert → Edit → Download</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 justify-center items-center">
          {/* Upload Section */}
          <div className="space-y-6">
            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <label
                htmlFor="dropzone-file"
                className={`
                  w-full h-[65vh] border-2 border-dashed rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all duration-200
                  ${dragActive ? "border-primary bg-secondary/50" : "border-secondary/40"}
                  ${file ? "border-success bg-success/10" : "hover:bg-base-200"}
                `}
              >
                {preview ? (
                  file.type.startsWith("image/") ? (
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-base-content p-4">
                      <FileText className="w-16 h-16 mb-4 text-primary" />
                      <p className="text-lg font-medium truncate max-w-full">{file.name}</p>
                      <p className="text-sm text-base-content/60 mt-2">Click to replace</p>
                    </div>
                  )
                ) : (
                  <div className="text-center p-6">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-base-content/40" />
                    <p className="font-semibold text-lg text-primary">Click or Drag & Drop</p>
                    <p className="text-sm text-base-content/60 mt-2">JPG, PNG, PDF (Max 20MB)</p>
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

            <div className="flex flex-col gap-3">
              <button
                onClick={handleConvert}
                disabled={loading || !file}
                className="btn btn-primary btn-lg flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Image className="w-5 h-5" />}
                {loading ? "Processing..." : "Convert to Text"}
              </button>

              <button
                onClick={handleReset}
                className="btn btn-outline btn-lg flex items-center justify-center gap-3"
              >
                <X className="w-5 h-5" /> Reset
              </button>
            </div>

            {ocrResult?.ocr_confidence && (
              <div className="bg-base-200 rounded-lg p-4 text-center">
                <p className="text-sm text-base-content/60">OCR Confidence</p>
                <p className="text-2xl font-bold text-primary">{ocrResult.ocr_confidence.toFixed(1)}%</p>
              </div>
            )}
          </div>

          {/* Editor Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-secondary/5 border border-primary shadow-xl">
              <div className="card-body p-0">
                <div className="flex items-center justify-between p-4 border-b border-primary">
                  <h2 className="text-xl font-semibold text-primary">Edit Generated Text</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editor?.chain().focus().undo().run()}
                      disabled={!editor?.can().undo()}
                      className="btn btn-ghost btn-sm"
                    >
                      <Undo className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().redo().run()}
                      disabled={!editor?.can().redo()}
                      className="btn btn-ghost btn-sm"
                    >
                      <Redo className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap gap-1 p-3 border-b border-primary bg-secondary/20">
                  {/* Text Formatting */}
                  <div className="flex gap-1 border-r border-primary pr-2 mr-2">
                    <button
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`btn btn-sm ${editor?.isActive("bold") ? "btn-primary" : "btn-ghost"}`}
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={`btn btn-sm ${editor?.isActive("italic") ? "btn-primary" : "btn-ghost"}`}
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleUnderline().run()}
                      className={`btn btn-sm ${editor?.isActive("underline") ? "btn-primary" : "btn-ghost"}`}
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleStrike().run()}
                      className={`btn btn-sm ${editor?.isActive("strike") ? "btn-primary" : "btn-ghost"}`}
                    >
                      <Strikethrough className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Headings */}
                  <div className="flex gap-1 border-r border-primary pr-2 mr-2">
                    <select
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "paragraph") {
                          editor?.chain().focus().setParagraph().run();
                        } else {
                          editor?.chain().focus().toggleHeading({ level: parseInt(value, 10) }).run();
                        }
                      }}
                      className="select select-bordered select-sm w-32"
                      value={
                        editor?.isActive('paragraph') ? 'paragraph' :
                        editor?.isActive('heading', { level: 1 }) ? '1' :
                        editor?.isActive('heading', { level: 2 }) ? '2' :
                        editor?.isActive('heading', { level: 3 }) ? '3' :
                        editor?.isActive('heading', { level: 4 }) ? '4' : 'paragraph'
                      }
                    >
                      <option value="paragraph">Paragraph</option>
                      <option value="1">Heading 1</option>
                      <option value="2">Heading 2</option>
                      <option value="3">Heading 3</option>
                      <option value="4">Heading 4</option>
                    </select>
                  </div>

                  {/* Alignment */}
                  <div className="flex gap-1 border-r border-primary pr-2 mr-2">
                    <button
                      onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                      className={`btn btn-sm ${editor?.isActive({ textAlign: "left" }) ? "btn-primary" : "btn-ghost"}`}
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                      className={`btn btn-sm ${editor?.isActive({ textAlign: "center" }) ? "btn-primary" : "btn-ghost"}`}
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                      className={`btn btn-sm ${editor?.isActive({ textAlign: "right" }) ? "btn-primary" : "btn-ghost"}`}
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
                      className={`btn btn-sm ${editor?.isActive({ textAlign: "justify" }) ? "btn-primary" : "btn-ghost"}`}
                    >
                      <AlignJustify className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Blocks */}
                  <div className="flex gap-1 border-r border-primary pr-2 mr-2">
                    <button
                      onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                      className={`btn btn-sm ${editor?.isActive("blockquote") ? "btn-primary" : "btn-ghost"}`}
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                      className={`btn btn-sm ${editor?.isActive("codeBlock") ? "btn-primary" : "btn-ghost"}`}
                    >
                      <Code className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Colors */}
                  <div className="flex gap-1 border-r border-primary pr-2 mr-2">
                    <input
                      type="color"
                      onInput={(e) => editor?.chain().focus().setColor(e.currentTarget.value).run()}
                      className="w-8 h-8 rounded cursor-pointer bg-primary"
                      title="Text Color"
                    />
                    <button
                      onClick={() => editor?.chain().focus().setColor('#000000').run()}
                      className="btn btn-sm btn-ghost"
                      title="Reset Color"
                    >
                      A
                    </button>
                  </div>

                  {/* Links */}
                  <div className="flex gap-1">
                    {showLinkInput ? (
                      <div className="flex gap-1 items-center">
                        <input
                          ref={linkInputRef}
                          type="url"
                          placeholder="Enter URL..."
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          className="input input-bordered input-sm w-32"
                          onKeyPress={(e) => e.key === "Enter" && setLink()}
                        />
                        <button onClick={setLink} className="btn btn-success btn-sm">
                          <Link className="w-4 h-4" />
                        </button>
                        <button onClick={unsetLink} className="btn btn-error btn-sm">
                          <Unlink className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowLinkInput(true)}
                        className={`btn btn-sm ${editor?.isActive("link") ? "btn-primary" : "btn-ghost"}`}
                      >
                        <Link className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <EditorContent editor={editor} className="p-6 min-h-96" />
              </div>
            </div>

            {/* Download */}
            <div className="flex gap-4">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 btn btn-success btn-lg flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5" /> Download PDF
              </button>
              <button
                onClick={handleDownloadTXT}
                className="flex-1 btn btn-outline btn-lg flex items-center justify-center gap-3"
              >
                <FileText className="w-5 h-5" /> Download TXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCR_Convert;