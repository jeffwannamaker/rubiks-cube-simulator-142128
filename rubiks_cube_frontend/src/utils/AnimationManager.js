/**
 * Animation Manager for smooth cube rotations and performance optimization
 */

// PUBLIC_INTERFACE
export class AnimationManager {
    constructor() {
        this.animationQueue = [];
        this.isAnimating = false;
        this.defaultDuration = 300;
        this.easingFunctions = {
            linear: (t) => t,
            easeInQuad: (t) => t * t,
            easeOutQuad: (t) => t * (2 - t),
            easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: (t) => t * t * t,
            easeOutCubic: (t) => (--t) * t * t + 1,
            easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        };
    }

    // PUBLIC_INTERFACE
    queueAnimation(animationConfig) {
        /**
         * Queue an animation to be played
         * @param {object} animationConfig - Animation configuration
         */
        this.animationQueue.push({
            id: this.generateId(),
            timestamp: Date.now(),
            ...animationConfig
        });

        if (!this.isAnimating) {
            this.processQueue();
        }
    }

    // PUBLIC_INTERFACE
    processQueue() {
        /**
         * Process the next animation in the queue
         */
        if (this.animationQueue.length === 0) {
            this.isAnimating = false;
            return;
        }

        this.isAnimating = true;
        const animation = this.animationQueue.shift();
        this.executeAnimation(animation);
    }

    executeAnimation(animation) {
        const {
            duration = this.defaultDuration,
            easing = 'easeInOutCubic',
            onUpdate,
            onComplete,
            from = 0,
            to = 1
        } = animation;

        const startTime = performance.now();
        const easingFunc = this.easingFunctions[easing] || this.easingFunctions.easeInOutCubic;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easingFunc(progress);
            
            const currentValue = from + (to - from) * easedProgress;

            if (onUpdate) {
                onUpdate(currentValue, easedProgress, progress);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (onComplete) {
                    onComplete();
                }
                // Process next animation
                setTimeout(() => this.processQueue(), 0);
            }
        };

        requestAnimationFrame(animate);
    }

    // PUBLIC_INTERFACE
    clearQueue() {
        /**
         * Clear all queued animations
         */
        this.animationQueue = [];
        this.isAnimating = false;
    }

    // PUBLIC_INTERFACE
    setSpeed(multiplier) {
        /**
         * Set animation speed multiplier
         * @param {number} multiplier - Speed multiplier (1.0 = normal speed)
         */
        this.defaultDuration = 300 / Math.max(0.1, multiplier);
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    // PUBLIC_INTERFACE
    getQueueLength() {
        return this.animationQueue.length;
    }

    // PUBLIC_INTERFACE
    isPlaying() {
        return this.isAnimating;
    }
}

// PUBLIC_INTERFACE
export const createAnimationManager = () => {
    return new AnimationManager();
};

export default AnimationManager;
