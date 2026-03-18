# CareerPath-AI V1

An AI-powered career guidance platform that analyzes academic transcripts to help students understand their skills, discover career opportunities, and plan their next steps.

## Features

- **📄 Transcript Analysis** - Upload PDF or image transcripts for automatic data extraction
- **🎓 Official Course Details** - Find official university course catalogs and syllabi
- **🧠 Skill Inference** - AI-powered skill profile generation from coursework
- **💼 Career Matching** - Personalized career domain recommendations with fit scores
- **📊 Detailed Analysis** - Strengths, gaps, and actionable next steps for any target field
- **✨ Beautiful UI** - Clean, modern interface with smooth animations
- **⚡ Fast Processing** - Multi-stage progress indication for long-running operations
- **📥 Editable Results** - Review and correct extracted data before analysis

## Tech Stack

- **Frontend**: Next.js 14 with React 18 and TypeScript
- **Styling**: Tailwind CSS with Framer Motion animations
- **AI**: OpenAI API for transcript extraction, skill inference, and recommendations
- **Architecture**: Single Next.js app with server-side route handlers (no separate backend)

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── analyze/                 # Analysis flow page
│   └── api/                     # Route handlers (server-side)
│       ├── extract-transcript/  # PDF/image parsing
│       ├── analyze-career/      # Career analysis
│       └── search-field/        # Target field search
├── components/                   # React components
│   ├── navbar.tsx               # Navigation
│   ├── hero.tsx                 # Hero section
│   ├── transcript-upload.tsx    # File upload
│   ├── transcript-review-table.tsx # Edit extracted data
│   ├── processing-indicator.tsx # Progress stages
│   ├── results-dashboard.tsx    # Results view
│   ├── feature-highlights.tsx   # Feature showcase
│   └── ui/                      # Reusable UI components
├── lib/
│   ├── openai/                  # OpenAI API utilities
│   │   ├── client.ts            # OpenAI client setup
│   │   ├── extract-transcript.ts
│   │   └── infer-skills.ts
│   ├── course-lookup/           # University course search
│   │   └── search.ts
│   ├── scoring/                 # Career matching logic
│   │   └── career-matching.ts
│   └── cn.ts                    # Tailwind class utilities
├── types/                        # TypeScript interfaces
│   ├── transcript.ts
│   ├── course.ts
│   └── career.ts
└── styles/
    └── globals.css              # Global styles and animations
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd careerpath-ai
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## How It Works

### 1. Upload Transcript
Users upload their academic transcript as a PDF or image file. The system validates the file and prepares it for processing.

### 2. Extract Data
The transcript is sent to OpenAI which extracts:
- University name
- Major/Program
- Courses (code, title, credits, grades)
- GPA (if available)

### 3. Review & Edit
Users can review the extracted data and make corrections before proceeding. This ensures accuracy for subsequent analysis.

### 4. Look Up Course Details
For each course, the system searches the official university domain for:
- Official course catalog descriptions
- Public syllabus pages (when available)
- Department-level course information

### 5. Infer Skills
OpenAI analyzes the course content to infer:
- Core technical and domain skills
- Tools and technologies
- Key concepts
- Strengths (skills demonstrated by coursework and grades)
- Skill gaps (important skills not covered)

### 6. Career Matching
The app recommends career domains and provides detailed analysis including:
- **Top Domains**: Ranked by fit score based on skill alignment
- **Target Field Analysis**: Deep dive into any specific field showing:
  - Fit score (0-100%)
  - Relevant strengths
  - Missing skills
  - Personalized next steps

### 7. Results & Export
Users can view detailed results and export a shareable PDF summary.

## Architecture Notes

### Server-Side Only OpenAI Calls
All OpenAI API calls happen server-side in Next.js route handlers. This approach:
- ✅ Protects API credentials (not exposed to client)
- ✅ Enables caching and deduplication
- ✅ Provides better rate limiting and error handling
- ✅ Allows for deterministic scoring logic

### Data Flow
```
User Upload → API Route → PDF Parse → OpenAI Extract → Review Table
    ↓
 Search Courses (University Domains) → OpenAI Skill Inference
    ↓
Career Matching Scoring (Deterministic) → Results Dashboard
    ↓
Export PDF
```

### Caching Strategy (V1)
Currently uses in-memory caching. V1+ improvements could include:
- IndexedDB for client-side course descriptions
- Optional database for user session history
- Redis caching for frequently searched courses

## Career Domains Supported

V1 includes matching for these domains:
- Software Engineering
- Data Science
- Web Development
- DevOps / Cloud Infrastructure
- Machine Learning
- Cybersecurity

Additional domains can be added by extending `lib/scoring/career-matching.ts`.

## Key Design Decisions

### 1. Single Next.js App
Per the PRD requirements, this is **not** a separate backend + frontend architecture. Everything runs inside one Next.js application with:
- React components for UI
- Server-side route handlers for API logic
- TypeScript throughout

### 2. Explainability First
Every recommendation includes:
- Supporting evidence (which courses contributed)
- Confidence levels
- Explicit gaps (what's missing and why)
- Deterministic scoring logic where possible

### 3. Graceful Degradation
If syllabus lookup fails for a course, the system:
- Falls back to official catalog descriptions
- Still completes the analysis
- Marks confidence levels appropriately

### 4. User Control
- Users can edit extracted data before analysis
- Multiple result views (top domains vs. target field analysis)
- Clear disclaimers about the tool's purpose

## Important Notes

### Private Documentation
The `docs/private_docs/` folder contains PRD and planning materials. This folder is **intentionally excluded** from version control (see `.gitignore`). Do not commit these files.

### Version 1 Limitations
- V1 does not support authenticated user accounts - everything is session-based
- Course description lookup is placeholder-ready (uses mock data in demo, can integrate real search APIs)
- Does not include resume analysis (post-MVP feature)
- No historical comparison or saved profiles yet

### Future Enhancements (Post-MVP)
- User authentication and saved profiles
- Resume upload and fusion with transcript analysis
- Job-title-level recommendations
- User-entered projects, certifications, and extracurriculars
- Institution-specific model tuning
- Better course source heuristics
- Mobile app version

## Scoring Methodology

**Career domain fit scores** are calculated as:
1. Required skills match (base score: matched required skills / total required)
2. Preferred tools bonus (up to +0.25 additional points)
3. Normalized to 0-100%

Example:
- Domain requires: Programming, Data Structures, Algorithms, Software Design
- Student's skills: Programming, Algorithms, Python, Java
- Match: 2/4 base + tool bonus = ~65% fit

Scoring is intentionally transparent and explainable, not a black-box ML model.

## Troubleshooting

### OpenAI API Errors
- Check that `OPENAI_API_KEY` is set correctly in `.env.local`
- Verify your OpenAI account has API access and credits
- Check rate limits and quota in your OpenAI dashboard

### PDF Parsing Issues
- Ensure PDFs are readable (not scanned images or corrupted)
- Maximum file size: 10MB
- Supported formats: PDF, PNG, JPG

### Course Lookup Not Finding Results
- This is expected in V1 preview (uses mock data)
- Production version will integrate with real search APIs
- System gracefully continues with available catalog descriptions

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

This is a V1 MVP. Future contributions should:
- Follow the existing TypeScript and React patterns
- Add tests for new features
- Update types when adding data models
- Respect the architecture constraints (single Next.js app)
- Maintain explainability in scoring logic

## Support

For issues, feature requests, or questions:
1. Check the [open issues](https://github.com/your-org/careerpath-ai/issues)
2. Review the Architecture Notes above
3. Consult the PRD for design decisions

---

**Built with ❤️ for students navigating their career paths.**
