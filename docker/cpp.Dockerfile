FROM alpine:3.19
RUN apk add --no-cache g++ coreutils
RUN adduser -D -u 1000 coderunner
USER coderunner
WORKDIR /app
CMD ["sh"]
