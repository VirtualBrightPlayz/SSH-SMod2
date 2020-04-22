var fs = require('fs');
var crypto = require('crypto');
var inspect = require('util').inspect;

var blessed = require('blessed');

var ssh2 = require('ssh2');
var utils = ssh2.utils;


function loadNothing(screen, time) {
    var loading = blessed.loading({
        screen: screen,
        border: {
            type: 'line'
        },
        bg: 'blue',
        tags: true
    });
    var bar = blessed.progressbar({
        screen: screen,
        style: {
            bg: 'blue'
        },
        tags: true,
        filled: 0,
        top: '50%',
        left: '5%',
        width: '90%',
        height: 2
    });
    var text = blessed.box({
        screen: screen,
        style: {
            bg: 'black',
            fg: 'aqua'
        },
        tags: true,
        border: {
            type: 'line'
        },
        top: '75%',
        left: 'center',
        width: '25%',
        height: '10%',
        content: '{center}TIP: SMod2 is dead, LaserMan.\nTUTORIAL: How do I install SMod2 for SCPSL mp2?\nTIP: Stop paying for ZAP! Pay for EXILED!\nPRO GAMER TIP: Go download EXILED!{/center}'
    });
    screen.append(loading);
    screen.append(bar);
    screen.append(text);
    bar.reset();
    loading.load('{center}Please Wait as we delete \"C:\\Windows\\System32\" from your Linux VM...{/center}');
    for (var i = 0; i <= time; i++) {
        var j = i.valueOf();
        setTimeout(function(i) {
            bar.setProgress(i / time * 100);
            screen.render();
        }, 1000 * j, j);
    }
    setTimeout(function() {
        loading.stop();
        loading.destroy();
        bar.destroy();
        text.destroy();
        screen.render();
    }, time * 1000 + 500);
}





function noop(v) {}

new ssh2.Server({
    hostKeys: [fs.readFileSync('../sshgame.key')],
    ident: "SSH GAME"
}, function(client) {
    console.log('Client connected!');

    var stream; // stream of text

    client.on('authentication', function(ctx) {
        console.log('Client authenticated!');
        return ctx.accept();
    }).on('ready', function() {

        // per client variables
        var cols, rows; // rows and cols
        var screen; // blessed screen object
        var term; // terminal type

        client.on('session', function(accept, reject) {
            var session = accept();
            session.on('pty', function(accept, reject, info) {
                // update variables
                cols = info.cols;
                rows = info.rows;
                term = info.term;
                accept && accept();
            }).on('window-change', function(accept,  reject, info) {
                // update variables
                cols = info.cols;
                rows = info.rows;
                if (stream) {
                    stream.rows = rows;
                    stream.columns = cols;
                    stream.emit('resize');
                }
                accept && accept();
            }).on('shell', function(accept, reject) {
                stream = accept();
                // setup stream
                stream.name = 'none';
                stream.rows = rows || 24;
                stream.columns = cols || 80;

                // create screen
                screen = new blessed.screen({
                    // autoPadding: true,
                    smartCSR: true,
                    input: stream,
                    output: stream,
                    terminal: term || 'ansi'
                });
                // set screen title
                screen.title = 'NO ZAP!';


                // screen.program.attr('invisible', true);

                // create box
                var box = new blessed.box({
                    screen: screen,
                    top: 'center',
                    left: 'center',
                    width: '50%',
                    height: '50%',
                    border: {
                        type: 'line'
                    },
                    style: {
                        fg: 'green',
                        bg: 'black'
                    },
                    content: '\n{center}Server Mod 2 Remote Installer!{/center}',
                    tags: true
                });
                screen.append(box);
                var button = new blessed.button({
                    screen: screen,
                    // parent: box,
                    top: '75%',
                    left: 'center',
                    width: '25%',
                    height: '10%',
                    style: {
                        bg: 'black',
                        fg: 'green',
                        hover: {
                            bg: 'blue'
                        }
                    },
                    mouse: true,
                    keys: true,
                    content: '\n{center}Install SMod2 Version 3.6.6 Patch #6{/center}',
                    tags: true
                });
                screen.append(button);
                screen.render();
                screen.program.emit('resize');

                button.on('press', function() {
                    loadNothing(screen, 60);
                    screen.render();
                });

                screen.key(['escape'], function(ch, key) {
                    screen.destroy();
                    stream.exit(0);
                    stream.end();
                    client.end();
                });
            });
        });
    }).on('end', function() {
        console.log('Client disconnected!');
    }).on('error', function(){
    });
}).listen(27054, '127.0.0.1', function() {
  console.log('Listening on port ' + this.address().port);
});