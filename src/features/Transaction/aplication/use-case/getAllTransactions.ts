import type {Transaction} from "../../domain/models/Transaction";
import type {TransactionRepository} from "../../domain/ports/TransactionRepository";

export class GetAllTransactions {
    private repo: TransactionRepository;

    constructor(repo: TransactionRepository) {
        this.repo = repo;
    }

    async execute(): Promise<Transaction[]> {
        try {   
            return this.repo.getAllTransactions();
        } catch (error) {
            throw new Error("Error fetching transactions: " + (error as Error).message);
        }
    }
}