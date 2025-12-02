import React, { useState } from 'react';

interface CustomTextModalProps {
    onSubmit: (text: string) => void;
    onClose: () => void;
}

const CustomTextModal: React.FC<CustomTextModalProps> = ({ onSubmit, onClose }) => {
    const [text, setText] = useState('');

    const handleSubmit = () => {
        if (text.trim()) {
            onSubmit(text.trim());
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Custom Text</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <textarea
                        className="custom-text-input"
                        placeholder="Enter your custom text here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={10}
                        autoFocus
                    />
                    <button className="submit-btn" onClick={handleSubmit}>
                        Start Typing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomTextModal;
