import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import './UploadZone.scss';

type Props = {
    onFileSelect: (file: File) => void;
    uploading?: boolean;
}

export const UploadZone = ({ onFileSelect, uploading = false }: Props) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                setSelectedFile(file);
                onFileSelect(file);
            } else {
                alert('Please select an image file');
            }
        }
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    };

    const handleClick = () => {
        if (!uploading) {
            fileInputRef.current?.click();
        }
    };

    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div 
            className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''} ${selectedFile ? 'has-file' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
            />
            
            <div className="upload-content">
                {uploading ? (
                    <>
                        <div className="upload-spinner"></div>
                        <h3>Uploading your photo...</h3>
                        <p>Please wait while we process your image</p>
                    </>
                ) : selectedFile ? (
                    <>
                        <div className="file-preview">
                            <div className="file-icon">📷</div>
                            <div className="file-info">
                                <h4>{selectedFile.name}</h4>
                                <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button 
                                className="remove-file"
                                onClick={handleRemoveFile}
                                aria-label="Remove file"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="upload-hint">Click to upload or drag a new image to replace</p>
                    </>
                ) : (
                    <>
                        <div className="upload-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.2639 15.9375L12.5958 14.2834C12.2668 13.9583 11.7332 13.9583 11.4042 14.2834L9.73608 15.9375C9.13137 16.5339 9.56201 17.5625 10.4653 17.5625H13.5347C14.438 17.5625 14.8686 16.5339 14.2639 15.9375Z" fill="currentColor"/>
                                <path d="M5.25 6C5.25 4.75736 6.25736 3.75 7.5 3.75H16.5C17.7426 3.75 18.75 4.75736 18.75 6V18C18.75 19.2426 17.7426 20.25 16.5 20.25H7.5C6.25736 20.25 5.25 19.2426 5.25 18V6Z" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                        </div>
                        <h3>Drop your photos here</h3>
                        <p>or <span className="upload-link">click to browse</span></p>
                        <small>Supports: JPG, PNG, GIF, WebP</small>
                    </>
                )}
            </div>
        </div>
    );
};