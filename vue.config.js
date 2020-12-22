//别名的相关配置
module.exports = {
    configureWebpack:{
        resolve: {
            alias: {
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                'views': '@/views'
            }
            
        }
    }
}
