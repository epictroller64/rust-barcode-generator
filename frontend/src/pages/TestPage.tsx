import React, { useState } from "react"
import { LocalApi } from "../lib/LocalApi";
import { type BarcodeImportRowCSV } from "../lib/interfaces";

export default function TestPage() {
    const [barcodes, setBarcodes] = useState<BarcodeImportRowCSV[]>([])
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
            const fetchResult = await LocalApi.getImportedBarcodes()
            if (fetchResult.success && fetchResult.data) {
                setBarcodes(fetchResult.data)
            }

        }}></input>
        <button onClick={fileSubmitHandler}></button>
        {barcodes.length > 0 && <ul>
            {barcodes.map(i => <li key={i.value}>{JSON.stringify(i)}</li>)}
        </ul>}
    </main>
}