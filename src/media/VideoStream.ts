import { Writable } from "stream";
import { MediaUdp } from "../client/voice/MediaUdp";

export class VideoStream extends Writable {
    public udp: MediaUdp;
    public count: number;
    public sleepTime: number;
    public startTime?: number;
    
    constructor(udp: MediaUdp, fps: number = 30) {
        super();
        this.udp = udp;
        this.count = 0;
        this.sleepTime = 1000 / fps;
    }

    public setSleepTime(time: number) {
        this.sleepTime = time;
    }

    _write(frame: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
        this.count++;
        if (!this.startTime)
            this.startTime = Date.now();

        this.udp.sendVideoFrame(frame);

        const next = ( (this.count + 1) * this.sleepTime) - (Date.now() - this.startTime);

       setTimeout(() => {
            callback();
        }, next);
    }
}
