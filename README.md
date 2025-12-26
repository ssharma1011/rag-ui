# rag-ui

A modern, user-friendly interface for Retrieval-Augmented Generation (RAG) applications.

## Overview

This project provides a clean and intuitive UI for interacting with RAG systems, enabling users to query knowledge bases and receive contextually relevant responses powered by AI.

## Features

- **Intuitive Interface**: Clean, modern design for seamless user interaction
- **Real-time Query Processing**: Fast response times with streaming capabilities
- **Document Management**: Upload and manage your knowledge base documents
- **Contextual Responses**: Leverages RAG architecture to provide accurate, source-backed answers
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd rag-ui
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- API endpoints
- Authentication credentials
- Model configurations

### Running the Application

Development mode:
```bash
npm run dev
# or
yarn dev
```

Production build:
```bash
npm run build
npm start
# or
yarn build
yarn start
```

The application will be available at `http://localhost:3000` (or your configured port).

## Usage

1. **Upload Documents**: Navigate to the document management section and upload your knowledge base files
2. **Ask Questions**: Type your query in the search bar
3. **Review Responses**: Get AI-generated answers with source citations
4. **Refine Results**: Use filters and settings to customize response behavior

## Project Structure

```
rag-ui/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── services/       # API and business logic
│   ├── utils/          # Helper functions
│   └── styles/         # CSS/styling files
├── public/             # Static assets
├── tests/              # Test files
└── package.json        # Project dependencies
```

## Configuration

Key configuration options in `.env`:

- `NEXT_PUBLIC_API_URL`: Backend API endpoint
- `NEXT_PUBLIC_MODEL_NAME`: AI model identifier
- `MAX_UPLOAD_SIZE`: Maximum document upload size
- `CHUNK_SIZE`: Document chunking parameters

## Technologies

- **Frontend**: React/Next.js
- **Styling**: Tailwind CSS / styled-components
- **State Management**: React Context / Redux
- **API Integration**: Axios / Fetch API

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

Run tests with coverage:
```bash
npm run test:coverage
# or
yarn test:coverage
```

## Deployment

### Docker

Build and run with Docker:
```bash
docker build -t rag-ui .
docker run -p 3000:3000 rag-ui
```

### Platform Deployment

This project can be deployed to:
- Vercel
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## Troubleshooting

**Common Issues:**

- **Port already in use**: Change the port in your configuration or kill the process using the port
- **API connection errors**: Verify your API endpoint and credentials in `.env`
- **Upload failures**: Check file size limits and supported formats

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the [documentation](docs/)
- Contact the maintainers

## Acknowledgments

- Built with modern RAG architecture principles
- Inspired by best practices in AI-powered applications
- Community contributions and feedback

---

**Note**: This is an active project under development. Features and documentation are continuously updated.