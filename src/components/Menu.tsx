import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface PropsType {
    isActive: boolean;
}

function Menu({ isActive }: PropsType) {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<HTMLLIElement[]>([]);

    const setItemRef = (el: HTMLLIElement | null, index: number) => {
        if (el) itemsRef.current[index] = el;
    };
    useEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        if (isActive) {
            gsap.set(container, { display: "block", pointerEvents: "auto" });
            gsap.to(container, { opacity: 1, duration: 0.2 });

            gsap.fromTo(
                itemsRef.current,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.3,
                    stagger: 0.1,
                    ease: "expo"
                }
            );
        } else {
            gsap.to(container, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    gsap.set(container, { display: "none", pointerEvents: "none" });
                },
            });
        }
    }, [isActive]);

    const socialLinks = [
        { text: "Facebook", url: "https://facebook.com" },
        { text: "X", url: "https://x.com" },
        { text: "Linkedin", url: "https://linkedin.com" },
        { text: "URL", url: "#" },
    ];

    return (
        <div
            ref={containerRef}
            className="fixed top-0 right-0 w-full h-full z-40  "
        >
            <div className="Share__background__3rglzHoI w-full h-full text-white flex justify-end pt-18 pr-5">
                <ul className="flex flex-col gap-3">
                    {socialLinks.map(({ text, url }, i) => (
                        <li
                            key={text}
                            ref={(el) => setItemRef(el, i)}
                            className="text-right text-xs font-normal uppercase SansRegular"
                        >
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                {text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Menu;
