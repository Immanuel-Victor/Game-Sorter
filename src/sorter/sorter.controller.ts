import { Request, RequestHandler, Response, Router } from "express";
import { SorterService } from "./sorter.service";

export class SorterController {
    private router: Router = Router();
    constructor(private readonly sorterService: SorterService) {
        this.registerRoutes()
    }

    getRouter(): Router {
        return this.router;
    }

    private registerRoutes() {
        this.router.get('/:userId', this.sortUserGames());
    }

    private sortUserGames(): RequestHandler {
        return async (req: Request, res: Response) => {
            const userId = req.params.userId;

            if(!userId) {
               res.status(400).json({ message: 'Não é possivel realizar sorteio sem um id' })
               return
            }

            try {
                res.status(200).json(await this.sorterService.sortUserGames(userId))
            } catch (error) {
                console.log(error)
                res.status(400).json({message: 'Algo inesperado aconteceu'})
            }
        }
    }
}