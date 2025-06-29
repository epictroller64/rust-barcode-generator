# Barcode Generator

[![Rust](https://img.shields.io/badge/Rust-1.70+-orange.svg)](https://www.rust-lang.org/)
[![Tauri](https://img.shields.io/badge/Tauri-1.0+-blue.svg)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A powerful, cross-platform barcode generator application built with Rust and Tauri. Generate high-quality barcodes with a modern, intuitive interface.

![Barcode Generator Interface](assets/barcode%20generator%20interface.png)

## ✨ Features

### Core Functionality
- **Multiple Barcode Formats**: Support for Code39, Code128, QR codes, and more
- **Bulk Generation**: Generate multiple barcodes efficiently
- **Custom Templates**: Save and reuse barcode configurations
- **High-Quality Output**: Custom DPI settings for professional results

### Customization Options
- **Text Styling**: Customize font, size, and positioning
- **Dimensions**: Adjust width, height, and margins
- **Export Formats**: Multiple output formats for different use cases

### User Interface
- **Modern GUI**: Built with Tauri and React for a native feel
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Intuitive Design**: User-friendly interface for both beginners and professionals

## 🚀 Getting Started

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (1.70 or higher)
- [Node.js](https://nodejs.org/) (18 or higher)
- [pnpm](https://pnpm.io/) (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rust-barcode-generator.git
   cd rust-barcode-generator
   ```

2. **Install dependencies**
   ```bash
   # Install Rust dependencies
   cargo build --release
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Run the application**
   ```bash
   npx tauri dev --release
   ```

### Building for Production

```bash
cargo tauri build
```

The built application will be available in the `src-tauri/target/release` directory.

## 🛠️ Technology Stack

### Backend
- **Rust**: Core application logic and performance
- **ZXing CPP**: Barcode generation engine with Rust bindings
- **imageproc**: Image processing for text overlay and resizing

### Frontend
- **Tauri**: Cross-platform desktop application framework
- **React**: Modern UI framework with TypeScript
- **Vite**: Fast build tool and development server

## 📋 Planned Features

- [ ] Enhanced bulk generation interface
- [ ] Printable export formats (PDF, SVG)
- [ ] Additional export formats (EPS, PNG with transparency)
- [ ] Advanced styling options (gradients, shadows)
- [ ] Barcode validation and error correction
- [ ] Batch processing with progress tracking

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.



## 🙏 Acknowledgments

- [ZXing](https://github.com/zxing-cpp/zxing-cpp) for the barcode generation library
- [Tauri](https://tauri.app/) for the excellent desktop application framework
- [React](https://reactjs.org/) for the UI framework

---
