import React from "react"
import { LocalApi } from "../lib/LocalApi";
export default function TestPage() {
    function fileSubmitHandler() {
    }
    return <main>
        <input type="file" onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            const result = await LocalApi.submitFile(Array.from(uint8Array))
            console.log(result)

        }}></input>
        <button onClick={fileSubmitHandler}></button>
    </main>
}