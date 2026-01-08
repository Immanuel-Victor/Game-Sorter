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
        console.log('Caiui aqui')
        return async (req: Request, res: Response) => {
            const userId = req.params.userId;

            if(!userId) {
                throw new Error('Não é possivel realizar sorteio sem um id')
            }

            res.status(200).json(await this.sorterService.sortUserGames(userId))
        }
    }
}