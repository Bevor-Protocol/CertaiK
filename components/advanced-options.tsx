import React from 'react';

interface AdvancedOptionsModalProps {
  setPromptText: React.Dispatch<React.SetStateAction<string>>;
  promptText: string;
  onClose: () => void;
}

const AdvancedOptionsModal: React.FC<AdvancedOptionsModalProps> = ({ setPromptText, promptText, onClose }) => {
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptText(event.target.value);
  };

  const handleDownloadPrompt = () => {
    const blob = new Blob([promptText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-100"
      onClick={onClose}
    >
      <div
        className="bg-[#0a0a0a] p-6 rounded-lg max-w-4xl w-full h-[98vh] z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-4 z-20">
          {/* <img src="/logo.svg" alt="Logo" className="h-16 w-auto" /> */}
        </div>
        <button
          className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-2 px-4 rounded mr-2 mt-10"
          onClick={() => navigator.clipboard.writeText(promptText)}
        >
          Copy
        </button>
        <button
          className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-2 px-4 rounded mt-10"
          onClick={handleDownloadPrompt}
        >
          Download Prompt
        </button>
        <div className="bg-[#0a0a0a]/50 p-4 mt-10 rounded-lg text-white placeholder-white max-w-4xl w-full overflow-scroll h-[500px]">
          <textarea
            className="w-full h-full bg-transparent text-white p-2 border border-white rounded-lg"
            placeholder="Enter your prompt here..."
            onChange={handleTextChange}
            value={promptText}
          />
        </div>
        <div className="flex justify-center items-center">
          <button
            className="text-white py-2 px-4 rounded bg-gradient-to-r from-green-500 to-green-700"
            onClick={onClose}
          >
            Save and Close
          </button>
          <p className="text-xs text-gray-400 mb-0 max-w-[400px] text-center mr-4">
            Warning: Modifying the prompt will change how the audit outputs in potentially unexpected ways. 
            Ensure that you leave the <code>``` ```</code> at the bottom of the prompt for the AI to have a place to insert the code.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdvancedOptionsModal;