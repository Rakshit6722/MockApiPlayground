import Cors from 'cors'
import iniitMiddleware from './init-middleware'

const cors = iniitMiddleware(
    Cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    })
)

export default cors