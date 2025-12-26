# AutoFlow UI - AI Code Assistant

A modern, professional chat interface for AutoFlow, an AI-powered code assistant that uses RAG (Retrieval Augmented Generation) to analyze codebases, fix bugs, and implement features.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4+-blue.svg)

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Key Components](#-key-components)
- [UX Design Philosophy](#-ux-design-philosophy)
- [API Integration](#-api-integration)
- [Development](#-development)
- [Building for Production](#-building-for-production)
- [Angular Implementation](#-angular-implementation)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- 💬 **Chat Interface**: Real-time conversation with AI agents
- 🔗 **Repository Management**: GitHub repository URL validation and locking
- 📁 **Log Detection & Upload**: Automatic log detection and drag-and-drop file upload
- 🌓 **Dark/Light Theme**: System-aware theme with manual toggle
- 📜 **Conversation History**: Persistent conversation storage with localStorage
- 📊 **Metrics Dashboard**: Workflow analytics and statistics
- ⚡ **Real-time Updates**: 2-second polling for workflow status

### User Experience
- 🎯 **Smart Auto-Scroll**: Non-intrusive scrolling that respects user position
- 🎨 **Organic Design**: Flattened UI without visual noise or scroll hijacking
- 📱 **Responsive Layout**: Works on desktop and mobile
- ♿ **Accessible**: High contrast text and clear visual hierarchy
- 💾 **Auto-Save**: Automatic conversation persistence
- 🚀 **Fast & Efficient**: Optimized rendering and minimal re-renders

### Advanced Features
- 🔍 **Auto Log Detection**: Recognizes Java, Python, JavaScript, C# stack traces
- 📎 **File Upload**: Drag-and-drop for .log, .txt, .out, .err files (max 10MB)
- 🎛️ **Collapsible Sections**: Space-efficient design with toggleable areas
- 🔔 **New Message Alerts**: Floating button when scrolled up
- ⌨️ **Keyboard Shortcuts**: Enter to send, Shift+Enter for newline
- 🔄 **Message Queuing**: Continue typing while AI responds

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **TypeScript 5** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 3.4** - Utility-first styling
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code highlighting with Prism

### Libraries & Tools
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library
- **LocalStorage** - Client-side persistence
- **VSCode Dark Plus** - Syntax highlighting theme

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- A running AutoFlow backend (for API calls)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ssharma1011/rag-ui.git
   cd rag-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (optional)
   - Edit `src/services/api.ts` to point to your backend
   - Default: `/api/v1` (proxied in dev mode)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   - Navigate to `http://localhost:3000`
   - Start chatting with AutoFlow!

---

## 📂 Project Structure

```
rag-ui/
├── src/
│   ├── components/          # React components
│   │   ├── AgentMessage.tsx     # AI agent message display
│   │   ├── UserMessage.tsx      # User message display
│   │   ├── ChatContainer.tsx    # Main chat layout
│   │   ├── ChatInput.tsx        # Message input with log detection
│   │   ├── MessageList.tsx      # Scrollable message list
│   │   ├── Header.tsx           # Top navigation bar
│   │   ├── HistorySidebar.tsx   # Conversation history
│   │   └── FileUpload.tsx       # Drag-and-drop file upload
│   │
│   ├── contexts/            # React contexts
│   │   └── ThemeContext.tsx     # Dark/light theme management
│   │
│   ├── services/            # API and external services
│   │   └── api.ts               # Axios client and API methods
│   │
│   ├── types/               # TypeScript interfaces
│   │   └── workflow.ts          # Message, Workflow, Conversation types
│   │
│   ├── utils/               # Utility functions
│   │   ├── logDetection.ts      # Log pattern detection and extraction
│   │   └── validation.ts        # GitHub URL validation
│   │
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles and Tailwind imports
│
├── public/                  # Static assets
├── dist/                    # Production build output
├── ANGULAR_MASTER_PROMPT.md # Complete Angular implementation guide
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🧩 Key Components

### ChatContainer
**Purpose**: Orchestrates the chat experience
- Manages message state and workflow lifecycle
- Handles sending messages and polling for updates
- Coordinates between MessageList and ChatInput

**Key Methods**:
```typescript
handleSendMessage(content, repoUrl, logsPasted?, logFiles?)
startPolling()
addOrUpdateAgentMessage(status)
```

### MessageList
**Purpose**: Displays messages with smart auto-scroll
- Renders user and agent messages
- Implements scroll threshold detection (100px from bottom)
- Shows "New messages ↓" button when user scrolls up

**Smart Auto-Scroll**:
```typescript
isNearBottom() // Checks if within 100px of bottom
scrollToBottom(force?) // Scrolls only if near bottom or forced
```

### ChatInput
**Purpose**: Message input with advanced features
- Auto-resizing textarea (max 5 lines)
- Repository URL validation with visual feedback
- Automatic log detection using regex patterns
- Collapsible file upload area
- Message queuing during AI response

**State**:
```typescript
input, repoUrl, repoError
logFiles, detectedLogs, showDetectedLogs
showFileUpload
```

### AgentMessage
**Purpose**: Displays AI agent responses
- Status-based colored borders (RUNNING, COMPLETED, FAILED, WAITING)
- Progress bar for long-running tasks
- Markdown rendering with syntax highlighting
- Agent badge with status icon

**Status Colors**:
- RUNNING: Blue border + spinning loader
- COMPLETED: Green border + checkmark
- FAILED: Red border + X icon
- WAITING_FOR_DEVELOPER: Yellow border + clock icon

### FileUpload
**Purpose**: Drag-and-drop file upload
- Supports .log, .txt, .out, .err files
- Maximum 10MB per file, 5 files total
- File validation and duplicate detection
- Visual drag feedback
- Shows attached files with remove buttons

---

## 🎨 UX Design Philosophy

### Organic Over Mechanical
Our design follows a "less is more" approach:

✅ **What we do:**
- Clean white/gray backgrounds for readability
- Colored borders (not backgrounds) for status indication
- Subtle animations and smooth transitions
- Smart auto-scroll that respects user agency
- Collapsible sections for space efficiency
- High contrast text (gray-900 on white, gray-100 on dark)

❌ **What we avoid:**
- Heavy gradients and visual noise
- Scroll hijacking (forcing user to bottom)
- Blocking input during processing
- Aggressive animations
- Colored text/background combos that hurt readability

### Smart Auto-Scroll Logic
**Problem**: Traditional chat apps forcibly scroll to bottom during responses, yanking users away from content they're reading.

**Solution**: Threshold-based auto-scroll
1. Check if user is within 100px of bottom
2. If yes → auto-scroll smoothly
3. If no → show "New messages ↓" button
4. Always scroll on user's own messages

This gives users **agency** while maintaining a smooth experience.

### Inline Code Visibility
**Problem**: Light gray on white backgrounds made inline code invisible.

**Solution**: Dark gray background (`bg-gray-700`) with white text for maximum contrast in both themes.

### Space Efficiency
**Techniques**:
- Compact padding (px-4 py-2 instead of p-6)
- Hide repository URL when locked
- Collapsible file upload area (hidden by default)
- Ultra-compact input area (38px height)
- Show file count badge instead of full upload area

Result: ~40% more vertical space for conversation.

---

## 🔌 API Integration

### Base URL
```
/api/v1
```

### Endpoints

#### 1. Start Workflow
**POST** `/workflows/start`

**Request (JSON - simple)**:
```json
{
  "requirement": "Fix the login bug",
  "repoUrl": "https://github.com/username/repository",
  "targetClass": "LoginController"
}
```

**Request (multipart/form-data - with logs)**:
```
Content-Type: multipart/form-data

requirement: "Fix this error"
repoUrl: "https://github.com/username/repo"
logsPasted: "Exception in thread 'main'...\nat com.example..."
logFiles: [file1.log, file2.log]
```

**Response**:
```json
{
  "conversationId": "conv_abc123",
  "status": "RUNNING",
  "message": "Analyzing codebase...",
  "agent": "CodeAnalyzer",
  "progress": 0.25
}
```

#### 2. Get Workflow Status
**GET** `/workflows/{conversationId}/status`

**Response**:
```json
{
  "conversationId": "conv_abc123",
  "status": "COMPLETED",
  "message": "Successfully fixed the login bug!",
  "agent": "CodeFixer",
  "progress": 1.0
}
```

#### 3. Respond to Workflow
**POST** `/workflows/{conversationId}/respond`

**Request**:
```json
{
  "response": "Yes, please proceed with the fix"
}
```

### Polling Strategy
- Interval: 2 seconds
- Continues until status is `COMPLETED` or `FAILED`
- Updates agent message in real-time
- Graceful error handling with retries

---

## 💻 Development

### Available Scripts

```bash
# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint
npm run lint
```

### Environment Variables
Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Development Workflow

1. **Start backend** (AutoFlow orchestrator)
   ```bash
   cd ../rag-orchestrator
   ./gradlew bootRun
   ```

2. **Start frontend** (this project)
   ```bash
   npm run dev
   ```

3. **Open browser**
   - Navigate to `http://localhost:3000`
   - DevTools will show any errors

### Hot Module Replacement
Vite provides instant HMR - changes appear immediately without full page reload.

---

## 🏗️ Building for Production

### Build Command
```bash
npm run build
```

### Output
- Production build in `dist/` folder
- Optimized and minified
- Code splitting for better performance
- Gzip size: ~456KB (includes React + all dependencies)

### Deployment Options

#### Option 1: Static Hosting (Netlify, Vercel)
```bash
npm run build
# Upload dist/ folder
```

#### Option 2: Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Option 3: Node.js Server
```bash
npm install -g serve
serve -s dist -l 3000
```

### Performance Optimization
- **Code splitting**: Automatic via Vite
- **Tree shaking**: Dead code elimination
- **Minification**: Terser for JS, cssnano for CSS
- **Compression**: Enable gzip/brotli on server
- **Caching**: Set proper cache headers

**Recommendations**:
- Use CDN for static assets
- Enable HTTP/2
- Implement service worker for offline support

---

## 🔄 Angular Implementation

Want to build this exact app in Angular? We've got you covered!

### 📄 Complete Angular Master Prompt
See **[ANGULAR_MASTER_PROMPT.md](./ANGULAR_MASTER_PROMPT.md)** for a comprehensive, step-by-step guide to rebuild this application in Angular.

**What's included:**
- ✅ Complete architecture and component breakdown
- ✅ All TypeScript interfaces and types
- ✅ Service implementations with RxJS
- ✅ Tailwind configuration for Angular
- ✅ Template examples for every component
- ✅ State management patterns
- ✅ UX behaviors and patterns
- ✅ Build configuration
- ✅ Implementation checklist

Simply follow the master prompt and you'll have an identical Angular version!

---

## 🔍 Key Features Deep Dive

### 1. Log Detection
Automatically detects stack traces and error logs using regex patterns.

**Supported formats:**
- Java/Kotlin: `at com.example.Class.method(File.java:123)`
- Python: `File "script.py", line 123, in method`
- JavaScript: `at Object.method (file.js:123:45)`
- C#: `at Namespace.Class.Method() in File.cs:line 123`
- Generic: Exception keywords, log levels, timestamps

**Implementation**: `src/utils/logDetection.ts`
```typescript
export function detectLogs(text: string): boolean
export function extractLogs(text: string): string
export function extractRequirement(text: string): string
export function countLogLines(text: string): number
```

### 2. Repository URL Validation
Validates GitHub repository URLs in real-time.

**Valid format**: `https://github.com/username/repository`

**Features**:
- ✓ Real-time validation as user types
- ✓ Visual feedback (green checkmark / red error)
- ✓ Saves valid URL to localStorage
- ✓ Must be HTTPS
- ✓ Must match GitHub URL pattern

**Implementation**: `src/utils/validation.ts`

### 3. Theme Management
System-aware dark/light theme with manual toggle.

**Features**:
- Checks system preference on first load
- Persists theme choice to localStorage
- Applies theme via class on document root
- Smooth transitions between themes
- All components fully support both themes

**Implementation**: `src/contexts/ThemeContext.tsx`

### 4. Conversation History
Persistent conversation storage with localStorage.

**Data structure**:
```typescript
interface Conversation {
  id: string;
  repoUrl: string;
  messages: ChatMessage[];
  timestamp: Date;
}
```

**Features**:
- Saves all conversations automatically
- Shows message preview and timestamp
- Click to load conversation
- Relative timestamps ("2 hours ago")
- Repository URL shown for each conversation

---

## 🐛 Troubleshooting

### Common Issues

#### 1. API calls fail
**Problem**: CORS errors or network failures

**Solution**:
- Check backend is running on correct port
- Verify API base URL in `src/services/api.ts`
- Check CORS configuration on backend

#### 2. Dark mode not working
**Problem**: Theme toggle doesn't switch themes

**Solution**:
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Verify Tailwind `darkMode: 'class'` in config

#### 3. Log detection not working
**Problem**: Logs not detected when pasted

**Solution**:
- Check log format matches supported patterns
- Test with `detectLogs()` function directly
- Add custom pattern in `logDetection.ts` if needed

#### 4. File upload fails
**Problem**: Files don't upload or validation fails

**Solution**:
- Check file extension (.log, .txt, .out, .err only)
- Verify file size < 10MB
- Check backend multipart/form-data support

#### 5. Messages not scrolling
**Problem**: Auto-scroll not working

**Solution**:
- Check `messagesEndRef` is attached to element
- Verify `scrollToBottom()` is called in useEffect
- Check for CSS overflow issues

---

## 📝 Code Examples

### Sending a Message with Logs
```typescript
// In ChatInput component
const handleSend = () => {
  let requirement = input.trim();
  let logsPasted: string | undefined;

  // Extract requirement and logs
  if (detectedLogs) {
    requirement = extractRequirement(input);
    logsPasted = detectedLogs;
  }

  // Send message
  onSend(
    requirement,
    repoUrl.trim(),
    logsPasted,
    logFiles.length > 0 ? logFiles : undefined
  );

  // Clear state
  setInput('');
  setLogFiles([]);
  setDetectedLogs(null);
};
```

### Adding a Custom Log Pattern
```typescript
// In src/utils/logDetection.ts
const patterns = [
  // ... existing patterns

  // Add your custom pattern
  /YourCustomPattern: .+/i,
];
```

### Customizing Theme Colors
```javascript
// In tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#your-color',
          dark: '#your-dark-color',
        },
      },
    },
  },
};
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/rag-ui.git`
3. Create a branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Test thoroughly
6. Commit: `git commit -m 'Add amazing feature'`
7. Push: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Coding Standards
- Use TypeScript for all new code
- Follow existing code style
- Add comments for complex logic
- Write meaningful commit messages
- Test dark mode compatibility
- Ensure responsive design

### Pull Request Guidelines
- Describe what your PR does
- Include screenshots for UI changes
- Link related issues
- Ensure all checks pass
- Request review from maintainers

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** - For an amazing UI library
- **Tailwind CSS** - For utility-first styling
- **Vite** - For blazing fast development
- **Gemini AI** - For UX audit insights
- **AutoFlow Team** - For the awesome backend

---

## 📧 Contact

- **Project Repository**: [https://github.com/ssharma1011/rag-ui](https://github.com/ssharma1011/rag-ui)
- **Issue Tracker**: [https://github.com/ssharma1011/rag-ui/issues](https://github.com/ssharma1011/rag-ui/issues)

---

## 🗺️ Roadmap

### Upcoming Features
- [ ] Voice input for messages
- [ ] Syntax highlighting language auto-detection
- [ ] Export conversation to markdown
- [ ] Keyboard shortcuts panel
- [ ] Multi-file code diffs in UI
- [ ] Real-time collaboration
- [ ] Plugin system for extensions
- [ ] Offline mode with service worker

### Version History
- **v1.2.0** (Current) - Log upload and auto-detection, UI readability improvements
- **v1.1.0** - Major UX overhaul based on professional audit
- **v1.0.0** - Initial release with core features

---

Made with ❤️ by the AutoFlow Team
