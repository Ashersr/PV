import { useState } from 'react'
import styled from '@emotion/styled'
import Editor from '@monaco-editor/react'

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`

const PromptPanel = styled.div`
  width: 300px;
  height: 100%;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`

const PromptTextArea = styled.textarea`
  flex: 1;
  padding: 16px;
  border: none;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  &:focus {
    outline: none;
  }
`

const GenerateButton = styled.button`
  padding: 12px;
  background-color: #007AFF;
  color: white;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`

const EditorContainer = styled.div`
  flex: 1;
  height: 100%;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
`

const FileExplorer = styled.div`
  height: 40px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background-color: #f5f5f5;
`

const FileTab = styled.div<{ active: boolean }>`
  padding: 8px 16px;
  margin-right: 4px;
  background-color: ${props => props.active ? '#ffffff' : '#e0e0e0'};
  border: 1px solid #ccc;
  border-bottom: ${props => props.active ? 'none' : '1px solid #ccc'};
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: ${props => props.active ? '#ffffff' : '#f0f0f0'};
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 2px 6px;
  cursor: pointer;
  color: #666;
  font-size: 16px;
  line-height: 1;

  &:hover {
    color: #000;
  }
`

const PreviewContainer = styled.div`
  flex: 1;
  height: 100%;
  padding: 20px;
  background-color: #f5f5f5;
  overflow: auto;
`

const PreviewFrame = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 200px;
`

interface File {
  name: string;
  content: string;
  language: string;
}

const defaultFiles: File[] = [
  {
    name: 'index.html',
    content: `<!DOCTYPE html>
<html>
<head>
  <title>Task List App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>My Task List</h1>
    <div class="task-input">
      <input type="text" id="taskInput" placeholder="Add a new task...">
      <button onclick="addTask()">Add Task</button>
    </div>
    <div class="task-filters">
      <button onclick="filterTasks('all')" class="filter-btn active">All</button>
      <button onclick="filterTasks('active')" class="filter-btn">Active</button>
      <button onclick="filterTasks('completed')" class="filter-btn">Completed</button>
    </div>
    <ul id="taskList" class="task-list">
      <!-- Tasks will be added here dynamically -->
    </ul>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
    language: 'html'
  },
  {
    name: 'styles.css',
    content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
}

.task-input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input[type="text"] {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #2980b9;
}

.task-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-btn {
  background-color: #ecf0f1;
  color: #2c3e50;
}

.filter-btn.active {
  background-color: #3498db;
  color: white;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  margin-bottom: 10px;
  border-radius: 4px;
  transition: transform 0.2s;
}

.task-item:hover {
  transform: translateX(5px);
}

.task-item.completed {
  background-color: #e8f5e9;
}

.task-item.completed .task-text {
  text-decoration: line-through;
  color: #666;
}

.task-checkbox {
  margin-right: 15px;
}

.task-text {
  flex: 1;
}

.delete-btn {
  background-color: #e74c3c;
  padding: 5px 10px;
  font-size: 14px;
}

.delete-btn:hover {
  background-color: #c0392b;
}`,
    language: 'css'
  },
  {
    name: 'app.js',
    content: `// Task list functionality
let tasks = [
  { id: 1, text: 'Learn HTML', completed: false },
  { id: 2, text: 'Master CSS', completed: false },
  { id: 3, text: 'Practice JavaScript', completed: true }
];

// DOM Elements
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Initialize the task list
function initializeTasks() {
  renderTasks(tasks);
}

// Add a new task
function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };
    tasks.push(newTask);
    renderTasks(tasks);
    taskInput.value = '';
  }
}

// Toggle task completion
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  renderTasks(tasks);
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks(tasks);
}

// Filter tasks
function filterTasks(filter) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  let filteredTasks = tasks;
  if (filter === 'active') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (filter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  }
  renderTasks(filteredTasks);
}

// Render tasks to the DOM
function renderTasks(tasksToRender) {
  const taskElements = tasksToRender.map(task => 
    '<li class="task-item ' + (task.completed ? 'completed' : '') + '">' +
    '<input type="checkbox" class="task-checkbox" ' + 
    (task.completed ? 'checked' : '') + ' onclick="toggleTask(' + task.id + ')">' +
    '<span class="task-text">' + task.text + '</span>' +
    '<button class="delete-btn" onclick="deleteTask(' + task.id + ')">Delete</button>' +
    '</li>'
  ).join('');
  
  taskList.innerHTML = taskElements;
}

// Initialize the app
initializeTasks();

// Add task on Enter key
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});`,
    language: 'javascript'
  }
];

function App() {
  const [files, setFiles] = useState<File[]>(defaultFiles);
  const [activeFile, setActiveFile] = useState<string>(defaultFiles[0].name);
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setFiles(files.map(file => 
        file.name === activeFile 
          ? { ...file, content: value }
          : file
      ));
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      console.log('Sending request to:', import.meta.env.VITE_SUPABASE_FUNCTION_URL)
      console.log('With prompt:', prompt)

      const response = await fetch(import.meta.env.VITE_SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ prompt })
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(`Failed to generate code: ${data.error || response.statusText}`)
      }

      if (data.error) {
        throw new Error(data.error)
      }

      // Update the active file with the generated code
      setFiles(files.map(file => 
        file.name === activeFile 
          ? { ...file, content: data.code }
          : file
      ));
    } catch (err) {
      console.error('Error details:', err)
      setError(err instanceof Error ? `${err.message}\n${err.stack || ''}` : 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFileClose = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
    if (activeFile === fileName) {
      setActiveFile(files[0]?.name || '');
    }
  }

  const getActiveFileContent = () => {
    return files.find(file => file.name === activeFile)?.content || '';
  }

  const getActiveFileLanguage = () => {
    return files.find(file => file.name === activeFile)?.language || 'javascript';
  }

  // Combine all files for preview
  const getPreviewContent = () => {
    const htmlFile = files.find(file => file.name.endsWith('.html'))?.content || '';
    const cssFile = files.find(file => file.name.endsWith('.css'))?.content || '';
    const jsFile = files.find(file => file.name.endsWith('.js'))?.content || '';

    // Extract the body content from HTML
    const bodyMatch = htmlFile.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : htmlFile;

    // Create a complete HTML document
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${cssFile}</style>
      </head>
      <body>
        ${bodyContent}
        <script>${jsFile}</script>
      </body>
      </html>
    `;
  }

  return (
    <AppContainer>
      <PromptPanel>
        <PromptTextArea
          placeholder="Describe what you want the code to do..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <GenerateButton 
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </GenerateButton>
        {error && (
          <div style={{ color: 'red', padding: '8px', fontSize: '14px' }}>
            {error}
          </div>
        )}
      </PromptPanel>
      <EditorContainer>
        <FileExplorer>
          {files.map(file => (
            <FileTab
              key={file.name}
              active={file.name === activeFile}
              onClick={() => setActiveFile(file.name)}
            >
              {file.name}
              <CloseButton onClick={() => handleFileClose(file.name)}>×</CloseButton>
            </FileTab>
          ))}
        </FileExplorer>
        <Editor
          height="100%"
          defaultLanguage={getActiveFileLanguage()}
          value={getActiveFileContent()}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </EditorContainer>
      <PreviewContainer>
        <h2>Preview</h2>
        <PreviewFrame>
          <div dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
        </PreviewFrame>
      </PreviewContainer>
    </AppContainer>
  )
}

export default App
