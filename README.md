# Inicis(이니시스 결제 연동)

### Backend issue

1. cors 오류

BE와 FE의 서버 연동을 위해 첫번 째로 넘어야할 관문인 cors 오류가 있었습니다.
처음에 클라이언트와 서버를 로컬에서 테스트할 때는 cors 오류가 발생했으나, heroku에 배포할때는 같은 도메인이기에 cors 오류를 크게 신경쓰지 않아도됩니다.
그래도 cors 라는 라이브러리 다운 후,

```
    app.use(
    cors({
        origin: [
            "https://paymentportfolio.herokuapp.com",
            "http://localhost:5000"
        ],
        credentials: true,
    })
);

```

위 와 같이 처리 했습니다.

<br >

2. API 라우팅 이슈

이번 프로젝트의 경우, 클라이언트단에서 결제 연동을 위해 처리해야할 로직을 보여주기 위함이기에 서버에는 기본적인 셋팅 및 결제창을 띄우기 위해 API 라우팅 셋팅만 마쳤습니다.
그러던 중, API 테스트를 하는데에 있어서 이슈가 계속 났었는데 API 처리와 listen 처리의 순서에 있어서 잘못됐다는걸 인지 한 후, 해당 이슈를 수정 할 수 있었습니다.
이슈는 get방식의 test API를 만들어서 서버 통신을 했을 경우, 계속 HTML 문서만 response로 전달됐습니다.

- 수정 전

```
    app.use(express.static(path.join(__dirname, "/client/build")));

    app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
    });

    app.use("/api", api);

    app.listen(process.env.PORT || 5000);
```

<br />

- 수정 후

```
    app.use("/api", api);

    app.listen(process.env.PORT || 5000);

    app.use(express.static(path.join(__dirname, "/client/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname + "/client/build/index.html"));
    });
```
