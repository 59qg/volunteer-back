var CommonConfig = {
    root: __dirname, // 定义全局根目录
    web: {
        context: '/volunteer',
        http_port: 3020,            //http访问端口
    },
    mongodb: {
        url: 'mongodb://localhost/volunteer'
    }
}

module.exports = CommonConfig;