import { Request, Response, NextFunction } from 'express'

export const unknownMiddleware = (req: Request, res: Response) => {
    res.status(404).send({ message: 'Not Found' })
}
