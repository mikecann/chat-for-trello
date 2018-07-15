import { CardsService } from '../services/CardsService';
import { PageModel } from '../models/PageModel';
import { BoardSettingsModel } from '../models/BoardSettingsModel';
import { IPersistanceService } from '../../services/IPersistanceService';
import { ILogger } from 'mikeysee-helpers';
import { BoardsService } from '../services/BoardsService';
import { ListSettingsModel } from '../../models/ListSettingsModel';
import { AppSettingsModel } from '../../models/AppSettingsModel';

export class ModelsFactory {

    constructor(
        private cardService: CardsService, 
        private persistanceService: IPersistanceService,
        private appSettings: AppSettingsModel,
        private logger: ILogger,
        private boardsService: BoardsService
    ) {}

    createPage() {
        this.logger.debug("ModelsFactory creating PageModel");
        return new PageModel(this.logger, this.boardsService, this.cardService, this);
    }

    createBoardSettings(boardId: string): BoardSettingsModel {
        this.logger.debug("ModelsFactory creating BoardSettingsModel");
        return new BoardSettingsModel(boardId, this.persistanceService, this.logger);
    }

    createListSettings(listId: string): ListSettingsModel {
        this.logger.debug("ModelsFactory creating ListSettingsModel");
        return new ListSettingsModel(listId, this.persistanceService, this.appSettings, this.logger);
    }
}