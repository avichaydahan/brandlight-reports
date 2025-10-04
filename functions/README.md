# BrandLight Advanced PDF Report Generator

A professional, scalable Firebase Functions-based service for generating complex, multi-page PDF reports with advanced features including charts, background processing, and comprehensive job tracking.

## 🚀 Features

### Advanced PDF Generation

- **Multiple PDF Libraries**: Integrated PDF-lib, Puppeteer for maximum flexibility
- **Professional Templates**: 4+ report types (A, B, C, D) with unique styling
- **Chart Generation**: Built-in SVG chart generation (bar, pie, line charts)
- **Custom Styling**: Professional layouts with responsive design
- **Watermarks & Metadata**: Custom watermarks and PDF metadata

### Background Processing

- **Long-running Jobs**: Support for 10+ minute report generation
- **Progress Tracking**: Real-time progress updates in Firestore
- **Error Handling**: Comprehensive error tracking and recovery
- **Scalable Architecture**: Firebase Functions v2 with configurable memory/timeout

### Data Management

- **Firestore Integration**: Complete job lifecycle management
- **Cloud Storage**: Automatic PDF upload with signed URLs
- **Type Safety**: Full TypeScript with Zod validation
- **Cleanup Jobs**: Automatic cleanup of old files and jobs

### Developer Experience

- **Structured Architecture**: Service-oriented design
- **Comprehensive Logging**: Built-in logger with context
- **ESLint Configuration**: Code quality enforcement
- **Hot Reload**: Development with watch mode

## 📁 Project Structure

```
functions/
├── src/
│   ├── config/
│   │   └── index.ts          # Configuration management
│   ├── services/
│   │   ├── pdf.service.ts    # Advanced PDF generation
│   │   ├── chart.service.ts  # Chart generation
│   │   ├── firestore.service.ts # Database operations
│   │   └── storage.service.ts   # File storage
│   ├── templates/
│   │   ├── templateA.ts      # Premium Analysis template
│   │   ├── templateB.ts      # Business Intelligence template
│   │   ├── templateC.ts      # Technical Analysis template
│   │   └── templateD.ts      # Executive Summary template
│   ├── types/
│   │   └── index.ts          # TypeScript definitions
│   ├── utils/
│   │   └── logger.ts         # Logging utilities
│   ├── index.ts              # HTTP endpoints
│   ├── tasks.ts              # Background processing
│   └── data.ts               # Mock data generation
├── package.json
├── tsconfig.json
└── .eslintrc.json
```

## 🛠 Installation & Setup

### Prerequisites

- Node.js 20+
- Firebase CLI
- Firebase project with Firestore, Storage, and Functions enabled

### Installation

1. **Clone and Install Dependencies**

   ```bash
   cd functions
   npm install
   ```

2. **Build the Project**

   ```bash
   npm run build
   ```

3. **Start Local Development**

   ```bash
   npm run serve
   ```

4. **Deploy to Firebase**
   ```bash
   npm run deploy
   ```

## 🔧 Development Scripts

```bash
# Build TypeScript
npm run build

# Watch mode for development
npm run build:watch

# Start Firebase emulators
npm run serve

# Development with hot reload
npm run serve:watch

# Deploy to production
npm run deploy

# Lint code
npm run lint
npm run lint:fix

# Clean build artifacts
npm run clean
```

## 📋 API Endpoints

### Create Report Job

```http
POST /createReport
Content-Type: application/json

{
  "reportType": "A",
  "data": {
    "title": "Q4 Performance Report",
    "subtitle": "Annual Analysis",
    "author": "Analytics Team",
    "date": "2024-12-31",
    "data": {}
  },
  "options": {
    "format": "A4",
    "orientation": "portrait",
    "quality": 100
  }
}
```

### Get Job Status

```http
GET /getJobStatus?jobId=abc123
```

### Health Check

```http
GET /health
```

## 📊 Report Types

### Type A - Premium Analysis

- Executive summary with metrics
- Detailed data tables
- Professional blue gradient theme
- Multiple chart visualizations

### Type B - Business Intelligence

- Grid-based metric cards
- Business-focused styling
- Purple/brown color scheme
- Analytics dashboard layout

### Type C - Technical Analysis

- Technical overview format
- Gray/slate professional theme
- Code-friendly styling
- Technical metrics focus

### Type D - Executive Summary

- High-level overview format
- Green success-oriented theme
- Executive-friendly layout
- Key insights presentation

## 🎨 Chart Types Supported

- **Bar Charts**: Comparative data visualization
- **Pie Charts**: Proportion and distribution
- **Line Charts**: Trends and time series
- **SVG-based**: Scalable, professional quality
- **Customizable**: Colors, titles, dimensions

## ⚙️ Configuration

### Environment Variables

```bash
STORAGE_BUCKET=your-project-storage
FIREBASE_PROJECT_ID=your-project-id
```

### Firebase Functions Configuration

- Memory: 2-4GiB for complex reports
- Timeout: 540 seconds (9 minutes)
- Region: us-central1 (configurable)

## 🔄 Background Processing Flow

1. **Job Creation**: HTTP endpoint creates job in Firestore
2. **Background Enqueueing**: HTTP request to background processor
3. **PDF Generation**: Template selection, data processing, chart generation
4. **Progress Updates**: Real-time status updates (0% → 100%)
5. **Storage Upload**: PDF saved to Cloud Storage
6. **Completion**: Download URL provided, job marked complete

## 📈 Monitoring & Logging

### Job States

- `pending`: Job created, waiting for processing
- `processing`: PDF generation in progress
- `completed`: PDF ready for download
- `failed`: Error occurred during processing

### Logging Levels

- **DEBUG**: Detailed execution information
- **INFO**: General operation info
- **WARN**: Non-critical issues
- **ERROR**: Critical failures with stack traces

## 🧪 Testing

### Local Testing

```bash
# Start emulators
npm run serve

# Test report creation
curl -X POST http://localhost:5001/your-project/us-central1/createReport \
  -H "Content-Type: application/json" \
  -d '{"reportType": "A"}'
```

## 🚀 Advanced Usage

### Custom Templates

1. Create new template file in `src/templates/`
2. Implement `generateHTML(data: ReportData): string`
3. Add template selection logic in `pdf.service.ts`

### Custom Charts

1. Extend `ChartService` class
2. Add new chart types to `generateSVGChart` method
3. Update chart type definitions in `types/index.ts`

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Firebase, TypeScript, and modern PDF generation technologies.**
