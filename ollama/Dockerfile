FROM ollama/ollama:latest

# Copy your startup script into the container
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Override default entrypoint to shell instead of "ollama"
ENTRYPOINT ["/bin/sh"]
CMD ["/start.sh"]
