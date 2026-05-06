import React, { useRef, useState, useEffect } from "react";
import { X, Eraser, Check, Type, Pencil } from "lucide-react";

interface DrawingCanvasProps {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
  initialColor?: string;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  onSave,
  onCancel,
  initialColor = "#111111",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(initialColor);
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<"pen" | "eraser" | "text">("pen");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        requestAnimationFrame(handleResize);
        return;
      }
      canvas.width = rect.width;
      canvas.height = rect.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (tool !== "text") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    const text = prompt("Enter your note:");
    if (text) {
      ctx.font = `${brushSize * 5}px Georgia, serif`;
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary canvas to trim the empty space
    // For now, just save the whole thing as is
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div className='w-full h-full flex flex-col bg-white'>
      {/* Toolbar */}
      <div className='h-12 bg-stone-100 border-b border-stone-200 flex items-center justify-between px-4 shrink-0'>
        <div className='flex items-center gap-3'>
          <div className='flex bg-white border border-stone-200 rounded-lg p-0.5 shadow-sm'>
            <button
              onClick={() => setTool("pen")}
              className={`p-1.5 rounded-md transition-all ${tool === "pen" ? "bg-indigo-50 text-indigo-600 shadow-inner" : "text-stone-500 hover:text-stone-700"}`}
              title='Pen Tool'
            >
              <Pencil className='w-4 h-4' />
            </button>
            <button
              onClick={() => setTool("eraser")}
              className={`p-1.5 rounded-md transition-all ${tool === "eraser" ? "bg-indigo-50 text-indigo-600 shadow-inner" : "text-stone-500 hover:text-stone-700"}`}
              title='Eraser Tool'
            >
              <Eraser className='w-4 h-4' />
            </button>
            <button
              onClick={() => setTool("text")}
              className={`p-1.5 rounded-md transition-all ${tool === "text" ? "bg-indigo-50 text-indigo-600 shadow-inner" : "text-stone-500 hover:text-stone-700"}`}
              title='Text Tool'
            >
              <Type className='w-4 h-4' />
            </button>
          </div>

          <div className='h-6 w-px bg-stone-300 mx-1' />

          {/* Color Picker */}
          <div className='flex items-center gap-1.5'>
            {[
              "#111111",
              "#ef4444",
              "#3b82f6",
              "#10b981",
              "#f59e0b",
              "#8b5cf6",
            ].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setTool("pen");
                }}
                className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${color === c && tool === "pen" ? "border-stone-400 scale-110" : "border-transparent"}`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type='color'
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                setTool("pen");
              }}
              className='w-5 h-5 bg-transparent border-none cursor-pointer'
            />
          </div>

          <div className='h-6 w-px bg-stone-300 mx-1' />

          {/* Brush Size */}
          <div className='flex items-center gap-2'>
            <input
              type='range'
              min='1'
              max='20'
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className='w-20 accent-indigo-600'
            />
            <span className='text-[10px] font-mono text-stone-500 w-4'>
              {brushSize}
            </span>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={clearCanvas}
            className='flex items-center gap-1.5 text-xs text-stone-500 hover:text-red-600 px-2 py-1.5 transition-colors'
          >
            <Eraser className='w-3.5 h-3.5' /> Clear
          </button>
          <button
            onClick={onCancel}
            className='p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-200 rounded-full transition-colors'
            title='Close'
          >
            <X className='w-5 h-5' />
          </button>
          <button
            onClick={handleSave}
            className='flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium shadow-md transition-all active:scale-95'
          >
            <Check className='w-3.5 h-3.5' /> Insert Drawing
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative cursor-crosshair overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onClick={handleCanvasClick}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className='w-full h-full touch-none'
        />
      </div>

      <div className='h-8 bg-stone-50 border-t border-stone-200 flex items-center px-4 justify-center'>
        <p className='text-[10px] text-stone-400 font-serif italic uppercase tracking-wider'>
          Virtual Pen Mode — Draw or write your thoughts
        </p>
      </div>
    </div>
  );
};

export default DrawingCanvas;
