import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';


interface EditorToolbarProps {
  editor: Editor | null;
  activeTab?: 'text' | 'page';
  onTabChange?: (tab: 'text' | 'page') => void;
  // Page-specific props
  headerFooter?: boolean;
  margins?: boolean;
  rulers?: boolean;
  watermark?: boolean;
  zoom?: number;
  fill?: string;
  showCharacterCount?: boolean;
  onToggleHeaderFooter?: () => void;
  onToggleMargins?: () => void;
  onToggleRulers?: () => void;
  onToggleWatermark?: () => void;
  onZoomChange?: (zoom: number) => void;
  onFillChange?: (fill: string) => void;
  onToggleCharacterCount?: () => void;
  customHeader?: string;
  onHeaderChange?: (header: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  editor, 
  activeTab = 'text',
  onTabChange,
  headerFooter = true,
  margins = true,
  rulers = false,
  watermark = false,
  zoom = 100,
  fill = 'white',
  showCharacterCount = true,
  onToggleHeaderFooter,
  onToggleMargins,
  onToggleRulers,
  onToggleWatermark,
  onZoomChange,
  onFillChange,
  onToggleCharacterCount,
  customHeader = '',
  onHeaderChange
}) => {
  const [editorState, setEditorState] = useState(0);
  
  // Force re-render when editor state changes
  useEffect(() => {
    if (!editor) return;
    
    const updateHandler = () => {
      setEditorState(prev => prev + 1);
    };
    
    editor.on('selectionUpdate', updateHandler);
    editor.on('transaction', updateHandler);
    
    return () => {
      editor.off('selectionUpdate', updateHandler);
      editor.off('transaction', updateHandler);
    };
  }, [editor]);
  
  if (!editor) {
    return null;
  }

  const fontFamilies = [
    { name: 'Avenir Next', value: 'Avenir Next, system-ui, sans-serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
    { name: 'Courier New', value: 'Courier New, monospace' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
  ];

  const fontSizes = [
    { name: '8', value: 8 },
    { name: '10', value: 10 },
    { name: '12', value: 12 },
    { name: '16', value: 16 },
    { name: '18', value: 18 },
    { name: '20', value: 20 },
    { name: '24', value: 24 },
    { name: '36', value: 36 },
  ];

  const headingLevels = [
    { name: 'H1', value: 1 },
    { name: 'H2', value: 2 },
    { name: 'H3', value: 3 },
    { name: 'H4', value: 4 },
    { name: 'H5', value: 5 },
    { name: 'H6', value: 6 },
  ];



  const zoomLevels = [50, 75, 100, 125, 150, 200];
  const fillOptions = ['white', 'light-gray', 'light-blue', 'light-green', 'cream', 'light-yellow'];
  
  // Map fill options to display names
  const fillDisplayNames = {
    'white': 'White',
    'light-gray': 'Light Gray',
    'light-blue': 'Light Blue',
    'light-green': 'Light Green',
    'cream': 'Cream',
    'light-yellow': 'Light Yellow'
  };

  return (
    <div className="editor-toolbar bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300 shadow-md">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-300 bg-gradient-to-r from-gray-200 to-gray-300">
        <button
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${            activeTab === 'text'               ? 'text-blue-700 border-blue-500 bg-blue-50 shadow-inner font-semibold'               : 'text-gray-700 border-transparent hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300'          }`}
          onClick={() => onTabChange?.('text')}
          title="Text formatting tools"
        >
          Text
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${            activeTab === 'page'               ? 'text-blue-700 border-blue-500 bg-blue-50 shadow-inner font-semibold'               : 'text-gray-700 border-transparent hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300'          }`}
          onClick={() => onTabChange?.('page')}
          title="Page layout and formatting"
        >
          Page
        </button>
      </div>

      {/* Toolbar Content */}
      <div className="p-3 flex flex-wrap gap-2 items-center bg-white border-b border-gray-300">
        {activeTab === 'text' && (
          <>
            {/* Font Controls */}
            <div className="flex gap-1">
              <select
                className="border border-gray-400 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px] shadow-sm hover:border-blue-400 transition-all duration-200"
                value={(() => {
                  const currentFont = editor.getAttributes('textStyle').fontFamily;
                  if (!currentFont) return 'Avenir Next, system-ui, sans-serif';
                  
                  // Find the matching font from our list
                  const matchedFont = fontFamilies.find(font => 
                    font.value === currentFont || 
                    currentFont.includes(font.name) ||
                    font.value.includes(currentFont)
                  );
                  
                  return matchedFont ? matchedFont.value : currentFont;
                })()}
                onChange={(e) => {
                  if (e.target.value) {
                    editor.chain().focus().setFontFamily(e.target.value).run();
                  } else {
                    editor.chain().focus().unsetFontFamily().run();
                  }
                }}
                title="Font Family"
                style={{ 
                  fontFamily: (() => {
                    const currentFont = editor.getAttributes('textStyle').fontFamily;
                    return currentFont || 'Avenir Next, system-ui, sans-serif';
                  })(),
                  backgroundColor: editor.getAttributes('textStyle').fontFamily ? '#eff6ff' : 'white',
                  borderColor: editor.getAttributes('textStyle').fontFamily ? '#3b82f6' : '#9ca3af'
                }}
              >
                {fontFamilies.map((font) => (
                  <option 
                    key={font.name} 
                    value={font.value}
                    style={{ fontFamily: font.value }}
                  >
                    {font.name}
                  </option>
                ))}
              </select>
              
              <select
                className="border border-gray-400 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:border-blue-400 transition-all duration-200"
                value={(() => {
                  if (editor.isActive('bold')) return 'bold';
                  if (editor.isActive('italic')) return 'italic';
                  return '';
                })()}
                onChange={(e) => {
                  if (e.target.value === '') {
                    editor.chain().focus().unsetBold().unsetItalic().run();
                  } else if (e.target.value === 'bold') {
                    editor.chain().focus().unsetItalic().setBold().run();
                  } else if (e.target.value === 'italic') {
                    editor.chain().focus().unsetBold().setItalic().run();
                  }
                }}
                title="Font Style"
                style={{
                  fontWeight: editor.isActive('bold') ? 'bold' : 'normal',
                  fontStyle: editor.isActive('italic') ? 'italic' : 'normal',
                  backgroundColor: (editor.isActive('bold') || editor.isActive('italic')) ? '#eff6ff' : 'white',
                  borderColor: (editor.isActive('bold') || editor.isActive('italic')) ? '#3b82f6' : '#9ca3af'
                }}
              >
                <option value="" style={{ fontWeight: 'normal', fontStyle: 'normal' }}>Regular</option>
                <option value="bold" style={{ fontWeight: 'bold' }}>Bold</option>
                <option value="italic" style={{ fontStyle: 'italic' }}>Italic</option>
              </select>
              
              <select
                className="border border-gray-400 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:border-blue-400 transition-all duration-200"
                value={(() => {
                  const fontSize = editor.getAttributes('textStyle').fontSize;
                  if (fontSize) {
                    const sizeValue = parseInt(fontSize.replace('px', ''));
                    return sizeValue.toString();
                  }
                  return '12';
                })()}
                onChange={(e) => {
                  const size = parseInt(e.target.value);
                  if (size && !isNaN(size)) {
                    // Simple and direct font size application
                    editor.chain().focus().setMark('textStyle', { 
                      fontSize: `${size}px` 
                    }).run();
                  }
                }}
                title="Font Size"
                style={{
                  backgroundColor: editor.getAttributes('textStyle').fontSize ? '#eff6ff' : 'white',
                  borderColor: editor.getAttributes('textStyle').fontSize ? '#3b82f6' : '#9ca3af'
                }}
              >
                {fontSizes.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Heading Dropdown */}
            <div className="flex gap-1">
              <select
                className="border border-indigo-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm hover:border-indigo-400 transition-all duration-200"
                value={editor.getAttributes('heading').level || '0'}
                onChange={(e) => {
                  const level = parseInt(e.target.value);
                  if (level === 0) {
                    editor.chain().focus().setParagraph().run();
                  } else {
                    editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
                  }
                }}
                title="Heading Level"
                style={{
                  fontWeight: editor.isActive('heading') ? 'bold' : 'normal',
                  fontSize: editor.isActive('heading') ? 
                    `${18 - (editor.getAttributes('heading').level || 0)}px` : 'inherit'
                }}
              >
                <option value="0">Header</option>
                {headingLevels.map((heading) => (
                  <option 
                    key={heading.value} 
                    value={heading.value}
                    style={{ fontWeight: heading.value === 1 ? 'bold' : heading.value === 2 ? 'semibold' : 'normal', fontSize: `${18 - heading.value}px` }}
                  >
                    {heading.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Text Formatting Buttons */}
            <div className="flex gap-1">
              <button
                className={`p-2 rounded transition-all duration-200 shadow-sm ${editor.isActive('bold') ? 'bg-blue-500 text-white border border-blue-600 shadow-md transform scale-105' : 'hover:bg-blue-100 border border-transparent hover:border-blue-300 hover:text-blue-700'}`}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold (Ctrl+B)"
              >
                <strong>B</strong>
              </button>
              
              <button
                className={`p-2 rounded transition-all duration-200 shadow-sm ${editor.isActive('italic') ? 'bg-blue-500 text-white border border-blue-600 shadow-md transform scale-105' : 'hover:bg-blue-100 border border-transparent hover:border-blue-300 hover:text-blue-700'}`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic (Ctrl+I)"
              >
                <em>I</em>
              </button>
              
              <button
                className={`p-2 rounded transition-all duration-200 shadow-sm ${editor.isActive('underline') ? 'bg-blue-500 text-white border border-blue-600 shadow-md transform scale-105' : 'hover:bg-blue-100 border border-transparent hover:border-blue-300 hover:text-blue-700'}`}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Underline (Ctrl+U)"
              >
                <u>U</u>
              </button>
              
              <button
                className={`p-2 rounded transition-all duration-200 shadow-sm ${editor.isActive('strike') ? 'bg-blue-500 text-white border border-blue-600 shadow-md transform scale-105' : 'hover:bg-blue-100 border border-transparent hover:border-blue-300 hover:text-blue-700'}`}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                title="Strikethrough"
              >
                <s>S</s>
              </button>
            </div>

            {/* Link Button */}
            <button
              className={`p-2 rounded transition-colors shadow-sm ${editor.isActive('link') ? 'bg-gray-200 text-gray-800 border border-gray-400' : 'hover:bg-gray-100 border border-transparent hover:border-gray-400'}`}
              onClick={() => {
                const url = window.prompt('Enter URL');
                if (url) {
                  // If there's no selection, insert link text first
                  const { from, to } = editor.state.selection;
                  if (from === to) {
                    // No text selected, insert link text
                    const linkText = window.prompt('Enter link text', url);
                    if (linkText) {
                      editor.chain().focus().insertContent(`<a href="${url}">${linkText}</a>`).run();
                    }
                  } else {
                    // Text is selected, apply link to selection
                    editor.chain().focus().setLink({ href: url }).run();
                  }
                }
              }}
              title="Insert Link"
            >
              🔗
            </button>

            {/* Color Picker */}
            <div className="flex gap-1">
              <input
                type="color"
                className="w-8 h-8 border border-gray-400 rounded cursor-pointer shadow-sm hover:border-gray-600 transition-all duration-200"
                value={editor.getAttributes('textStyle').color || '#000000'}
                onChange={(e) => {
                  editor.chain().focus().setColor(e.target.value).run();
                }}
                title="Text Color"
              />
              
              <button
                className="p-2 rounded hover:bg-gray-100 transition-colors shadow-sm border border-transparent hover:border-gray-400"
                onClick={() => {
                  const color = window.prompt('Enter highlight color (hex)');
                  if (color) {
                    editor.chain().focus().toggleHighlight({ color }).run();
                  }
                }}
                title="Highlight Text"
              >
                ✏️
              </button>
            </div>

            {/* Alignment Buttons */}
            <div className="flex gap-1">
              <button
                className={`p-2 rounded transition-colors shadow-sm ${editor.isActive({ textAlign: 'left' }) ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'hover:bg-gray-100 border border-transparent hover:border-gray-300'}`}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                title="Align Left"
              >
                ⬅️
              </button>
              
              <button
                className={`p-2 rounded transition-colors shadow-sm ${editor.isActive({ textAlign: 'center' }) ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'hover:bg-gray-100 border border-transparent hover:border-gray-300'}`}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                title="Align Center"
              >
                ↔️
              </button>
              
              <button
                className={`p-2 rounded transition-colors shadow-sm ${editor.isActive({ textAlign: 'right' }) ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'hover:bg-gray-100 border border-transparent hover:border-gray-300'}`}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                title="Align Right"
              >
                ➡️
              </button>
              
              <button
                className={`p-2 rounded transition-colors shadow-sm ${editor.isActive({ textAlign: 'justify' }) ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'hover:bg-gray-100 border border-transparent hover:border-gray-300'}`}
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                title="Justify"
              >
                ↕️
              </button>
            </div>

            {/* List Buttons */}
            <div className="flex gap-1">
              <button
                className={`p-2 rounded transition-colors shadow-sm ${editor.isActive('bulletList') ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'hover:bg-gray-100 border border-transparent hover:border-gray-300'}`}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Bullet List"
              >
                •
              </button>
              
              <button
                className={`p-2 rounded transition-colors shadow-sm ${editor.isActive('orderedList') ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'hover:bg-gray-100 border border-transparent hover:border-gray-300'}`}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Numbered List"
              >
                1.
              </button>
            </div>

            {/* Heading Controls */}
            <div className="flex gap-1">
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded transition-colors shadow-sm ${
                  editor.isActive('heading', { level: 1 }) ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'hover:bg-gray-100 border border-transparent hover:border-gray-300'
                }`}
                title="Heading 1"
              >
                H1
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded transition-colors shadow-sm ${
                  editor.isActive('heading', { level: 2 }) ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'hover:bg-gray-100 border border-transparent hover:border-gray-300'
                }`}
                title="Heading 2"
              >
                H2
              </button>
            </div>

            {/* More Options */}
            <div className="flex gap-1">
              
              <button
                className={`p-2 rounded transition-colors shadow-sm ${editor.isActive('superscript') ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'hover:bg-gray-100 border border-transparent hover:border-gray-300'}`}
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                title="Superscript"
              >
                X²
              </button>
              
              <button
                className={`p-2 rounded transition-colors shadow-sm ${editor.isActive('subscript') ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'hover:bg-gray-100 border border-transparent hover:border-gray-300'}`}
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                title="Subscript"
              >
                X₂
              </button>
              
              <button
                className="p-2 rounded hover:bg-gray-100 transition-colors shadow-sm border border-transparent hover:border-gray-300"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Insert Horizontal Rule"
              >
                ─
              </button>
              
              <button
                className="p-2 rounded hover:bg-gray-100 transition-colors shadow-sm border border-transparent hover:border-gray-300"
                onClick={() => {
                  // For vertical rule, we'll insert a vertical line character
                  editor.chain().focus().insertContent('│').run();
                }}
                title="Insert Vertical Rule"
              >
                │
              </button>
              
              <button
                className="p-2 rounded hover:bg-gray-100 transition-colors shadow-sm border border-transparent hover:border-gray-300"
                onClick={() => {
                  const url = prompt('Enter the image URL');
                  if (url) {
                    editor.chain().focus().insertContent({
                      type: 'image',
                      attrs: { src: url }
                    }).run();
                  }
                }}
                title="Insert Image"
              >
                🖼️
              </button>
              
              <button
                className="p-2 rounded hover:bg-gray-100 transition-colors shadow-sm border border-transparent hover:border-gray-300"
                onClick={() => {
                  const rows = parseInt(prompt('Number of rows:') || '3');
                  const cols = parseInt(prompt('Number of columns:') || '3');
                  if (rows > 0 && cols > 0) {
                    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
                  }
                }}
                title="Insert Table"
              >
                📊
              </button>
            </div>
          </>
        )}

        {activeTab === 'page' && (
          <>
            {/* Header & Footer */}
            <button
              className={`p-2 rounded flex items-center gap-1 transition-colors shadow-sm ${                headerFooter ? 'bg-gray-200 text-gray-800 border border-gray-400' : 'hover:bg-gray-100 border border-transparent hover:border-gray-400'              }`}
              onClick={onToggleHeaderFooter}
              title="Toggle Header & Footer"
            >
              👁️ Header & Footer
            </button>

            {/* Margins */}
            <button
              className={`p-2 rounded flex items-center gap-1 transition-colors shadow-sm ${                margins ? 'bg-gray-200 text-gray-800 border border-gray-400' : 'hover:bg-gray-100 border border-transparent hover:border-gray-400'              }`}
              onClick={onToggleMargins}
              title="Toggle Page Margins"
            >
              🔗 Margin
            </button>

            {/* Rulers */}
            <button
              className={`p-2 rounded flex items-center gap-1 transition-colors shadow-sm ${                rulers ? 'bg-gray-200 text-gray-800 border border-gray-400' : 'hover:bg-gray-100 border border-transparent hover:border-gray-400'              }`}
              onClick={onToggleRulers}
              title="Toggle Rulers"
            >
              🔗 Rulers
            </button>

            {/* Watermark */}
            <button
              className={`p-2 rounded flex items-center gap-1 transition-colors shadow-sm ${                watermark ? 'bg-gray-200 text-gray-800 border border-gray-400' : 'hover:bg-gray-100 border border-transparent hover:border-gray-400'              }`}
              onClick={onToggleWatermark}
              title="Toggle Watermark"
            >
              Watermark
            </button>

            {/* Zoom */}
            <div className="flex items-center gap-1">
              <select
                className="border border-gray-400 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-600 shadow-sm hover:border-gray-600 transition-all duration-200"
                value={zoom}
                onChange={(e) => onZoomChange?.(parseInt(e.target.value))}
                title="Zoom Level"
              >
                {zoomLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}%
                  </option>
                ))}
              </select>
            </div>

            {/* Fill */}
            <div className="flex items-center gap-1">
              <select
                className="border border-gray-400 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-600 shadow-sm hover:border-gray-600 transition-all duration-200"
                value={fill}
                onChange={(e) => onFillChange?.(e.target.value)}
                title="Page Fill Color"
              >
                {fillOptions.map((option) => (
                  <option key={option} value={option}>
                    {fillDisplayNames[option as keyof typeof fillDisplayNames]}
                  </option>
                ))}
              </select>
            </div>

            {/* Character Count */}
            <button
              className={`p-2 rounded flex items-center gap-1 transition-colors shadow-sm ${                showCharacterCount ? 'bg-gray-200 text-gray-800 border border-gray-400' : 'hover:bg-gray-100 border border-transparent hover:border-gray-400'              }`}
              onClick={onToggleCharacterCount}
              title="Toggle Character Count Display"
            >
              👁️ Character count
            </button>

            {/* Print/Export Button */}
            <button
              className="p-2 rounded bg-blue-50 hover:bg-blue-100 transition-colors shadow-sm border border-blue-300 hover:border-blue-400 text-blue-700 flex items-center gap-1"
              onClick={() => {
                const content = editor.getHTML();
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  // Get current page settings
                  const pageBackground = fill || 'white';
                  const pageMargins = margins ? '40px' : '0';
                  
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Print/Export</title>
                        <style>
                          @import url('https://fonts.googleapis.com/css2?family=Avenir+Next&family=Arial&family=Georgia&family=Times+New+Roman&family=Courier+New&family=Verdana&display=swap');
                          
                          body { 
                            font-family: Arial, sans-serif; 
                            background-color: ${pageBackground === 'white' ? 'white' : 
                                               pageBackground === 'light-gray' ? '#f5f5f5' :
                                               pageBackground === 'light-blue' ? '#f0f8ff' :
                                               pageBackground === 'light-green' ? '#f0fff0' :
                                               pageBackground === 'cream' ? '#fffdd0' :
                                               pageBackground === 'light-yellow' ? '#fffacd' : 'white'};
                            margin: 0;
                            padding: 0;
                          }
                          
                          .page {
                            width: 8.5in;
                            min-height: 11in;
                            padding: ${pageMargins};
                            margin: 20px auto;
                            background-color: white;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                            position: relative;
                          }
                          
                          @media print {
                            body { background-color: white; }
                            .page { 
                              width: 100%; 
                              height: 100%; 
                              margin: 0; 
                              padding: ${pageMargins};
                              box-shadow: none;
                            }
                            .no-print { display: none; }
                          }
                          
                          .header, .footer {
                            padding: 10px;
                            text-align: center;
                            color: #666;
                            font-size: 12px;
                          }
                          
                          .content { min-height: 9in; }
                        </style>
                      </head>
                      <body>
                        <div class="no-print" style="text-align: center; padding: 20px;">
                          <button onclick="window.print()" style="padding: 10px 20px; background: #4a86e8; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
                            Print / Save as PDF
                          </button>
                        </div>
                        
                        <div class="page">
                          ${headerFooter ? '<div class="header">' + (customHeader || 'Document created with TipTap Editor') + '</div>' : ''}
                          <div class="content">${content}</div>
                          ${headerFooter ? '<div class="footer">Page 1</div>' : ''}
                        </div>
                        
                        <script>
                          // Apply any additional formatting
                          document.addEventListener('DOMContentLoaded', function() {
                            // Any additional JavaScript for formatting can go here
                          });
                        </script>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                }
              }}
              title="Print/Export"
            >
              <span>🖨️</span> <span>Print/Export</span>
            </button>

            {/* Header Editing */}
            <div className="flex items-center gap-3 ml-4 border-l border-gray-300 pl-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-600">Header:</label>
                <input
                  type="text"
                  placeholder="Enter header text"
                  value={customHeader}
                  onChange={(e) => onHeaderChange?.(e.target.value)}
                  className="border border-gray-400 rounded px-3 py-1 text-sm w-40 focus:outline-none focus:ring-1 focus:ring-gray-600 shadow-sm hover:border-gray-600 transition-all duration-200"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditorToolbar;