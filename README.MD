🤖 Vibe Coder Finder: Autonomous AI Web QA & Experience Agent

Vibe Coder Finder is an agentic AI-driven testing platform designed to autonomously audit, test, and evaluate web applications in real-time production environments.

By taking a target URL and authentication credentials, Vibe Coder Finder deploys a team of specialized AI agents powered by LangGraph and Playwright. The agents systematically navigate pages, execute user flows, test dynamic interactions, detect UI/UX anomalies ("vibe checks"), capture console/network errors, and deliver actionable diagnostic reports.

🌟 Key Features

Autonomous Web Exploration: LangGraph agents inspect the DOM and screenshots to determine the next logical action (clicks, form fills, navigation) without pre-scripted test flows.

Secure Authentication Flow: Safely injects credentials into login forms, handles MFA/OTP prompts if configured, and maintains authenticated browser sessions.

Visual & Functional "Vibe Check": Evaluates page aesthetics, visual responsiveness, broken layouts, dead links, and general user experience smoothness.

Deep Technical Auditing: Captures network logs (HTTP 4xx/5xx status codes), frontend console errors, unhandled exceptions, and page performance metrics.

Real-Time Streaming Dashboard: Built with Next.js and Server-Sent Events (SSE) / WebSockets to view the agent's browser state, live video/screenshot stream, and thought process in real time.

Automated Bug Reports: Generates structured issue reports complete with steps-to-reproduce, screenshots, DOM elements, and console log traces.

🏗 System Architecture

                                  +-------------------+
                                  |   Next.js Frontend |
                                  | (Live Dashboard)  |
                                  +---------+---------+
                                            |
                                  REST / SSE / WebSockets
                                            |
                                  +---------v---------+
                                  |  FastAPI Backend  |
                                  +----+----+----+----+
                                       |    |    |
             +-------------------------+    |    +--------------------------+
             |                              |                               |
   +---------v---------+          +---------v---------+           +---------v---------+
   |   LangGraph Agent  |          | Playwright Engine |           |   MySQL Database  |
   |     State Machine | <======> | (Headless Browser) |           |  (State & History)|
   +-------------------+          +-------------------+           +-------------------+


Agentic Execution Graph (LangGraph Workflow)

[Start Run] ---> (Planner Agent) ---> (Browser Operator Agent) ---> (Observer Agent)
                      ^                                                  |
                      |------------ [Action Iteration Loop] -------------|
                                                                         |
                                                                 (Task Complete?)
                                                                         |
                                                                         v
                                                                 (Reporter Agent) ---> [Finish]


Planner Agent: Evaluates the goal, analyzes the current page structure, and determines the high-level roadmap (e.g., "Login -> Navigate to Dashboard -> Test Profile Settings -> Checkout").

Browser Operator Agent: Translates agent directives into Playwright actions (e.g., page.click("#submit"), page.fill("#email", val)).

Observer Agent: Captures the state after each action—analyzing visual screenshots, DOM mutations, console logs, and network responses. Detects bugs and visual flaws.

Reporter Agent: Synthesizes all execution traces into a final diagnostic summary and bug report.

🛠 Tech Stack

Frontend

Framework: Next.js 14+ (App Router, React 18, TypeScript)

Styling: Tailwind CSS + Shadcn UI

State & Streaming: React Query, Lucide Icons, EventSource (SSE) / WebSockets

Backend

Framework: FastAPI (Python 3.11+)

ORMs & Database: SQLAlchemy / Alembic, MySQL 8.0+

Task Queue: Celery / Redis or Asyncio background tasks

Agentic AI & Automation

Agent Orchestration: LangGraph & LangChain

LLM Backbone: OpenAI GPT-4o / Anthropic Claude 3.5 Sonnet (Vision-capable model required)

Browser Automation: Playwright Python