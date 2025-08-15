# Tiptap Pagination Editor

A modern rich text editor with advanced pagination features built using Tiptap, React 19, TypeScript, and Tailwind CSS. This editor provides a WYSIWYG (What You See Is What You Get) interface with page-based editing capabilities similar to traditional word processors.

## Features

- **Rich Text Editing**: Full formatting capabilities including font styles, sizes, colors, and alignment
- **Page-Based Layout**: Visual A4 page boundaries with accurate dimensions (210mm × 297mm)
- **Document Structure**: Support for headings, lists, tables, and images
- **Page Customization**: 
  - Headers and footers with customizable text
  - Adjustable margins and rulers
  - Optional watermarks
  - Background color options
- **View Options**:
  - Toggle between text-focused and page-focused modes
  - Zoom functionality for detailed editing
- **Print/Export**: One-click printing or PDF export with formatting preservation
- **Character Count**: Track document length with built-in character counter

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tiptap-editor.git
cd tiptap-editor

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview
```

## Technical Implementation

### Architecture

The editor is built with a component-based architecture using React 19 and TypeScript. The main components are:

- **PagedEditor**: The core component that manages the editor state and page layout
- **EditorToolbar**: Provides formatting controls and page settings

### Tiptap Extensions

The editor leverages several Tiptap extensions to provide rich functionality:

- Text formatting: FontFamily, FontSize, TextStyle, Color, TextAlign
- Document structure: StarterKit, Heading, Table components
- Special elements: Image, Highlight, Superscript, Subscript
- Utilities: CharacterCount

### Page Management

Pages are represented as fixed-size containers matching A4 dimensions (210mm × 297mm). The editor:

- Calculates page breaks based on character count
- Provides navigation between pages
- Maintains consistent styling across pages

### Print/Export System

The print/export functionality:

- Opens a new window with formatted content
- Applies current editor settings (background, margins, etc.)
- Includes optional headers and footers
- Provides a print button for direct printing or PDF export
- Preserves all text formatting and layout

## Current Limitations

1. **Character-Based Pagination**: The current implementation uses character count rather than visual height to determine page breaks, which may not perfectly match traditional word processors.

2. **Browser Compatibility**: The print/export functionality relies on browser printing capabilities, which may vary across different browsers and devices.

3. **Performance with Large Documents**: Rendering multiple pages with complex content might impact performance, especially with very large documents.

4. **Limited Export Formats**: Currently only supports PDF export through the browser's print functionality.

## Future Enhancements

### Planned Improvements

1. **Visual-Based Pagination**: Implement height-based pagination that more accurately reflects traditional word processors.

2. **Additional Export Formats**: Add direct export to DOCX, HTML, and other formats.

3. **Collaborative Editing**: Integrate with a backend to support real-time collaborative document editing.

4. **Enhanced Mobile Support**: Optimize the editor interface for mobile devices.

### Technical Roadmap

1. **Performance Optimization**: Implement virtualization for large documents to improve rendering performance.

2. **Accessibility Improvements**: Enhance keyboard navigation and screen reader support.

3. **Custom Tiptap Extensions**: Develop specialized extensions for pagination and document layout.

4. **Comprehensive Testing**: Add unit and integration tests for all editor features.

5. **Offline Support**: Implement local storage and offline editing capabilities.

## License

MIT

## Technologies Used

- [React](https://react.dev/) - UI library (v19)
- [Tiptap](https://tiptap.dev/) - Headless editor framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Next-generation frontend tooling
