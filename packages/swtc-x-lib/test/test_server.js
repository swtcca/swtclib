const chai = require('chai');
const expect = chai.expect;
const Server = require('../src/server');
const Remote = require('../src/remote');
const config = require('./config');
const sinon = require('sinon');
const url = require('url');
const WS = require('ws');
let {
    JT_NODE,
    TEST_NODE
} = config

describe('test server', function () {

    describe('test constructor', function () {
        it('if this is secure', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let server = new Server(remote, JT_NODE);
            let parsed = url.parse(JT_NODE)
            expect(server._remote instanceof Remote).to.equal(true);
            expect(server._ws).to.equal(null);
            expect(server._connected).to.equal(false);
            expect(server._opened).to.equal(false);
            expect(server._state).to.equal('offline');
            expect(server._id).to.equal(0);
            expect(server._timer).to.equal(0);
            expect(server._url).to.equal(JT_NODE)
            expect(server._opts).to.deep.equal({
                host: parsed.hostname,
                port: Number(parsed.port),
                secure: parsed.protocol === 'wss:',
                path: null
            })
        })

        it('if server address has path', function () {
            let testAddress = "wss://test.net/bc/ws"
            let remote = new Remote({
                server: testAddress,
                local_sign: true
            });
            let server = new Server(remote, testAddress);
            let parsed = url.parse(testAddress)
            expect(server._remote instanceof Remote).to.equal(true);
            expect(server._ws).to.equal(null);
            expect(server._connected).to.equal(false);
            expect(server._opened).to.equal(false);
            expect(server._state).to.equal('offline');
            expect(server._id).to.equal(0);
            expect(server._timer).to.equal(0);
            expect(server._url).to.equal("wss://test.net:443/bc/ws")
            expect(server._opts).to.deep.equal({
                host: parsed.hostname,
                port: 443,
                secure: parsed.protocol === 'wss:',
                path: "/bc/ws"
            })
        })

        it('if this is not secure', function () {
            let testNode = 'ws://test.com'
            let remote = new Remote({
                server: testNode,
                local_sign: true
            });
            let server = new Server(remote, testNode);
            let parsed = url.parse(testNode)
            expect(server._remote instanceof Remote).to.equal(true);
            expect(server._ws).to.equal(null);
            expect(server._connected).to.equal(false);
            expect(server._opened).to.equal(false);
            expect(server._state).to.equal('offline');
            expect(server._id).to.equal(0);
            expect(server._timer).to.equal(0);
            expect(server._url).to.equal('ws://test.com:80')
            expect(server._opts).to.deep.equal({
                host: parsed.hostname,
                port: 80,
                secure: false,
                path: null
            })
        })

        it('throw error if options is invalid', function () {
            let remote = new Remote({
                server: TEST_NODE,
                local_sign: true
            });
            let server = new Server(remote, null);
            expect(server.opts).to.be.an('error');
            expect(server.opts.message).to.equal('server options not supplied')
        })

        it('throw error if host is invalid', function () {
            let remote = new Remote({
                server: TEST_NODE,
                local_sign: true
            });
            let server = new Server(remote, {
                host: JT_NODE + TEST_NODE
            });
            expect(server.opts_host).to.be.an('error');
            expect(server.opts_host.message).to.equal('server host incorrect')
        })

        it('throw error if port is not a number', function () {
            let remote = new Remote({
                server: TEST_NODE,
                local_sign: true
            });
            let server = new Server(remote, {
                host: 'ts5.jingtum.com',
                port: 'aaa'
            });
            expect(server.port).to.be.an('error');
            expect(server.port.message).to.equal('server port not a number')

            server = new Server(remote, {
                host: 'ts5.jingtum.com',
                port: Infinity
            });
            expect(server.port).to.be.an('error');
            expect(server.port.message).to.equal('server port not a number')
        })

        it('throw error if port is less than 1', function () {
            let remote = new Remote({
                server: TEST_NODE,
                local_sign: true
            });
            let server = new Server(remote, {
                host: 'ts5.jingtum.com',
                port: -1
            });
            expect(server.port).to.be.an('error');
            expect(server.port.message).to.equal('server port out of range')
        })

        it('throw error if port is more than 65535', function () {
            let remote = new Remote({
                server: TEST_NODE,
                local_sign: true
            });
            let server = new Server(remote, {
                host: 'ts5.jingtum.com',
                port: 65536
            });
            expect(server.port).to.be.an('error');
            expect(server.port.message).to.equal('server port out of range')
        })

        it('secure is false if opts.secure is not boolean', function () {
            let remote = new Remote({
                server: TEST_NODE,
                local_sign: true
            });
            let server = new Server(remote, {
                host: 'ts5.jingtum.com',
                port: 5020
            });
            expect(server._opts.secure).to.equal(false);
        })
    })

    describe('test sendMessage', function () {
        it('do not have next step if the _opened is false', function (done) {
            this.timeout(0)
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            remote.connect((err, res) => {
                let spy = sinon.spy(remote._server._ws, 'send');
                remote._server._opened = false;
                let id = remote._server.sendMessage('submit', {
                    test: 'test'
                })
                expect(spy.callCount).to.equal(0);
                expect(id).to.equal(undefined)
                remote.disconnect();
                expect(remote._server._ws).to.equal(null);
                done()
            })
        })

        it('send message if the _opened is true', function (done) {
            this.timeout(0)
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            remote.connect((err, res) => {
                let spy = sinon.spy(remote._server._ws, 'send');
                let id = remote._server.sendMessage('submit', {
                    test: 'test'
                })
                expect(spy.callCount).to.equal(1);
                expect(id).to.equal(1);
                let args = spy.args[0];
                expect(JSON.parse(args[0])).to.deep.equal({
                    id: 1,
                    command: 'submit',
                    test: 'test'
                })
                remote.disconnect();
                done()
            })
        })
    })

    describe('test _handleClose', function () {
        it('if the _state is offline', function () {
            let remote = new Remote({
                server: TEST_NODE,
                local_sign: true
            });
            let server = new Server(remote, TEST_NODE);
            let spy = sinon.spy(server, '_setState');
            server._handleClose();
            expect(spy.callCount).to.equal(0);
        })

        it('if the _state is online but timer is not 0', function () {
            let remote = new Remote({
                server: TEST_NODE,
                local_sign: true
            });
            let server = new Server(remote, TEST_NODE);
            server._state = 'online';
            server._timer = 1;
            let spy = sinon.spy(server, '_setState');
            let spy1 = sinon.spy(server._remote, 'emit');
            server._handleClose();
            expect(spy.callCount).to.equal(1);
            expect(server._state).to.equal('offline');
            expect(server._connected).to.equal(false);
            expect(server._opened).to.equal(false);
            let args = spy.args[0]
            expect(args[0]).to.equal('offline');
            expect(spy1.callCount).to.equal(0);
        })

        it('if the _state is online and timer is 0', function (done) {
            this.timeout(0)
            // this.retries(10);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            remote.connect((err, res) => {
                let spy = sinon.spy(remote._server, '_setState');
                let spy1 = sinon.spy(remote, 'emit');
                remote._server._handleClose();
                expect(spy.callCount).to.equal(1);
                expect(remote._server._state).to.equal('offline');
                expect(remote._server._connected).to.equal(false);
                expect(remote._server._opened).to.equal(false);
                let args = spy.args[0]
                expect(args[0]).to.equal('offline');
                setTimeout(() => {
                    // clearInterval(remote._server._timer)
                    expect(spy1.callCount).to.at.least(2);
                    expect(spy1.args[0][0]).to.equal('disconnect')
                    let existed = spy1.args.find(arg => {
                        return arg[0] === 'reconnect'
                    })
                    if (existed) {
                        expect(existed).to.deep.equal(['reconnect'])
                    }
                    remote.disconnect();
                    done()
                }, 5000)

            })
        })
    })

    describe('test _setState', function () {
        it('if the _state is equal to state', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let server = new Server(remote, JT_NODE);
            server._connected = true;
            server._opened = true;
            server._setState('offline');
            expect(server._connected).to.equal(true);
            expect(server._opened).to.equal(true);
        })
    })

    describe('test connect', function () {
        it('if had connected', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let server = new Server(remote, JT_NODE);
            server._ws = new WS(JT_NODE);
            server._connected = true;
            let spy = sinon.spy(server._ws, 'on');
            let spy1 = sinon.spy(server._ws, 'close');
            server.connect();
            expect(spy.callCount).to.equal(0)
            expect(spy1.callCount).to.equal(0)
            server.disconnect();
        })

        it('throw error if create WS instance', function (done) {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let server = new Server(remote, 'aaaa');
            server.connect((err, res) => {
                expect(err).to.be.an('error')
                done()
            });
        })
    })
});