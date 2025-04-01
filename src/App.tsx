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

const defaultCode = `// Enter your code here
console.log("Hello, World!");`

function App() {
  const [code, setCode] = useState(defaultCode)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value)
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

      setCode(data.code)
    } catch (err) {
      console.error('Error details:', err)
      setError(err instanceof Error ? `${err.message}\n${err.stack || ''}` : 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
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
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
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
          <div dangerouslySetInnerHTML={{ __html: code }} />
        </PreviewFrame>
      </PreviewContainer>
    </AppContainer>
  )
}

export default App
