import Entity from './Entity';
import {entityStructureFilter} from './entityProcessors';

class Toast extends Entity {
    constructor(entityData) {
        super(
            {
                ...entityData,
                id: entityData.id || 'global-toast',
                onDismiss: entityData.onDismiss || (() => {}),
                actionLabel: entityData.actionLabel || '',
                onActionClick: entityData.onActionClick || (() => {}),
                autohide: entityData.hasOwnProperty('autohide') ? entityData.autohide : true,
                autohideTimeout: entityData.autohideTimeout || 5000,
            },
            [
                (entity) => entityStructureFilter(entity, ['id', 'text', 'onDismiss', 'actionLabel', 'onActionClick', 'autohide', 'autohideTimeout']),
            ]
        );
    }

    getId() {
        return this.entity.id;
    }

    getText() {
        return this.entity.text;
    }

    getActionLabel() {
        return this.entity.actionLabel;
    }

    onActionClick() {
        return () => this.entity.onActionClick()();
    }

    getAutohide() {
        return this.entity.autohide;
    }
    
    getAutohideTimeout() {
        return this.entity.autohideTimeout;
    }
    
    onDismiss() {
        return this.entity.onDismiss();
    }
}

export default Toast;
export {Toast};
