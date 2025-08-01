module.exports = {
    apps: [{
        name: 'tap-app',
        script: 'npm',
        args: 'run dev',
        cwd: '/opt/tap-app',
        env: {
            NODE_ENV: 'staging',
            PORT: 3000,
            DEBUG_MODE: true
        },
        watch: true,
        watch_delay: 1000,
        ignore_watch: [
            'node_modules',
            '.next',
            'logs'
        ],
        error_file: '/opt/tap-app/logs/err.log',
        out_file: '/opt/tap-app/logs/out.log',
        log_file: '/opt/tap-app/logs/combined.log',
        time: true
    }]
}