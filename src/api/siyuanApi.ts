import siyuan from 'siyuan';
function timeToStr(time: Date) {
    let str: string = time.getFullYear() + "";
    let month: number = time.getMonth() + 1;
    let date: number = time.getDate();
    if (month < 10) {
        str += "0" + month;
    } else {
        str += month;
    }
    if (date < 10) {
        str += "0" + date;
    } else {
        str += date;
    }
    return str + "000000";
}
export function getData(year: number):Promise<any[]> {
    // 定义一个dataList数组
    let dataList:any[];
    // 判断siyuan是否存在
    // 使用async/await来处理异步操作
    return (async () => {
        // 获取总数
        let firstDay:Date = new Date(year, 0, 1);
        let lastDay:Date = new Date(+year + 1, 0, 1);
        let firstDayStr:string = timeToStr(firstDay);
        let lastDayStr:string = timeToStr(lastDay);
        let count:number = await siyuan.serverApi.sql(`SELECT count(*) from blocks WHERE type='d' AND created>= '${firstDayStr}' And created<'${lastDayStr}'`);
        console.log("文档数：",count)
        // 批量请求数
        let size:number = 50;
        // 定义一个promises数组
        let promises:Promise<any>[] = [];
        console.log("文档总数", count)
        for (let i = 0; i < count[0]['count(*)']; i += size) {
            // 将每个sql()函数返回的promise添加到promises数组中
            promises.push(siyuan.serverApi.sql(`SELECT created From blocks WHERE type='d'  AND created>= '${firstDayStr}' And created<'${lastDayStr}' limit ${size} OFFSET ${i}`));
        }
        // 等待所有promise完成，并将结果合并到dataList数组中
        dataList = (await Promise.all(promises)).flat();
        console.log("文档创建时间", dataList)
        return dataList;
    })();
}
