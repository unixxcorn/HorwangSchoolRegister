import moment from 'moment'

export const logger = {
    log: (...data: any[]) => {
        console.log(moment().format('YYYY-MM-DD HH:mm:ss Z'), ...data)
    },
}
