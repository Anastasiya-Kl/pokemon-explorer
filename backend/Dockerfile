FROM golang:1.26-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./cmd/server

FROM alpine:3.22

RUN apk --no-cache add ca-certificates

ENV PORT=8080

EXPOSE 8080

COPY --from=builder /server /server

CMD ["/server"]
