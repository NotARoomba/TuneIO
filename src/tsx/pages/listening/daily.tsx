import { useState } from "react";
import Title from "../../components/misc/Title";

export default function Daily() {
    const [song, setSong] = useState();
    return <div className="flex flex-col w-screen">
    <Title text="Song" reverse />
    </div>
}