
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Video,
  ImagePlus,
  Mic,
  FolderOpen,
  Settings,
  Sparkles,
  Upload,
  Play,
  Clock,
  Menu,
  X,
} from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("5 seconds");
  const [ratio, setRatio] = useState("16:9");
  const [image, setImage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }
    setImage(URL.createObjectURL(file));
    setMessage("");
  }

  function prepareVideo() {
    if (!prompt.trim()) {
      setMessage("Please describe the video you want to create.");
      return;
    }
    if (mode === "image" && !image) {
      setMessage("Please upload an image first.");
      return;
    }
    setMessage("Your video settings are ready. AI generation will be connected next!");
  }

  return (
    <main className="min-h-screen bg-[#090b12] text-white">
      <div className="flex min-h-screen">
        <aside className={`${menuOpen ? "flex" : "hidden"} fixed inset-y-0 left-0 z-20 w-64 flex-col border-r border-white/10 bg-[#10131d] p-6 md:static md:flex`}>
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-600 p-2">
                <Sparkles size={22} />
              </div>
              <div>
                <h1 className="text-lg font-bold">Nova AI</h1>
                <p className="text-xs text-gray-400">Creative Studio</p>
              </div>
            </div>
            <button onClick={() => setMenuOpen(false)} className="md:hidden">
              <X />
            </button>
          </div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Workspace</p>
          <nav className="space-y-2">
            <div className="flex items-center gap-3 rounded-xl bg-violet-600/20 px-4 py-3 text-violet-300">
              <Video size={19} /> Video Generator
            </div>
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-400">
              <Mic size={19} /> Voice Studio
            </div>
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-400">
              <FolderOpen size={19} /> My Projects
            </div>
          </nav>

          <div className="mt-auto flex items-center gap-3 rounded-xl border border-white/10 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 font-bold">N</div>
            <div>
              <p className="text-sm font-semibold">My Workspace</p>
              <p className="text-xs text-gray-500">Free plan</p>
            </div>
            <Settings className="ml-auto text-gray-400" size={18} />
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 md:px-10">
            <div className="flex items-center gap-3">
              <button className="md:hidden" onClick={() => setMenuOpen(true)}><Menu /></button>
              <div>
                <h2 className="text-xl font-bold">Video Generator</h2>
                <p className="text-sm text-gray-400">Turn your ideas into videos with AI.</p>
              </div>
            </div>
            <div className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
              ✦ Nova Studio
            </div>
          </header>

          <div className="mx-auto grid max-w-7xl gap-8 p-5 md:p-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold">Create something amazing</h3>
                <p className="mt-2 text-sm text-gray-400">Start with a prompt or bring your own image.</p>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3">
                <button onClick={() => setMode("text")} className={`rounded-xl border p-4 text-left ${mode === "text" ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-[#111522]"}`}>
                  <Video className="mb-3 text-violet-400" />
                  <p className="font-semibold">Text to Video</p>
                  <p className="mt-1 text-xs text-gray-400">Create from a prompt</p>
                </button>
                <button onClick={() => setMode("image")} className={`rounded-xl border p-4 text-left ${mode === "image" ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-[#111522]"}`}>
                  <ImagePlus className="mb-3 text-violet-400" />
                  <p className="font-semibold">Image to Video</p>
                  <p className="mt-1 text-xs text-gray-400">Animate an image</p>
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#111522] p-5">
                <label className="mb-3 block text-sm font-semibold">Describe your video</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A cinematic shot of a futuristic city at sunset, flying cars, glowing lights..."
                  className="min-h-36 w-full resize-y rounded-xl border border-white/10 bg-[#090d17] p-4 text-sm outline-none placeholder:text-gray-600 focus:border-violet-500"
                />

                {mode === "image" && (
                  <div className="mt-4">
                    <label className="flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-white/20 p-6 text-center hover:border-violet-500">
                      {image ? (
                        <Image
                          src={image}
                          alt="Selected upload"
                          width={640}
                          height={360}
                          unoptimized
                          className="max-h-48 rounded-lg object-contain"
                        />
                      ) : (
                        <>
                          <Upload className="mb-2 text-violet-400" size={26} />
                          <span className="text-sm font-medium">Upload an image</span>
                          <span className="mt-1 text-xs text-gray-500">Choose an image from your device</span>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                    </label>
                  </div>
                )}

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-xs text-gray-400">Duration</label>
                    <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#090d17] p-3 text-sm">
                      <option>5 seconds</option>
                      <option>10 seconds</option>
                      <option>15 seconds</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs text-gray-400">Aspect ratio</label>
                    <select value={ratio} onChange={(e) => setRatio(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#090d17] p-3 text-sm">
                      <option>16:9</option>
                      <option>9:16</option>
                      <option>1:1</option>
                    </select>
                  </div>
                </div>

                {message && <p className="mt-4 text-sm text-violet-300">{message}</p>}

                <button onClick={prepareVideo} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 font-semibold transition hover:bg-violet-500">
                  <Sparkles size={18} /> Prepare Video
                </button>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">Preview</h3>
                <span className="text-xs text-gray-500">Your canvas</span>
              </div>
              <div className="flex aspect-video flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#111522]">
                {image && mode === "image" ? (
                  <Image
                    src={image}
                    alt="Video preview"
                    width={1280}
                    height={720}
                    unoptimized
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <>
                    <div className="mb-4 rounded-2xl bg-violet-500/10 p-5">
                      <Play size={32} className="text-violet-400" />
                    </div>
                    <p className="font-medium text-gray-300">Your video preview</p>
                    <p className="mt-2 text-xs text-gray-500">Your creation will appear here</p>
                  </>
                )}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-[#111522] p-5">
                <h4 className="mb-4 font-semibold">Project settings</h4>
                <div className="flex items-center justify-between border-b border-white/10 py-3 text-sm">
                  <span className="text-gray-400">Creation mode</span>
                  <span>{mode === "text" ? "Text to Video" : "Image to Video"}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 py-3 text-sm">
                  <span className="text-gray-400">Duration</span>
                  <span>{duration}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 py-3 text-sm">
                  <span className="text-gray-400">Aspect ratio</span>
                  <span>{ratio}</span>
                </div>
                <div className="flex items-center justify-between py-3 text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="flex items-center gap-2 text-amber-300"><Clock size={14} /> Not generated</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
