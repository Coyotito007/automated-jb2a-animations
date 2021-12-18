//import { AAITEMCHECK, AAITEMCHECKFREE } from "../animation-functions/item-arrays.js";
//import thunderwaveAuto from "../animation-functions/thunderwave.js";
import huntersMark from "../animation-functions/custom-sequences/hunters-mark.js";
import bardicInspiration from "../animation-functions/custom-sequences/bardic-inspiration.js";
import { rangedAnimations } from "../animation-functions/rangedAnimation.js";
import { meleeAnimation } from "../animation-functions/meleeAnimation.js";
import { teleportation } from "../animation-functions/teleportation.js";
import { templateAnimation } from "../animation-functions/templateAnimation.js";
import { shieldSpell } from "../animation-functions/custom-sequences/shield.js";
import { sneakAttack } from "../animation-functions/custom-sequences/sneak-Attack.js";
import { bless } from "../animation-functions/custom-sequences/bless.js";
import { staticAnimation } from "../animation-functions/staticAnimation.js";
import { auras } from "../animation-functions/aura-attach.js";
//import { findObjectByName, autorecNameCheck, rinseName, getAllNames } from "../custom-recognition/autoFunctions.js";
import { aaDebugger } from "../constants/constants.js";
import { AutorecFunctions } from "../aa-classes/autorecFunctions.js";
import { fireball } from "../animation-functions/custom-sequences/fireball.js";

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
/*
async function itemSound(handler) {
    let audio = handler.allSounds.item;
    if (handler.itemSound) {
        await wait(audio.delay);
        AudioHelper.play({ src: audio.file, volume: audio.volume, autoplay: true, loop: false }, true);
    }
}
*/
export async function trafficCop(handler) {
    const aaDebug = game.settings.get("autoanimations", "debug")
    /*
    if (handler.itemSound) {
        itemSound(handler);
    }
    */
   /*
    if (handler.animKill) {
        if (aaDebug) { aaDebugger("Animations Disabled on Item") }
        itemSound(handler)
        return;
    }
    */
    //const itemName = handler.convertedName;
    const animType = handler.animType;
    const animName = handler.flags?.animation;
    const override = handler.animOverride;
    const targets = handler.allTargets?.length ?? 0;
    if (override) {
        if (aaDebug) { aaDebugger("Custom Switch Beginning", [animName, animType, override, targets, handler.flags]) }
        //if (animType === 'template' || (animType === 'preset' && handler.animation === 'fireball')) { } else { itemSound(handler) }
        switch (animType) {
            case "melee":
                if (targets === 0) {
                    Hooks.callAll("aa.animationEnd", handler.actorToken, "no-target");
                    if (aaDebug) { aaDebugger("Melee Animation End", "NO TARGETS") }
                    return;
                }
                Hooks.callAll("aa.preAnimationStart", handler.actorToken);
                meleeAnimation(handler);
                break;
            case "range":
                if (targets === 0) {
                    Hooks.callAll("aa.animationEnd", handler.actorToken, "no-target");
                    if (aaDebug) { aaDebugger("Range Animation End", "NO TARGETS") }
                    return;
                }
                Hooks.callAll("aa.preAnimationStart", handler.actorToken);
                rangedAnimations(handler);
                break;
            case "static":
                /*
                if (targets === 0) {
                    Hooks.callAll("aa.animationEnd", handler.actorToken, "no-target");
                    if (aaDebug) { aaDebugger("Creature Animation End", "NO TARGETS") }
                    return;
                }
                */
                Hooks.callAll("aa.preAnimationStart", handler.actorToken);
                staticAnimation(handler);
                break;
            case "template":
                if (game.modules.get("midi-qol")?.active) { return; }
                //some do not need hook on template, depends on when damage is rolled
                switch (game.system.id) {
                    case "dnd5e":
                    case "pf2e":
                        if (game.modules.get("mars-5e")?.active) {
                            templateAnimation(handler);
                        } else {
                            Hooks.once("createMeasuredTemplate", () => {
                                templateAnimation(handler);
                            });
                        }
                        break;
                    default:
                        templateAnimation(handler);
                }
                break;
            case "aura":
                /*
                if (game.modules.get("Custom-Token-Animations")?.active) {
                    ctaCall(handler);
                } else { ui.notifications.error("Custom Token Animations module must be Active") }
                */
                auras(handler)
                break;
            case "preset":
                switch (animName) {
                    case "bardicinspiration":
                        bardicInspiration(handler);
                        break;
                    case "shieldspell":
                        shieldSpell(handler);
                        break;
                    case "huntersmark":
                        huntersMark(handler)
                        break;
                    case "sneakattack":
                        sneakAttack(handler);
                        break;
                    case "bless":
                        bless(handler);
                        break;
                    case "teleportation":
                        teleportation(handler)
                        break;
                    case "fireball":
                        switch (game.system.id) {
                            case "dnd5e":
                            case "pf2e":
                                if (game.modules.get("mars-5e")?.active/* || game.modules.get('midi-qol')?.active*/) {
                                    fireball(handler);
                                } else {
                                    Hooks.once("createMeasuredTemplate", () => {
                                        fireball(handler);
                                    });
                                }
                                break;
                            default:
                                fireball(handler);
                        }
                        break;
                }
                break;
        }
    } else {
        if (!game.settings.get("autoanimations", "disableAutoRec")) {
            if (aaDebug) { aaDebugger("Automatic Recognition Beginning") }
            const autoRecSettings = game.settings.get('autoanimations', 'aaAutorec');
            //const autoNameList = AutorecFunctions._getAllTheNames(autoRecSettings);//gets ALL names in Autorec sorted longest to shortest
            //const isAuto = AutorecFunctions._autorecNameCheck(autoNameList, autoName); //checks autoNameList against current name
            const autoName = AutorecFunctions._rinseName(handler.itemName); //removes all spaces in the name
            const isAuto = AutorecFunctions.foundInAutorec(autoRecSettings, autoName);

            if (isAuto) {
                const autoObject = AutorecFunctions._findObjectFromArray(autoRecSettings, autoName) // combines Autorec menus and sorts by name length, returns object
                switch (autoObject.menuSection) {
                    case 'melee':
                        if (targets === 0) {
                            Hooks.callAll("aa.animationEnd", handler.actorToken, "no-target");
                            if (aaDebug) { aaDebugger("Melee Animation End", "NO TARGETS") }
                            return;
                        }
                        Hooks.callAll("aa.preAnimationStart", handler.actorToken);
                        if (aaDebug) { aaDebugger("Pre Melee Animation", autoObject) }
                        //itemSound(handler)
                        meleeAnimation(handler, autoObject);
                        break;
                    case 'range':
                        if (targets === 0) {
                            Hooks.callAll("aa.animationEnd", handler.actorToken, "no-target");
                            if (aaDebug) { aaDebugger("Range Animation End", "NO TARGETS") }
                            return;
                        }
                        Hooks.callAll("aa.preAnimationStart", handler.actorToken);
                        if (aaDebug) { aaDebugger("Pre Range Animation", autoObject) }
                        //itemSound(handler)
                        rangedAnimations(handler, autoObject);
                        break;
                    case 'static':
                        Hooks.callAll("aa.preAnimationStart", handler.actorToken);
                        if (aaDebug) { aaDebugger("Pre Static Animation", autoObject) }
                        //itemSound(handler)
                        staticAnimation(handler, autoObject);
                        break;
                    case 'templates':
                        if (aaDebug) { aaDebugger("Pre Template Animation", autoObject) }
                        Hooks.once("createMeasuredTemplate", () => {
                            templateAnimation(handler, autoObject);
                        })
                        break;
                    case 'auras':
                        if (aaDebug) { aaDebugger("Pre CTA Animation", autoObject) }
                        //itemSound(handler)
                        auras(handler, autoObject)
                        break;
                    case 'preset':
                        if (aaDebug) { aaDebugger("Pre Preset Animation", autoObject) }
                        switch (autoObject.animation) {
                            case 'bardicinspiration':
                                //itemSound(handler)
                                bardicInspiration(handler, autoObject);
                                break;
                            case 'bless':
                                //itemSound(handler)
                                bless(handler, autoObject);
                                break;
                            case 'shieldspell':
                                //itemSound(handler)
                                shieldSpell(handler, autoObject);
                                break;
                            case 'huntersmark':
                                huntersMark(handler, autoObject);
                                break;
                            case 'teleportation':
                                //itemSound(handler)
                                teleportation(handler, autoObject);
                                break;
                            case 'sneakattack':
                                //itemSound(handler);
                                sneakAttack(handler, autoObject);
                                break;
                            case "fireball":
                                switch (game.system.id) {
                                    case "dnd5e":
                                    case "pf2e":
                                        if (game.modules.get("mars-5e")?.active/* || game.modules.get('midi-qol')?.active*/) {
                                            fireball(handler, autoObject, true);
                                        } else {
                                            Hooks.once("createMeasuredTemplate", () => {
                                                fireball(handler, autoObject, true);
                                            });
                                        }
                                        break;
                                    default:
                                        fireball(handler, autoObject, true);
                                }
                                break;
                        }
                        break;
                }
            } else {
                //itemSound(handler)
            }
        }
    }
}
