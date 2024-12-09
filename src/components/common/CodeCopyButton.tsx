/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/12/9
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy, FaCheck } from 'react-icons/fa';

const CodeCopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // 2秒后恢复
    };

    return (
        <CopyToClipboard text={text} onCopy={handleCopy}>
            <button
                className="bg-gray-700 rounded-md text-white hover:bg-gray-600">
                {copied ? <FaCheck /> : <FaCopy />}
            </button>
        </CopyToClipboard>
    );
};

export default CodeCopyButton;
