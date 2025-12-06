import {useEffect} from "react";

const Home = () => {
    useEffect(() => {
        const track = document.getElementById("image-track") as HTMLElement;

        const handleMouseDown = (e: MouseEvent) => {
            track.dataset.mouseDownAt = e.clientX.toString();
        };

        const handleMouseMove = (e: MouseEvent) =>{
            console.log("handleMouseMove");
            if(track.dataset.mouseDownAt === "0") return;

            const mouseDelta = parseFloat(track.dataset.mouseDownAt ?? "0") - e.clientX,
                  maxDelta = window.innerWidth / 2;

            let percent = (mouseDelta / maxDelta) * -100,
                  nextPercent = parseFloat(track.dataset.prevPercentage ?? "0") + percent;

            nextPercent = Math.max(Math.min(nextPercent, 0), -100);

            track.dataset.percentage = nextPercent.toString();

            // track.style.transform = `translate(${nextPercent}%, -50%)`;
            track.animate({
                transform: `translate(${nextPercent}%, -50%)`,
            }, { duration: 1200, fill: "forwards" });

            for (const image of Array.from(track.getElementsByClassName("image"))) {
                (image as HTMLElement).animate({
                    objectPosition: `${nextPercent + 100}% 50%`
                }, {duration: 1200, fill: "forwards"});
            }
        }

        const handleMouseUp = (e: MouseEvent) =>{
            track.dataset.mouseDownAt = "0";
            track.dataset.prevPercentage = track.dataset.percentage;
        }

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);
    return (
        <div className={"Home"}>
            <div className={"header"}></div>
            <div className={"slide-show"}>
                <div id={"image-track"} data-mouse-down-at={"0"} data-prev-percentage={"0"}>
                    <img className="image" src={"img/hand_made_1.jpg"} alt="" />
                    <img className="image" src={"img/hand_made_1.jpg"} alt="" />
                    <img className="image" src={"img/hand_made_1.jpg"} alt="" />
                    <img className="image" src={"img/hand_made_1.jpg"} alt="" />
                    <img className="image" src={"img/hand_made_1.jpg"} alt="" />
                    <img className="image" src={"img/hand_made_1.jpg"} alt="" />
                    <img className="image" src={"img/hand_made_1.jpg"} alt="" />
                    <img className="image" src={"img/hand_made_1.jpg"} alt="" />
                    <img className="image" src={"img/hand_made_1.jpg"} alt="" />
                    <img className="image" src={"img/hand_made_1.jpg"} alt="" />
                </div>
            </div>
        </div>
    );
}
export default Home;