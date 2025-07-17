#!/bin/sh

# Start Ollama server in background
ollama serve &

# Wait for server to be ready
sleep 3

# Pull the model (adjust model name as needed)
ollama pull gemma3:1b

# Keep the server running (attach to background process)
wait
