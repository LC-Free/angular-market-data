FROM golang
VOLUME /var/log/service
COPY src /go/src
WORKDIR /go/src/goservice
RUN go build
ENTRYPOINT ./goservice
EXPOSE 8000

