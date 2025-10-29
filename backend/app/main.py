from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from .api.routes import router

app = FastAPI(title="CareerPath AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
