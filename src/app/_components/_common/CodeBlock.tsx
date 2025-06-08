'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'javascript' }) => {
  return (
    <div className="font-mono text-sm text-gray-300 overflow-x-auto">
      {code.split('\n').map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          className="whitespace-pre"
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
};

export default CodeBlock;