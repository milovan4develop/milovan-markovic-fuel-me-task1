import { ReportGenerator } from '../services/reportGenerator';

;(async () => {
    try {
        const data = await new ReportGenerator().generate();
        console.log(JSON.stringify(data, null, 4));
    } catch (e) {
        console.error('Error:',(e as Error).message);
        process.exitCode = 1;
    }
})();