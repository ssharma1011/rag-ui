# Master Prompt: AutoFlow UI - Angular Implementation

This document contains a comprehensive specification for building the AutoFlow UI application in Angular. This is currently a React TypeScript application, and this prompt will help you rebuild it exactly in Angular.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Complete Feature List](#complete-feature-list)
3. [Architecture & Technology Stack](#architecture--technology-stack)
4. [Component Structure](#component-structure)
5. [TypeScript Interfaces & Types](#typescript-interfaces--types)
6. [Utilities & Services](#utilities--services)
7. [Styling & Design System](#styling--design-system)
8. [UX Patterns & Behaviors](#ux-patterns--behaviors)
9. [State Management](#state-management)
10. [API Integration](#api-integration)
11. [Build Configuration](#build-configuration)
12. [Implementation Checklist](#implementation-checklist)

---

## Project Overview

**AutoFlow** is an AI code assistant UI that provides a chat interface for developers to interact with an AI agent that can analyze codebases, fix bugs, and implement features using RAG (Retrieval Augmented Generation).

### Core Functionality
- Chat interface with user and AI agent messages
- Repository URL management with validation
- Conversation history with localStorage persistence
- Dark/Light theme toggle
- Log file detection and upload (drag-and-drop)
- Real-time workflow status updates via polling
- Metrics dashboard
- Smart auto-scroll with user control
- Collapsible UI sections for space efficiency

---

## Complete Feature List

### 1. **Repository Management**
- GitHub repository URL input with validation
- URL validation: must be valid GitHub repo format (https://github.com/username/repository)
- Repository URL locks after first message is sent
- Visual validation feedback (✓ for valid, ⚠️ for invalid)
- Saves last used repository URL to localStorage
- Shows repository URL input only when unlocked
- Hide repository URL when locked to save space

### 2. **Chat Interface**
- User messages: Right-aligned, blue background
- Agent messages: Left-aligned, white/gray background with colored borders
- Status indicators for agent messages:
  - RUNNING: Blue border, spinning loader icon
  - COMPLETED: Green border, checkmark icon
  - FAILED: Red border, X icon
  - WAITING_FOR_DEVELOPER: Yellow border, clock icon
- Agent badge showing agent name
- Progress bar for agent tasks (0-100%)
- Markdown rendering with syntax highlighting
- Inline code with dark gray background and white text
- Code blocks with VSCode Dark Plus theme
- Timestamps for all messages
- Avatar icons (user and bot)
- Maximum message width: 3xl (768px)

### 3. **Log Detection & Upload**
- **Auto-detection**: Automatically detects logs pasted in chat input
- **Detection patterns**:
  - Java/Kotlin stack traces (e.g., `at com.example.Class.method(File.java:123)`)
  - Python stack traces (e.g., `File "script.py", line 123, in method`)
  - JavaScript errors (e.g., `at Object.method (file.js:123:45)`)
  - C# exceptions (e.g., `at Namespace.Class.Method() in File.cs:line 123`)
  - Exception keywords: Exception, Error, Throwable, Caused by
  - Log levels with timestamps: ERROR, WARN, FATAL
  - Generic stack traces
- **Visual indicators**:
  - Blue badge showing "📋 Logs detected: X lines"
  - Show/Hide toggle to preview detected logs
  - Clear button to remove detected logs
  - Automatically separates user requirement from logs
- **File upload**:
  - Collapsible file upload area (hidden by default)
  - Toggle button: "Upload log files" with chevron icon
  - Badge showing file count when files attached
  - Drag-and-drop zone with visual feedback
  - File picker as fallback
  - Supported formats: .log, .txt, .out, .err
  - Maximum file size: 10MB per file
  - Maximum 5 files at once
  - Shows attached files with remove buttons
  - File size formatting (KB, MB)
  - Duplicate detection
  - Auto-collapses after sending message

### 4. **Theme Management**
- Dark/Light theme toggle in header
- Moon icon for dark mode, Sun icon for light mode
- Persists theme to localStorage
- Checks system preference on first load
- Applies theme via class on document root element
- All components support both themes
- Theme context available throughout app

### 5. **Conversation History**
- History sidebar on the left (slides in/out)
- Shows all past conversations
- Each conversation shows:
  - First message preview
  - Timestamp (relative: "2 hours ago" or "Today at 3:45 PM")
  - Repository URL
- Click to load conversation
- New Chat button clears current conversation
- History button in header (only visible when repo unlocked)
- Persists to localStorage
- Auto-saves conversations

### 6. **Smart Auto-Scroll**
- **Problem solved**: Prevents "scroll hijacking" where screen forcibly scrolls during AI responses
- **Solution**:
  - Only auto-scrolls if user is near bottom (within 100px threshold)
  - If user scrolls up to read previous messages, stays at their position
  - Shows "New messages ↓" floating button when new messages arrive and user is scrolled up
  - Force scroll on user's own messages
  - Smooth scrolling behavior

### 7. **Input Area**
- Auto-resizing textarea (grows with content, max 5 lines)
- Placeholder changes based on state:
  - Normal: "Describe what you want to build or ask a question..."
  - AI responding: "AI is responding... Type to queue your next message"
- Enter to send, Shift+Enter for newline
- Send button disabled when:
  - Input is empty
  - Repository URL is invalid or empty
- Input stays enabled during AI response (allows queuing)
- Visual indicator when AI is responding: "AI is responding..." with pulsing dot
- Ultra-compact design (px-4 py-2 padding)
- Send button shows different tooltip based on state:
  - "Send message" (normal)
  - "Send + Logs" (when logs detected or files attached)
  - "Queue message" (when AI responding)

### 8. **Metrics Dashboard**
- Accessible via "Metrics" button in header
- Shows workflow metrics and statistics
- Error handling for loading failures
- (Implementation details depend on backend API)

### 9. **Workflow Polling**
- 2-second interval polling when workflow is active
- Fetches status updates from backend
- Updates agent message in real-time
- Continues until workflow completes or fails
- Handles network errors gracefully

### 10. **Visual Design Philosophy**
- **Organic over Mechanical**: Flattened design without heavy gradients
- **Clean and readable**: High contrast text, minimal visual noise
- **No colored backgrounds on messages**: Use borders for status indication
- **Subtle animations**: Smooth transitions, no jarring movements
- **Space efficiency**: Compact padding, collapsible sections
- **Accessibility**: Clear visual hierarchy, readable fonts

---

## Architecture & Technology Stack

### Angular Version
- **Angular 17+** (latest stable)
- **TypeScript 5+**
- **RxJS** for reactive state management
- **Angular Router** for navigation (if multi-page in future)

### Styling
- **Tailwind CSS 3+**
- **Dark mode**: class strategy (add/remove 'dark' class on html element)
- **Lucide Angular** for icons (or @ng-icons/lucide)
- **Prose plugin** for Tailwind (@tailwindcss/typography)

### Markdown & Code Highlighting
- **ngx-markdown** for markdown rendering
- **Prism.js** or **highlight.js** for syntax highlighting
- **VSCode Dark Plus theme** for code blocks

### HTTP & API
- **HttpClient** from @angular/common/http
- **RxJS operators**: map, catchError, switchMap, interval

### Storage
- **localStorage** for persistence (theme, conversations, repo URL)
- Wrap in service with fallback for SSR compatibility

---

## Component Structure

### App Component (`app.component.ts`)
- Root component
- Provides theme context
- Routing outlet (if applicable)

### Main Layout Components

#### 1. **Header Component** (`header.component.ts`)
**Purpose**: Top navigation bar with branding and actions

**Inputs**:
- `@Input() showHistory: boolean` - Whether to show history button
- `@Input() onHistoryClick: () => void` - History button click handler
- `@Input() onNewChat: () => void` - New chat button click handler
- `@Input() onMetrics: () => void` - Metrics button click handler

**Template**:
```html
<header class="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white px-6 py-3 shadow-md">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <!-- Left: Branding + History -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3">
        <home-icon class="w-6 h-6"></home-icon>
        <div>
          <h1 class="text-xl font-bold">AutoFlow</h1>
          <p class="text-xs text-blue-100">AI Code Assistant</p>
        </div>
      </div>

      <button *ngIf="showHistory" (click)="onHistoryClick()"
              class="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
        <history-icon class="w-4 h-4"></history-icon>
        <span class="text-sm">History</span>
      </button>
    </div>

    <!-- Right: Repository URL (when locked) + Actions -->
    <div class="flex items-center gap-3">
      <div *ngIf="isRepoLocked" class="flex items-center gap-2 bg-blue-500/50 px-3 py-1.5 rounded-lg">
        <github-icon class="w-4 h-4"></github-icon>
        <span class="text-sm">{{ repoUrl }}</span>
      </div>

      <!-- New Chat Button -->
      <button (click)="onNewChat()" class="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg">
        <message-circle-plus-icon class="w-4 h-4"></message-circle-plus-icon>
        New Chat
      </button>

      <!-- Metrics Button -->
      <button (click)="onMetrics()" class="bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg">
        <bar-chart-icon class="w-4 h-4"></bar-chart-icon>
        Metrics
      </button>

      <!-- Theme Toggle -->
      <button (click)="toggleTheme()" class="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg">
        <moon-icon *ngIf="theme === 'light'" class="w-4 h-4"></moon-icon>
        <sun-icon *ngIf="theme === 'dark'" class="w-4 h-4"></sun-icon>
      </button>
    </div>
  </div>
</header>
```

**Features**:
- Shows repository URL when locked
- Theme toggle with icon swap
- Conditional history button
- All buttons with hover effects

---

#### 2. **History Sidebar Component** (`history-sidebar.component.ts`)
**Purpose**: Left sidebar showing conversation history

**Inputs**:
- `@Input() isOpen: boolean`
- `@Input() conversations: Conversation[]`
- `@Input() onSelectConversation: (id: string) => void`
- `@Input() onClose: () => void`

**Interface**:
```typescript
interface Conversation {
  id: string;
  repoUrl: string;
  messages: ChatMessage[];
  timestamp: Date;
}
```

**Template**:
```html
<div *ngIf="isOpen" class="fixed inset-0 z-50 flex">
  <!-- Backdrop -->
  <div (click)="onClose()" class="absolute inset-0 bg-black/50"></div>

  <!-- Sidebar -->
  <div class="relative w-80 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
    <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Conversation History</h2>
        <button (click)="onClose()">
          <x-icon class="w-5 h-5"></x-icon>
        </button>
      </div>
    </div>

    <!-- Conversation List -->
    <div class="p-4 space-y-3">
      <div *ngFor="let conv of conversations"
           (click)="onSelectConversation(conv.id)"
           class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
          {{ conv.messages[0]?.content.substring(0, 60) }}...
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <github-icon class="w-3 h-3"></github-icon>
          {{ conv.repoUrl }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ formatTimestamp(conv.timestamp) }}
        </div>
      </div>
    </div>
  </div>
</div>
```

**Features**:
- Fixed overlay with backdrop
- Slide-in animation from left
- Click outside to close
- Relative timestamps
- Truncated message previews

---

#### 3. **Chat Container Component** (`chat-container.component.ts`)
**Purpose**: Main chat area managing message list and input

**Template**:
```html
<div class="flex-1 flex flex-col overflow-hidden">
  <!-- Messages -->
  <app-message-list
    [messages]="messages"
    [isLoading]="isLoading">
  </app-message-list>

  <!-- Input -->
  <app-chat-input
    [disabled]="isLoading"
    [initialRepoUrl]="repoUrl"
    [isRepoLocked]="isRepoLocked"
    (onSend)="handleSendMessage($event)">
  </app-chat-input>
</div>
```

**State**:
```typescript
messages: ChatMessage[] = [];
isLoading = false;
conversationId: string | null = null;
repoUrl = '';
isRepoLocked = false;
```

**Methods**:
```typescript
async handleSendMessage(event: {
  content: string;
  repoUrl: string;
  logsPasted?: string;
  logFiles?: File[];
}) {
  // Add user message
  const userMessage: ChatMessage = {
    id: generateId(),
    sender: 'user',
    content: event.content,
    timestamp: new Date(),
  };
  this.messages.push(userMessage);

  // Start workflow
  this.isLoading = true;
  try {
    const status = await this.workflowService.startWorkflow({
      requirement: event.content,
      repoUrl: event.repoUrl,
      logsPasted: event.logsPasted,
      logFiles: event.logFiles,
    });

    this.conversationId = status.conversationId;
    this.repoUrl = event.repoUrl;
    this.isRepoLocked = true;

    // Add agent message
    this.addOrUpdateAgentMessage(status);

    // Start polling
    this.startPolling();
  } catch (error) {
    this.handleError(error);
  } finally {
    this.isLoading = false;
  }
}

startPolling() {
  if (!this.conversationId) return;

  this.pollingSubscription = interval(2000)
    .pipe(
      switchMap(() => this.workflowService.getWorkflowStatus(this.conversationId!))
    )
    .subscribe({
      next: (status) => {
        this.addOrUpdateAgentMessage(status);

        // Stop polling if completed or failed
        if (status.status === 'COMPLETED' || status.status === 'FAILED') {
          this.pollingSubscription?.unsubscribe();
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Polling error:', error);
      }
    });
}
```

---

#### 4. **Message List Component** (`message-list.component.ts`)
**Purpose**: Scrollable list of messages with smart auto-scroll

**Template**:
```html
<div #container class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 px-6 py-4">
  <div class="max-w-4xl mx-auto">
    <div *ngFor="let message of messages">
      <app-user-message *ngIf="message.sender === 'user'" [message]="message"></app-user-message>
      <app-agent-message *ngIf="message.sender === 'agent'" [message]="message"></app-agent-message>
    </div>
    <div #messagesEnd></div>
  </div>

  <!-- New messages button -->
  <button *ngIf="showNewMessagesButton"
          (click)="scrollToBottom(true)"
          class="fixed bottom-24 right-8 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700">
    New messages ↓
  </button>
</div>
```

**Smart Auto-Scroll Logic**:
```typescript
@ViewChild('container') container!: ElementRef<HTMLDivElement>;
@ViewChild('messagesEnd') messagesEnd!: ElementRef<HTMLDivElement>;

showNewMessagesButton = false;

ngAfterViewChecked() {
  this.scrollToBottom();
}

isNearBottom(): boolean {
  const container = this.container.nativeElement;
  const threshold = 100; // pixels from bottom
  const position = container.scrollHeight - container.scrollTop - container.clientHeight;
  return position < threshold;
}

scrollToBottom(force = false) {
  if (force || this.isNearBottom()) {
    this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
    this.showNewMessagesButton = false;
  } else {
    this.showNewMessagesButton = true;
  }
}

@HostListener('scroll', ['$event'])
onScroll() {
  if (this.isNearBottom()) {
    this.showNewMessagesButton = false;
  }
}
```

---

#### 5. **User Message Component** (`user-message.component.ts`)
**Purpose**: Display user messages

**Template**:
```html
<div class="flex justify-end mb-4">
  <div class="flex items-start gap-2 max-w-3xl">
    <div class="flex-1">
      <div class="bg-blue-600 dark:bg-blue-500 text-white rounded-lg px-4 py-3">
        <div class="text-sm whitespace-pre-wrap">{{ message.content }}</div>
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1.5 text-right">
        {{ message.timestamp | date:'shortTime' }}
      </div>
    </div>
    <div class="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
      <user-icon class="w-3.5 h-3.5 text-white"></user-icon>
    </div>
  </div>
</div>
```

---

#### 6. **Agent Message Component** (`agent-message.component.ts`)
**Purpose**: Display agent messages with status

**Template**:
```html
<div class="flex justify-start mb-4">
  <div class="flex items-start gap-2 max-w-3xl">
    <div class="flex-shrink-0 w-7 h-7 rounded-full bg-gray-700 dark:bg-gray-600 flex items-center justify-center">
      <bot-icon class="w-3.5 h-3.5 text-white"></bot-icon>
    </div>

    <div class="flex-1">
      <div [class]="'border rounded-lg px-4 py-3 ' + getStatusColor()">
        <!-- Agent Badge -->
        <div *ngIf="message.agent" class="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 px-2 py-0.5 rounded">
            {{ message.agent }}
          </span>
          <ng-container [ngSwitch]="message.status">
            <loader-icon *ngSwitchCase="'RUNNING'" class="w-4 h-4 text-blue-500 animate-spin"></loader-icon>
            <check-circle-icon *ngSwitchCase="'COMPLETED'" class="w-4 h-4 text-green-500"></check-circle-icon>
            <x-circle-icon *ngSwitchCase="'FAILED'" class="w-4 h-4 text-red-500"></x-circle-icon>
            <clock-icon *ngSwitchCase="'WAITING_FOR_DEVELOPER'" class="w-4 h-4 text-yellow-500"></clock-icon>
          </ng-container>
        </div>

        <!-- Progress Bar -->
        <div *ngIf="message.progress && message.progress > 0" class="mb-3">
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div class="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                 [style.width.%]="message.progress * 100">
            </div>
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {{ (message.progress * 100) | number:'1.0-0' }}% complete
          </div>
        </div>

        <!-- Markdown Content -->
        <div class="prose prose-sm dark:prose-invert max-w-none text-gray-900 dark:text-gray-100">
          <markdown [data]="message.content"></markdown>
        </div>
      </div>

      <div class="text-xs text-gray-500 mt-1.5">
        {{ message.timestamp | date:'shortTime' }}
      </div>
    </div>
  </div>
</div>
```

**Status Color Method**:
```typescript
getStatusColor(): string {
  switch (this.message.status) {
    case 'RUNNING':
      return 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800';
    case 'COMPLETED':
      return 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-800';
    case 'FAILED':
      return 'bg-white dark:bg-gray-800 border-red-200 dark:border-red-800';
    case 'WAITING_FOR_DEVELOPER':
      return 'bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-800';
    default:
      return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  }
}
```

**Markdown Configuration** (in module):
```typescript
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    MarkdownModule.forRoot({
      loader: HttpClient,
    }),
  ],
})
```

**Custom Markdown Styling** (global CSS):
```css
/* Inline code blocks */
markdown code:not([class*="language-"]) {
  background-color: rgb(55, 65, 81); /* gray-700 */
  color: white;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-family: 'Courier New', monospace;
}

.dark markdown code:not([class*="language-"]) {
  background-color: rgb(75, 85, 99); /* gray-600 */
}

/* Code blocks use syntax highlighter */
```

---

#### 7. **Chat Input Component** (`chat-input.component.ts`)
**Purpose**: Message input with repo URL, log detection, and file upload

**Inputs/Outputs**:
```typescript
@Input() disabled = false;
@Input() placeholder = 'Type your message...';
@Input() initialRepoUrl = '';
@Input() isRepoLocked = false;
@Output() onSend = new EventEmitter<{
  content: string;
  repoUrl: string;
  logsPasted?: string;
  logFiles?: File[];
}>();
```

**State**:
```typescript
input = '';
repoUrl = '';
repoError = '';
logFiles: File[] = [];
detectedLogs: string | null = null;
showDetectedLogs = false;
showFileUpload = false;
```

**Template Structure**:
```html
<div class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 shadow-lg">
  <div class="max-w-4xl mx-auto space-y-2">

    <!-- Repository URL (only when not locked) -->
    <div *ngIf="!isRepoLocked">
      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        <github-icon class="w-3 h-3 inline"></github-icon>
        Repository URL *
        <span *ngIf="repoUrl && !repoError" class="text-green-600 dark:text-green-400 text-xs ml-auto">✓</span>
      </label>
      <input type="text"
             [(ngModel)]="repoUrl"
             placeholder="https://github.com/username/repository"
             [disabled]="disabled"
             [class]="getRepoInputClass()"
             class="w-full px-2.5 py-1.5 rounded-md border text-xs">
      <p *ngIf="repoError" class="text-red-600 dark:text-red-400 text-xs mt-0.5">⚠️ {{ repoError }}</p>
    </div>

    <!-- Message Input -->
    <div class="flex items-center gap-2">
      <textarea #textareaRef
                [(ngModel)]="input"
                (keydown)="handleKeyDown($event)"
                (input)="onInputChange()"
                [placeholder]="getPlaceholder()"
                rows="1"
                class="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                style="min-height: 38px; max-height: 120px;">
      </textarea>

      <button (click)="handleSend()"
              [disabled]="!canSend()"
              [title]="getSendTooltip()"
              class="bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300">
        <send-icon class="w-4 h-4"></send-icon>
      </button>
    </div>

    <!-- Detected Logs Badge -->
    <div *ngIf="detectedLogs" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-2">
      <div class="flex items-center justify-between">
        <span class="text-blue-600 dark:text-blue-400 text-sm font-medium">
          📋 Logs detected: {{ countLogLines(detectedLogs) }} lines
        </span>
        <div class="flex items-center gap-1">
          <button (click)="showDetectedLogs = !showDetectedLogs" class="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded">
            {{ showDetectedLogs ? 'Hide' : 'Show' }}
          </button>
          <button (click)="clearDetectedLogs()" class="px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded">
            Clear
          </button>
        </div>
      </div>
      <pre *ngIf="showDetectedLogs" class="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto max-h-40 overflow-y-auto">{{ detectedLogs }}</pre>
    </div>

    <!-- File Upload Toggle -->
    <div class="flex items-center gap-2">
      <button (click)="showFileUpload = !showFileUpload" class="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
        <file-text-icon class="w-3.5 h-3.5"></file-text-icon>
        {{ showFileUpload ? 'Hide' : 'Upload' }} log files
        <span *ngIf="logFiles.length > 0" class="bg-blue-600 text-white px-1.5 py-0.5 rounded-full text-xs">
          {{ logFiles.length }}
        </span>
        <chevron-up-icon *ngIf="showFileUpload" class="w-3 h-3"></chevron-up-icon>
        <chevron-down-icon *ngIf="!showFileUpload" class="w-3 h-3"></chevron-down-icon>
      </button>
    </div>

    <!-- File Upload Area -->
    <app-file-upload *ngIf="showFileUpload"
                     [files]="logFiles"
                     [disabled]="disabled"
                     (filesChange)="logFiles = $event">
    </app-file-upload>

    <!-- AI Responding Indicator -->
    <p *ngIf="disabled" class="text-blue-600 dark:text-blue-400 text-xs flex items-center gap-1">
      <span class="inline-block w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></span>
      AI is responding...
    </p>
  </div>
</div>
```

**Methods**:
```typescript
onInputChange() {
  // Auto-resize textarea
  const textarea = this.textareaRef.nativeElement;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;

  // Detect logs
  if (this.input.trim() && detectLogs(this.input)) {
    this.detectedLogs = extractLogs(this.input);
  } else {
    this.detectedLogs = null;
  }
}

handleSend() {
  if (!this.canSend()) return;

  let requirement = this.input.trim();
  let logsPasted: string | undefined;

  // Extract requirement if logs detected
  if (this.detectedLogs) {
    requirement = extractRequirement(this.input);
    logsPasted = this.detectedLogs;
  }

  this.onSend.emit({
    content: requirement,
    repoUrl: this.repoUrl.trim(),
    logsPasted,
    logFiles: this.logFiles.length > 0 ? this.logFiles : undefined,
  });

  // Clear state
  this.input = '';
  this.logFiles = [];
  this.detectedLogs = null;
  this.showDetectedLogs = false;
  this.showFileUpload = false;
  this.textareaRef.nativeElement.style.height = 'auto';
}

canSend(): boolean {
  return this.input.trim().length > 0 &&
         this.repoUrl.trim().length > 0 &&
         !this.repoError;
}

getPlaceholder(): string {
  return this.disabled
    ? 'AI is responding... Type to queue your next message'
    : this.placeholder;
}

getSendTooltip(): string {
  if (this.disabled) return 'Queue message';
  if (this.detectedLogs || this.logFiles.length > 0) return 'Send + Logs';
  return 'Send message';
}
```

---

#### 8. **File Upload Component** (`file-upload.component.ts`)
**Purpose**: Drag-and-drop file upload area

**Inputs/Outputs**:
```typescript
@Input() files: File[] = [];
@Input() disabled = false;
@Input() maxFiles = 5;
@Input() maxSize = 10 * 1024 * 1024; // 10MB
@Output() filesChange = new EventEmitter<File[]>();
```

**Template**:
```html
<div class="space-y-2">
  <!-- Drop Zone -->
  <div (drop)="onDrop($event)"
       (dragover)="onDragOver($event)"
       (dragleave)="onDragLeave($event)"
       [class]="getDropZoneClass()"
       class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all">

    <upload-icon class="w-8 h-8 mx-auto mb-2 text-gray-400"></upload-icon>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
      Drop log files or <label class="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
        browse
        <input type="file"
               #fileInput
               multiple
               accept=".log,.txt,.out,.err"
               (change)="onFileSelect($event)"
               class="hidden">
      </label>
    </p>
    <p class="text-xs text-gray-500 dark:text-gray-500">
      Supports .log, .txt, .out, .err (max {{ maxSize / 1024 / 1024 }}MB)
    </p>
  </div>

  <!-- File List -->
  <div *ngIf="files.length > 0" class="space-y-1">
    <div *ngFor="let file of files"
         class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded px-3 py-2">
      <div class="flex items-center gap-2 flex-1">
        <file-icon class="w-4 h-4 text-gray-500"></file-icon>
        <span class="text-sm text-gray-900 dark:text-gray-100 truncate">{{ file.name }}</span>
        <span class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</span>
      </div>
      <button (click)="removeFile(file)"
              class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
        <x-icon class="w-4 h-4"></x-icon>
      </button>
    </div>
  </div>

  <!-- Error Message -->
  <p *ngIf="errorMessage" class="text-red-600 dark:text-red-400 text-xs">
    {{ errorMessage }}
  </p>
</div>
```

**Methods**:
```typescript
isDragging = false;
errorMessage = '';

onDrop(event: DragEvent) {
  event.preventDefault();
  this.isDragging = false;

  const files = Array.from(event.dataTransfer?.files || []);
  this.addFiles(files);
}

onDragOver(event: DragEvent) {
  event.preventDefault();
  this.isDragging = true;
}

onDragLeave(event: DragEvent) {
  this.isDragging = false;
}

onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  this.addFiles(files);
  input.value = ''; // Reset input
}

addFiles(newFiles: File[]) {
  this.errorMessage = '';

  // Validate files
  for (const file of newFiles) {
    if (!isValidLogFile(file)) {
      this.errorMessage = `Invalid file: ${file.name}. Only .log, .txt, .out, .err files allowed.`;
      continue;
    }

    if (file.size > this.maxSize) {
      this.errorMessage = `File too large: ${file.name}. Max size is ${this.maxSize / 1024 / 1024}MB.`;
      continue;
    }

    if (this.files.some(f => f.name === file.name && f.size === file.size)) {
      this.errorMessage = `Duplicate file: ${file.name}`;
      continue;
    }

    if (this.files.length >= this.maxFiles) {
      this.errorMessage = `Maximum ${this.maxFiles} files allowed.`;
      break;
    }

    this.files.push(file);
  }

  this.filesChange.emit(this.files);
}

removeFile(file: File) {
  this.files = this.files.filter(f => f !== file);
  this.filesChange.emit(this.files);
}

getDropZoneClass(): string {
  if (this.disabled) return 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 cursor-not-allowed';
  if (this.isDragging) return 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20';
  return 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500';
}

formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
```

---

## TypeScript Interfaces & Types

### Core Types (`types/workflow.ts`)
```typescript
export type MessageSender = 'user' | 'agent';

export type WorkflowStatus = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'WAITING_FOR_DEVELOPER';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  content: string;
  timestamp: Date;
  agent?: string;
  status?: WorkflowStatus;
  progress?: number; // 0-1
}

export interface WorkflowRequest {
  requirement: string;
  repoUrl: string;
  targetClass?: string;
  logsPasted?: string;
  logFiles?: File[];
}

export interface WorkflowStatusResponse {
  conversationId: string;
  status: WorkflowStatus;
  message: string;
  agent?: string;
  progress?: number;
}

export interface Conversation {
  id: string;
  repoUrl: string;
  messages: ChatMessage[];
  timestamp: Date;
}
```

---

## Utilities & Services

### 1. **Log Detection Utility** (`utils/log-detection.ts`)
```typescript
/**
 * Detects if text contains log traces or exceptions
 */
export function detectLogs(text: string): boolean {
  if (!text || text.trim().length === 0) return false;

  const patterns = [
    // Java/Kotlin stack traces
    /at\s+[\w.$]+\([\w.]+:\d+\)/,
    /^\s+at\s+/m,

    // Python stack traces
    /File\s+"[^"]+",\s+line\s+\d+/i,
    /Traceback\s+\(most recent call last\)/i,

    // JavaScript errors
    /at\s+\w+\s+\([^)]+:\d+:\d+\)/,
    /^\s+at\s+Object\./m,

    // C# exceptions
    /at\s+[\w.]+\([^)]*\)\s+in\s+[^:]+:\s*line\s+\d+/i,

    // Exception keywords
    /Exception|Error|Throwable/i,
    /Caused by:/i,

    // Log levels with timestamps
    /\d{4}-\d{2}-\d{2}[\sT]\d{2}:\d{2}:\d{2}.*?(ERROR|WARN|FATAL|Exception)/i,
    /\[(ERROR|WARN|FATAL)\]/i,

    // Generic stack traces
    /^\s*at\s+.+:\d+/m,
    /stack trace:/i,
  ];

  return patterns.some(pattern => pattern.test(text));
}

/**
 * Counts number of log lines
 */
export function countLogLines(text: string): number {
  return text.split('\n').filter(line => line.trim().length > 0).length;
}

/**
 * Extracts user requirement from text containing logs
 */
export function extractRequirement(text: string): string {
  const lines = text.split('\n');
  const requirementLines: string[] = [];

  for (const line of lines) {
    // Stop when we hit log patterns
    if (detectLogs(line)) break;
    requirementLines.push(line);
  }

  return requirementLines.join('\n').trim() || text;
}

/**
 * Extracts just the log content
 */
export function extractLogs(text: string): string {
  const lines = text.split('\n');
  const logLines: string[] = [];
  let foundLogs = false;

  for (const line of lines) {
    if (detectLogs(line)) {
      foundLogs = true;
    }
    if (foundLogs) {
      logLines.push(line);
    }
  }

  return logLines.join('\n').trim() || text;
}

/**
 * Validates if file is a valid log file
 */
export function isValidLogFile(file: File): boolean {
  const validExtensions = ['.log', '.txt', '.out', '.err'];
  return validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
}
```

### 2. **GitHub URL Validation** (`utils/validation.ts`)
```typescript
/**
 * Validates GitHub repository URL
 */
export function isValidGitHubUrl(url: string): boolean {
  if (!url) return false;

  // Must be HTTPS
  if (!url.startsWith('https://')) return false;

  // GitHub URL pattern: https://github.com/username/repository
  const pattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/;

  return pattern.test(url.trim());
}
```

### 3. **Workflow Service** (`services/workflow.service.ts`)
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkflowRequest, WorkflowStatusResponse } from '../types/workflow';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private readonly API_BASE_URL = '/api/v1';

  constructor(private http: HttpClient) {}

  /**
   * Start a new workflow
   */
  startWorkflow(request: WorkflowRequest): Observable<WorkflowStatusResponse> {
    const hasLogs = request.logsPasted || (request.logFiles && request.logFiles.length > 0);

    if (hasLogs) {
      // Use multipart/form-data
      const formData = new FormData();
      formData.append('requirement', request.requirement);
      formData.append('repoUrl', request.repoUrl);

      if (request.targetClass) {
        formData.append('targetClass', request.targetClass);
      }

      if (request.logsPasted) {
        formData.append('logsPasted', request.logsPasted);
      }

      if (request.logFiles) {
        request.logFiles.forEach(file => {
          formData.append('logFiles', file);
        });
      }

      return this.http.post<WorkflowStatusResponse>(
        `${this.API_BASE_URL}/workflows/start`,
        formData
      );
    } else {
      // Use JSON
      return this.http.post<WorkflowStatusResponse>(
        `${this.API_BASE_URL}/workflows/start`,
        request
      );
    }
  }

  /**
   * Get workflow status
   */
  getWorkflowStatus(conversationId: string): Observable<WorkflowStatusResponse> {
    return this.http.get<WorkflowStatusResponse>(
      `${this.API_BASE_URL}/workflows/${conversationId}/status`
    );
  }

  /**
   * Send developer response
   */
  respondToWorkflow(conversationId: string, response: string): Observable<WorkflowStatusResponse> {
    return this.http.post<WorkflowStatusResponse>(
      `${this.API_BASE_URL}/workflows/${conversationId}/respond`,
      { response }
    );
  }
}
```

### 4. **Theme Service** (`services/theme.service.ts`)
```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  private themeSubject: BehaviorSubject<Theme>;

  constructor() {
    const initialTheme = this.getInitialTheme();
    this.themeSubject = new BehaviorSubject<Theme>(initialTheme);
    this.applyTheme(initialTheme);
  }

  get theme$() {
    return this.themeSubject.asObservable();
  }

  get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme) {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  private getInitialTheme(): Theme {
    // Check localStorage
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved as Theme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  private applyTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
```

### 5. **Storage Service** (`services/storage.service.ts`)
```typescript
import { Injectable } from '@angular/core';
import { Conversation } from '../types/workflow';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly CONVERSATIONS_KEY = 'conversations';

  /**
   * Save conversations to localStorage
   */
  saveConversations(conversations: Conversation[]) {
    try {
      localStorage.setItem(this.CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Failed to save conversations:', error);
    }
  }

  /**
   * Load conversations from localStorage
   */
  loadConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(this.CONVERSATIONS_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      // Convert timestamp strings back to Date objects
      return parsed.map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
    } catch (error) {
      console.error('Failed to load conversations:', error);
      return [];
    }
  }

  /**
   * Clear all conversations
   */
  clearConversations() {
    localStorage.removeItem(this.CONVERSATIONS_KEY);
  }
}
```

---

## Styling & Design System

### Tailwind Configuration (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // Use class strategy for dark mode
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.900'),
            a: {
              color: theme('colors.blue.600'),
              '&:hover': {
                color: theme('colors.blue.700'),
              },
            },
            code: {
              backgroundColor: theme('colors.gray.700'),
              color: theme('colors.white'),
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.100'),
            code: {
              backgroundColor: theme('colors.gray.600'),
              color: theme('colors.white'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

### Global Styles (`styles.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Smooth transitions */
* {
  @apply transition-colors duration-200;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600 rounded;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 dark:bg-gray-500;
}

/* Markdown code blocks */
markdown pre {
  @apply rounded-lg overflow-x-auto my-4;
}

markdown code:not([class*="language-"]) {
  @apply bg-gray-700 dark:bg-gray-600 text-white px-1.5 py-0.5 rounded text-xs font-mono;
}

/* Textarea auto-resize */
textarea {
  resize: none;
  overflow: hidden;
}
```

---

## UX Patterns & Behaviors

### 1. **Smart Auto-Scroll**
- Only auto-scroll if user is within 100px of bottom
- Show "New messages ↓" button when new messages arrive and user scrolled up
- Force scroll to bottom on user's own message
- Smooth scrolling animation

### 2. **Input Area Behaviors**
- Textarea auto-resizes as user types (max 5 lines)
- Enter sends, Shift+Enter adds newline
- Input stays enabled during AI response (queuing)
- Placeholder changes to show AI is responding
- Send button disabled when invalid

### 3. **Theme Toggle**
- Smooth transition between themes
- Icon swaps (Moon ↔ Sun)
- Persists to localStorage
- Applies to entire app instantly

### 4. **Repository URL**
- Real-time validation with visual feedback
- Shows green checkmark when valid
- Shows red error message when invalid
- Hides when locked to save space
- Saves to localStorage

### 5. **Log Detection**
- Runs automatically on every input change
- Shows badge with line count
- Allows preview with Show/Hide toggle
- Clear button to remove detection
- Automatically separates requirement from logs

### 6. **File Upload**
- Collapsible (starts hidden)
- Drag-and-drop with visual feedback
- File picker as fallback
- Shows file count badge on toggle button
- Validates file type and size
- Shows attached files with remove buttons
- Auto-collapses after sending

### 7. **Status Indication**
- Colored borders (not backgrounds) for agent messages
- Icons with status (spinner, checkmark, X, clock)
- Progress bar for tasks
- Agent badge showing agent name

### 8. **Conversation History**
- Slides in from left
- Backdrop click to close
- Truncated message previews
- Relative timestamps
- Repository URL shown for each conversation

---

## State Management

### Application State
Use Angular services with RxJS for state management:

```typescript
@Injectable({ providedIn: 'root' })
export class AppStateService {
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  private currentConversationSubject = new BehaviorSubject<Conversation | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  conversations$ = this.conversationsSubject.asObservable();
  currentConversation$ = this.currentConversationSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadConversations();
  }

  private loadConversations() {
    const conversations = this.storageService.loadConversations();
    this.conversationsSubject.next(conversations);
  }

  addMessage(message: ChatMessage) {
    const current = this.currentConversationSubject.value;
    if (current) {
      current.messages.push(message);
      this.currentConversationSubject.next(current);
      this.saveConversations();
    }
  }

  startNewConversation(repoUrl: string) {
    const conversation: Conversation = {
      id: this.generateId(),
      repoUrl,
      messages: [],
      timestamp: new Date(),
    };

    this.currentConversationSubject.next(conversation);

    const conversations = this.conversationsSubject.value;
    conversations.unshift(conversation);
    this.conversationsSubject.next(conversations);
    this.saveConversations();
  }

  loadConversation(id: string) {
    const conversations = this.conversationsSubject.value;
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      this.currentConversationSubject.next(conversation);
    }
  }

  private saveConversations() {
    this.storageService.saveConversations(this.conversationsSubject.value);
  }

  private generateId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

---

## API Integration

### Endpoint: POST /api/v1/workflows/start

**Request (JSON - simple)**:
```json
{
  "requirement": "Fix the login bug",
  "repoUrl": "https://github.com/username/repo",
  "targetClass": "LoginController"
}
```

**Request (multipart/form-data - with logs)**:
```
Content-Type: multipart/form-data

requirement: "Fix this error"
repoUrl: "https://github.com/username/repo"
logsPasted: "Exception in thread...\nat com.example..."
logFiles: [file1.log, file2.log]
```

**Response**:
```json
{
  "conversationId": "conv_123",
  "status": "RUNNING",
  "message": "Analyzing codebase...",
  "agent": "CodeAnalyzer",
  "progress": 0.25
}
```

### Endpoint: GET /api/v1/workflows/{conversationId}/status

**Response**:
```json
{
  "conversationId": "conv_123",
  "status": "COMPLETED",
  "message": "Bug fixed successfully!",
  "agent": "CodeFixer",
  "progress": 1.0
}
```

### Endpoint: POST /api/v1/workflows/{conversationId}/respond

**Request**:
```json
{
  "response": "Yes, please proceed"
}
```

**Response**:
```json
{
  "conversationId": "conv_123",
  "status": "RUNNING",
  "message": "Proceeding with implementation...",
  "agent": "CodeImplementer",
  "progress": 0.5
}
```

---

## Build Configuration

### package.json
```json
{
  "name": "autoflow-ui-angular",
  "version": "1.0.0",
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch",
    "test": "ng test"
  },
  "dependencies": {
    "@angular/animations": "^17.0.0",
    "@angular/common": "^17.0.0",
    "@angular/compiler": "^17.0.0",
    "@angular/core": "^17.0.0",
    "@angular/forms": "^17.0.0",
    "@angular/platform-browser": "^17.0.0",
    "@angular/platform-browser-dynamic": "^17.0.0",
    "@angular/router": "^17.0.0",
    "ngx-markdown": "^17.0.0",
    "prismjs": "^1.29.0",
    "lucide-angular": "^0.300.0",
    "rxjs": "^7.8.0",
    "tslib": "^2.6.0",
    "zone.js": "^0.14.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^17.0.0",
    "@angular/cli": "^17.0.0",
    "@angular/compiler-cli": "^17.0.0",
    "@types/node": "^20.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/typography": "^0.5.0",
    "typescript": "~5.2.0"
  }
}
```

### angular.json (key sections)
```json
{
  "projects": {
    "autoflow-ui": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.css",
              "node_modules/prismjs/themes/prism-tomorrow.css"
            ],
            "scripts": [
              "node_modules/prismjs/prism.js",
              "node_modules/prismjs/components/prism-typescript.min.js",
              "node_modules/prismjs/components/prism-javascript.min.js",
              "node_modules/prismjs/components/prism-java.min.js",
              "node_modules/prismjs/components/prism-python.min.js",
              "node_modules/prismjs/components/prism-csharp.min.js"
            ]
          }
        },
        "serve": {
          "options": {
            "proxyConfig": "proxy.conf.json"
          }
        }
      }
    }
  }
}
```

### proxy.conf.json (for development)
```json
{
  "/api/v1": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

---

## Implementation Checklist

### Phase 1: Setup & Foundation
- [ ] Create Angular 17+ project
- [ ] Install dependencies (Tailwind, ngx-markdown, lucide-angular, etc.)
- [ ] Configure Tailwind with dark mode class strategy
- [ ] Configure Prism.js for syntax highlighting
- [ ] Set up proxy configuration for API
- [ ] Create folder structure (components, services, types, utils)

### Phase 2: Core Services
- [ ] Create ThemeService with localStorage persistence
- [ ] Create WorkflowService with HTTP methods
- [ ] Create StorageService for conversations
- [ ] Create AppStateService for global state
- [ ] Create utility functions (log detection, validation)

### Phase 3: Type Definitions
- [ ] Define ChatMessage interface
- [ ] Define WorkflowRequest interface
- [ ] Define WorkflowStatusResponse interface
- [ ] Define Conversation interface
- [ ] Define all enums (MessageSender, WorkflowStatus, Theme)

### Phase 4: UI Components - Layout
- [ ] Create HeaderComponent with theme toggle
- [ ] Create HistorySidebarComponent with conversations list
- [ ] Create ChatContainerComponent as main layout
- [ ] Style all components with Tailwind

### Phase 5: UI Components - Messages
- [ ] Create MessageListComponent with smart auto-scroll
- [ ] Create UserMessageComponent with styling
- [ ] Create AgentMessageComponent with status colors
- [ ] Configure markdown rendering with custom styles
- [ ] Add syntax highlighting for code blocks

### Phase 6: UI Components - Input
- [ ] Create ChatInputComponent with auto-resize
- [ ] Add repository URL input with validation
- [ ] Integrate log detection with badge
- [ ] Create FileUploadComponent with drag-and-drop
- [ ] Add collapsible file upload area

### Phase 7: Features - Chat Functionality
- [ ] Implement sending messages
- [ ] Implement starting workflows via API
- [ ] Implement 2-second polling for status updates
- [ ] Update agent messages in real-time
- [ ] Handle errors gracefully

### Phase 8: Features - Conversation Management
- [ ] Implement new conversation creation
- [ ] Implement conversation history loading
- [ ] Implement localStorage persistence
- [ ] Add conversation timestamps
- [ ] Implement conversation selection

### Phase 9: Features - Log Detection & Upload
- [ ] Implement auto-detection regex patterns
- [ ] Implement requirement extraction
- [ ] Implement log extraction
- [ ] Add file validation (type, size)
- [ ] Send multipart/form-data when logs present

### Phase 10: UX Polish
- [ ] Implement smart auto-scroll with threshold
- [ ] Add "New messages" floating button
- [ ] Add smooth transitions and animations
- [ ] Test dark mode on all components
- [ ] Ensure all text is readable
- [ ] Test collapsible sections
- [ ] Verify placeholder text changes

### Phase 11: Testing & Deployment
- [ ] Test all API integrations
- [ ] Test localStorage persistence
- [ ] Test file upload with various file types
- [ ] Test log detection with various formats
- [ ] Test theme toggle
- [ ] Test conversation history
- [ ] Build for production
- [ ] Deploy

---

## Key Differences from React

### State Management
- **React**: useState, useEffect, useContext
- **Angular**: RxJS BehaviorSubjects, Services with dependency injection

### Component Communication
- **React**: Props and callbacks
- **Angular**: @Input(), @Output() with EventEmitter

### Lifecycle
- **React**: useEffect with dependencies
- **Angular**: ngOnInit, ngOnDestroy, ngAfterViewInit, etc.

### Refs
- **React**: useRef
- **Angular**: @ViewChild, ElementRef

### Styling
- **React**: className
- **Angular**: [class], [ngClass]

### Conditional Rendering
- **React**: {condition && <Component />}
- **Angular**: *ngIf="condition"

### Lists
- **React**: map() with key
- **Angular**: *ngFor with trackBy

### Forms
- **React**: Controlled components with useState
- **Angular**: [(ngModel)] two-way binding or Reactive Forms

---

## Final Notes

This specification is comprehensive and contains everything needed to build the AutoFlow UI in Angular. Key points to remember:

1. **Organic UX**: Flattened design, no scroll hijacking, clean and readable
2. **Dark Mode**: Class-based with full support in all components
3. **Smart Auto-Scroll**: Only scrolls if user near bottom
4. **Log Detection**: Automatic with regex patterns
5. **Collapsible Sections**: File upload hidden by default
6. **State Persistence**: All conversations and settings saved to localStorage
7. **Real-time Updates**: 2-second polling for workflow status
8. **Inline Code Visibility**: Dark gray background with white text
9. **Space Efficiency**: Compact padding, hidden sections when locked

Follow this specification step-by-step and you'll have an exact Angular implementation of the AutoFlow UI.
