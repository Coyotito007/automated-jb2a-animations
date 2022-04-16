import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import ItemMenuAppShell from './itemMenuAppShell.svelte';

export default class AAItemMenu extends SvelteApplication {
    
    //constructor(options = {}) { super(options); }
    constructor(item) {
        //console.log(Object.entries(aaNameMenu.melee.weapon))
        super({
            title: `A-A Item Setting for ${item.name}`,
            id: `AA-item-settings-${item.name}`,
            zIndex: 102,
            svelte: {
                class: ItemMenuAppShell,
                target: document.body,
                props: {
                    item,
                }
            },
            //close: () => this.options.reject(),
            //...options
        });
        /*
        this.hookId = Hooks.on('updateActor', (changedActor) => {
            if (changedActor !== actor) return;
            setTimeout(() => {
                this.svelte.applicationShell.updateHealthBar();
            }, 100);
        });
        */
    }
    /**
     * 
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            resizable: true,
            minimizable: true,
            width: 700,
            height: "auto",
            closeOnSubmit: true,
        })
    }
}