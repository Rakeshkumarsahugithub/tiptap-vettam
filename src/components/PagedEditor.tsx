import React, { useState, useEffect, useRef, createRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import { FontSize } from '@tiptap/extension-font-size'
import { Color } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';
import { Superscript } from '@tiptap/extension-superscript';
import { Subscript } from '@tiptap/extension-subscript';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Image } from '@tiptap/extension-image';
import EditorToolbar from './EditorToolbar';


// A4 page dimensions in pixels (assuming 96 DPI)
const A4_WIDTH_PX = 794; // 210mm at 96 DPI
const A4_HEIGHT_PX = 1123; // 297mm at 96 DPI
const PAGE_PADDING = 40; // Padding inside each page

interface PagedEditorProps {
  documentTitle?: string;
  initialContent?: string;
}

const PagedEditor: React.FC<PagedEditorProps> = ({ 
  initialContent = '<p>Do Androids Dream of Electric Sheep? is a 1968 dystopian science fiction novel by American writer Philip K. Dick. Set in a post-apocalyptic San Francisco, the story unfolds after a devastating global war.</p><p>1. Androids and Humans: The novel explores the uneasy coexistence of humans and androids. Androids, manufactured on Mars, rebel, kill their owners, and escape to Earth, where they hope to remain undetected.[1]</p><p>2. Empathy and Identity: To distinguish androids from humans, the Voigt-Kampff Test measures emotional responses. Androids lack empathy, making them vulnerable to detection. Criminal [2005][2]</p><p>Do Androids Dream of Electric Sheep? is a 1968 dystopian science fiction novel by American writer Philip K. Dick. Set in a post-apocalyptic San Francisco, the story unfolds after a devastating global war.</p><p>1. Androids and Humans: The novel explores the uneasy coexistence of humans and androids. Androids, manufactured on Mars, rebel, kill their owners, and escape to Earth, where they hope to remain undetected.[1]</p><p>2. Empathy and Identity: To distinguish androids from humans, the Voigt-Kampff Test measures emotional responses. Androids lack empathy, making them vulnerable to detection. Criminal [2005][2]</p>'
}) => {
  const [pages, setPages] = useState<number[]>([1]); // Start with 1 page
  const pageRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const [activeTab, setActiveTab] = useState<'text' | 'page'>('text');
  const [rulers, setRulers] = useState<boolean>(false);
  const [headerFooter, setHeaderFooter] = useState<boolean>(true);
  const [margins, setMargins] = useState<boolean>(true);
  const [watermark, setWatermark] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(100);
  const [fill, setFill] = useState<string>('white');
  const [showCharacterCount, setShowCharacterCount] = useState<boolean>(true);
 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [charactersPerPage] = useState<number>(1500); // Character limit per page
  const [askVettamQuery, setAskVettamQuery] = useState<string>('');
  const [customHeader, setCustomHeader] = useState<string>('');
  
  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
      scrollToPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToPage(currentPage - 1);
    }
  };
  
  // Function to scroll to a specific page
  const scrollToPage = (pageNum: number) => {
    if (pageRefs.current[pageNum - 1] && pageRefs.current[pageNum - 1].current) {
      pageRefs.current[pageNum - 1].current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle.configure({
        HTMLAttributes: {
          class: 'text-style',
        },
      }),
      FontFamily,
      FontSize,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Superscript,
      Subscript,
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CharacterCount.configure({
        limit: 10000,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  // Calculate pages based on character count
  useEffect(() => {
    if (editor) {
      const characterCount = editor.storage.characterCount.characters();
      // Ensure we always have at least one page, and calculate exact pages based on fixed character count
      const calculatedPageCount = Math.max(1, Math.ceil(characterCount / charactersPerPage));
      
      const newPages = Array.from({ length: calculatedPageCount }, (_, i) => i + 1);
      setPages(newPages);
      
      // Update refs array when page count changes
      pageRefs.current = newPages.map((_, i) => 
        pageRefs.current[i] || createRef<HTMLDivElement>()
      );
      
      if (currentPage > calculatedPageCount) {
        setCurrentPage(calculatedPageCount);
      }
    }
  }, [editor?.storage.characterCount.characters(), charactersPerPage]);



  // Toggle rulers
  const toggleRulers = () => {
    setRulers(!rulers);
  };

  // Toggle header and footer
  const toggleHeaderFooter = () => {
    setHeaderFooter(!headerFooter);
  };

  // Toggle margins
  const toggleMargins = () => {
    setMargins(!margins);
  };

  // Toggle watermark
  const toggleWatermark = () => {
    setWatermark(!watermark);
  };

  // Change zoom level
  const changeZoom = (newZoom: number) => {
    setZoom(newZoom);
  };

  // Change fill
  const changeFill = (newFill: string) => {
    setFill(newFill);
  };

  // Toggle character count
  const toggleCharacterCount = () => {
    setShowCharacterCount(!showCharacterCount);
  };

  // Handle Ask Vettam submission
  const handleAskVettam = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Ask Vettam query:', askVettamQuery);
    setAskVettamQuery('');
  };

  // These navigation functions are already defined above
  // Removing duplicate functions to fix the syntax error

  if (!editor) {
    return null;
  }

  return (
    <div className="paged-editor h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Editor Toolbar */}
      <EditorToolbar 
        editor={editor} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        headerFooter={headerFooter}
        margins={margins}
        rulers={rulers}
        watermark={watermark}
        zoom={zoom}
        fill={fill}
        showCharacterCount={showCharacterCount}
        onToggleHeaderFooter={toggleHeaderFooter}
        onToggleMargins={toggleMargins}
        onToggleRulers={toggleRulers}
        onToggleWatermark={toggleWatermark}
        onZoomChange={changeZoom}
        onFillChange={changeFill}
        onToggleCharacterCount={toggleCharacterCount}
        customHeader={customHeader}
        onHeaderChange={setCustomHeader}
      />
      
      {/* Top pagination removed as requested */}

      {/* Main Content - Fixed height for desktop */}
      <div className="h-[calc(100vh-160px)] overflow-auto bg-gray-100 px-4 py-6">
        {/* Editor Content */}
        <div className="h-full">
          {activeTab === 'page' ? (
            <div 
              className="flex justify-center p-6"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            >
              <div className="flex flex-col items-center">
                {pages.map((pageNum) => {
                    // Calculate exact character range for this page
                    // For page 1: 0-1500, page 2: 1501-3000, etc.
                    const startChar = (pageNum - 1) * charactersPerPage;
                    const endChar = Math.min(pageNum * charactersPerPage, editor ? editor.storage.characterCount.characters() : 0);
                    
                    return (
                    <div 
                      key={pageNum}
                      ref={pageRefs.current[pageNum - 1]}
                      className="relative shadow-xl mb-1 rounded"
                      style={{
                        width: `${A4_WIDTH_PX}px`,
                        height: `${A4_HEIGHT_PX * 0.6}px`,
                        padding: margins ? `${PAGE_PADDING}px` : '0',
                        backgroundColor: 
                          fill === 'light-gray' ? '#f3f4f6' : 
                          fill === 'light-blue' ? '#eff6ff' : 
                          fill === 'light-green' ? '#ecfdf5' : 
                          fill === 'cream' ? '#fffbeb' : 
                          fill === 'light-yellow' ? '#fef9c3' : 
                          fill === 'white' ? '#ffffff' : '#ffffff'
                      }}
                    >
                      {/* Header */}
                      {headerFooter && customHeader && (
                        <div className="absolute top-4 left-4 right-4 text-center text-xs text-gray-700 font-medium border-b border-gray-200 pb-2">
                          {customHeader}
                        </div>
                      )}
                      

                      
                      {/* Rulers */}
                      {rulers && (
                        <div className="rulers">
                          <div className="horizontal-ruler absolute top-0 left-0 w-full h-6 bg-gray-50 border-b flex">
                            {Array.from({ length: 21 }).map((_, i) => (
                              <div key={i} className="ruler-mark border-r h-full flex-1 flex items-end justify-center text-xs text-gray-400">
                                {i}
                              </div>
                            ))}
                          </div>
                          <div className="vertical-ruler absolute top-0 left-0 h-full w-6 bg-gray-50 border-r flex flex-col">
                            {Array.from({ length: 30 }).map((_, i) => (
                              <div key={i} className="ruler-mark border-b w-full flex-1 flex items-center justify-end pr-1 text-xs text-gray-400">
                                {i}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Watermark */}
                      {watermark && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-45 text-5xl font-bold text-gray-500">
                          DRAFT
                        </div>
                      )}
                      
                      {/* Page Content */}
                      <div className="relative h-full overflow-hidden">
                        <div 
                          className="prose prose-sm max-w-none h-full overflow-hidden p-4"
                          style={{ 
                            paddingTop: rulers ? '28px' : (headerFooter && customHeader) ? '40px' : '16px',
                            paddingLeft: rulers ? '28px' : '16px',
                            paddingBottom: '16px',
                            paddingRight: '16px'
                          }}
                        >
                          <style>
                            {`
                              /* ProseMirror Required CSS */
                              .ProseMirror {
                                white-space: pre-wrap;
                                word-wrap: break-word;
                                -webkit-font-variant-ligatures: none;
                                font-variant-ligatures: none;
                                font-feature-settings: "liga" 0;
                                outline: none;
                              }
                              
                              /* Image styling for page view */
                              .ProseMirror img {
                                max-width: 100%;
                                height: auto;
                                display: block;
                                margin: 8px 0;
                                border-radius: 4px;
                              }
                              
                              /* Enhanced styling for all rich text elements in page view */
                              
                              /* Font family and size support - Fixed to preserve actual values */
                              .editor-content-wrapper [style*="font-family"] {
                                /* Don't override, let the inline style take precedence */
                              }
                              
                              .editor-content-wrapper [style*="font-size"] {
                                /* Don't override, let the inline style take precedence */
                              }
                              
                              /* Text styling */
                              .editor-content-wrapper strong, .editor-content-wrapper b {
                                font-weight: bold !important;
                              }
                              
                              .editor-content-wrapper em, .editor-content-wrapper i {
                                font-style: italic !important;
                              }
                              
                              .editor-content-wrapper u {
                                text-decoration: underline !important;
                              }
                              
                              .editor-content-wrapper s {
                                text-decoration: line-through !important;
                              }
                              
                              /* Link styling */
                              .editor-content-wrapper a {
                                color: #2563eb !important;
                                text-decoration: underline !important;
                              }
                              
                              .editor-content-wrapper a:hover {
                                color: #1d4ed8 !important;
                              }
                              
                              /* Heading styles */
                              .editor-content-wrapper h1 {
                                font-size: 2em !important;
                                font-weight: bold !important;
                                margin: 0.67em 0 !important;
                              }
                              
                              .editor-content-wrapper h2 {
                                font-size: 1.5em !important;
                                font-weight: bold !important;
                                margin: 0.75em 0 !important;
                              }
                              
                              .editor-content-wrapper h3 {
                                font-size: 1.17em !important;
                                font-weight: bold !important;
                                margin: 0.83em 0 !important;
                              }
                              
                              .editor-content-wrapper h4 {
                                font-size: 1em !important;
                                font-weight: bold !important;
                                margin: 1.12em 0 !important;
                              }
                              
                              .editor-content-wrapper h5 {
                                font-size: 0.83em !important;
                                font-weight: bold !important;
                                margin: 1.5em 0 !important;
                              }
                              
                              .editor-content-wrapper h6 {
                                font-size: 0.75em !important;
                                font-weight: bold !important;
                                margin: 1.67em 0 !important;
                              }
                              
                              /* Text alignment */
                              .editor-content-wrapper [style*="text-align: left"] {
                                text-align: left !important;
                              }
                              
                              .editor-content-wrapper [style*="text-align: center"] {
                                text-align: center !important;
                              }
                              
                              .editor-content-wrapper [style*="text-align: right"] {
                                text-align: right !important;
                              }
                              
                              .editor-content-wrapper [style*="text-align: justify"] {
                                text-align: justify !important;
                              }
                              
                              /* Color support - Fixed to preserve actual color values */
                              .editor-content-wrapper [style*="color:"] {
                                /* Don't override, let the inline style take precedence */
                              }
                              
                              /* Highlight support - Fixed to preserve custom highlight colors */
                              .editor-content-wrapper mark {
                                /* Don't override background-color, let inline styles take precedence */
                                padding: 0 2px !important;
                              }
                              
                              .editor-content-wrapper mark[style*="background-color"] {
                                /* Ensure custom highlight colors are preserved */
                              }
                              
                              /* List styling */
                              .editor-content-wrapper ul {
                                list-style-type: disc !important;
                                margin: 1em 0 !important;
                                padding-left: 2em !important;
                              }
                              
                              .editor-content-wrapper ol {
                                list-style-type: decimal !important;
                                margin: 1em 0 !important;
                                padding-left: 2em !important;
                              }
                              
                              .editor-content-wrapper li {
                                margin: 0.5em 0 !important;
                              }
                              
                              /* Superscript and subscript */
                              .editor-content-wrapper sup {
                                vertical-align: super !important;
                                font-size: smaller !important;
                              }
                              
                              .editor-content-wrapper sub {
                                vertical-align: sub !important;
                                font-size: smaller !important;
                              }
                              
                              /* Table Styling - Enhanced for page view */
                              .editor-content-wrapper table {
                                border-collapse: collapse !important;
                                margin: 8px 0 !important;
                                width: 100% !important;
                                border: 2px solid #e2e8f0 !important;
                                background-color: white !important;
                                display: table !important;
                                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
                                border-radius: 6px !important;
                              }
                              
                              .editor-content-wrapper table td, .editor-content-wrapper table th {
                                border: 1px solid #cbd5e0 !important;
                                padding: 8px 12px !important;
                                min-width: 60px !important;
                                background-color: white !important;
                                display: table-cell !important;
                              }
                              
                              .editor-content-wrapper table th {
                                background-color: #f7fafc !important;
                                font-weight: 600 !important;
                                text-align: center !important;
                                color: #2d3748 !important;
                              }
                              
                              .editor-content-wrapper table tr {
                                display: table-row !important;
                              }
                              
                              .editor-content-wrapper table tbody {
                                display: table-row-group !important;
                              }
                              
                              .editor-content-wrapper table thead {
                                display: table-header-group !important;
                              }
                              
                              .editor-content-wrapper table td:hover {
                                background-color: #f8fafc !important;
                              }
                              
                              /* Paragraph spacing */
                              .editor-content-wrapper p {
                                margin: 1em 0 !important;
                                line-height: 1.6 !important;
                              }
                              
                              /* Horizontal rule */
                              .editor-content-wrapper hr {
                                border: none !important;
                                border-top: 1px solid #e2e8f0 !important;
                                margin: 2em 0 !important;
                              }
                            `}
                          </style>
                          <div className="editor-content-wrapper">
                            {/* Display only the content for this specific page with full HTML formatting */}
                            <div 
                              className="text-sm leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: (() => {
                                  // Get the full HTML content from the editor
                                  const fullHTML = editor ? editor.getHTML() : '';
                                  
                                  // Create a temporary div to parse the HTML content
                                  const tempDiv = document.createElement('div');
                                  tempDiv.innerHTML = fullHTML;
                                  
                                  // Get all text nodes and their parent elements
                                  const textNodes = [];
                                  const walker = document.createTreeWalker(
                                    tempDiv,
                                    NodeFilter.SHOW_TEXT,
                                    null
                                  );
                                  
                                  let node;
                                  while (node = walker.nextNode()) {
                                    textNodes.push(node);
                                  }
                                  
                                  // Calculate total text length up to this page
                                  const totalText = textNodes.map(node => node.textContent).join('');
                                  
                                  // If this page should not show any content based on character range, return empty string
                                  if (startChar >= totalText.length) {
                                    return '';
                                  }
                                  
                                  // For the current page, only show content within the character range
                                  let currentCharCount = 0;
                                  
                                  // Clone the temp div to preserve the original structure
                                  const pageDiv = tempDiv.cloneNode(true);
                                  const pageWalker = document.createTreeWalker(
                                    pageDiv,
                                    NodeFilter.SHOW_TEXT,
                                    null
                                  );
                                  
                                  let pageNode;
                                  let shouldInclude = false;
                                  
                                  while (pageNode = pageWalker.nextNode()) {
                                    const nodeText = pageNode.textContent;
                                    const nodeStartChar = currentCharCount;
                                    const nodeEndChar = currentCharCount + (nodeText?.length || 0);
                                    
                                    // Check if this text node is within the page's character range
                                    if (nodeEndChar <= startChar) {
                                      // This node is before the page's range, skip it
                                      pageNode.textContent = '';
                                    } else if (nodeStartChar >= endChar) {
                                      // This node is after the page's range, skip it
                                      pageNode.textContent = '';
                                    } else {
                                      // This node is partially or fully within the page's range
                                      let startOffset = Math.max(0, startChar - nodeStartChar);
                                      let endOffset = Math.min(nodeText?.length || 0, endChar - nodeStartChar);
                                      pageNode.textContent = nodeText?.substring(startOffset, endOffset) || '';
                                      shouldInclude = true;
                                    }
                                    
                                    currentCharCount += nodeText?.length || 0;
                                  }
                                  
                                  return shouldInclude ? (pageDiv as HTMLElement).innerHTML : '';
                                })()
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Character count display */}
                      {showCharacterCount && (
                        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-600 border">
                          <div className="text-sm text-gray-500">{startChar + 1}-{Math.min(endChar, editor ? editor.storage.characterCount.characters() : 0)} of {editor ? editor.storage.characterCount.characters() : 0} characters</div>
                        </div>
                      )}
                      
                      {/* Page number indicator */}
                      <div className="absolute bottom-2 right-2 bg-gray-100 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                        {pageNum}
                      </div>
                    </div>
                    );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50">
              <div className="bg-white p-6 shadow-sm rounded-md max-w-4xl mx-auto">
                <EditorContent editor={editor} className="min-h-[500px] prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Bar with Enhanced Pagination */}
      <div className="border-t bg-white py-2 px-4 flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center">
          <span className="mr-2 font-medium">
            {editor ? `${editor.storage.characterCount.characters()} characters` : '0 characters'}
          </span>
        </div>
        
        <div className="pagination-nav flex items-center space-x-2">
          <button 
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
            className="px-3 py-1 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-1">
            {pages.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => {
                  setCurrentPage(pageNum);
                  scrollToPage(pageNum);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${currentPage === pageNum ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'hover:bg-gray-100 border border-gray-300'}`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          
          <button 
            onClick={goToNextPage}
            disabled={currentPage >= pages.length}
            className="px-3 py-1 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Next
          </button>
          
          <span className="text-sm text-gray-500 ml-2">
            Page {currentPage} of {pages.length}
          </span>
        </div>
        
        <div className="flex items-center">
          <form onSubmit={handleAskVettam} className="flex items-center">
            <input
              type="text"
              placeholder="Ask Vettam"
              value={askVettamQuery}
              onChange={(e) => setAskVettamQuery(e.target.value)}
              className="border border-gray-300 rounded-l px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white rounded-r px-2 py-0.5 text-xs hover:bg-purple-700 transition-colors"
            >
              Ask
            </button>
          </form>
        </div>
      </div>
      
      
    </div>
  );
};

export default PagedEditor;
