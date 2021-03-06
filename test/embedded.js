describe('embedded', function () {
  var server, baseUrl;
  before(function (done) {
    listen(function (s, p) {
      server = s;
      baseUrl = 'http://localhost:' + p;

      middler(server)
        .get('/', function (req, res, next) {
          res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
          res.end('hello world');
        })
        .add('/stuff/*', middler()
          .get('/stuff/do', function (req, res, next) {
            writeRes(res, 'a deer');
          })
          .get('/stuff/re', function (req, res, next) {
            writeRes(res, 'a drop of golden sun');
          })
          .add(function (req, res, next) {
            writeRes(res, 'stuff not found', 404);
          })
          .handler
        )
        .add(function (req, res, next) {
          writeRes(res, 'not found', 404);
        });
      done();
    });
  });

  it('get /', function (done) {
    request.get(baseUrl + '/', function (res) {
      assertRes(res, 'hello world');
      done();
    });
  });

  it('get /stuff/do', function (done) {
    request.get(baseUrl + '/stuff/do', function (res) {
      assertRes(res, 'a deer');
      done();
    });
  });

  it('get /stuff/re', function (done) {
    request.get(baseUrl + '/stuff/re', function (res) {
      assertRes(res, 'a drop of golden sun');
      done();
    });
  });

  it('get /stuff/mi', function (done) {
    request.get(baseUrl + '/stuff/mi', function (res) {
      assertRes(res, 'stuff not found', 404);
      done();
    });
  });

  it('get /etc', function (done) {
    request.get(baseUrl + '/etc', function (res) {
      assertRes(res, 'not found', 404);
      done();
    });
  });

  it('closes the server', function (done) {
    server.once('close', done);
    server.close();
  });
});