// =======================
// Seguimiento de Cursor (Ojo)
// =======================
export function lookCursor() {
    const lente = [
        { id: '#pupila', factor: 1.2 },
        { id: '#reflejo1', factor: 1.2 },
        { id: '#reflejo2', factor: 1.2 }
    ];

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;

        lente.forEach(({ id, factor }) => {
            const el = document.querySelector(id);
            if (el) {
                gsap.to(el, {
                    x: x * factor * 10,
                    y: y * factor * 10,
                    duration: 0.5,
                    ease: 'power3.out'
                });
            }
        });
    });
}


// =======================
// Animación Robot
// =======================
export function robot() {
    const robot = document.querySelector('.Robot');
    const sombra = document.querySelector('.Sombra');

    gsap.to(robot, {
        y: 10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to(sombra, {
        scaleX: 1.1,
        scaleY: 0.8,
        transformOrigin: '50% 50%',
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: 'sine.inOut'
    });
}


// =======================
// Animación Ojo (Password Focus)
// =======================
export function passwordFocus() {
    const inputPassword = document.querySelector('#password');
    const inputPasswordRegister = document.querySelector('#password-register');
    const iris = document.querySelector('.Iris');
    const pupila = document.querySelector('.Pupila');
    const reflejos = [
        document.querySelector('.Reflejo1'),
        document.querySelector('.Reflejo2')
    ];

    inputPassword.addEventListener('focus', () => {
        gsap.to([iris, pupila, reflejos], {
            scale: 0,
            duration: 0.3,
            transformOrigin: 'center center'
        });
        gsap.to(reflejos, {
            opacity: 0,
            duration: 0.2
        });
    });

    inputPassword.addEventListener('blur', () => {
        gsap.to([iris, pupila, reflejos], {
            scale: 1,
            duration: 0.2,
            ease: 'back.out(1.7)'
        });
        gsap.to(reflejos, {
            opacity: 1,
            duration: 0.2
        });
    });

    inputPasswordRegister.addEventListener('focus', () => {
        gsap.to([iris, pupila, reflejos], {
            scale: 0,
            duration: 0.3,
            transformOrigin: 'center center'
        });
        gsap.to(reflejos, {
            opacity: 0,
            duration: 0.2
        });
    });

    inputPasswordRegister.addEventListener('blur', () => {
        gsap.to([iris, pupila, reflejos], {
            scale: 1,
            duration: 0.2,
            ease: 'back.out(1.7)'
        });
        gsap.to(reflejos, {
            opacity: 1,
            duration: 0.2
        });
    });
}
