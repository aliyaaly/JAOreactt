import React, { useState, useRef, useEffect } from 'react';
import { XIcon, RotateCwIcon, UploadIcon } from './Icons';

const ImageEditorModal = ({ src, onClose, onSave, onUpload, t }) => {
    // All hooks are now at the top level, before any conditions.
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    const containerRef = useRef(null);
    useEffect(() => {
    // The conditional return is now placed after the hooks.
    if (!src) return null;

    
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
            const container = containerRef.current;
            if (!container || container.offsetWidth === 0) {
                setTimeout(() => {
                    if (containerRef.current) {
                        const cWidth = containerRef.current.offsetWidth;
                        const cHeight = containerRef.current.offsetHeight;
                        const { naturalWidth, naturalHeight } = img;
                        const widthRatio = cWidth / naturalWidth;
                        const heightRatio = cHeight / naturalHeight;
                        setZoom(Math.min(widthRatio, heightRatio));
                    }
                }, 100);
                return;
            }
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            const { naturalWidth, naturalHeight } = img;
            
            const widthRatio = containerWidth / naturalWidth;
            const heightRatio = containerHeight / naturalHeight;
            const initialZoom = Math.min(widthRatio, heightRatio, 1);
            
            setZoom(initialZoom);
            setPosition({ x: 0, y: 0 });
            setRotation(0);
        };
        img.onerror = () => {
            console.error("Failed to load image for editor.");
        }
    }, [src]);

    if (!src) return null;

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => { 
        if (isDragging) { 
            setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); 
        } 
    };
    const handleMouseUp = () => setIsDragging(false);
    const handleWheel = (e) => {
        e.preventDefault();
        const newZoom = zoom - e.deltaY * 0.001;
        setZoom(Math.min(Math.max(newZoom, 0.1), 5));
    };

    const handleSave = () => {
        const container = containerRef.current;
        if (!container) return;

        window.html2canvas(container, {
            useCORS: true,
            backgroundColor: '#FFFFFF',
        })
        .then(canvas => {
            const outputSize = 300;
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = outputSize;
            finalCanvas.height = outputSize;
            const ctx = finalCanvas.getContext('2d');
            
            ctx.drawImage(canvas, 0, 0, outputSize, outputSize);
            
            const dataUrl = finalCanvas.toDataURL('image/png');
            onSave(dataUrl);
        })
        .catch(err => {
            console.error("html2canvas error:", err);
            alert("Sorry, there was an error saving the image. Please try again.");
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md m-4 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"> 
                    <XIcon /> 
                </button>
                <h3 className="text-xl font-bold mb-4 text-center">{t.photo}</h3>
                <div 
                    ref={containerRef}
                    className="w-full max-w-sm mx-auto aspect-square bg-gray-200 rounded-md overflow-hidden relative cursor-grab"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    <img
                        ref={imageRef}
                        src={src}
                        alt="Preview"
                        crossOrigin="anonymous"
                        className="absolute top-1/2 left-1/2"
                        style={{
                            transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                            cursor: isDragging ? 'grabbing' : 'grab'
                        }}
                    />
                     <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/3 left-0 w-full h-px bg-white/50"></div>
                        <div className="absolute top-2/3 left-0 w-full h-px bg-white/50"></div>
                        <div className="absolute top-0 left-1/3 w-px h-full bg-white/50"></div>
                        <div className="absolute top-0 left-2/3 w-px h-full bg-white/50"></div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 items-center mt-4">
                     <div className="space-y-2">
                         <label className="block text-sm font-medium text-gray-700 text-center">{t.rotate}</label>
                          <div className="flex items-center gap-2">
                              <button onClick={() => setRotation(0)} className="p-1 rounded-full hover:bg-gray-100"><RotateCwIcon/></button>
                              <input type="range" min="-180" max="180" step="1" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value, 10))} className="w-full"/>
                         </div>
                    </div>
                     <div className="space-y-2">
                         <label className="block text-sm font-medium text-gray-700 text-center">{t.zoom}</label>
                         <input type="range" min="0.1" max="5" step="0.05" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full"/>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                     <button onClick={onUpload} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                         <UploadIcon />
                         <span>{t.uploadImage}</span>
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">{t.confirm}</button>
                </div>
            </div>
        </div>
    );
};

export default ImageEditorModal;

