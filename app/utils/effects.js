import * as enums from "tns-core-modules/ui/enums"
import * as platform from "tns-core-modules/platform"

/**
 * Apply an effect on an element, reducing it and bump it back for 100ms
 */
export function tapEffect(view) {
    return view.animate({
        scale: { x: 0.9, y: 0.9 },
        opacity: 0.8,
        duration: 50,
        curve: enums.AnimationCurve.easeIn
    }).then(() => {
        return view.animate({
            scale: { x: 1, y: 1 },
            opacity: 1,
            duration: 50,
            curve: enums.AnimationCurve.easeIn
        })
    })
}

/**
 * Move an object out of the screen
 * options : to (left, right, top, bottom)
 * @param {1} view 
 */
export function leave(view, options) {
    options = Object.assign({
        to: "left",
        duration: 250,
        curve: enums.AnimationCurve.easeIn,
        opacity: 0
    }, options)

    let anim = {
        duration: options.duration,
        curve: options.curve,
        opacity: options.opacity
    }
    if (options.to === "left") anim.translate = { x: -platform.screen.mainScreen.widthDIPs, y: 0 }
    else if (options.to === "right") anim.translate = { x: platform.screen.mainScreen.widthDIPs, y: 0 }
    else if (options.to === "top") anim.translate = { x: 0, y: -platform.screen.mainScreen.heightDIPs }
    else if (options.to === "bottom") anim.translate = { x: 0, y: platform.screen.mainScreen.heightDIPs }
    return view.animate(anim)
}
/**
 * Move an object in the screen
 * options : from (left, right, top, bottom)
 * @param {1} view 
 */
export function welcome(view, options) {
    options = Object.assign({
        from: "right",
        duration: 250,
        curve: enums.AnimationCurve.easeIn,
        opacity: 0,
        opacityfinal: 1
    }, options)

    let anim = {
        duration: options.duration,
        curve: options.curve,
        opacity: options.opacityfinal
    }
    view.style.opacity = options.opacity
    if (options.from === "left") {
        view.translateX = -platform.screen.mainScreen.widthDIPs
        anim.translate = { x: 0, y: 0 }
    }
    else if (options.from === "right") {
        view.translateX = platform.screen.mainScreen.widthDIPs
        anim.translate = { x: 0, y: 0 }
    }
    else if (options.from === "top") {
        view.translateY = -platform.screen.mainScreen.heightDIPs
        anim.translate = { x: 0, y: 0 }
    }
    else if (options.from === "bottom") {
        view.translateY = platform.screen.mainScreen.heightDIPs
        anim.translate = { x: 0, y: 0 }
    }

    return view.animate(anim)
}