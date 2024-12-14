import React from 'react';
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { TbCopy } from "react-icons/tb";

const { materialDark } = require('react-syntax-highlighter/dist/esm/styles/prism');

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'code' | 'list' | 'markdown';
  language?: string;
}

export const parseMessage = (content: string): Message => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/;
  const codeMatch = content.match(codeBlockRegex);
  if (codeMatch) {
    return {
      role: 'assistant',
      content: codeMatch[2].trim(),
      type: 'code',
      language: codeMatch[1] || 'plaintext'
    };
  }

  const listRegex = /^(\s*[-*]|\d+\.)\s/gm;
  if (listRegex.test(content)) {
    return {
      role: 'assistant',
      content: content,
      type: 'list'
    };
  }

  const markdownRegex = /^(#{1,6}|\*\*|\*|__)/gm;
  if (markdownRegex.test(content)) {
    return {
      role: 'assistant',
      content: content,
      type: 'markdown'
    };
  }

  return {
    role: 'assistant',
    content: content,
    type: 'text'
  };
};

const renderMarkdownContent = (content: string) => {
  const lines = content.split('\n');
  return (
    <div className="markdown-content">
      {lines.map((line, index) => {
        if (line.startsWith('#')) {
          const level = line.match(/^#+/)?.[0].length || 1;
          const text = line.replace(/^#+\s*/, '');
          const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
          const processedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            .replace(/_(.*?)_/g, '<em>$1</em>');

          return React.createElement(HeadingTag, { 
            key: index, 
            className: `markdown-header markdown-h${level}`,
            dangerouslySetInnerHTML: { __html: processedText }
          });
        }

        if (line.match(/^\s*[-*]\s/) || line.match(/^\s*\d+\.\s/)) {
          const listText = line.replace(/^\s*[-*]\s*|\s*\d+\.\s*/, '');
          const processedListText = listText
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            .replace(/_(.*?)_/g, '<em>$1</em>');

          return (
            <div key={index} className="markdown-list-item pl-4 flex items-start mb-4">
              <span className="mr-2 text-white">•</span>
              <span dangerouslySetInnerHTML={{ __html: processedListText }} />
            </div>
          );
        }

        let processedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/__(.*?)__/g, '<strong>$1</strong>')
          .replace(/_(.*?)_/g, '<em>$1</em>');

        return (
          <div key={index} className="markdown-paragraph mb-4" dangerouslySetInnerHTML={{ __html: processedLine }} />
        );
      })}
    </div>
  );
};

export const renderMessage = (msg: Message) => {
  return (
    <div className="mb-4 flex">
      {msg.type === 'code' && (
        <Messages language={msg.language || 'plaintext'} content={msg.content} />
      )}

      {(msg.type === 'markdown' || msg.type === 'list') && (
        <div
          className={`max-w-xl p-5 ${
            msg.role === 'user'
              ? 'bg-neutral-800 text-white rounded-3xl rounded-br-sm shadow-[0_0_4px_rgba(255,255,255,0.4)]'
              : 'bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-500 rounded-3xl rounded-bl-sm shadow-[0_0_4px_rgba(255,255,255,0.4)]'
          }`}
        >
          {renderMarkdownContent(msg.content)}
        </div>
      )}

      {msg.type === 'text' && (
        <div
          className={`max-w-xl p-5 ${
            msg.role === 'user'
              ? 'bg-neutral-800 text-white rounded-3xl rounded-br-sm shadow-[0_0_4px_rgba(255,255,255,0.4)]'
              : 'bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-500 rounded-3xl rounded-bl-sm shadow-[0_0_4px_rgba(255,255,255,0.4)]'
          }`}
        >
          {msg.content}
        </div>
      )}
    </div>
  );
};

const copyToClipboard = (content: string) => {
  navigator.clipboard.writeText(content).catch((err) => console.error('Failed to copy code: ', err));
};

interface MessagesProps {
  language: string;
  content: string;
}

const languageMapping: { [key: string]: string } = {
  javascript: 'JavaScript',
  html: 'HTML',
  css: 'CSS',
  python: 'Python',
  java: 'Java',
  ruby: 'Ruby',
  php: 'PHP',
  csharp: 'C#',
  cpp: 'C++',
  swift: 'Swift',
  kotlin: 'Kotlin',
  go: 'Go',
  rust: 'Rust',
  sql: 'SQL',
  bash: 'Bash',
  perl: 'Perl',
  r: 'R',
  scala: 'Scala',
  dart: 'Dart',
  json: 'JSON',
  xml: 'XML',
  markdown: 'Markdown',
  yaml: 'YAML',
  shell: 'Shell',
  lua: 'Lua',
  pascal: 'Pascal',
  vbnet: 'VB.NET',
};

const Messages: React.FC<MessagesProps> = ({ language, content }) => {
  const displayLanguage = languageMapping[language.toLowerCase()] || language;

  return (
    <div className="max-w-xl my-4 overflow-hidden bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-500 rounded-3xl shadow-[0_0_4px_rgba(255,255,255,0.4)]">
      <div className="text-sm px-4 py-3 flex justify-between items-center">
        <span>{displayLanguage}</span>
        <button
          onClick={() => copyToClipboard(content)}
          className="flex items-center"
        >
          Copy
          <TbCopy className="ml-2" />
        </button>
      </div>
      <div className="relative">
        <SyntaxHighlighter
          language={language || 'plaintext'}
          style={materialDark}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '0.9rem',
            overflowX: 'auto',
            position: 'relative',
          }}
          codeTagProps={{
            className: 'text-sm',
          }}
        >
          {content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default Messages;