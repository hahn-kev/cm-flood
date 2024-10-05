import data from '../test.json';

interface FloodData {
    hour: string;
    day: 1|2|3;// day 1 is the newest day, day 3 is the oldest day
    p67Level: number;
    p67Discharge: number;
    p1Level: number;
    p1Discharge: number;
    dateTime: Date;
}

type DataType = {
    resradio1: string;
    resradio2: string;
    ckst1_day1: number;
    ckst1_day2: number;
    ckst1_day3: number;
    ckst2_day1: number;
    ckst2_day2: number;
    ckst2_day3: number;
    river_basin: string;
    river_basin2: string;
    station_id1: string;
    level_limit1: string;
    dischg_limit1: string;
    level_limit_day1: number;
    Address_1: string;
    station_id2: string;
    level_limit2: string;
    dischg_limit2: string;
    level_limit_day2: number;
    Address_2: string;
    dischg_limit_day1: string;
    dischg_limit_day2: string;
    dischg_limit_day3: string;
    dischg_limit2_day1: string;
    dischg_limit2_day2: string;
    dischg_limit2_day3: string;
    date_day1: string;
    date_day2: string;
    date_day3: string;
    date_day_use: string;
    hours_lv: string;
    level1_day1: string;
    level2_day1: string;
    level1_day2: string;
    level2_day2: string;
    level1_day3: string;
    level2_day3: string;
    dischg1_day1: string;
    dischg2_day1: string;
    dischg1_day2: string;
    dischg2_day2: string;
    dischg1_day3: string;
    dischg2_day3: string;
    level_horus_day1: string;
    dischg_horus_day1: string;
    level_horus_day2: string;
    dischg_horus_day2: string;
    level_horus_day3: string;
    dischg_horus_day3: string;
    level_horus_day1_2: string;
    dischg_horus_day1_2: string;
    level_horus_day2_2: string;
    dischg_horus_day2_2: string;
    level_horus_day3_2: string;
    dischg_horus_day3_2: string;
};

async function fetchPage(): Promise<DataType[]> {
    const response = await fetch('https://hydro1.ddns.net/main/information_4/houly/water_today_report.php?date=2024-10-05');
    const data = await response.json();
    console.log('water level data', data);
    return data as any;
}

async function fetchExamplePage(): Promise<DataType[]> {
    return Promise.resolve(data);
}

async function parsePage(data: DataType[]): Promise<FloodData[]> {
    return data.flatMap(row => {
       const lastDate = new Date(row.date_day_use);
       const tzOffset = new Date().getTimezoneOffset() * -1 / 60;
       return [
           {
               day: 3,
               hour: row.hours_lv,
               p67Level: parseNumberData(row.level1_day1),
               p67Discharge: parseNumberData(row.dischg1_day1),
               p1Level: parseNumberData(row.level2_day1),
               p1Discharge: parseNumberData(row.dischg2_day1),
               dateTime: new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate(), parseInt(row.hours_lv) + tzOffset, 0, 0),
           },
           {
               day: 2,
               hour: row.hours_lv,
               p67Level: parseNumberData(row.level1_day2),
               p67Discharge: parseNumberData(row.dischg1_day2),
               p1Level: parseNumberData(row.level2_day2),
               p1Discharge: parseNumberData(row.dischg2_day2),
               dateTime: new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() - 1, parseInt(row.hours_lv) + tzOffset, 0, 0),
           },
           {
               day: 1,
               hour: row.hours_lv,
               p67Level: parseNumberData(row.level1_day3),
               p67Discharge: parseNumberData(row.dischg1_day3),
               p1Level: parseNumberData(row.level2_day3),
               p1Discharge: parseNumberData(row.dischg2_day3),
               dateTime: new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() - 2, parseInt(row.hours_lv) + tzOffset, 0, 0),
           },
       ] satisfies FloodData[];
    }).filter(floodData => floodData.p1Level !== -1).sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
}

function parseNumberData(data: string): number {
    let ret = parseFloat(data);
    if (isNaN(ret)) {
        ret = -1;
    }
    return ret;
}
const test = false;
export async function getData(): Promise<FloodData[]> {
    return await parsePage(
        test ? await fetchExamplePage() : await fetchPage()
    );
}