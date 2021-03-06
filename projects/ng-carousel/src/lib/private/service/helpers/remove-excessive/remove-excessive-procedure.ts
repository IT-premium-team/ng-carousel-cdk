import { ContinueWith } from '../../../models/procedure/handler/contiue-with.model';
import { ProcedureHandler } from '../../../models/procedure/handler/procedure-handler.interface';
import { ProcedureStateFacade } from '../../../models/procedure/procedure-state-facade.interface';
import { Procedure } from '../../../models/procedure/procedure.type';
import { removeExcessive } from './remove-excessive';

/**
 * Removes slide copies
 */
export function removeExcessiveProcedure(): Procedure {
    return ({state, procedureState}: ProcedureStateFacade): ProcedureHandler => {
        const result = removeExcessive(
            state.slides,
            state.offset,
            state.config.slideWidth,
            procedureState?.inViewportRange?.[0] ?? null,
            procedureState?.inViewportRange?.[1] ?? null,
        );
        state.slides = result.slides;
        state.offset = result.offset;

        return new ContinueWith(state);
    };
}
