import React from "react";


export default function MyMachine() {

    const symbol = [
        { id: 1, img: "/images/ji1.jpg" },
        { id: 2, img: "/images/ji2.jpg" },
        { id: 3, img: "/images/ji3.jpg" },
        { id: 4, img: "/images/ji4.jpg" },
    ]


    return (
        <div className=" bg-gradient-to-b from-gray-900 via-gray-800 to-black ">


            <div className="flex flex-row ">
                <img src={symbol[Math.floor(Math.random() * symbol.length)].img} alt="1번" />
                <img src={symbol[Math.floor(Math.random() * symbol.length)].img} alt="2번" />
                <img src={symbol[Math.floor(Math.random() * symbol.length)].img} alt="3번" />
            </div>


        </div>
    );
}