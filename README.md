# Code Preview App

A web application that allows you to generate and preview code using OpenAI's GPT model. The app features a three-panel layout with:
- A prompt panel for entering code generation requests
- A code editor for viewing and editing the generated code
- A live preview panel that renders the code output

## Features

- Real-time code generation using OpenAI's GPT model
- Monaco Editor integration for a professional coding experience
- Live preview of generated code
- Supabase Edge Functions for secure API handling
- Modern, responsive UI

## Setup

1. Clone the repository:
```bash
git clone git@github.com:Ashersr/Productvalidation.git
cd code-preview-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_FUNCTION_URL=your_supabase_function_url
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

The following environment variables are required:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_SUPABASE_FUNCTION_URL`: Your Supabase Edge Function URL

## Development

The project is built with:
- React + TypeScript
- Vite
- Monaco Editor
- Supabase Edge Functions
- OpenAI API

## License

MIT
