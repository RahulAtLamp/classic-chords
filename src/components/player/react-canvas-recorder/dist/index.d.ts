interface CanvasRecorder {
    start: () => void;
    stop: () => void;
    save: () => Blob;
    createStream: <T extends HTMLCanvasElement>(canvas: T) => void;
    captureMediaStream: <T extends MediaStream>(mediaStream: T) => void;
    recordScreen: () => void;
}
declare const CanvasRecorder: () => CanvasRecorder;
declare const _default: CanvasRecorder;
export default _default;
