FROM python:3.11-alpine
RUN apk add --no-cache coreutils
RUN adduser -D -u 1000 coderunner
USER coderunner
WORKDIR /app
CMD ["sh"]
