import { CarouselConfig } from '../../../../carousel-config';
import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';

/**
 * Assigns carousel config, works as part of multiphase carousel initialization
 */
export function setConfigProcedure<T>(newConfig: CarouselConfig<T>): Procedure {
    return ({state}: ProcedureStateFacade<T>): ProcedureHandler => {
        state.config = newConfig;
        state.initializationState.configInitialized = true;

        return new ContinueWith(state);
    };
}
