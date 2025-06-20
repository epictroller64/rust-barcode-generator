export interface BarcodeConfig {
    format: BarcodeFormatWrapper;
    texts: BarcodeTextStyleConfig[];
    scale: number;
    quiet_zones: boolean;
    dimensions: BarcodeDimensions;
    data: string;
}

export interface BarcodeDimensions {
    height_percentage: number;
    width_percentage: number;
    width_mm: number;
    height_mm: number;
}

export interface BarcodeTextStyleConfig {
    text: string;
    text_color: RgbColor;
    text_size: number;
    text_position: TextPosition;
    font: string;
    margin: number;
}

export interface RgbColor {
    r: number;
    g: number;
    b: number;
}

export interface BarcodeFormatWrapper {
    format: string;
}

export enum BarcodeFormat {
    Code128 = "Code128",
    Code39 = "Code39",
    QRCode = "QRCode",
    EAN13 = "EAN13",
    EAN8 = "EAN8",
    UPCA = "UPCA",
    UPCE = "UPCE",
    DataMatrix = "DataMatrix",
    PDF417 = "PDF417",
    Aztec = "Aztec",
    Codabar = "Codabar",
    Code93 = "Code93",
    DataBar = "DataBar",
    DataBarExpanded = "DataBarExpanded",
    DataBarLimited = "DataBarLimited",
    ITF = "ITF",
    MaxiCode = "MaxiCode",
    MicroQRCode = "MicroQRCode",
    RMQRCode = "RMQRCode",
    DXFilmEdge = "DXFilmEdge",
    LinearCodes = "LinearCodes",
    MatrixCodes = "MatrixCodes",
    Any = "Any",
    None = "None"
}

export enum TextPosition {
    Upper = "Upper",
    Lower = "Lower",
    None = "None",
    UpperCenter = "UpperCenter",
    LowerCenter = "LowerCenter"
}

export function createBarcodeFormatWrapper(format: BarcodeFormat): BarcodeFormatWrapper {
    return { format };
}

export function getAvailableBarcodeFormats(): BarcodeFormat[] {
    return [
        BarcodeFormat.Code128,
        BarcodeFormat.Code39,
        BarcodeFormat.QRCode,
        BarcodeFormat.EAN13,
        BarcodeFormat.EAN8,
        BarcodeFormat.UPCA,
        BarcodeFormat.UPCE,
        BarcodeFormat.DataMatrix,
        BarcodeFormat.PDF417,
        BarcodeFormat.Aztec,
        BarcodeFormat.Codabar,
        BarcodeFormat.Code93,
        BarcodeFormat.DataBar,
        BarcodeFormat.DataBarExpanded,
        BarcodeFormat.DataBarLimited,
        BarcodeFormat.ITF,
        BarcodeFormat.MaxiCode,
        BarcodeFormat.MicroQRCode,
        BarcodeFormat.RMQRCode
    ];
}